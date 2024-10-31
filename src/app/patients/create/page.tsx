'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { createPaciente } from '@/lib/api'
import { Paciente } from '@/types'

export default function CreatePatientPage() {
  const [formData, setFormData] = useState<Paciente>({
    nome: '',
    genero: '',
    raca: '',
    data_entrada_clinica: '',
    data_nascimento: '',
    imagem_url: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let imageUrl = ''
      if (imageFile) {
        const reader = new FileReader()
        reader.readAsDataURL(imageFile)
        imageUrl = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string)
        })
      }
      const patientData: Paciente = {
        ...formData,
        imagem_url: imageUrl,
      }
      await createPaciente(patientData)
      router.push('/patients')
    } catch (error) {
      console.error('Error creating patient:', error)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Criar Paciente</h1>
      <Card>
        <CardHeader>
          <CardTitle>Informações do Paciente</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
            </div>
            <div>
              <Label>Gênero</Label>
              <RadioGroup name="genero" value={formData.genero} onValueChange={(value) => setFormData(prev => ({ ...prev, genero: value }))}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Masculino</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Feminino</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Outro</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="raca">Raça</Label>
              <Input id="raca" name="raca" value={formData.raca} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="data_entrada_clinica">Data de Entrada na Clínica</Label>
              <Input id="data_entrada_clinica" name="data_entrada_clinica" type="date" value={formData.data_entrada_clinica} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="data_nascimento">Data de Nascimento</Label>
              <Input id="data_nascimento" name="data_nascimento" type="date" value={formData.data_nascimento} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="imagem">Imagem</Label>
              <Input id="imagem" name="imagem" type="file" accept="image/*" onChange={handleImageChange} />
            </div>
            <Button type="submit">Criar Paciente</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}