import nodemailer from 'nodemailer'
import { env } from '@/config/env'

// For local testing, Mailtrap is recommended.
// In production, this can be swapped to Resend SMTP, SendGrid, Amazon SES, etc.
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
  port: Number(process.env.SMTP_PORT) || 2525,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
})

// Tip: To test this locally, create a free account at https://mailtrap.io/
// and put the SMTP_USER and SMTP_PASS in your .env.local file.
