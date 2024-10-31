import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <Loader2 className={cn("h-4 w-4 animate-spin", className)} />
  )
}

export function LoadingPage() {
  return (
    <div className="flex h-[50vh] w-full items-center justify-center">
      <LoadingSpinner className="h-8 w-8" />
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="flex h-32 w-full items-center justify-center rounded-lg border">
      <LoadingSpinner />
    </div>
  )
}

export function LoadingButton() {
  return <LoadingSpinner className="mr-2" />
}