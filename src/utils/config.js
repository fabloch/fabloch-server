import dotenv from "dotenv"

dotenv.config({ silent: true })

export const {
  CLIENT_URI,
  CORS_URI,
  EMAIL_DEFAULT,
  JWT_SECRET,
  MAILGUN_DOMAIN,
  MAILGUN_KEY,
  MONGO_URL,
  MONGO_DB_NAME,
  PORT,
  WEBSOCKET_ENDPOINT,
  TEST_MONGO_URL,
  TEST_MONGO_DB_NAME,
} = process.env

const defaultString = "defined in .env"
const defaults = {
  CLIENT_URI: defaultString,
  CORS_URI: defaultString,
  EMAIL_DEFAULT: defaultString,
  JWT_SECRET: defaultString,
  MAILGUN_DOMAIN: defaultString,
  MAILGUN_KEY: defaultString,
  MONGO_URL: defaultString,
  MONGO_DB_NAME: defaultString,
  PORT: defaultString,
  TEST_MONGO_URL: defaultString,
  TEST_MONGO_DB_NAME: defaultString,
}

Object.keys(defaults).forEach(key => {
  if (!process.env[key] || process.env[key] === defaults[key]) {
    throw new Error(
      `Environment variable missing: ${key} (if running on your local environment, add it into a .env file at the root of your project).`,
    )
  }
})
