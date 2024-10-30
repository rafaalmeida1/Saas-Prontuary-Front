'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import MultiStepForm from '@/components/MultiStepForm'
import { createAcompanhamento } from '@/lib/api'

export default function AcompanhamentoForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    prontuario_id: '',
    data: '',
    peso_direito: '',
    altura_direita: '',
    imc_direito: '',
    porcentagem_gordura_direita: '',
    altura_joelho_direito: '',
    braco_direito: '',
    punho_direito: '',
    panturrilha_direita: '',
    circunferencia_abdomen_direito: '',
    circunferencia_pescoco_direito: '',
    peso_esquerdo: '',
    altura_esquerda: '',
    imc_esquerdo: '',
    porcentagem_gordura_esquerda: '',
    altura_joelho_esquerdo: '',
    braco_esquerdo: '',
    punho_esquerdo: '',
    panturrilha_esquerda: '',
    circunferencia_abdomen_esquerda: '',
    circunferencia_pescoco_esquerdo: '',
  })

  const handleSubmit = async (data: any) => {
    try {
      await createAcompanhamento(formData)
      toast({
        title: 'Sucesso',
        description: 'Acompanhamento criado com sucesso',
      })
      router.push(`/prontuarios/${formData.prontuario_id}`)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao criar acompanhamento',
        variant: 'destructive',
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const steps = [
    {
      title: 'Informações Básicas',
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prontuario_id">ID do Prontuário</Label>
            <Input
              id="prontuario_id"
              name="prontuario_id"
              value={formData.prontuario_id}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="data">Data</Label>
            <Input
              id="data"
              name="data"
              type="date"
              value={formData.data}
              onChange={handleChange}
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Medidas Lado Direito',
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="peso_direito">Peso (Direito)</Label>
            <Input
              id="peso_direito"
              name="peso_direito"
              type="number"
              value={formData.peso_direito}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="altura_direita">Altura (Direita)</Label>
            <Input
              id="altura_direita"
              name="altura_direita"
              type="number"
              value={formData.altura_direita}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imc_direito">IMC (Direito)</Label>
            <Input
              id="imc_direito"
              name="imc_direito"
              type="number"
              value={formData.imc_direito}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="porcentagem_gordura_direita">Porcentagem de Gordura (Direita)</Label>
            <Input
              id="porcentagem_gordura_direita"
              name="porcentagem_gordura_direita"
              type="number"
              value={formData.porcentagem_gordura_direita}
              onChange={handleChange}
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Medidas Lado Esquerdo',
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="peso_esquerdo">Peso (Esquerdo)</Label>
            <Input
              id="peso_esquerdo"
              name="peso_esquerdo"
              type="number"
              value={formData.peso_esquerdo}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="altura_esquerda">Altura (Esquerda)</Label>
            <Input
              id="altura_esquerda"
              name="altura_esquerda"
              type="number"
              value={formData.altura_esquerda}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imc_esquerdo">IMC (Esquerdo)</Label>
            <Input
              id="imc_esquerdo"
              name="imc_esquerdo"
              type="number"
              value={formData.imc_esquerdo}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="porcentagem_gordura_esquerda">Porcentagem de Gordura (Esquerda)</Label>
            <Input
              id="porcentagem_gordura_esquerda"
              name="porcentagem_gordura_esquerda"
              type="number"
              value={formData.porcentagem_gordura_esquerda}
              onChange={handleChange}
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Medidas Adicionais',
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="altura_joelho_direito">Altura do Joelho (Direito)</Label>
            <Input
              id="altura_joelho_direito"
              name="altura_joelho_direito"
              type="number"
              value={formData.altura_joelho_direito}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="braco_direito">Braço (Direito)</Label>
            <Input
              id="braco_direito"
              name="braco_direito"
              type="number"
              value={formData.braco_direito}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="punho_direito">Punho (Direito)</Label>
            <Input
              id="punho_direito"
              name="punho_direito"
              type="number"
              value={formData.punho_direito}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="panturrilha_direita">Panturrilha (Direita)</Label>
            <Input
              id="panturrilha_direita"
              name="panturrilha_direita"
              type="number"
              value={formData.panturrilha_direita}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="circunferencia_abdomen_direito">Circunferência do Abdômen (Direito)</Label>
            <Input
              id="circunferencia_abdomen_direito"
              name="circunferencia_abdomen_direito"
              type="number"
              value={formData.circunferencia_abdomen_direito}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="circunferencia_pescoco_direito">Circunferência do Pescoço (Direito)</Label>
            <Input
              id="circunferencia_pescoco_direito"
              name="circunferencia_pescoco_direito"
              type="number"
              value={formData.circunferencia_pescoco_direito}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="altura_joelho_esquerdo">Altura do Joelho (Esquerdo)</Label>
            <Input
              id="altura_joelho_esquerdo"
              name="altura_joelho_esquerdo"
              type="number"
              value={formData.altura_joelho_esquerdo}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="braco_esquerdo">Braço (Esquerdo)</Label>
            <Input
              id="braco_esquerdo"
              name="braco_esquerdo"
              type="number"
              value={formData.braco_esquerdo}
              onChange={handleChange}
            /> 
          </div>
          <div className="space-y-2">
            <Label htmlFor="punho_esquerdo">Punho (Esquerdo)</Label>
            <Input
              id="punho_esquerdo"
              name="punho_esquerdo"
              type="number"
              value={formData.punho_esquerdo}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="panturrilha_esquerda">Panturrilha (Esquerda)</Label>
            <Input
              id="panturrilha_esquerda"
              name="panturrilha_esquerda"
              type="number"
              value={formData.panturrilha_esquerda}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="circunferencia_abdomen_esquerda">Circunferência do Abdômen (Esquerdo)</Label>
            <Input
              id="circunferencia_abdomen_esquerda"
              name="circunferencia_abdomen_esquerda"
              type="number"
              value={formData.circunferencia_abdomen_esquerda}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="circunferencia_pescoco_esquerdo">Circunferência do Pescoço (Esquerdo)</Label>
            <Input
              id="circunferencia_pescoco_esquerdo"
              name="circunferencia_pescoco_esquerdo"
              type="number"
              value={formData.circunferencia_pescoco_esquerdo}
              onChange={handleChange}
            />
          </div>
        </div>
      ),
    }
  ]

  return <MultiStepForm steps={steps} onSubmit={handleSubmit} />
}