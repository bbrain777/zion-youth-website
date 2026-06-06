const { ensureTables, getSqlClient, requireFields, sendError } = require("./db");

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

    return response.status(201).json({
      ok: true,
      id: rows[0].id,
      createdAt: rows[0].created_at,
    });
  } catch (error) {
    return sendError(response, error);
  }
};
