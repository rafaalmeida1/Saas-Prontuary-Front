import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import Link from 'next/link'
import { Users, Home } from 'lucide-react'
import './globals.css'
import { AuthProvider } from '@/components/auth-provider'
import { SidebarNav } from '@/components/sidebar-nav'

const inter = Inter({ subsets: ['latin'] })

const menuItems = [
  { href: '/', label: 'Início' },
  { href: '/patients', label: 'Pacientes' }
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <header className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold">
                PMS
              </Link>
              <SidebarNav menuItems={menuItems} />
            </header>
            <div className="flex flex-1">
              <aside className="hidden md:flex flex-col w-64 bg-gray-100 p-4">
                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </aside>
              <main className="flex-grow p-6">{children}</main>
            </div>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
