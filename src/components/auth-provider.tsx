'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { LoginDialog } from './login-dialog'

type AuthContextType = {
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  useEffect(() => {
    const isPublicPage = pathname === '/login' || pathname === '/register'
    if (!isAuthenticated && !isPublicPage) {
      setShowLoginDialog(true)
    }
  }, [isAuthenticated, pathname])

  const login = (token: string) => {
    localStorage.setItem('token', token)
    setIsAuthenticated(true)
    setShowLoginDialog(false)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}