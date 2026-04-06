// components/LayoutWrapper.tsx
"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"


export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideLayout = pathname === "/auth/login" || pathname === "/signup"


  return (
    <>
      {!hideLayout && <Navbar />}

      <main className={hideLayout ? "" : "px-20 py-10"}>
        {children}
      </main>

      {!hideLayout && (
        <footer className="flex py-4 px-20 justify-center items-center opacity-80">
          Lumina — conference passes, live analytics, and observability stack demo
        </footer>
      )}
    </>
  )
}
