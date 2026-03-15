'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Power, TrendingUp, CheckCircle, MapPin, Navigation } from 'lucide-react'
import toast from 'react-hot-toast'

import { useAppStore } from '@/store/appStore'
import { MOCK_DRIVERS, DEFAULT_CENTER, randomNearby, TOW_SERVICES, calcPrice } from '@/lib/mockData'
import { BottomSheet, Button, Badge, Card } from '@/components/ui'
import DriverCard from '@/components/driver/DriverCard'

const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-navy-900" />,
})

type DriverFlow = 'idle' | 'incoming' | 'accepted' | 'navigating' | 'arrived' | 'completed' | 'earnings'

interface IncomingJob {
  id: string
  customerName: string
  pickup: { coords: [number, number]; address: string }
  dropoff: { coords: [number, number]; address: string }
  service: string
  price: number
  distance: number
}

export default function DriverPage() {
  const router = useRouter()
  const { driverStatus, setDriverStatus, earnings, completedJobs, addEarnings } = useAppStore()

  const driver = MOCK_DRIVERS[0]
  const [flow, setFlow]             = useState<DriverFlow>('idle')
  const [driverPos, setDriverPos]   = useState<[number, number]>(DEFAULT_CENTER)
  const [incomingJob, setIncomingJob] = useState<IncomingJob | null>(null)
  const [activeJob, setActiveJob]   = useState<IncomingJob | null>(null)
  const [timeoutId, setTimeoutId]   = useState<ReturnType<typeof setTimeout> | null>(null)
  const [countdown, setCountdown]   = useState(15)

  // Get driver location
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(pos => {
      setDriverPos([pos.coords.longitude, pos.coords.latitude])
    })
  }, [])

  // Simulate incoming request when online
  useEffect(() => {
    if (driverStatus !== 'online') return
    const tid = setTimeout(() => {
      const pickupCoords = randomNearby(driverPos, 1.5)
      const dropoffCoords = randomNearby(driverPos, 4)
      const service = TOW_SERVICES[Math.floor(Math.random() * TOW_SERVICES.length)]
      const dist = 3 + Math.random() * 8
      const job: IncomingJob = {
        id: `job_sim_${Date.now()}`,
        customerName: ['Sara Ahmed', 'Mike Johnson', 'Layla Hassan', 'David Park'][Math.floor(Math.random() * 4)],
        pickup:  { coords: pickupCoords,  address: `${pickupCoords[1].toFixed(4)}, ${pickupCoords[0].toFixed(4)}` },
        dropoff: { coords: dropoffCoords, address: `${dropoffCoords[1].toFixed(4)}, ${dropoffCoords[0].toFixed(4)}` },
        service: service.id,
        price: calcPrice(service.id, dist),
        distance: parseFloat(dist.toFixed(1)),
      }
      setIncomingJob(job)
      setFlow('incoming')
      setCountdown(15)
    }, 4000)
    return () => clearTimeout(tid)
  }, [driverStatus, driverPos])

  // Countdown for incoming job
  useEffect(() => {
    if (flow !== 'incoming') return
    if (countdown <= 0) { declineJob(); return }
    const id = setTimeout(() => setCountdown(c => c - 1), 1000)
    setTimeoutId(id)
    return () => clearTimeout(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow, countdown])

  const toggleOnline = () => {
    if (driverStatus === 'offline') {
      setDriverStatus('online')
      toast.success('You\'re now online 🟢')
    } else if (driverStatus === 'online') {
      setDriverStatus('offline')
      setFlow('idle')
      setIncomingJob(null)
      toast('Gone offline', { icon: '🔴' })
    }
  }

  const acceptJob = () => {
    if (!incomingJob) return
    if (timeoutId) clearTimeout(timeoutId)
    setActiveJob(incomingJob)
    setIncomingJob(null)
    setFlow('accepted')
    setDriverStatus('busy')
    toast.success('Job accepted! Navigate to pickup.')
  }

  const declineJob = () => {
    if (timeoutId) clearTimeout(timeoutId)
    setIncomingJob(null)
    setFlow('idle')
    toast('Job declined', { icon: '↩️' })
  }

  const startNavigate = () => setFlow('navigating')

  const markArrived = () => {
    setFlow('arrived')
    toast.success('Marked as arrived')
  }

  const completeJob = () => {
    if (!activeJob) return
    addEarnings(activeJob.price)
    setFlow('completed')
    setDriverStatus('online')
  }

  const showEarnings = () => setFlow('earnings')
  const backToIdle   = () => { setFlow('idle'); setActiveJob(null) }

  const svcInfo = TOW_SERVICES.find(s => s.id === (activeJob?.service ?? incomingJob?.service))

  return (
    <div className="relative w-full h-screen overflow-hidden bg-navy-900">
      {/* Map */}
      <MapView
        center={driverPos}
        pickup={activeJob?.pickup.coords ?? incomingJob?.pickup.coords}
        dropoff={activeJob?.dropoff.coords}
        driverPos={driverPos}
        className="absolute inset-0"
      />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 safe-top">
        <div className="flex items-center gap-3 px-4 pt-4 pb-2">
          <button
            onClick={() => router.push('/')}
            className="w-10 h-10 bg-navy-800/90 backdrop-blur rounded-full flex items-center justify-center border border-white/10 text-white"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex-1 bg-navy-800/90 backdrop-blur rounded-2xl px-4 py-2.5 border border-white/10">
            <p className="text-xs text-white/40 leading-none mb-0.5">Driver mode</p>
            <p className="text-white text-sm font-medium">{driver.name}</p>
          </div>

          {/* Online toggle */}
          <button
            onClick={toggleOnline}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-2xl border font-medium text-sm transition-all ${
              driverStatus === 'online' || driverStatus === 'busy'
                ? 'bg-green-500/20 border-green-500/40 text-green-400'
                : 'bg-navy-800/90 border-white/10 text-white/50'
            }`}
          >
            <Power size={14} />
            {driverStatus === 'offline' ? 'Offline' : driverStatus === 'busy' ? 'Busy' : 'Online'}
          </button>
        </div>
      </div>

      {/* Stats bar (idle/online) */}
      {(flow === 'idle' || flow === 'earnings') && (
        <div className="absolute bottom-0 left-0 right-0 z-20 safe-bottom">
          <div className="bg-navy-800/95 backdrop-blur border-t border-white/10 rounded-t-3xl px-5 py-5">
            <div className="grid grid-cols-3 gap-3 mb-4">
              <Card className="text-center py-3">
                <TrendingUp size={16} className="text-electric-400 mx-auto mb-1" />
                <p className="text-white font-bold text-lg">AED {earnings}</p>
                <p className="text-white/40 text-xs">Today</p>
              </Card>
              <Card className="text-center py-3">
                <CheckCircle size={16} className="text-green-400 mx-auto mb-1" />
                <p className="text-white font-bold text-lg">{completedJobs}</p>
                <p className="text-white/40 text-xs">Trips</p>
              </Card>
              <Card className="text-center py-3">
                <span className="text-lg block mb-1">⭐</span>
                <p className="text-white font-bold text-lg">{driver.rating}</p>
                <p className="text-white/40 text-xs">Rating</p>
              </Card>
            </div>

            {driverStatus === 'offline' ? (
              <Button fullWidth size="lg" onClick={toggleOnline}>
                Go Online to Start Earning
              </Button>
            ) : (
              <div className="flex items-center justify-center gap-2 py-2">
                <motion.div
                  className="w-2 h-2 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-green-400 text-sm font-medium">Waiting for requests…</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Incoming job sheet */}
      <AnimatePresence>
        {flow === 'incoming' && incomingJob && (
          <BottomSheet isOpen title="New tow request" closeable={false}>
            {/* Countdown ring */}
            <div className="flex justify-end mb-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border-2 border-amber-500/60 flex items-center justify-center">
                <span className="text-amber-400 text-sm font-bold">{countdown}</span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-3 bg-navy-900/60 rounded-xl p-3">
                <MapPin size={16} className="text-electric-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-white/40">Customer</p>
                  <p className="text-white text-sm font-medium">{incomingJob.customerName}</p>
                  <p className="text-white/50 text-xs mt-0.5">{incomingJob.pickup.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-navy-900/60 rounded-xl p-3">
                <Navigation size={16} className="text-white/40 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-white/40">Drop-off</p>
                  <p className="text-white/60 text-sm">{incomingJob.dropoff.address}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mb-4 text-sm">
              <Badge color="blue">{svcInfo?.name}</Badge>
              <Badge color="amber">{incomingJob.distance} km</Badge>
              <Badge color="green">AED {incomingJob.price}</Badge>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={declineJob}>Decline</Button>
              <Button className="flex-2 flex-1" onClick={acceptJob}>Accept Job</Button>
            </div>
          </BottomSheet>
        )}
      </AnimatePresence>

      {/* Accepted job sheet */}
      {(flow === 'accepted' || flow === 'navigating' || flow === 'arrived') && activeJob && (
        <BottomSheet isOpen closeable={false}>
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <p className="text-white font-semibold">{activeJob.customerName}</p>
              <Badge color={flow === 'arrived' ? 'green' : flow === 'navigating' ? 'blue' : 'amber'}>
                {flow === 'arrived' ? 'At pickup' : flow === 'navigating' ? 'Navigating' : 'Accepted'}
              </Badge>
            </div>

            <div className="bg-navy-900/60 rounded-xl p-3 space-y-2 text-sm">
              <div className="flex gap-2">
                <MapPin size={14} className="text-electric-400 mt-0.5 flex-shrink-0" />
                <span className="text-white/70">{activeJob.pickup.address}</span>
              </div>
              <div className="flex gap-2">
                <Navigation size={14} className="text-white/40 mt-0.5 flex-shrink-0" />
                <span className="text-white/50">{activeJob.dropoff.address}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Badge color="blue">{svcInfo?.name}</Badge>
              <Badge color="green">AED {activeJob.price}</Badge>
            </div>
          </div>

          {flow === 'accepted' && (
            <Button fullWidth size="lg" onClick={startNavigate}>Start Navigation</Button>
          )}
          {flow === 'navigating' && (
            <Button fullWidth size="lg" onClick={markArrived}>I've Arrived at Pickup</Button>
          )}
          {flow === 'arrived' && (
            <Button fullWidth size="lg" onClick={completeJob}>Mark Job Complete</Button>
          )}
        </BottomSheet>
      )}

      {/* Completed sheet */}
      {flow === 'completed' && activeJob && (
        <BottomSheet isOpen closeable={false} title="Job complete!">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
            <div className="w-16 h-16 bg-green-500/20 border-2 border-green-500/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-400" />
            </div>
            <p className="text-white font-bold text-2xl mb-1">AED {activeJob.price}</p>
            <p className="text-white/50 text-sm mb-4">Added to your earnings</p>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={showEarnings}>
                View Earnings
              </Button>
              <Button className="flex-1" onClick={backToIdle}>
                Back Online
              </Button>
            </div>
          </motion.div>
        </BottomSheet>
      )}
    </div>
  )
}
