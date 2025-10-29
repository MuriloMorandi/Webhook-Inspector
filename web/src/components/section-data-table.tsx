import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

interface SectionDataTableProps extends ComponentProps<'div'> {
  data: Array<{ label: string; value: string }>
}

export function SectionDataTable({
  className,
  data,
  ...pros
}: SectionDataTableProps) {
  return (
    <div
      className={twMerge(
        'overflow-hidden rounded-lg border border-zinc-700',
        className,
      )}
      {...pros}
    >
      <table className="w-full">
        {data.map(({ label, value }) => (
          <tr key={label} className="boder-b border-zinc-700 last:border-0">
            <td className="p-3 text-sm font-medium text-zinc-400 bg-zinc/800/50 border-r border-zinc-700">
              {label}
            </td>
            <td className="p-3 text-sm font-mono text-zinc-300 ">{value}</td>
          </tr>
        ))}
      </table>
    </div>
  )
}
