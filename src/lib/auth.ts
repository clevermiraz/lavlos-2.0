import { checkout, polar, portal } from "@polar-sh/better-auth";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import prisma from "@/lib/db";
import { polarClient } from "./polar";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql"
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "ada7a8d2-307b-4b57-9dca-43f2bb37b591",
              slug: "lavlos",
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
        }),
        portal(),
      ],
    }),
  ],
  trustedOrigins: ["https://tussal-deftly-ressie.ngrok-free.dev"],
});
