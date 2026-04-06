// components/LayoutWrapper.tsx
"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"


export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideLayout = pathname === "/auth/login" || pathname === "/signup"


  return (
    <div
      className={
        hideLayout
          ? ""
          : "min-h-screen bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,oklch(0.72_0.12_85/0.18),transparent)] dark:bg-[radial-gradient(ellipse_100%_60%_at_80%_-10%,oklch(0.45_0.1_200/0.25),transparent)]"
      }
    >
      {!hideLayout && <Navbar />}

      <main
        className={
          hideLayout
            ? ""
            : "mx-auto max-w-[1400px] px-4 pb-16 pt-8 sm:px-6 lg:px-10"
        }
      >
        {children}
      </main>

      {!hideLayout && (
        <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
          Lumina — conference catalog · observability demo
        </footer>
      )}
    </div>
  )
}
