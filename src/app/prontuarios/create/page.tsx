'use client'

import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { CreateProntuarioForm } from './create-prontuario-form'

export default function CreateProntuarioPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <h1 className="text-3xl font-bold mb-6">Create New Medical Record</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <CreateProntuarioForm />
      </Suspense>
    </div>
  )
}