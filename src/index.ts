import Fastify from 'fastify'
import { knex } from './database'
import { env } from './env'

const app = Fastify({
  logger: true,
})

app.get('/', async () => {
  const transactions = await knex('transactions').select('*')

  return transactions
})

app.listen({ port: env.PORT }, (err, address) => {
  if (err) throw err
  console.log(`Server is now listening on ${address}`)
})
