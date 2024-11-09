import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

const localEnvPath = path.resolve(process.cwd(), '.env.local')
const localEnvExists = fs.existsSync(localEnvPath)

if (localEnvExists) {
  const localEnvConfig = dotenv.parse(fs.readFileSync(localEnvPath))
  for (const key in localEnvConfig) {
    process.env[key] = localEnvConfig[key]
  }
} else {
  console.warn('.env.local does not exist, using .env by default')
  dotenv.config()
}

export default process.env
