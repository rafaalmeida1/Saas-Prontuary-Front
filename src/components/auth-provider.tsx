'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getUserProfile } from '@/lib/api'
import { error as showError } from '@/lib/toast-service'
import { PageLoader } from '@/components/ui/loading'

// Definindo tipos para o contexto de autenticação
type User = {
  id: string
  username: string
  role: string
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string) => void
  logout: () => void
}

// Criando o contexto de autenticação
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
})

// Rotas públicas que não precisam de autenticação
const publicRoutes = ['/login', '/register']

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Efeito para verificar a autenticação ao iniciar ou mudar de rota
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')

      // Se não há token e a rota não é pública, redireciona para login
      if (!token) {
        setUser(null)
        setIsLoading(false)
        
        if (!publicRoutes.some(route => pathname.startsWith(route))) {
          router.push('/login')
        }
        return
      }

      // Se há token, busca dados do usuário
      try {
        const userData = await getUserProfile()
        setUser(userData)
        
        // Se estiver em uma rota pública mas já está autenticado, redireciona para o dashboard
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          router.push('/')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        localStorage.removeItem('token')
        setUser(null)
        
        if (!publicRoutes.some(route => pathname.startsWith(route))) {
          if (error instanceof Error) {
            showError('Sessão expirada. Por favor, faça login novamente.')
          }
          router.push('/login')
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  // Função para fazer login
  const login = (token: string) => {
    localStorage.setItem('token', token)
    setIsLoading(true)
    router.push('/')
  }

  // Função para fazer logout
  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/login')
  }

  // Renderiza um loader enquanto verifica a autenticação
  if (isLoading) {
    return <PageLoader text='Carregando...' />
  }

  // Se a rota não é pública e o usuário não está autenticado, bloqueia o acesso
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  const shouldBlockAccess = !isPublicRoute && !user

  if (shouldBlockAccess) {
    // Não renderiza nada enquanto redireciona
    return null
  }

  // Provê o contexto de autenticação para a aplicação
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext)
