import { createFileRoute } from '@tanstack/react-router'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { Sidebar } from '../components/sidebar'
import { WebhookDetailsHeader } from '../components/webhook-details-header'

import { CodeBlock } from '../components/ui/code-block'
import { SectionTitle } from '../components/ui/section-title'
import { SectionDataTable } from '../components/section-data-table'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const overviewData = [
    { label: 'Method', value: 'POST' },
    { label: 'Status Key', value: '200' },
    { label: 'Content-Type', value: 'application/json' },
    { label: 'Response Time', value: '150ms' },
  ]

  return (
    <div className="h-screen bg-zinc-900">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={20} minSize={15} maxSize={40}>
          <Sidebar />
        </Panel>
        <PanelResizeHandle className="w-px bg-zinc-700 hover:bg-zinc-600 transition-colors duration-150" />

        <Panel defaultSize={80} minSize={60}>
          <div className="flex h-full flex-col">
            <WebhookDetailsHeader />
            <div className='flex-1 overflow-y-auto'>
            <div className="space-y-6 p-6">
              <div className="space-y-4">
                <SectionTitle>Request Overview</SectionTitle>
                <SectionDataTable data={overviewData} />
              </div>

              <div className="space-y-4">
                <SectionTitle>Request Overview</SectionTitle>
                <SectionDataTable data={overviewData} />
              </div>

              <div className="space-y-4">
                <SectionTitle>Request Body</SectionTitle>
                <SectionDataTable data={overviewData} />
                <CodeBlock code={JSON.stringify(overviewData, null, 2)} />
              </div>
              </div>
              </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}
