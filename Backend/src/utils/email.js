import nodemailer from 'nodemailer'
export async function sendTeacherVerification(email, code) {
  if (!process.env.SMTP_HOST || !process.env.MAIL_FROM) {
    const error = new Error('Teacher email verification is not configured. Please contact the administrator.')
    error.statusCode = 503
    throw error
  }
  const port = Number(process.env.SMTP_PORT || 587)
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port, secure: port === 465, requireTLS: true,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    connectionTimeout: 10000, socketTimeout: 15000,
  })
  try {
    await transport.sendMail({ from: process.env.MAIL_FROM, to: email,
      subject: 'Verify your Bhorosha teacher account',
      text: 'Paste this verification code into Bhorosha to claim your teacher profile:\n\n' + code + '\n\nIt expires in 15 minutes. If you did not request this, ignore this email.',
    })
  } catch {
    const error = new Error('Unable to deliver verification email. Please try again later.')
    error.statusCode = 503
    throw error
  } finally { transport.close() }
}
