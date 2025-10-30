import { uuidv7 } from 'uuidv7'
import { dbClient } from '.'
import { webhooks } from './schema'
import { faker } from '@faker-js/faker'

async function seed() {
  const webhookEvents = [
    'checkout.session.completed',
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    'invoice.paid',
    'invoice.payment_failed',
    'customer.created',
    'customer.subscription.created',
    'customer.subscription.updated',
    'charge.refunded',
  ]

  const data = Array.from({ length: 60 }).map(() => {
    const event = faker.helpers.arrayElement(webhookEvents)
    const body = JSON.stringify({
      id: `evt_${faker.string.alphanumeric(24)}`,
      object: 'event',
      type: event,
      data: {
        object: {
          id: `pi_${faker.string.alphanumeric(24)}`,
          amount: faker.number.int({ min: 1000, max: 100000 }),
          currency: 'usd',
          status: faker.helpers.arrayElement([
            'succeeded',
            'pending',
            'failed',
          ]),
        },
      },
    })

    return {
      id: uuidv7(),
      method: 'POST',
      pathname: '/api/webhook/stripe',
      ip: faker.internet.ip(),
      statusCode: faker.helpers.arrayElement([200, 200, 200, 200, 500]),
      contentType: 'application/json',
      contentLength: body.length,
      queryParams: { test: 'true' },
      headers: {
        'user-agent': faker.internet.userAgent(),
        'stripe-signature': faker.string.alphanumeric(64),
      },
      body,
      createdAt: faker.date.recent({ days: 30 }),
    }
  })

  await dbClient.insert(webhooks).values(data)
  console.log('✅ 60 webhooks simulados do Stripe inseridos com sucesso!')
}

seed().catch((err) => {
  console.error('❌ Erro ao criar seed:', err)
})
