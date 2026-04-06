'use client'
import { createClient } from '@/lib/client'
import axios, { AxiosRequestConfig } from "axios";

const supabase = createClient()
const baseURL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500'}`

// This helper automatically injects the latest access token
export async function fetchWithAuth(url: string, options: AxiosRequestConfig = {}) {
  // Get session at the time of request, inside async fn
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) throw new Error('User not logged in')

  const token = session.access_token

  return axios({
    url: `${baseURL}${url}`,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    ...options,
  })
}
