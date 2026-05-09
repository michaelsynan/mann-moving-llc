export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  if (getMethod(event) !== "POST") {
    setResponseStatus(event, 405);
    return { status: "error", error: "Method Not Allowed" };
  }

  if (!config.resend?.apiKey) {
    setResponseStatus(event, 500);
    return { status: "error", error: "Missing Resend API key" };
  }

  const resend = useResend();

  const escapeHtml = (value: unknown) => {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  };

  // Get form data from request body
  const body = await readBody<Record<string, unknown>>(event).catch(
    () => ({}) as Record<string, unknown>,
  );
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const service = String(body.service ?? "").trim();
  const zipcode = String(body.zipcode ?? "").trim();
  const message = String(body.message ?? "").trim();

  // Bot mitigation (low-friction): honeypot + minimum time-to-submit.
  const website = String(body.website ?? "").trim();
  if (website) {
    setResponseStatus(event, 422);
    return { status: "error", error: "Spam detected" };
  }

  const startedAtRaw = body.startedAt;
  const startedAt =
    typeof startedAtRaw === "number"
      ? startedAtRaw
      : Number.parseInt(String(startedAtRaw ?? ""), 10);

  if (!Number.isFinite(startedAt)) {
    setResponseStatus(event, 422);
    return { status: "error", error: "Please try again." };
  }

  const elapsedMs = Date.now() - startedAt;
  if (!Number.isFinite(elapsedMs) || elapsedMs < 2500) {
    setResponseStatus(event, 422);
    return { status: "error", error: "Please wait a moment and try again." };
  }

  if (!name || !email || !service || !message) {
    setResponseStatus(event, 400);
    return { status: "error", error: "Missing required fields" };
  }

  try {
    const result = await resend.emails.send({
      from: "Mann Muscles LLC <no-reply@formworkstudios.xyz>",
      to: ["hello@formworkstudios.com"],
      bcc: ["mikesynan@gmail.com"],
      subject: `New ${service} Request from ${name}`,
      html: `
      <h2>New ${escapeHtml(service)} Request</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
      <p><strong>Service Type:</strong> ${escapeHtml(service)}</p>
      <p><strong>Zip Code:</strong> ${escapeHtml(zipcode || "Not provided")}</p>
      <p><strong>Message:</strong></p>
      <pre style="white-space:pre-wrap;word-break:break-word">${escapeHtml(message)}</pre>
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
    `,
    });

    const smsToRaw = String((config as any).contactSmsTo ?? "").trim();
    let smsResult: unknown = null;

    if (smsToRaw) {
      const smsRecipients = smsToRaw
        .split(/[,\s]+/)
        .map((value) => value.trim())
        .filter(Boolean);

      const maskedRecipients = smsRecipients.map((value) => {
        return value.replace(/^\d+(?=@)/, "***");
      });

      try {
        const smsLines = [
          `New ${service} request`,
          `Name: ${name}`,
          `Phone: ${phone || "N/A"}`,
          `Zip: ${zipcode || "N/A"}`,
        ];

        // Keep it short for SMS gateways (160-ish chars) and ASCII only.
        const baseText = smsLines.join(" | ");
        const sanitized = baseText.replace(/[^\x00-\x7F]/g, "");
        const smsText =
          sanitized.length > 160 ? sanitized.slice(0, 160) : sanitized;

        const perRecipientResults = [] as unknown[];
        for (const to of smsRecipients) {
          perRecipientResults.push(
            await resend.emails.send({
              from: "Mann Muscles Alerts <no-reply@formworkstudios.xyz>",
              to: [to],
              subject: `New ${service}: ${name}`,
              text: smsText,
            }),
          );
        }

        smsResult = perRecipientResults;
      } catch (error) {
        smsResult = {
          error:
            error instanceof Error
              ? error.message
              : "Failed to send SMS notification",
        };
      }
    }

    return { status: "sent", result, smsResult };
  } catch (error) {
    setResponseStatus(event, 500);
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
});
