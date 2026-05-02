import twilio from "twilio";

type SmsBody = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  service?: unknown;
  zipcode?: unknown;
  message?: unknown;
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const accountSid = config.twilio?.accountSid;
  const authToken = config.twilio?.authToken;
  const fromNumber = config.twilio?.fromNumber;
  const toNumber = config.twilio?.toNumber;

  if (!accountSid || !authToken || !fromNumber || !toNumber) {
    setResponseStatus(event, 500);
    return {
      status: "error",
      error: "Twilio is not configured (missing TWILIO_* env vars).",
    };
  }

  const body = await readBody<SmsBody>(event).catch(() => ({}) as SmsBody);
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const service = String(body.service ?? "").trim();
  const zipcode = String(body.zipcode ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!service || !name) {
    setResponseStatus(event, 400);
    return { status: "error", error: "Missing required fields" };
  }

  // Keep it concise; Twilio can segment long messages but short is better.
  const smsText = [
    `New ${service} request`,
    `Name: ${name}`,
    `Phone: ${phone || "N/A"}`,
    `Email: ${email || "N/A"}`,
    `Zip: ${zipcode || "N/A"}`,
    message ? `Msg: ${message.replace(/\s+/g, " ").slice(0, 600)}` : "",
  ]
    .filter(Boolean)
    .join(" | ");

  try {
    const client = twilio(accountSid, authToken);
    const result = await client.messages.create({
      from: fromNumber,
      to: toNumber,
      body: smsText,
    });

    return { status: "sent", sid: result.sid };
  } catch (error) {
    setResponseStatus(event, 500);
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Failed to send SMS",
    };
  }
});
