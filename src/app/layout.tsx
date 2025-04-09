"use client"

import type { Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import Link from 'next/link'
import { Home, Users, ClipboardList, BookOpen, LayoutDashboard, Menu, X, Settings } from 'lucide-react'
import './globals.css'
import { AuthProvider, useAuth } from '@/components/auth-provider'
import { SidebarNav } from '@/components/sidebar-nav'
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

// Modern sans-serif font
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: false,
};

const menuItems = [
  { href: '/', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: '/patients', label: 'Pacientes', icon: <Users className="h-5 w-5" /> },
  { href: '/prontuarios', label: 'Prontuários', icon: <ClipboardList className="h-5 w-5" /> },
  { href: '/acompanhamentos', label: 'Acompanhamentos', icon: <BookOpen className="h-5 w-5" /> },
  { href: '/profile', label: 'Minha Conta', icon: <Settings className="h-5 w-5" /> },
]

// Rotas de autenticação que não devem mostrar o layout principal
const authRoutes = ['/login', '/register'];

function AppLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();
  const pathname = usePathname();
  
  // Verificar se está em uma rota de autenticação
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Renderizar apenas o conteúdo sem o layout principal em rotas de autenticação
  if (isAuthRoute) {
    return children;
  }
  
  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="fixed z-20 hidden h-screen w-72 flex-col border-r border-border bg-card md:flex">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image 
              src="/esperanca_e_vida_transparente.png" 
              alt="logo esperança e vida" 
              width={150} 
              height={40}
              className="h-8 w-auto"
            />
          </Link>
        </div>
        <nav className="flex-1 overflow-auto p-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground",
                  pathname === item.href && "bg-secondary text-foreground"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
        <div className="border-t border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 rounded-md p-2 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users className="h-4 w-4" />
              </div>
              <div className="flex-1 text-sm">
                <p className="font-medium">{user?.username || 'Usuário'}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role || 'Nutrição'}</p>
              </div>
            </div>
            <div className="flex items-center">
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-foreground">
                Sair
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-card px-4 md:hidden">
        <MobileNav />
        <div className="flex-1 flex justify-center">
          <Image 
            src="/esperanca_e_vida_transparente.png" 
            alt="logo esperança e vida" 
            width={120} 
            height={30} 
            className="h-8 w-auto"
          />
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto md:pl-72">
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

// Mobile Navigation Component
function MobileNav() {
  const [open, setOpen] = useState(false);
  const { logout, user } = useAuth();
  const pathname = usePathname();
  
  return (
    <>
      <Button
        variant="ghost" 
        size="icon"
        onClick={() => setOpen(true)}
        className="md:hidden"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open menu</span>
      </Button>
      
      {open && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
          <div className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-card shadow-lg">
            <div className="flex h-16 items-center border-b border-border px-6">
              <Button
                variant="ghost" 
                size="icon"
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
              
              <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2 font-semibold">
                <Image 
                  src="/esperanca_e_vida_transparente.png" 
                  alt="logo esperança e vida" 
                  width={120} 
                  height={30}
                  className="h-7 w-auto" 
                />
              </Link>
            </div>
            
            <nav className="flex-1 overflow-auto p-4">
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground",
                      pathname === item.href && "bg-secondary text-foreground"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
            
            <div className="border-t border-border p-4">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-3 rounded-md p-2 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium">{user?.username || 'Usuário'}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role || 'Nutrição'}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={logout} className="w-full">
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.variable,
        jakarta.variable
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <AuthProvider>
              <AppLayout>
                {children}
              </AppLayout>
              <Toaster />
            </AuthProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
