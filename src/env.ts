import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["production", "development"]),
    DATABASE_URL: z.string(),
    SHADOW_DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3000),
    NEXT_PUBLIC_APP_URL: z.string()
});

export const env = process.env.SKIP_ENV_VALIDATION
    ? (envSchema.partial().parse(process.env) as z.infer<typeof envSchema>)
    : envSchema.parse(process.env);
