'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/components/ui/use-toast'
import { createPaciente } from '@/lib/api'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload } from 'lucide-react'
import { Paciente } from '@/types'

export default function PatientForm() {
  const [formData, setFormData] = useState({
    nome: '',
    genero: '',
    raca: '',
    data_entrada_clinica: '',
    data_nascimento: '',
    imagem: null as File | null,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, value)
        }
      })

      const pacienteData: Paciente = {
        nome: formData.nome,
        genero: formData.genero,
        raca: formData.raca,
        data_entrada_clinica: formData.data_entrada_clinica,
        data_nascimento: formData.data_nascimento,
        imagem_url: formData.imagem ? formData.imagem : '',  
      }
      await createPaciente(pacienteData)
      toast({
        title: 'Sucesso',
        description: 'Paciente criado com sucesso',
      })
      router.push('/patients')
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao criar paciente',
        variant: 'destructive',
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    if (type === 'file') {
      const file = e.target.files?.[0] || null
      setFormData((prev) => ({ ...prev, [name]: file }))
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        setImagePreview(null)
      }
    } else {
      
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Criar Novo Paciente</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Gênero</Label>
            <RadioGroup
              name="genero"
              value={formData.genero}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, genero: value }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="masculino" id="masculino" />
                <Label htmlFor="masculino">Masculino</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="feminino" id="feminino" />
                <Label htmlFor="feminino">Feminino</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="outro" id="outro" />
                <Label htmlFor="outro">Outro</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="raca">Raça</Label>
            <Input
              id="raca"
              name="raca"
              value={formData.raca}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="data_entrada_clinica">Data de Entrada na Clínica</Label>
            <Input
              id="data_entrada_clinica"
              name="data_entrada_clinica"
              type="date"
              value={formData.data_entrada_clinica}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="data_nascimento">Data de Nascimento</Label>
            <Input
              id="data_nascimento"
              name="data_nascimento"
              type="date"
              value={formData.data_nascimento}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imagem">Imagem do Paciente</Label>
            <div className="flex items-center space-x-4">
              <Input
                id="imagem"
                name="imagem"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('imagem')?.click()}
              >
                <Upload className="mr-2 h-4 w-4" /> Escolher Imagem
              </Button>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-md" />
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Criar Paciente</Button>
        </CardFooter>
      </form>
    </Card>
  )
}