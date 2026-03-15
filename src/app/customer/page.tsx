'use client'
import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Navigation, ArrowLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

import { useAppStore, type JobRequest, type JobStatus } from '@/store/appStore'
import {
  DEFAULT_CENTER, MOCK_DRIVERS, calcPrice, calcDistance, randomNearby, TOW_SERVICES,
} from '@/lib/mockData'

import { BottomSheet, Button, StatusPill, Skeleton } from '@/components/ui'
import ServiceSelector from '@/components/customer/ServiceSelector'
import PriceEstimate from '@/components/customer/PriceEstimate'
import SearchingAnimation from '@/components/customer/SearchingAnimation'
import DriverCard from '@/components/driver/DriverCard'
import PaymentScreen from '@/components/customer/PaymentScreen'
import RatingScreen from '@/components/customer/RatingScreen'

const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-navy-900 flex items-center justify-center"><span className="text-white/30 text-sm">Loading map…</span></div>,
})

type PickStep = 'idle' | 'pickup' | 'dropoff'

export default function CustomerPage() {
  const router = useRouter()
  const { currentJob, setCurrentJob, updateJobStatus } = useAppStore()

  const [userPos, setUserPos]   = useState<[number, number]>(DEFAULT_CENTER)
  const [pickup, setPickup]     = useState<[number, number] | null>(null)
  const [dropoff, setDropoff]   = useState<[number, number] | null>(null)
  const [pickupAddr, setPickupAddr]   = useState('')
  const [dropoffAddr, setDropoffAddr] = useState('')
  const [pickStep, setPickStep] = useState<PickStep>('idle')
  const [service, setService]   = useState('standard')
  const [sheet, setSheet]       = useState<'service' | 'estimate' | 'driver' | 'tracking' | 'payment' | 'rating' | null>(null)
  const [driverPos, setDriverPos] = useState<[number, number] | null>(null)
  const [payLoading, setPayLoading] = useState(false)
  const [nearbyDrivers, setNearbyDrivers] = useState<[number, number][]>([])

  // Get user location
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      pos => {
        const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude]
        setUserPos(coords)
        setPickup(coords)
        setPickupAddr('Your current location')
        // scatter mock nearby drivers
        setNearbyDrivers([
          randomNearby(coords, 1.2),
          randomNearby(coords, 1.8),
          randomNearby(coords, 0.9),
        ])
      },
      () => {
        setNearbyDrivers([
          randomNearby(DEFAULT_CENTER, 1.2),
          randomNearby(DEFAULT_CENTER, 1.8),
          randomNearby(DEFAULT_CENTER, 0.9),
        ])
      }
    )
  }, [])

  const handleMapClick = useCallback((coords: [number, number]) => {
    const label = `${coords[1].toFixed(5)}, ${coords[0].toFixed(5)}`
    if (pickStep === 'pickup') {
      setPickup(coords); setPickupAddr(label); setPickStep('idle')
      toast.success('Pickup set')
    } else if (pickStep === 'dropoff') {
      setDropoff(coords); setDropoffAddr(label); setPickStep('idle')
      toast.success('Drop-off set')
    }
  }, [pickStep])

  const distance = pickup && dropoff ? calcDistance(pickup, dropoff) : 0
  const estimatedPrice = calcPrice(service, distance)
  const status = currentJob?.status ?? 'idle'

  const requestTow = () => {
    if (!pickup) return toast.error('Please set pickup location')
    if (!dropoff) return toast.error('Please set drop-off location')

    const job: JobRequest = {
      id: `job_${Date.now()}`,
      customerId: 'demo_user',
      pickup: { coords: pickup, address: pickupAddr },
      dropoff: { coords: dropoff, address: dropoffAddr },
      serviceType: service,
      estimatedPrice,
      distance,
      status: 'searching',
      createdAt: Date.now(),
    }
    setCurrentJob(job)
    setSheet('driver')
    setNearbyDrivers([]) // hide idle drivers when searching

    // Simulate finding a driver after 3s
    setTimeout(() => {
      const driver = MOCK_DRIVERS[Math.floor(Math.random() * MOCK_DRIVERS.length)]
      const driverStartPos = randomNearby(pickup, 1.5)
      setCurrentJob({ ...job, status: 'assigned', driver: { ...driver, location: driverStartPos } })
      setDriverPos(driverStartPos)
      toast.success(`${driver.name} is on the way!`)

      // Simulate driver approaching
      simulateApproach(driverStartPos, pickup, () => {
        updateJobStatus('arrived')
        toast('Driver has arrived! 📍', { icon: '🎉' })
        setTimeout(() => {
          updateJobStatus('in_progress')
          if (dropoff) simulateApproach(pickup, dropoff, () => {
            updateJobStatus('completed')
            setSheet('payment')
          }, 120)
        }, 4000)
      }, 90)
    }, 3000)
  }

  const simulateApproach = (
    from: [number, number], to: [number, number],
    onDone: () => void, durationSec = 90
  ) => {
    const steps = durationSec * 10
    let i = 0
    const interval = setInterval(() => {
      i++
      const t = i / steps
      const pos: [number, number] = [
        from[0] + (to[0] - from[0]) * t + (Math.random() - 0.5) * 0.0001,
        from[1] + (to[1] - from[1]) * t + (Math.random() - 0.5) * 0.0001,
      ]
      setDriverPos(pos)
      if (i >= steps) { clearInterval(interval); setDriverPos(to); onDone() }
    }, 100)
  }

  const handlePay = (method: string) => {
    setPayLoading(true)
    setTimeout(() => {
      setPayLoading(false)
      updateJobStatus('rating')
      setSheet('rating')
      toast.success('Payment confirmed ✓')
    }, 1500)
  }

  const handleRating = () => {
    setCurrentJob(null)
    setPickup(userPos)
    setDropoff(null)
    setDropoffAddr('')
    setSheet(null)
    setDriverPos(null)
    setNearbyDrivers([
      randomNearby(userPos, 1.2),
      randomNearby(userPos, 1.8),
      randomNearby(userPos, 0.9),
    ])
    toast.success('Thank you for riding with TowNow! 🚛')
  }

  const svcInfo = TOW_SERVICES.find(s => s.id === service)

  return (
    <div className="relative w-full h-screen overflow-hidden bg-navy-900">
      {/* Map */}
      <MapView
        center={userPos}
        pickup={pickup}
        dropoff={dropoff}
        driverPos={driverPos}
        nearbyDrivers={nearbyDrivers}
        onMapClick={handleMapClick}
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
            <p className="text-xs text-white/40 leading-none mb-0.5">TowNow</p>
            {status === 'idle' || status === 'selecting' || status === 'estimating'
              ? <p className="text-white text-sm font-medium">Request a tow truck</p>
              : <StatusPill status={status} />
            }
          </div>
        </div>

        {/* Map tap hint */}
        <AnimatePresence>
          {pickStep !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="mx-4 mt-1 bg-electric-600/90 backdrop-blur rounded-xl px-4 py-2 text-white text-sm text-center"
            >
              Tap the map to set your {pickStep === 'pickup' ? 'pickup' : 'drop-off'} location
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main bottom sheet - location & actions */}
      {(!sheet || sheet === 'service' || sheet === 'estimate') && status === 'idle' && (
        <BottomSheet isOpen title="" closeable={false} className="pb-safe">
          {/* Location inputs */}
          <div className="space-y-2.5 mb-4">
            <button
              onClick={() => setPickStep(p => p === 'pickup' ? 'idle' : 'pickup')}
              className={`w-full flex items-center gap-3 bg-navy-900/60 border rounded-xl px-4 py-3 text-left transition-all ${
                pickStep === 'pickup' ? 'border-electric-500' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <MapPin size={16} className="text-electric-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/40">Pickup</p>
                <p className="text-white text-sm truncate">{pickupAddr || 'Set pickup location'}</p>
              </div>
              {pickup && <span className="text-green-400 text-xs">✓</span>}
            </button>

            <button
              onClick={() => setPickStep(p => p === 'dropoff' ? 'idle' : 'dropoff')}
              className={`w-full flex items-center gap-3 bg-navy-900/60 border rounded-xl px-4 py-3 text-left transition-all ${
                pickStep === 'dropoff' ? 'border-electric-500' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <Navigation size={16} className="text-white/40 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/40">Drop-off</p>
                <p className={`text-sm truncate ${dropoff ? 'text-white' : 'text-white/30'}`}>
                  {dropoffAddr || 'Set drop-off location'}
                </p>
              </div>
              {dropoff && <span className="text-green-400 text-xs">✓</span>}
            </button>
          </div>

          {/* Service type */}
          {sheet === 'service' || sheet === 'estimate' ? (
            <>
              <p className="text-white/50 text-xs mb-2 uppercase tracking-wider">Tow type</p>
              <ServiceSelector selected={service} onSelect={setService} />
              {dropoff && (
                <div className="mt-4">
                  <PriceEstimate serviceId={service} distanceKm={distance} />
                </div>
              )}
              <Button fullWidth size="lg" className="mt-4" onClick={requestTow} disabled={!pickup || !dropoff}>
                Request Tow Truck
              </Button>
            </>
          ) : (
            <button
              onClick={() => setSheet('service')}
              className="w-full flex items-center justify-between bg-navy-900/60 border border-white/10 hover:border-electric-500/50 rounded-2xl px-4 py-3.5 text-left transition-all active:scale-95"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{svcInfo?.icon}</span>
                <div>
                  <p className="text-white text-sm font-medium">{svcInfo?.name}</p>
                  <p className="text-white/40 text-xs">from AED {svcInfo?.baseFare}</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-white/30" />
            </button>
          )}
        </BottomSheet>
      )}

      {/* Searching + Driver assigned sheet */}
      <BottomSheet isOpen={!!sheet && ['driver', 'tracking'].includes(sheet ?? '')} closeable={false}>
        {status === 'searching' && <SearchingAnimation />}
        {['assigned', 'en_route', 'arrived', 'in_progress'].includes(status) && currentJob?.driver && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <DriverCard driver={currentJob.driver} showEta />
            <div className="h-px bg-white/10" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Service</span>
                <span className="text-white">{TOW_SERVICES.find(s => s.id === currentJob.serviceType)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Pickup</span>
                <span className="text-white truncate max-w-[60%] text-right">{currentJob.pickup.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Estimated</span>
                <span className="text-electric-400 font-semibold">AED {currentJob.estimatedPrice}</span>
              </div>
            </div>
            <StatusPill status={status} />
          </motion.div>
        )}
      </BottomSheet>

      {/* Payment sheet */}
      <BottomSheet isOpen={sheet === 'payment'} title="Payment" closeable={false}>
        <PaymentScreen
          total={currentJob?.estimatedPrice ?? 0}
          onPay={handlePay}
          loading={payLoading}
        />
      </BottomSheet>

      {/* Rating sheet */}
      <BottomSheet isOpen={sheet === 'rating'} title="Rate your driver" closeable={false}>
        {currentJob?.driver && (
          <RatingScreen
            driver={currentJob.driver}
            total={currentJob.estimatedPrice}
            onSubmit={handleRating}
          />
        )}
      </BottomSheet>
    </div>
  )
}
