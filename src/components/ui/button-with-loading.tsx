import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/ui/loading"
import { ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ButtonWithLoadingProps extends ButtonProps {
  loading?: boolean
  children: React.ReactNode
}

export function ButtonWithLoading({
  loading = false,
  children,
  className,
  ...props
}: ButtonWithLoadingProps) {
  return (
    <Button className={cn(className)} disabled={loading} {...props}>
      {loading && <LoadingButton />}
      {children}
    </Button>
  )
}