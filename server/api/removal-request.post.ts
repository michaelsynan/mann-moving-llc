import { randomUUID } from "node:crypto";
import { ofetch } from "ofetch";

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== "POST") {
    setResponseStatus(event, 405);
    return { status: "error", error: "Method Not Allowed" };
  }

  const config = useRuntimeConfig(event);

  if (!config.resend?.apiKey) {
    setResponseStatus(event, 500);
    return { status: "error", error: "Missing Resend API key" };
  }

  const secretKey = config.turnstile?.secretKey;
  if (!secretKey) {
    setResponseStatus(event, 500);
    return { status: "error", error: "Missing Turnstile secret key" };
  }

  const escapeHtml = (value: unknown) => {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  };

  const parts = await readMultipartFormData(event).catch(() => null);
  if (!parts) {
    setResponseStatus(event, 400);
    return { status: "error", error: "Invalid form data" };
  }

  const decodePartData = (data: unknown): string => {
    if (typeof data === "string") {
      return data;
    }

    // h3 typically returns Buffer for both fields and files.
    // In some runtimes it may be Uint8Array.
    if (data && typeof data === "object") {
      if (typeof Buffer !== "undefined" && Buffer.isBuffer(data)) {
        return data.toString("utf8");
      }

      if (data instanceof Uint8Array) {
        try {
          return new TextDecoder("utf-8").decode(data);
        } catch {
          return Buffer.from(data).toString("utf8");
        }
      }
    }

    return "";
  };

  const getField = (name: string) => {
    const part = parts.find((p) => p.name === name && !p.filename);
    return part ? decodePartData(part.data) : "";
  };

  // Bot mitigation (low-friction): honeypot + minimum time-to-submit.
  const website = getField("website").trim();
  if (website) {
    setResponseStatus(event, 422);
    return { status: "error", error: "Spam detected" };
  }

  const startedAt = Number.parseInt(getField("startedAt").trim(), 10);
  if (!Number.isFinite(startedAt)) {
    setResponseStatus(event, 422);
    return { status: "error", error: "Please try again." };
  }

  const elapsedMs = Date.now() - startedAt;
  if (!Number.isFinite(elapsedMs) || elapsedMs < 2500) {
    setResponseStatus(event, 422);
    return { status: "error", error: "Please wait a moment and try again." };
  }

  const token = getField("token").trim();
  if (!token) {
    setResponseStatus(event, 422);
    return { status: "error", error: "Missing Turnstile token" };
  }

  // Verify Turnstile
  const form = new URLSearchParams();
  form.set("secret", String(secretKey));
  form.set("response", token);

  let turnstileResult: { success: boolean; "error-codes"?: string[] } | null =
    null;
  try {
    turnstileResult = await ofetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        body: form,
      },
    );
  } catch {
    setResponseStatus(event, 502);
    return { status: "error", error: "Turnstile verify request failed" };
  }

  if (!turnstileResult?.success) {
    setResponseStatus(event, 422);
    const codes = Array.isArray((turnstileResult as any)?.["error-codes"])
      ? (turnstileResult as any)["error-codes"]
      : undefined;
    return {
      status: "error",
      error: "Turnstile verification failed",
      errorCodes: codes,
    };
  }

  const name = getField("name").trim();
  const email = getField("email").trim();
  const phone = getField("phone").trim();
  const zipcode = getField("zipcode").trim();
  const message = getField("message").trim();
  const service = (getField("service").trim() || "Junk Removal").trim();

  if (!name || !email || !message) {
    setResponseStatus(event, 400);
    return { status: "error", error: "Missing required fields" };
  }

  const photos = parts.filter(
    (p) => p.name === "photos" && p.filename && p.data,
  );

  // Try to stay under common serverless body limits (Vercel can be strict).
  // Also, Resend limits attachments to 40mb per email.
  const MAX_TOTAL_ATTACH_BYTES = 3_500_000;
  const totalBytes = photos.reduce((sum, p) => {
    const data = p.data as unknown;
    if (typeof Buffer !== "undefined" && Buffer.isBuffer(data)) {
      return sum + data.byteLength;
    }
    if (data instanceof Uint8Array) {
      return sum + data.byteLength;
    }
    return sum;
  }, 0);

  if (totalBytes > MAX_TOTAL_ATTACH_BYTES) {
    setResponseStatus(event, 413);
    return {
      status: "error",
      error:
        "Photos are too large to email directly. Please upload fewer/smaller photos.",
    };
  }

  type Attachment = {
    filename: string;
    content: Buffer;
    contentType: string | undefined;
  };

  const attachments = photos
    .map((p): Attachment | null => {
      const data = p.data as unknown;
      const content =
        typeof Buffer !== "undefined" && Buffer.isBuffer(data)
          ? data
          : data instanceof Uint8Array
            ? Buffer.from(data)
            : null;

      if (!content) {
        return null;
      }

      return {
        filename: p.filename as string,
        content,
        contentType: typeof p.type === "string" ? p.type : undefined,
      };
    })
    .filter((a): a is Attachment => a !== null);

  const resend = useResend();

  try {
    let s3Prefix: string | null = null;
    let s3Uploads: Array<{ name: string; key: string; url: string }> | null =
      null;

    const slugify = (value: string): string => {
      return String(value ?? "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80);
    };

    const safeKeyPart = (value: string): string => {
      const cleaned = String(value ?? "")
        .replace(/[^a-zA-Z0-9._\-]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .slice(0, 120);
      return cleaned || "file";
    };

    const s3Config = (config as any)?.s3 as
      | {
          region?: string;
          bucket?: string;
          accessKeyId?: string;
          secretAccessKey?: string;
          endpoint?: string;
          presignedUrlExpiresSeconds?: string | number;
        }
      | undefined;

    if (attachments.length && s3Config) {
      const { getS3Client, getPresignedViewUrl, uploadBufferToS3 } =
        await import("../utils/s3");

      const s3 = getS3Client(s3Config);
      if (!s3) {
        console.warn("S3 upload skipped: missing/invalid S3 config", {
          region: String(s3Config.region ?? "").trim() || undefined,
          bucket: String(s3Config.bucket ?? "").trim() || undefined,
          hasEndpoint: Boolean(String(s3Config.endpoint ?? "").trim()),
          attachments: attachments.length,
        });
      }
      if (s3) {
        console.info("S3 upload starting", {
          bucket: s3.bucket,
          region: String(s3Config.region ?? "").trim() || undefined,
          attachments: attachments.length,
        });
        const submittedDate = new Date().toISOString().slice(0, 10);
        const suffix = randomUUID().slice(0, 8);

        const safeService = slugify(service) || "junk-removal";
        const safeName = slugify(name) || "customer";

        const prefix = `removal-requests/${safeService}/${safeName}/${submittedDate}-${suffix}/`;
        s3Prefix = prefix;
        console.info("S3 upload prefix", { prefix });

        const uploaded: Array<{ name: string; key: string; url: string }> = [];
        for (const [index, attachment] of attachments.entries()) {
          const numbered = String(index + 1).padStart(2, "0");
          const filename = safeKeyPart(attachment.filename);
          const key = `${prefix}${numbered}-${filename}`;

          try {
            await uploadBufferToS3({
              client: s3.client,
              bucket: s3.bucket,
              key,
              buffer: attachment.content,
              contentType: attachment.contentType,
            });

            const url = await getPresignedViewUrl({
              client: s3.client,
              bucket: s3.bucket,
              key,
              expiresInSeconds: s3.presignedUrlExpiresSeconds,
            });

            uploaded.push({ name: attachment.filename, key, url });
          } catch (error) {
            console.error(
              "S3 upload failed for",
              attachment.filename,
              error instanceof Error ? error.message : error,
            );
          }
        }

        s3Uploads = uploaded.length ? uploaded : null;
      }
    }

    const result = await resend.emails.send({
      from: "Mann Muscles LLC <no-reply@formworkstudios.xyz>",
      to: ["mannmuscles@gmail.com"],
      bcc: ["mikesynan@gmail.com"],
      reply_to: email,
      subject: `New ${service} Request from ${name}`,
      attachments: attachments.length ? attachments : undefined,
      html: `
        <h2>New ${escapeHtml(service)} Request</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
        <p><strong>Service Type:</strong> ${escapeHtml(service)}</p>
        <p><strong>Zip Code:</strong> ${escapeHtml(zipcode || "Not provided")}</p>
        <p><strong>Message:</strong></p>
        <pre style="white-space:pre-wrap;word-break:break-word">${escapeHtml(message)}</pre>
        ${attachments.length ? `<p><strong>Photos attached:</strong> ${attachments.length}</p>` : "<p><strong>Photos:</strong> None</p>"}
        ${
          s3Uploads?.length
            ? `
          <hr />
          <p><strong>Photos uploaded to S3 (pre-signed links):</strong></p>
          <ul>
            ${s3Uploads
              .map(
                (u) =>
                  `<li><a href="${escapeHtml(u.url)}">${escapeHtml(u.name)}</a></li>`,
              )
              .join("\n")}
          </ul>
        `
            : ""
        }
      `,
      text: `
New ${service} Request

Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Service Type: ${service}
Zip Code: ${zipcode || "Not provided"}

Message:
${message}

Photos attached: ${attachments.length}
${s3Uploads?.length ? `\nS3 uploads (pre-signed links):\n${s3Uploads.map((u) => `- ${u.name}: ${u.url}`).join("\n")}` : ""}
      `.trim(),
    });

    return {
      status: "sent",
      result,
      s3Prefix,
      s3Uploads,
    };
  } catch (error) {
    setResponseStatus(event, 500);
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
});
