import { CopyIcon } from 'lucide-react'
import { IconButton } from './ui/icon-button'
import { WebhooksList } from './webhooks-list'
import { Suspense } from 'react'

export function Sidebar() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between border-b border-zinc-700 px-4 py-5">
        <div className="flex items-baseline">
          <span className="font-semibold text-zinc-100">webhook</span>
          <span className="font-normal text-zinc-400">.inpect</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2.5">
        <div className="flex-1 min-w-0 flex items-center gap-1 text-cs font-mono text-zinc-300">
          <span className="truncate">http://localhost:5173/</span>
        </div>
        <IconButton size="sm" icon={<CopyIcon className="size-4" />} />
      </div>

      <Suspense fallback={<p>Carregando...</p>}>
        <WebhooksList />
      </Suspense>
    </div>
  )
}
