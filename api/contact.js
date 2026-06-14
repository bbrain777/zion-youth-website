const { ensureTables, getSqlClient, requireFields, sendError } = require("./db");
const { sendConfirmationEmail } = require("./email");

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed." });
  }

  try {
    const body = request.body || {};
    requireFields(body, ["name", "email", "reason", "message"]);

    await ensureTables();
    const sql = getSqlClient();

    const rows = await sql`
      INSERT INTO contact_messages (
        name,
        email,
        organization,
        reason,
        message
      )
      VALUES (
        ${body.name.trim()},
        ${body.email.trim().toLowerCase()},
        ${body.organization || null},
        ${body.reason.trim()},
        ${body.message.trim()}
      )
      RETURNING id, created_at;
    `;
    const emailResult = await sendConfirmationEmail({
      email: body.email.trim().toLowerCase(),
      name: body.name,
      formType: "contact",
    }).catch((error) => {
      console.error("Contact confirmation email failed:", error.message);
      return { error: error.message };
    });

    return response.status(201).json({
      ok: true,
      id: rows[0].id,
      createdAt: rows[0].created_at,
      emailSent: !emailResult.skipped && !emailResult.error,
    });
  } catch (error) {
    return sendError(response, error);
  }
};
