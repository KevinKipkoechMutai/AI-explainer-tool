"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

function ToastListenerContent() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const error = searchParams.get("error")
    if (error === "unauthorized") {
      toast.error("You must be logged in to view this page.")
      // Remove the error param from URL to prevent showing toast again on refresh
      const url = new URL(window.location.href)
      url.searchParams.delete("error")
      window.history.replaceState({}, "", url.toString())
    }
  }, [searchParams])

  return null
}

export function ToastListener() {
  return (
    <Suspense fallback={null}>
      <ToastListenerContent />
    </Suspense>
  )
}
