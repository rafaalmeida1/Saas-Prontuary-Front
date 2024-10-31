'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ButtonWithLoading } from '@/components/ui/button-with-loading'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { getProntuario, updateProntuario } from '@/lib/api'
import { Prontuario } from '@/types'
import { LoadingPage } from '@/components/ui/loading'

export default function EditProntuarioPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState<Prontuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchProntuario = async () => {
      try {
        const prontuarioData = await getProntuario(params.id)
        setFormData(prontuarioData)
      } catch (error) {
        console.error('Error fetching medical record:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProntuario()
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => {
      if (!prev) return prev
      return {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return
    setSubmitting(true)
    try {
      await updateProntuario(params.id, formData)
      router.push(`/prontuarios/${params.id}`)
    } catch (error) {
      console.error('Error updating medical record:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingPage />
  }

  if (!formData) {
    return <div>Prontuário não encontrado</div>
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Editar Prontuário</h1>
      <Card>
        <CardHeader>
          <CardTitle>Informações do Prontuário</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.entries(formData).map(([key, value]) => {
              if (key === 'id' || key === 'paciente_id') return null
              if (typeof value === 'boolean') {
                return (
                  <div key={key}>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={key}
                        name={key}
                        checked={value}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev!, [key]: checked }))}
                      />
                      <Label htmlFor={key}>{key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}</Label>
                    </div>
                  </div>
                )
              }
              if (typeof value === 'string' && value.length > 100) {
                return (
                  <div key={key}>
                    <Label htmlFor={key}>{key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}</Label>
                    <Textarea id={key} name={key} value={value} onChange={handleChange} />
                  </div>
                )
              }
              return (
                <div key={key}>
                  <Label htmlFor={key}>{key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}</Label>
                  <Input id={key} name={key} value={value} onChange={handleChange} />
                </div>
              )
            })}
            <ButtonWithLoading type="submit" loading={submitting}>Salvar</ButtonWithLoading>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}