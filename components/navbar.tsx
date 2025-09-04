"use client"

import Link from "next/link"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Brain, BarChart3, Menu, LogOut, User2, GitCompareArrows } from "lucide-react"

export function Navbar() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  const NavLinks = () => (
    <nav className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
      <Button variant="ghost" size="sm" asChild className="justify-start" onClick={() => setOpen(false)}>
        <Link href="/">Practice</Link>
      </Button>
      <Button variant="ghost" size="sm" asChild className="justify-start" onClick={() => setOpen(false)}>
        <Link href="/dashboard" className="flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Dashboard</Link>
      </Button>
      <Button variant="ghost" size="sm" asChild className="justify-start" onClick={() => setOpen(false)}>
        <Link href="/dashboard/compare" className="flex items-center gap-2"><GitCompareArrows className="w-4 h-4" /> Compare</Link>
      </Button>
    </nav>
  )

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button aria-label="Open menu" className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="p-4 flex items-center gap-2 border-b">
                  <Brain className="w-6 h-6 text-primary" />
                  <span className="font-bold">Competition Practice</span>
                </div>
                <div className="p-4 space-y-2">
                  <NavLinks />
                </div>
                <Separator />
                <div className="p-4 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <User2 className="w-4 h-4" /> {session?.user?.name || session?.user?.email}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => signOut()}>
                    <LogOut className="w-4 h-4 mr-2" /> Sign out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <Link href="/" className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            <span className="font-bold hidden sm:inline">Competition Practice</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <NavLinks />
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex text-sm text-muted-foreground items-center gap-2 max-w-[200px] truncate">
            <User2 className="w-4 h-4" /> {session?.user?.name || session?.user?.email}
          </div>
          {session && (
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              <LogOut className="w-4 h-4 mr-2" /> Sign out
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}


