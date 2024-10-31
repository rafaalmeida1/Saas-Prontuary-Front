'use client'

import { Suspense } from 'react'
import { ButtonWithLoading } from '@/components/ui/button-with-loading'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { CreateProntuarioForm } from './create-prontuario-form'
import { LoadingPage } from '@/components/ui/loading'

export default function CreateProntuarioPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-8">
      <ButtonWithLoading onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </ButtonWithLoading>
      <h1 className="text-3xl font-bold mb-6">Criar Prontuário</h1>
      <Suspense fallback={<LoadingPage />}>
        <CreateProntuarioForm />
      </Suspense>
    </div>
  )
}