import { useSuspenseQuery } from '@tanstack/react-query'
import { webhookDetailsSchema } from '../http/schemas/webhooks'
import { WebhookDetailsHeader } from './webhook-details-header'
import { SectionTitle } from './ui/section-title'
import { SectionDataTable } from './section-data-table'
import { CodeBlock } from './ui/code-block'

interface WebhookDetailsProps {
  id: string
}

export function WebhookDetails({ id }: WebhookDetailsProps) {
  const { data } = useSuspenseQuery({
    queryKey: ['webhook', id],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/webhook/${id}`,
      )
      const data = await response.json()

      return webhookDetailsSchema.parse(data)
    },
  })

  const overviewData = [
    { label: 'Method', value: data.method },
    { label: 'Status Key', value: String(data.statusCode) },
    { label: 'Content-Type', value: data.contentType || 'application/json' },
    { label: 'Content-Length', value: `${data.contentLength || 0} bytes` },
  ]

  const headers = Object.entries(data.headers).map(([label, value]) => {
    return { label, value: String(value) }
  })

  const queryParams = Object.entries(data.queryParams || {}).map(
    ([label, value]) => {
      return { label, value: String(value) }
    },
  )

  return (
    <div className="flex h-full flex-col">
      <WebhookDetailsHeader
        createdAt={data.createdAt}
        ip={data.ip}
        method={data.method}
        pathname={data.pathname}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 p-6">
          <div className="space-y-4">
            <SectionTitle>Request Overview</SectionTitle>
            <SectionDataTable data={overviewData} />
          </div>

          <div className="space-y-4">
            <SectionTitle>Headers</SectionTitle>
            <SectionDataTable data={headers} />
          </div>

          {queryParams.length > 0 && (
            <div className="space-y-4">
              <SectionTitle>Query Parameters</SectionTitle>
              <SectionDataTable data={queryParams} />
            </div>
          )}

          {!!data.body && (
            <div className="space-y-4">
              <SectionTitle>Request Body</SectionTitle>
              <SectionDataTable data={overviewData} />
              <CodeBlock code={data.body} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
