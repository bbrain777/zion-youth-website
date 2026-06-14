const DEFAULT_FROM_EMAIL = "ZION Youth <info@zionyouths.org>";

function getReplyToEmail() {
  return process.env.TEAM_REPLY_EMAIL || process.env.TEAM_EMAIL || "info@zionyouths.org";
}

function getFromEmail() {
  return process.env.FROM_EMAIL || DEFAULT_FROM_EMAIL;
}

function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

async function sendEmail({ to, subject, text, html }) {
  if (!isEmailConfigured()) {
    return { skipped: true };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getFromEmail(),
      to,
      subject,
      text,
      html,
      reply_to: getReplyToEmail(),
    }),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(result.message || "Confirmation email could not be sent.");
    error.statusCode = response.status;
    throw error;
  }

  return result;
}

function buildConfirmationEmail(name, formType) {
  const firstName = String(name || "there").trim() || "there";
  const subject =
    formType === "contact"
      ? "We received your message - ZION Youth"
      : "We received your application - ZION Youth";

  const text = `Hello ${firstName},

Thank you for contacting ZION Youth Development Initiative.

We have received your submission and our team will reach out within the next 72 hours.

With appreciation,
ZION Youth Development Initiative`;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #102a43; line-height: 1.6;">
      <p>Hello ${firstName},</p>
      <p>Thank you for contacting <strong>ZION Youth Development Initiative</strong>.</p>
      <p>We have received your submission and our team will reach out within the next <strong>72 hours</strong>.</p>
      <p>With appreciation,<br />ZION Youth Development Initiative</p>
    </div>
  `;

  return { subject, text, html };
}

async function sendConfirmationEmail({ email, name, formType }) {
  const message = buildConfirmationEmail(name, formType);
  return sendEmail({
    to: email,
    subject: message.subject,
    text: message.text,
    html: message.html,
  });
}

module.exports = {
  sendConfirmationEmail,
};
