'use client'

import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu, Users, Home } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const menuItems = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/patients', label: 'Pacientes', icon: Users }
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleCloseAndRouteLogin = () => {
    setShowLoginDialog(false)
    router.push('/login')
  }

  useEffect(() => {
    const isPublicPage = pathname === '/login' || pathname === '/register'
    const token = localStorage.getItem('token') // Verifica o token no localStorage

    if (!token && !isPublicPage) {
      setShowLoginDialog(true)
    }
  }, [pathname])

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              PMS
            </Link>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <nav className="flex flex-col gap-4">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 p-2 rounded-lg hover:bg-secondary ${
                        pathname === item.href ? 'bg-secondary' : ''
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </header>
          <div className="flex flex-1">
            <aside className="hidden md:flex flex-col w-64 bg-gray-100 p-4">
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 p-2 rounded-lg hover:bg-secondary ${
                      pathname === item.href ? 'bg-secondary' : ''
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </aside>
            <main className="flex-grow p-6">{children}</main>
          </div>
        </div>
        <Toaster />

        {/* Dialog de Login */}
        <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Login Necessário</DialogTitle>
              <DialogDescription>
                Você precisa estar logado para acessar esta página.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => handleCloseAndRouteLogin}>
                Ir para Login
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </body>
    </html>
  )
}
