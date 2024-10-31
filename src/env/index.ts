import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test', override: true })
} else {
  config()
}

const envSchema = z.object({
  DATABASE_URL: z.string(),
  DATABASE_CLIENT: z.enum(['sqlite3', 'pg']),
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
})

console.log(process.env.DATABASE_URL)

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid Environment Variables!', _env.error.format())

  throw new Error('Invalid Environment Variables.')
}

export const env = envSchema.parse(process.env)
