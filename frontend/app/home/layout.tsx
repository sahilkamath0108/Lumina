// app/home/layout.tsx (server component, no "use client")
import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const {
    data: { session },
  } = await (await supabase).auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  return <>{children}</>
}
