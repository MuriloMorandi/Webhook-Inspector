import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { webhooksListShema } from '../http/schemas/webhooks'
import { WebhooksListItem } from './webhooks-list-item'
import { Loader2, Wand2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { CodeBlock } from './ui/code-block'

export function WebhooksList() {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver>(null)
  const [checkedWebhooksIds, setCheckedWebhooksIds] = useState<string[]>([])
  const [generateHandleCode, setGenerateHandleCode] = useState<string | null>(
    null,
  )

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ['webkooks'],
      queryFn: async ({ pageParam }) => {
        const url = new URL(`${import.meta.env.VITE_API_URL}/webhooks`)

        if (pageParam) {
          url.searchParams.set('cursor', pageParam)
        }

        const response = await fetch(url)
        const data = await response.json()

        return webhooksListShema.parse(data)
      },
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor ?? undefined
      },
      initialPageParam: '',
    })

  const webhooks = data?.pages.flatMap((page) => page.webhooks)

  function handleWebhookChecked(webhookId: string) {
    if (checkedWebhooksIds.includes(webhookId)) {
      setCheckedWebhooksIds((state) => state.filter((id) => id !== webhookId))
    } else {
      setCheckedWebhooksIds((state) => [...state, webhookId])
    }
  }

  async function handleGenerateHandle() {
    const result = await fetch(`${import.meta.env.VITE_API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ webhooksIds: checkedWebhooksIds }),
    })

    const data: { code: string } = await result.json()
    setGenerateHandleCode(data.code)
  }

  const hasAnyWebhookChecked = checkedWebhooksIds.length > 0

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]

        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        threshold: 0.1,
      },
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-2">
          <button
            disabled={!hasAnyWebhookChecked}
            className="bg-indigo-400 text-white w-full rounded-lg flex items-center justify-center gap-3 font-medium text-sm py-2 mb-3 disabled:opacity-50"
            onClick={handleGenerateHandle}
          >
            <Wand2 className="size-4" />
            Gerar handle
          </button>

          {webhooks.map((webhook) => {
            return (
              <WebhooksListItem
                key={webhook.id}
                webhook={webhook}
                onWebhookChecked={handleWebhookChecked}
                isChecked={checkedWebhooksIds.includes(webhook.id)}
              />
            )
          })}
        </div>

        {hasNextPage && (
          <div className="p-2" ref={loadMoreRef}>
            {isFetchingNextPage && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="size-5 animate-spin text-zinc-500" />
              </div>
            )}
          </div>
        )}
      </div>

      {!!generateHandleCode && (
        <Dialog.Root
          defaultOpen
          onOpenChange={(value) => (value ? null : setGenerateHandleCode(null))}
        >
          <Dialog.Overlay className="fixed inset-0 bg-black/60 data-[state=open]:animate-overlayShow" />
          <Dialog.Content className="flex flex-col items-center justify-center fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[800px] -translate-x-1/2 -translate-y-1/2 z-20">
            <Dialog.Title className="m-0 text-[17px] font-medium text-mauve12 bg-zinc-900 w-full p-4">
              Generate Handle
            </Dialog.Title>
            <Dialog.Description className="bg-zinc-900  p-4 rounded-lg border-zinc-800 w-full max-h-[400px] overflow-y-auto">
              <CodeBlock language="typescript" code={generateHandleCode} />
            </Dialog.Description>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </>
  )
}
