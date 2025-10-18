/*
 * Node Modules
 */
import dotenv from "dotenv";

dotenv.config({
  quiet: true,
  debug: process.env.NODE_ENV === "development",
});

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  debug: process.env.DEBUG === "true" || false,
  version: "1.0.0",
  token: {
    secret: process.env.TOKEN_SECRET || "your-secret-key",
    expiresIn: process.env.TOKEN_EXPIRES_IN || "15m",
    refreshSecret: process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret-key",
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
    issuer: process.env.TOKEN_ISSUER || "your-app-name",
  },
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
};
