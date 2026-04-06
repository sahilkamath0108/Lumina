// components/GlobalLoader.tsx
"use client"
import { useIsFetching, useIsMutating } from "@tanstack/react-query"

export function GlobalLoader() {
  const isFetching = useIsFetching()
  const isMutating = useIsMutating()

  if (!isFetching && !isMutating) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  )
}
