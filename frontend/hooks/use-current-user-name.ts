import { createClient } from '@/lib/client'
import { useEffect, useState } from 'react'
import { getAllSessions, fetchSessionById } from '../utils/apis/eventsAPI'

export const useCurrentUserName = () => {
  const [name, setName] = useState<string | null>(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProfileName = async () => {
      try {
        const { data, error } = await createClient().auth.getSession()
        if (error) {
          throw error
        }
        setName(data.session?.user.user_metadata.full_name ?? '?')
      } catch (error) {
        setError(error)
      }
    }

    fetchProfileName()
  }, [])

  return { name: name || '?', error }
}