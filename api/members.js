const { ensureTables, getSqlClient, requireFields, sendError } = require("./db");
const { sendConfirmationEmail } = require("./email");

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed." });
  }

  try {
    const body = request.body || {};
    requireFields(body, [
      "firstName",
      "lastName",
      "email",
      "country",
      "city",
      "memberType",
      "interest",
      "goals",
    ]);

    await ensureTables();
    const sql = getSqlClient();

    const rows = await sql`
      INSERT INTO member_applications (
        first_name,
        last_name,
        email,
        phone,
        country,
        city,
        member_type,
        interest,
        goals,
        availability
      )
      VALUES (
        ${body.firstName.trim()},
        ${body.lastName.trim()},
        ${body.email.trim().toLowerCase()},
        ${body.phone || null},
        ${body.country.trim()},
        ${body.city.trim()},
        ${body.memberType.trim()},
        ${body.interest.trim()},
        ${body.goals.trim()},
        ${body.availability || null}
      )
      RETURNING id, created_at;
    `;
    const emailResult = await sendConfirmationEmail({
      email: body.email.trim().toLowerCase(),
      name: body.firstName,
      formType: "member",
    }).catch((error) => {
      console.error("Member confirmation email failed:", error.message);
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
