"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ButtonWithLoading } from "@/components/ui/button-with-loading"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { login } from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"
import { User } from "lucide-react"

export default function LoginPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState(["", "", "", "", "", ""])
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = await login(username, password.join(""))
      localStorage.setItem("token", token)
      router.push("/")
    } catch (error) {
      console.log(error)
      toast({
        title: "Erro",
        description: "Credenciais inválidas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = (index: number, value: string) => {
    const newPassword = [...password]
    newPassword[index] = value
    setPassword(newPassword)

    if (value && index < 5) {
      document.getElementById(`password-${index + 1}`)?.focus()
    }
  }

  return (
    <div className="transform translate-y-1/2 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="username"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="username">Usuário</Label>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <Input
                        id="username"
                        placeholder="Digite seu usuário"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div
                  key="password"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="password-0">Senha</Label>
                    <div className="space-y-2">
                      <Input
                        type="password"
                        onChange={(e) => handlePasswordChange(0, e.target.value)}
                        value={password[0]}
                        id="password-0"
                        className="w-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          <CardFooter>
            {step === 1 ? (
              <ButtonWithLoading
                type="button"
                className="w-full"
                onClick={() => setStep(2)}
              >
                Próximo
              </ButtonWithLoading>
            ) : (
              <ButtonWithLoading
                type="submit"
                className="w-full"
                loading={loading}
              >
                Entrar
              </ButtonWithLoading>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}