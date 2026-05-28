import "server-only"

import { Resend } from "resend"
import { z } from "zod"

import { env } from "@/env"

const resend = new Resend(env.RESEND_API_KEY)

const APP_NAME = "AgentRx"
const SUPPORT_EMAIL = "support@agentrx.com"

const sendPasswordResetEmailSchema = z.object({
  to: z.string().email("A valid recipient email is required."),
  resetUrl: z.string().url("A valid password reset URL is required."),
  name: z.string().trim().min(1).max(80).optional().nullable(),
})

type SendPasswordResetEmailInput = z.infer<
  typeof sendPasswordResetEmailSchema
>

type EmailSendResult = {
  id: string | null
  accepted: boolean
}

class EmailDeliveryError extends Error {
  constructor(
    message: string,
    public readonly providerMessage?: string
  ) {
    super(message)
    this.name = "EmailDeliveryError"
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function normalizeDisplayName(name?: string | null) {
  const normalized = name?.trim()

  if (!normalized) {
    return "there"
  }

  return normalized.slice(0, 80)
}

function getProviderSafeErrorMessage(message?: string) {
  if (!message) {
    return "The email provider rejected the request."
  }

  const lowerMessage = message.toLowerCase()

  if (
    lowerMessage.includes("domain is not verified") ||
    lowerMessage.includes("domain not verified")
  ) {
    return "The sender domain is not verified in Resend. Verify your domain or use onboarding@resend.dev for local testing."
  }

  if (lowerMessage.includes("api key")) {
    return "The email provider rejected the API key. Check RESEND_API_KEY."
  }

  if (lowerMessage.includes("rate limit")) {
    return "Email rate limit reached. Please try again later."
  }

  return "Unable to send the email right now. Please try again later."
}

function createPasswordResetTextEmail({
  displayName,
  resetUrl,
}: {
  displayName: string
  resetUrl: string
}) {
  return [
    `Hi ${displayName},`,
    "",
    `We received a request to reset your ${APP_NAME} password.`,
    "",
    "Use the secure link below to create a new password:",
    resetUrl,
    "",
    "This link will expire soon. If you did not request a password reset, you can safely ignore this email.",
    "",
    `${APP_NAME} Security`,
  ].join("\n")
}

function createPasswordResetHtmlEmail({
  displayName,
  resetUrl,
}: {
  displayName: string
  resetUrl: string
}) {
  const safeDisplayName = escapeHtml(displayName)
  const safeResetUrl = escapeHtml(resetUrl)

  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Reset your ${APP_NAME} password</title>
  </head>

  <body style="margin:0;padding:0;background-color:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#020617;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f8fafc;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background-color:#ffffff;border:1px solid #e2e8f0;border-radius:20px;overflow:hidden;">
            <tr>
              <td style="padding:32px 32px 20px;">
                <div style="display:inline-block;background-color:#020617;color:#ffffff;border-radius:14px;padding:10px 14px;font-size:14px;font-weight:700;">
                  ${APP_NAME}
                </div>

                <h1 style="margin:24px 0 12px;color:#020617;font-size:26px;line-height:1.25;font-weight:700;">
                  Reset your password
                </h1>

                <p style="margin:0;color:#475569;font-size:15px;line-height:1.7;">
                  Hi ${safeDisplayName},
                </p>

                <p style="margin:16px 0 0;color:#475569;font-size:15px;line-height:1.7;">
                  We received a request to reset your ${APP_NAME} password. Use the secure button below to create a new password.
                </p>

                <div style="margin:28px 0;">
                  <a href="${safeResetUrl}" style="display:inline-block;background-color:#020617;color:#ffffff;text-decoration:none;padding:13px 18px;border-radius:12px;font-size:14px;font-weight:700;">
                    Reset password
                  </a>
                </div>

                <p style="margin:0;color:#64748b;font-size:13px;line-height:1.7;">
                  This link will expire soon. If you did not request a password reset, you can safely ignore this email.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 32px 32px;">
                <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:16px;">
                  <p style="margin:0 0 8px;color:#475569;font-size:13px;line-height:1.6;font-weight:700;">
                    Having trouble with the button?
                  </p>

                  <p style="margin:0;color:#64748b;font-size:12px;line-height:1.6;">
                    Copy and paste this link into your browser:
                  </p>

                  <p style="margin:8px 0 0;color:#334155;font-size:12px;line-height:1.6;word-break:break-all;">
                    ${safeResetUrl}
                  </p>
                </div>

                <p style="margin:20px 0 0;color:#94a3b8;font-size:12px;line-height:1.6;">
                  This is a security email from ${APP_NAME}. Please do not forward this email.
                </p>
              </td>
            </tr>
          </table>

          <p style="margin:18px 0 0;color:#94a3b8;font-size:12px;line-height:1.6;">
            © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim()
}

export async function sendPasswordResetEmail(
  input: SendPasswordResetEmailInput
): Promise<EmailSendResult> {
  const parsed = sendPasswordResetEmailSchema.safeParse(input)

  if (!parsed.success) {
    throw new EmailDeliveryError(
      "Invalid password reset email payload.",
      parsed.error.message
    )
  }

  const { to, resetUrl, name } = parsed.data
  const displayName = normalizeDisplayName(name)

  try {
    const { data, error } = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to,
      replyTo: SUPPORT_EMAIL,
      subject: `Reset your ${APP_NAME} password`,
      text: createPasswordResetTextEmail({
        displayName,
        resetUrl,
      }),
      html: createPasswordResetHtmlEmail({
        displayName,
        resetUrl,
      }),
      tags: [
        {
          name: "category",
          value: "password-reset",
        },
        {
          name: "app",
          value: "agentrx",
        },
      ],
    })

    if (error) {
      throw new EmailDeliveryError(
        getProviderSafeErrorMessage(error.message),
        error.message
      )
    }

    return {
      id: data?.id ?? null,
      accepted: true,
    }
  } catch (error) {
    if (error instanceof EmailDeliveryError) {
      console.error("[email.password_reset.failed]", {
        to,
        reason: error.message,
        providerMessage: error.providerMessage,
      })

      throw error
    }

    console.error("[email.password_reset.unexpected_error]", {
      to,
      error,
    })

    throw new EmailDeliveryError(
      "Unexpected error while sending the password reset email."
    )
  }
}