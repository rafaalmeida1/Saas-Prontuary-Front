'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ButtonWithLoading } from '@/components/ui/button-with-loading'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { register } from '@/lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Lock } from 'lucide-react'

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const router = useRouter()
  const { toast } = useToast()

  const handleRegister = async () => {
    if(step != 2) return
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem',
        variant: 'destructive',
      })
      return
    }
    setLoading(true)
    try {
      if(step != 2) return
      await register(formData.username, formData.email, formData.password)
      toast({
        title: 'Sucesso',
        description: 'Conta criada com sucesso',
      })
      router.push('/login')
    } catch (error) {
      console.log(error)
      toast({
        title: 'Erro',
        description: 'Falha ao criar conta',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para criar sua conta
          </CardDescription>
        </CardHeader>
        <div>
          <CardContent className="space-y-4">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="username">Usuário</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        id="username"
                        name="username"
                        placeholder="Escolha um nome de usuário"
                        value={formData.username}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Seu endereço de e-mail"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Crie uma senha forte"
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirme a Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Digite a senha novamente"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          <CardFooter>
            {step === 1 ? (
              <ButtonWithLoading type="button" className="w-full" onClick={() => setStep(2)}>
                Próximo
              </ButtonWithLoading>
            ) : (
              <ButtonWithLoading onSubmit={handleRegister} className="w-full" loading={loading}>
                Criar Conta
              </ButtonWithLoading>
            )}
          </CardFooter>
        </div>
      </Card>
    </div>
  )
}