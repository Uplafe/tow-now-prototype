'use client'
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAppStore } from '@/store/appStore'

export function useAuth() {
  const { user, setUser } = useAppStore()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u))
    return unsub
  }, [setUser])

  return { user }
}
