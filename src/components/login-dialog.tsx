import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

type LoginDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const router = useRouter()

  const handleCloseAndRouteLogin = () => {
    onOpenChange(false)
    router.push('/login')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Login Necessário</DialogTitle>
          <DialogDescription>
            Você precisa estar logado para acessar esta página.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleCloseAndRouteLogin}>
            Ir para Login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}