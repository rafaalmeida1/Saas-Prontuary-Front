'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { LoginDialog } from './login-dialog'

// Definição do tipo AuthContext
type AuthContextType = {
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const pathname = usePathname()

  // Verifica o token ao carregar o componente
  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  // Exibe o modal de login caso esteja em uma página privada sem autenticação
  useEffect(() => {
    const isPublicPage = pathname === '/login' || pathname === '/register'
    if (!isAuthenticated && !isPublicPage) {
      setShowLoginDialog(true)
    } else {
      setShowLoginDialog(false)
    }
  }, [isAuthenticated, pathname])

  // Função para login
  const login = (token: string) => {
    localStorage.setItem('token', token)
    setIsAuthenticated(true)
    setShowLoginDialog(false)
  }

  // Função para logout
  const logout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    window.location.href = '/login'
  }

  // Função fetch com autenticação
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token')
    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }

    const response = await fetch(url, { ...options, headers })

    if (response.status === 401 || response.status === 403) {
      // Se o token estiver expirado ou inválido, faça logout
      logout()
      setShowLoginDialog(true)
    }
    return response
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, fetchWithAuth }}>
      {children}
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </AuthContext.Provider>
  )
}

// Hook de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
