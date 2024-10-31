import { app } from './app'
import { env } from './env'

app.listen(
  { port: env.PORT, host: 'RENDER' in process.env ? '0.0.0.0' : 'localhost' },
  (err, address) => {
    if (err) throw err
    console.log(`Server is now listening on ${address}`)
  },
)
