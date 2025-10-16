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
};
