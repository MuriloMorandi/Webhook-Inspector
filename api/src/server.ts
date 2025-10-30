import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import ScalarAPIReference from '@scalar/fastify-api-reference'
import { listWebhooks } from './routes/list-webhooks'
import { getWebhook } from './routes/get-webhooks'
import { deleteWebhook } from './routes/delete-webhooks'
import { capureWebhook } from './routes/capture-webhook'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Webhook Inspector API',
      description: 'API for capturing and inspecting webhooks requests.',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(ScalarAPIReference, {
  routePrefix: '/docs',
})

app.register(listWebhooks)
app.register(getWebhook)
app.register(deleteWebhook)
app.register(capureWebhook)

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('Server is running on http://localhost:3333')
  console.log('Docs are available at http://localhost:3333/docs')
})
