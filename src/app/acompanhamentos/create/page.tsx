import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { CreateAcompanhamentoForm } from './create-acompanhamento-form'

export default function CreateAcompanhamentoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild className="mb-6">
        <a href="javascript:history.back()">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </a>
      </Button>
      <h1 className="text-3xl font-bold mb-6">Create New Follow-up</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <CreateAcompanhamentoForm />
      </Suspense>
    </div>
  )
}