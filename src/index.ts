import Fastify from 'fastify'


import { env } from './env'
import { transactionsRoutes } from './routes/transactions'

const app = Fastify({
  logger: true,
})

app.register(transactionsRoutes, {
  prefix: 'transactions',
})

app.listen({ port: env.PORT }, (err, address) => {
  if (err) throw err
  console.log(`Server is now listening on ${address}`)
})
