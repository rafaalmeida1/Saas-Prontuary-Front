'use client'

import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'

import { Button } from './ui/button';

type DeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void 
  deleteFunc: (id: number | string) => Promise<void>
  id: number | string
}

export function DeleteDialog({ open, onOpenChange, deleteFunc, id }: DeleteDialogProps) {
  const router = useRouter()

  const handleDelete = async () => {

    await deleteFunc(id).then(() => {
      onOpenChange(false)
      router.refresh()
    }).catch((error) => {
      console.error('Error deleting:', error)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="destructive">Deletar</Button> 
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Você tem certeza ?</DialogTitle>
          <DialogDescription>
            Essa ação é irreversível.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex items-center gap-2'> 
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Não
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Sim
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}