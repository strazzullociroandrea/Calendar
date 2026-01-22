import {betterAuth} from "better-auth";
import {prismaAdapter} from "better-auth/adapters/prisma";
import {headers} from "next/headers";
import {customSession, emailOTP} from "better-auth/plugins";
import {env} from "@/env";
import {db} from "@/server/db";


export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: "mysql",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, token }) => {

            try {
                const url = `${env.NEXT_PUBLIC_APP_URL}/auth/verify-user?token=${token}&email=${user.email}`;

                if (env.NODE_ENV === "development") {
                    console.log(url);
                } /*else {
                        await sendOTP(email, otp);
                    }*/
            } catch (error) {
                console.error("Errore nell'invio dell'OTP:", error);
                throw new Error(
                    "Failed to send verification code. Please try again.",
                );
            }
        },
    },
    plugins: [
        emailOTP({
            disableSignUp: true,
            async sendVerificationOTP({email, otp, type}) {
                if (type !== "sign-in") {
                    throw new Error("Invalid type");
                }

                try {
                    if (env.NODE_ENV === "development") {
                        console.log(`[DEBUG] OTP per ${email}: ${otp}`);
                    } /*else {
                        await sendOTP(email, otp);
                    }*/
                } catch (error) {
                    console.error("Errore nell'invio dell'OTP:", error);
                    throw new Error(
                        "Failed to send verification code. Please try again.",
                    );
                }
            },
        }),
        customSession(async ({user, session}) => {
            let headquarterId: string | undefined;
            return {
                session,
                user: {...user, headquarterId},
            };
        })
    ]
});

export const getServerSession = async () =>
    auth.api.getSession({
        headers: await headers(),
    });
