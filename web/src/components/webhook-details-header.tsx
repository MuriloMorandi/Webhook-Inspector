import { Badge } from './ui/badge'

interface WebhookDetailsHeaderProps {
  method: string
  pathname: string
  ip: string
  createdAt: Date
}

export function WebhookDetailsHeader({
  createdAt,
  ip,
  method,
  pathname
}: WebhookDetailsHeaderProps) {
  return (
    <div className="space-y-4 border-b border-zinc-700 p-6">
      <div className="flex items-center gap-3">
        <Badge>{method}</Badge>
        <span>{pathname}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-sm text-zinc-400">
          <span>From IP:</span>
          <span className="underline">{ip}</span>
        </div>
        <span className="w-px h-4 bg-zinc-700"></span>
        <div className="flex items-center gap-1 text-sm text-zinc-400">
          <span>at </span>
          <span>{ createdAt.toLocaleString('en-US')}</span>
        </div>
      </div>
    </div>
  )
}
