import dotenv from 'dotenv'

dotenv.config({ silent: true })
export const {
  JWT_SECRET,
} = process.env
const defaults = {
  JWT_SECRET: 'your_secret',
}
Object.keys(defaults).forEach((key) => {
  if (!process.env[key] || process.env[key] === defaults[key]) {
    throw new Error(`Environment variable missing: ${key} (if running on your local environment, add it into a .env file at the root of your project).`)
  }
})
export default JWT_SECRET
