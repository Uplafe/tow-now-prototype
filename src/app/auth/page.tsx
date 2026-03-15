'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { motion } from 'framer-motion'
import { auth, db } from '@/lib/firebase'
import { useAppStore } from '@/store/appStore'
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AuthPage() {
  const router = useRouter()
  const { isDriver } = useAppStore()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const dest = isDriver ? '/driver' : '/customer'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'signup') {
        const { user } = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(user, { displayName: name })
        await setDoc(doc(db, isDriver ? 'drivers' : 'users', user.uid), {
          name,
          email,
          role: isDriver ? 'driver' : 'customer',
          createdAt: Date.now(),
          rating: 5.0,
          tripsCompleted: 0,
        })
        toast.success(`Welcome, ${name}! 🎉`)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
        toast.success('Signed in!')
      }
      router.push(dest)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed'
      toast.error(msg.replace('Firebase: ', '').replace(/ \(auth.*\)/, ''))
    } finally {
      setLoading(false)
    }
  }

  // Demo quick-login (bypass Firebase for local testing)
  const demoLogin = () => {
    toast.success('Demo mode – skipping auth')
    router.push(dest)
  }

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col px-6 safe-top safe-bottom">
      <button
        onClick={() => router.back()}
        className="mt-6 text-blue-200 flex items-center gap-1 text-sm w-fit"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <motion.div
        className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8">
          <div className="text-3xl mb-3">{isDriver ? '🚛' : '🚗'}</div>
          <h2 className="text-2xl font-bold text-white">
            {mode === 'signup' ? 'Create account' : 'Welcome back'}
          </h2>
          <p className="text-blue-200 mt-1 text-sm">
            {isDriver ? 'Driver portal' : 'Customer portal'}
          </p>
        </div>

        {/* Tab toggle */}
        <div className="flex bg-navy-800 rounded-xl p-1 mb-6">
          {(['login', 'signup'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                mode === m
                  ? 'bg-electric-600 text-white shadow'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              {m === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-blue-200 text-sm mb-1 block">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
                className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-electric-500 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="text-blue-200 text-sm mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-electric-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-blue-200 text-sm mb-1 block">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-electric-500 transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300"
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-electric-600 hover:bg-electric-500 disabled:opacity-60 text-white font-semibold rounded-xl py-3.5 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {mode === 'signup' ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-white/10" />
          <span className="mx-3 text-white/30 text-xs">OR</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <button
          onClick={demoLogin}
          className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl py-3 transition-all duration-200 active:scale-95 text-sm"
        >
          Continue in Demo Mode (no Firebase needed)
        </button>
      </motion.div>
    </div>
  )
}
