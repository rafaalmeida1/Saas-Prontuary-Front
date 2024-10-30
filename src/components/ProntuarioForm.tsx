'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import MultiStepForm from '@/components/MultiStepForm'
import { createProntuario } from '@/lib/api'

export default function ProntuarioForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
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

  const handleSubmit = async (data: any) => {
    try {
      await createProntuario(formData)
      toast({
        title: 'Sucesso',
        description: 'Prontuário criado com sucesso',
      })
      router.push('/pacientes/')
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao criar prontuário',
        variant: 'destructive',
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const steps = [
    {
      title: 'Informações Básicas',
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paciente_id">ID do Paciente</Label>
            <Input
              id="paciente_id"
              name="paciente_id"
              value={formData.paciente_id}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="historico_saude">Histórico de Saúde</Label>
            <Textarea
              id="historico_saude"
              name="historico_saude"
              value={formData.historico_saude}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="historico_nutricional">Histórico Nutricional</Label>
            <Textarea
              id="historico_nutricional"
              name="historico_nutricional"
              value={formData.historico_nutricional}
              onChange={handleChange}
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Avaliação Física',
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nivel_assistencia_nutricao">Nível de Assistência Nutricional</Label>
            <Input
              id="nivel_assistencia_nutricao"
              name="nivel_assistencia_nutricao"
              value={formData.nivel_assistencia_nutricao}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="condicao_fisica">Condição Física</Label>
            <Input
              id="condicao_fisica"
              name="condicao_fisica"
              value={formData.condicao_fisica}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="presenca_edema"
              name="presenca_edema"
              checked={formData.presenca_edema}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, presenca_edema: checked }))}
            />
            <Label htmlFor="presenca_edema">Presença de Edema</Label>
          </div>
          {formData.presenca_edema && (
            <div className="space-y-2">
              <Label htmlFor="localizacao_edema">Localização do Edema</Label>
              <Input
                id="localizacao_edema"
                name="localizacao_edema"
                value={formData.localizacao_edema}
                onChange={handleChange}
              />
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Hábitos e Sintomas',
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="frequencia_defecacao">Frequência de Defecação</Label>
            <Input
              id="frequencia_defecacao"
              name="frequencia_defecacao"
              value={formData.frequencia_defecacao}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="frequencia_miccao">Frequência de Micção</Label>
            <Input
              id="frequencia_miccao"
              name="frequencia_miccao"
              value={formData.frequencia_miccao}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="qualidade_sono">Qualidade do Sono</Label>
            <Input
              id="qualidade_sono"
              name="qualidade_sono"
              value={formData.qualidade_sono}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sinais_e_sintomas">Sinais e Sintomas</Label>
            <Textarea
              id="sinais_e_sintomas"
              name="sinais_e_sintomas"
              value={formData.sinais_e_sintomas}
              onChange={handleChange}
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Alimentação e Alergias',
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="classificacao_apetite">Classificação do Apetite</Label>
            <RadioGroup
              name="classificacao_apetite"
              value={formData.classificacao_apetite}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, classificacao_apetite: value }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bom" id="apetite-bom" />
                <Label htmlFor="apetite-bom">Bom</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="regular" id="apetite-regular" />
                <Label htmlFor="apetite-regular">Regular</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ruim" id="apetite-ruim" />
                <Label htmlFor="apetite-ruim">Ruim</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipo_dieta_atual">Tipo de Dieta Atual</Label>
            <Input
              id="tipo_dieta_atual"
              name="tipo_dieta_atual"
              value={formData.tipo_dieta_atual}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="alergias"
              name="alergias"
              checked={formData.alergias}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, alergias: checked }))}
            />
            <Label htmlFor="alergias">Possui Alergias</Label>
          </div>
          {formData.alergias && (
            <div className="space-y-2">
              <Label htmlFor="alergia_detalhes">Detalhes das Alergias</Label>
              <Textarea
                id="alergia_detalhes"
                name="alergia_detalhes"
                value={formData.alergia_detalhes}
                onChange={handleChange}
              />
            </div>
          )}
        </div>
      ),
    },
  ]

  return <MultiStepForm steps={steps} onSubmit={handleSubmit} />
}