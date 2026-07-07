import type { StringValue } from "ms";

const getEnv = (key: string): string => {
    const value = process.env[key];

    if (!value) {
        throw new Error(`La variable de entorno '${key}' no está definida.`);
    }

    return value;
};

export const env = {
    port: Number(process.env.PORT) || 3000,
    databaseUrl: getEnv("DATABASE_URL"),
    jwtSecret: getEnv("JWT_SECRET"),
    jwtExpiresIn: getEnv("JWT_EXPIRES_IN") as StringValue,
};