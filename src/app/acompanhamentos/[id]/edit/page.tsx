'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getAcompanhamento, updateAcompanhamento } from '@/lib/api'
import { Acompanhamento } from '@/types'

export default function EditAcompanhamentoPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState<Acompanhamento | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchAcompanhamento = async () => {
      try {
        const acompanhamentoData = await getAcompanhamento(params.id)
        setFormData(acompanhamentoData)
      } catch (error) {
        console.error('Error fetching follow-up:', error)
      }
    }
    fetchAcompanhamento()
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => {
      if (!prev) return prev
      return { ...prev, [name]: value }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return
    try {
      await updateAcompanhamento(params.id, formData)
      router.push(`/acompanhamentos/${params.id}`)
    } catch (error) {
      console.error('Error updating follow-up:', error)
    }
  }

  if (!formData) {
    return <div>Carregando...</div>
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Editar Acompanhamento</h1>
      <Card>
        <CardHeader>
          <CardTitle>Informações do Acompanhamento</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.entries(formData).map(([key, value]) => {
              if (key === 'id' || key === 'prontuario_id') return null
              return (
                <div key={key}>
                  <Label htmlFor={key}>{key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}</Label>
                  <Input
                    id={key}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    type={key === 'data' ? 'date' : 'number'}
                    step={key.includes('peso') || key.includes('altura') || key.includes('imc') || key.includes('porcentagem') ? '0.01' : '1'}
                  />
                </div>
              )
            })}
            <Button type="submit">Salvar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}