import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { webhooks } from '@/db/schema'
import { dbClient } from '@/db'
import { inArray } from 'drizzle-orm';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export const generateHandle: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/generate',
    {
      schema: {
        summary: 'Generate a handle for selected Webhooks',
        tags: ['Webhooks'],
        body: z.object({
          webhooksIds: z.array(z.uuid()),
        }),
        response: {
          201: z.object({
            code: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { webhooksIds } = request.body


      const result = await dbClient
        .select({
          body: webhooks.body
        })
        .from(webhooks)
        .where(inArray(webhooks.id, webhooksIds))
      
      const webhooksBodies = result.map(r => r.body).join('\n\n')
      
      const { text } = await generateText({
        model: google('gemini-2.5-flash-lite'),
        prompt: `
          You will receive multiple raw JSON bodies from different webhook requests.

          Your task is:
          1. Analyze all provided webhook bodies.
          2. Generate a complete TypeScript file containing only code.
          3. The generated code must include:
            - All Zod schemas inferred from the webhook bodies.
            - A discriminated union schema for all event types.
            - All necessary TypeScript and Zod imports.
          
          Formatting rules:
           - Do not include comments, explanations, descriptive text, or code fences.
           - The output must be only the code that belongs in a .ts file.

          Below are the webhook request bodies you should analyze:
          ${webhooksBodies}
        `.trim(),
      });
      

      return reply.status(201).send({ code: text })
    },
  )
}
