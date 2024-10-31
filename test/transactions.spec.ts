import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { z } from 'zod'
import { execSync } from 'node:child_process'

describe('Transactions routes', () => {
  beforeAll(async () => {
    execSync('npm run knex migrate:latest')

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new transaction.', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })

  it('Should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })

    const getTransactionCookiesSchema = z.array(z.string())

    const cookies = getTransactionCookiesSchema.parse(
      createTransactionResponse.get('Set-Cookie'),
    )

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000,
      }),
    ])
  })

  it('Should be able to get a specific transactions by ID', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })

    const getTransactionCookiesSchema = z.array(z.string())

    const cookies = getTransactionCookiesSchema.parse(
      createTransactionResponse.get('Set-Cookie'),
    )

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = listTransactionsResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000,
      }),
    )
  })

  it('Should be able to get the summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })

    const getTransactionCookiesSchema = z.array(z.string())

    const cookies = getTransactionCookiesSchema.parse(
      createTransactionResponse.get('Set-Cookie'),
    )

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'New transaction',
        amount: 2000,
        type: 'debit',
      })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)

    expect(summaryResponse.body.summary.amount).equal(3000)
  })
})
