import { Badge } from './ui/badge'

export function WebhookDetailsHeader() {
  return (
    <div className="space-y-4 border-b border-zinc-700 p-6">
      <div className="flex items-center gap-3">
        <Badge>POST</Badge>
        <span>/video/status</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-sm text-zinc-400">
          <span>From IP:</span>
          <span className="underline">192.169.150.200</span>
        </div>
        <span className="w-px h-4 bg-zinc-700"></span>
        <div className="flex items-center gap-1 text-sm text-zinc-400">
          <span>at </span>
          <span>Abril 18yh, 15pm</span>
        </div>
      </div>
    </div>
  )
}
