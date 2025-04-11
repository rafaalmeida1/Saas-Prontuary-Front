"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ButtonWithLoading } from "@/components/ui/button-with-loading"
import { login } from "@/lib/api"
import { useAuth } from "@/components/auth-provider"
import Image from "next/image"
import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"
import { success } from "@/lib/toast-service"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login: authLogin } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!username || !password) {
      setError("Por favor, preencha todos os campos")
      return
    }

    try {
      setIsLoading(true)
      const token = await login(username, password)
      authLogin(token)
      success("Login realizado com sucesso!")
    } catch (error) {
      console.error("Login error:", error)
      setError("Credenciais inválidas. Por favor, tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4 sm:p-8">
      <div className="absolute top-8 left-8">
        <Image 
          src="/esperanca_e_vida_transparente.png" 
          alt="Logo Esperança e Vida" 
          width={150} 
          height={40}
          className="h-10 w-auto" 
        />
      </div>
      
      <div className="absolute top-8 right-8">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Bem-vindo(a) de volta</h1>
          <p className="text-muted-foreground">
            Acesse sua conta para continuar
          </p>
        </div>
        
        <Card className="border-border/40 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Login</CardTitle>
            <CardDescription>
              Entre com seu usuário e senha para acessar o sistema
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username">Nome de usuário</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col">
              <ButtonWithLoading
                type="submit"
                isLoading={isLoading}
                loadingText="Entrando..."
                className="w-full mb-4"
              >
                Entrar
              </ButtonWithLoading>
              
              <p className="text-sm text-center text-muted-foreground mt-4">
                <span className="mr-1">Não tem uma conta?</span>
                <Link href="/register" className="text-primary hover:underline">
                  Cadastre-se
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
        
        <p className="text-center text-sm text-muted-foreground mt-6">
          Sistema de gerenciamento nutricional Esperança e Vida
        </p>
      </div>
    </div>
  )
}