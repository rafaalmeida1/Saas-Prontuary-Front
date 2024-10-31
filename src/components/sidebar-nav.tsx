'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

type MenuItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

type SidebarNavProps = {
  menuItems: MenuItem[]
}

export function SidebarNav({ menuItems }: SidebarNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
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
    </>
  )
}