import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { request } from 'https'
import { z } from 'zod'

export const listWebhooks: FastifyPluginAsyncZod = async (app) => {
    app.get(
        '/webhooks',
        {
            schema: {
                summary: 'List Webhooks',
                tags: ['Webhooks'],
                querystring: z.object({
                    limit: z.number().min(1).max(100).default(20),
                    offset: z.number().min(0).default(0),
                }),
                response: {
                    200: z.array(
                        z.object({
                            id: z.string(),
                            method: z.string(),
                        })
                    )
                }
            },
        },
        async (request, reply) => {
            const { limit, offset } = request.query


            return reply.send([])
        })
}
