import nodemailer from "nodemailer";
import { DateTime } from "luxon";

const smtpPort = Number(process.env.SMTP_PORT || 465);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: smtpPort,
  secure:
    String(process.env.SMTP_SECURE || "true").toLowerCase() === "true",

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function formatClassTime(startTimeUtc, timezone) {
  return DateTime.fromISO(startTimeUtc, {
    zone: "utc",
  })
    .setZone(timezone)
    .toFormat("dd LLL yyyy, hh:mm a");
}

export async function sendBookingConfirmationEmail({
  booking,
  meetingLink,
}) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP email configuration is missing.");
  }

  const parentTime = formatClassTime(
    booking.startTimeUtc,
    booking.parent.timezone
  );

  const mentorTime = formatClassTime(
    booking.startTimeUtc,
    booking.mentor.timezone
  );

  /*
   * Both parent and mentor receive the same
   * confirmation email and the same class link.
   */
  const recipients = [
    booking.parent.email,
    booking.mentor.email,
  ];

  const mailOptions = {
    from:
      process.env.MAIL_FROM ||
      `CodeYoung Trial Classes <${process.env.SMTP_USER}>`,

    to: recipients,

    subject: `CodeYoung Trial Class Confirmed - Booking #${booking.id}`,

    text: `
CodeYoung Trial Class Confirmed

Booking ID: #${booking.id}

Parent:
${booking.parent.name}
${booking.parent.email}

Mentor:
${booking.mentor.name}
${booking.mentor.email}

Parent local class time:
${parentTime}
(${booking.parent.timezone})

Mentor local class time:
${mentorTime}
(${booking.mentor.timezone})

Both times represent the same class appointment.

Join your demo class:
${meetingLink}

The class link is shared between the parent and mentor.

Regards,
CodeYoung Trial Classes
`,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 620px;
        margin: auto;
        padding: 24px;
        color: #172033;
      ">

        <h2 style="margin-bottom: 8px;">
          CodeYoung Trial Class Confirmed 🎉
        </h2>

        <p>
          Your CodeYoung trial class has been successfully booked.
        </p>

        <div style="
          padding: 18px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #f8fafc;
        ">

          <p>
            <strong>Booking ID:</strong>
            #${booking.id}
          </p>

          <p>
            <strong>Parent:</strong>
            ${booking.parent.name}
          </p>

          <p>
            <strong>Mentor:</strong>
            ${booking.mentor.name}
          </p>

          <p>
            <strong>Parent local time:</strong><br>
            ${parentTime}<br>
            <span style="color: #64748b;">
              ${booking.parent.timezone}
            </span>
          </p>

          <p>
            <strong>Mentor local time:</strong><br>
            ${mentorTime}<br>
            <span style="color: #64748b;">
              ${booking.mentor.timezone}
            </span>
          </p>

        </div>

        <p style="
          margin-top: 20px;
          color: #475569;
        ">
          The parent and mentor times above represent the
          <strong>same appointment</strong>, converted to each
          person's local timezone.
        </p>

        <div style="
          margin-top: 28px;
          text-align: center;
        ">

          <a
            href="${meetingLink}"
            style="
              display: inline-block;
              padding: 14px 24px;
              background: #2563eb;
              color: #ffffff;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
            "
          >
            Join Demo Class
          </a>

        </div>

        <div style="
          margin-top: 20px;
          padding: 14px;
          background: #f1f5f9;
          border-radius: 8px;
          word-break: break-all;
        ">

          <strong>Class link:</strong><br>

          <a
            href="${meetingLink}"
            style="color: #2563eb;"
          >
            ${meetingLink}
          </a>

        </div>

        <p style="
          margin-top: 24px;
          color: #64748b;
          font-size: 13px;
        ">
          Please keep this email for your class details.
        </p>

        <p>
          Regards,<br>
          <strong>CodeYoung Trial Classes</strong>
        </p>

      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);

  return {
    messageId: info.messageId,
    recipients,
  };
}