import dotenv from "dotenv"

dotenv.config({ silent: true })

export const {
  CLIENT_URI,
  CORS_URI,
  JWT_SECRET,
  MAILGUN_DOMAIN,
  MAILGUN_KEY,
  MONGODB_URI,
  PORT,
  WEBSOCKET_ENDPOINT,
} = process.env

const defaults = {
  CLIENT_URI: "defined in .env",
  CORS_URI: "defined in .env",
  JWT_SECRET: "defined in .env",
  MAILGUN_DOMAIN: "defined in .env",
  MAILGUN_KEY: "defined in .env",
  MONGODB_URI: "defined in .env",
  PORT: "defined in .env",
}

Object.keys(defaults).forEach((key) => {
  if (!process.env[key] || process.env[key] === defaults[key]) {
    throw new Error(`Environment variable missing: ${key} (if running on your local environment, add it into a .env file at the root of your project).`)
  }
})
