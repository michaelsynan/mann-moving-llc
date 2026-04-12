import { defineEventHandler, getRequestHeader, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const secretKey = config.turnstile?.secretKey;

  if (!secretKey) {
    return {
      success: false,
      errorCodes: ["turnstile-secret-missing"],
    };
  }

  const body = await readBody<{ token?: string }>(event);
  const token = body?.token;

  if (!token) {
    return {
      success: false,
      errorCodes: ["turnstile-token-missing"],
    };
  }

  const forwardedFor = getRequestHeader(event, "x-forwarded-for");
  const remoteIp = (
    getRequestHeader(event, "cf-connecting-ip") || forwardedFor?.split(",")[0]
  )?.trim();

  const form = new URLSearchParams();
  form.set("secret", secretKey);
  form.set("response", token);
  if (remoteIp) {
    form.set("remoteip", remoteIp);
  }

  let result: { success: boolean; "error-codes"?: string[] } | null = null;
  try {
    result = await $fetch<{ success: boolean; "error-codes"?: string[] }>(
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
    return {
      success: false,
      errorCodes: ["turnstile-verify-request-failed"],
    };
  }

  return {
    success: Boolean(result?.success),
    errorCodes: Array.isArray((result as any)?.["error-codes"])
      ? (result as any)["error-codes"]
      : undefined,
  };
});
