"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ButtonWithLoading } from '@/components/ui/button-with-loading';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { createPaciente } from '@/lib/api';
import { toastService } from '@/lib/toast-service';
import { ArrowLeft, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Paciente } from '@/types';
import { ImageUpload } from '@/components/ui/image-upload';
import { imageStorage } from '@/lib/image-storage';

export default function CreatePatientPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tempId] = useState(`temp_${Date.now()}`); // ID temporário para armazenar a imagem
  
  // Form fields
  const [formData, setFormData] = useState<Omit<Paciente, 'id'>>({
    nome: '',
    genero: '',
    raca: '',
    data_entrada_clinica: new Date().toISOString().split('T')[0],
    data_nascimento: '',
    imagem_url: '',
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle image change
  const handleImageChange = (imageData: string) => {
    // A imagem já está armazenada no localStorage pelo componente
    // Apenas atualizamos a referência no formData
    setFormData(prev => ({ ...prev, imagem_url: imageData }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Criar o paciente no servidor
      const novoPaciente = await createPaciente(formData);
      
      // Se a criação for bem-sucedida e tivermos um ID real,
      // renomeamos a imagem no localStorage para usar o ID real
      if (novoPaciente.id && formData.imagem_url) {
        const imagem = imageStorage.getImage(tempId);
        if (imagem !== imageStorage.defaultImage) {
          imageStorage.saveImage(String(novoPaciente.id), imagem);
          imageStorage.removeImage(tempId);
        }
      }
      
      setIsSuccess(true);
      toastService.success('Paciente cadastrado com sucesso!');
      
      // Redirect to patients list after successful creation
      setTimeout(() => {
        router.push('/patients');
      }, 1500);
    } catch (error) {
      setIsSubmitting(false);
      toastService.handleError(error, 'Erro ao cadastrar paciente');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/patients">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Cadastrar Novo Paciente</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Informações do Paciente</CardTitle>
          <CardDescription>
            Preencha os dados do novo paciente para cadastro no sistema
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Nome completo do paciente"
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
                  <Label htmlFor="genero">Gênero</Label>
                  <Select
                    value={formData.genero}
                    onValueChange={(value) => handleSelectChange('genero', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o gênero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="male">Masculino</SelectItem>
                        <SelectItem value="female">Feminino</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                        <SelectItem value="not_informed">Prefiro não informar</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="raca">Raça/Etnia</Label>
                  <Select
                    value={formData.raca}
                    onValueChange={(value) => handleSelectChange('raca', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a raça/etnia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="branca">Branca</SelectItem>
                        <SelectItem value="preta">Preta</SelectItem>
                        <SelectItem value="parda">Parda</SelectItem>
                        <SelectItem value="amarela">Amarela</SelectItem>
                        <SelectItem value="indigena">Indígena</SelectItem>
                        <SelectItem value="nao_informado">Não informado</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
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
              </div>
              
              <div>
                <Label>Foto do Paciente</Label>
                <div className="mt-2">
                  <ImageUpload
                    id={tempId}
                    value={formData.imagem_url}
                    onChange={handleImageChange}
                    onError={(error) => toastService.error(error.message)}
                    maxWidth={250}
                    maxHeight={250}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Faça upload de uma foto do paciente (opcional). A imagem é armazenada localmente.
                </p>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Link href="/patients">
              <Button variant="outline" type="button">Cancelar</Button>
            </Link>
            
            <ButtonWithLoading
              type="submit"
              isLoading={isSubmitting}
              isSuccess={isSuccess}
              loadingText="Cadastrando..."
              successText="Cadastrado com sucesso!"
              disabled={isSubmitting || isSuccess}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Cadastrar Paciente
            </ButtonWithLoading>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
