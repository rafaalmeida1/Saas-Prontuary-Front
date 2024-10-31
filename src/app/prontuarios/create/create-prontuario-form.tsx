'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import { createProntuario } from '@/lib/api'
import type { Prontuario } from '@/types'

export function CreateProntuarioForm() {
  const [formData, setFormData] = useState<Partial<Prontuario>>({
    paciente_id: '',
    historico_saude: '',
    historico_nutricional: '',
    observacoes: '',
    nivel_assistencia_nutricao: '',
    condicao_fisica: '',
    presenca_edema: false,
    localizacao_edema: '',
    avaliacao_subjetiva: '',
    apresenta_lipodistrofia: false,
    localizacao_lipodistrofia: '',
    frequencia_defecacao: '',
    caracteristicas_fezes: '',
    frequencia_miccao: '',
    caracteristicas_urina: '',
    qualidade_sono: '',
    hora_dormir: '',
    hora_acordar: '',
    sinais_e_sintomas: '',
    historico_atual_patologias: '',
    medicacoes_atuais: '',
    dificuldade_engolir: '',
    classificacao_apetite: '',
    ingestao_alimentar: '',
    tipo_dieta_atual: '',
    alimentos_preferidos: '',
    alimentos_menos_preferidos: '',
    alergias: false,
    alergia_detalhes: '',
    queixas_reclamacoes: '',
    periodo_avaliacao: '',
    mes: '',
    evolucao_dietoterapica: '',
    alteracoes_patologicas_farmacologicas: '',
    tipo_prescricao: '',
    prescricao_detalhada: '',
  })
  
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const paciente_id = searchParams.get('paciente_id')
    if (paciente_id) {
      setFormData(prev => ({ ...prev, paciente_id }))
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createProntuario(formData as Prontuario)
      router.push(`/patients/${formData.paciente_id}`)
    } catch (error) {
      console.error('Error creating medical record:', error)
    }
  }

  const renderField = (key: string, value: string | number | boolean) => {
    if (typeof value === 'boolean') {
      return (
        <div key={key} className="flex items-center space-x-2">
          <Switch
            id={key}
            name={key}
            checked={value}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, [key]: checked }))}
          />
          <Label htmlFor={key}>{key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}</Label>
        </div>
      )
    }
    if (typeof value === 'string' && value.length > 100) {
      return (
        <div key={key}>
          <Label htmlFor={key}>{key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}</Label>
          <Textarea id={key} name={key} value={value} onChange={handleChange} className="mt-1" />
        </div>
      )
    }
    return (
      <div key={key}>
        <Label htmlFor={key}>{key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}</Label>
        <Input id={key} name={key} value={value} onChange={handleChange} className="mt-1" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Prontuário</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="hidden" name="paciente_id" value={formData.paciente_id} />
          {Object.entries(formData).map(([key, value]) => {
            if (key === 'paciente_id') return null
            return renderField(key, value)
          })}
          <Button type="submit" className="w-full">
            <Save className="mr-2 h-4 w-4" /> Criar Prontuário
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}