import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/ui/loading"
import { ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ButtonWithLoadingProps extends ButtonProps {
  loading?: boolean
  children: React.ReactNode
  type?: "button" | "submit" | "reset"
}

export function ButtonWithLoading({
  loading = false,
  children,
  type = "button",
  className,
  ...props
}: ButtonWithLoadingProps) {
  return (
    <Button type={type} className={cn(className)} disabled={loading} {...props}>
      {loading && <LoadingButton />}
      {children}
    </Button>
  )
}