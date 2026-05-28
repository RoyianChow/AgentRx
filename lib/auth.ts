import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"

import { db } from "@/lib/db"
import { env } from "@/env"
import { sendPasswordResetEmail } from "./email"

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,

  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    resetPasswordTokenExpiresIn: 60 * 60,
    revokeSessionsOnPasswordReset: true,
  
    sendResetPassword: async ({ user, url }) => {
        await sendPasswordResetEmail({
          to: user.email,
          name: user.name,
          resetUrl: url,
        })
      },
  
    onPasswordReset: async ({ user }) => {
      console.log(`Password reset completed for ${user.email}`)
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false,
        returned: true,
      },
    },
  },

  plugins: [nextCookies()],
})