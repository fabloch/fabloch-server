import dotenv from "dotenv"

dotenv.config({ silent: true })

export const {
  CORS_URI,
  JWT_SECRET,
  PORT,
  MONGODB_URI,
} = process.env

const defaults = {
  CORS_URI: "defined in .env",
  JWT_SECRET: "defined in .env",
  PORT: "defined in .env",
  MONGODB_URI: "defined in .env",
}

Object.keys(defaults).forEach((key) => {
  if (!process.env[key] || process.env[key] === defaults[key]) {
    throw new Error(`Environment variable missing: ${key} (if running on your local environment, add it into a .env file at the root of your project).`)
  }
})
