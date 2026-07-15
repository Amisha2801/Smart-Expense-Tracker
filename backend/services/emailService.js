import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendPasswordResetEmail({ to, resetLink }) {
  await transporter.sendMail({
    from: `"Ledger Expense Tracker" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset your Ledger password",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Password Reset Request</h2>

        <p>
          We received a request to reset the password for your Ledger account.
        </p>

        <p>
          Click the button below to create a new password:
        </p>

        <p>
          <a
            href="${resetLink}"
            style="
              display: inline-block;
              padding: 12px 18px;
              background: #111827;
              color: white;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Reset Password
          </a>
        </p>

        <p>
          This link will expire after a limited period.
        </p>

        <p>
          If you did not request a password reset, you can ignore this email.
        </p>
      </div>
    `,
  });
}