import { knex as knexSetup, Knex } from 'knex'
import { env } from './env'

export const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: './db/app.sqlite',
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: env.DATABASE_URL,
  },
}

export const knex = knexSetup(config)
