'use client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import { usePWAInstall } from '@/hooks/usePWAInstall'
import { Download } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const { setIsDriver } = useAppStore()
  const { canInstall, install } = usePWAInstall()

  const goCustomer = () => { setIsDriver(false); router.push('/auth') }
  const goDriver   = () => { setIsDriver(true);  router.push('/auth') }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-navy-900 px-6 safe-top safe-bottom">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-12 text-center"
      >
        <div className="w-20 h-20 bg-electric-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-float">
          <span className="text-4xl">🚛</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white">TowNow</h1>
        <p className="text-blue-200 mt-2 text-base">On-demand roadside assistance</p>
      </motion.div>

      {/* Mode cards */}
      <motion.div
        className="w-full max-w-sm space-y-4"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
      >
        <button
          onClick={goCustomer}
          className="w-full bg-electric-600 hover:bg-electric-500 text-white rounded-2xl p-5 text-left transition-all duration-200 active:scale-95 shadow-float"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">🚗</span>
            <div>
              <p className="font-semibold text-lg">I need a tow</p>
              <p className="text-blue-100 text-sm">Request roadside assistance</p>
            </div>
            <span className="ml-auto text-2xl opacity-60">›</span>
          </div>
        </button>

        <button
          onClick={goDriver}
          className="w-full bg-navy-700 hover:bg-navy-600 border border-white/10 text-white rounded-2xl p-5 text-left transition-all duration-200 active:scale-95"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">🚛</span>
            <div>
              <p className="font-semibold text-lg">I'm a driver</p>
              <p className="text-blue-200 text-sm">Accept tow requests & earn</p>
            </div>
            <span className="ml-auto text-2xl opacity-60">›</span>
          </div>
        </button>
      </motion.div>

      {/* Install banner */}
      {canInstall && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={install}
          className="mt-8 flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm rounded-full px-5 py-2.5 hover:bg-white/15 transition-all"
        >
          <Download size={15} />
          Add to Home Screen
        </motion.button>
      )}

      <p className="mt-8 text-blue-200/40 text-xs">TowNow v1.0 – Prototype</p>
    </div>
  )
}
