'use client'
import { motion } from 'framer-motion'
import { calcPrice, TOW_SERVICES } from '@/lib/mockData'
import { DollarSign, MapPin, Ruler } from 'lucide-react'

interface PriceEstimateProps {
  serviceId: string
  distanceKm: number
}

export default function PriceEstimate({ serviceId, distanceKm }: PriceEstimateProps) {
  const svc   = TOW_SERVICES.find(s => s.id === serviceId)
  const total = calcPrice(serviceId, distanceKm)
  if (!svc) return null

  const breakdown = [
    { label: 'Base fare',  value: `AED ${svc.baseFare}` },
    { label: `Distance (${distanceKm.toFixed(1)} km × AED ${svc.perKm})`, value: `AED ${Math.round(svc.perKm * distanceKm)}` },
    { label: 'Service fee', value: 'AED 0' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-navy-900/60 rounded-2xl border border-white/10 p-4"
    >
      {/* Total */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-electric-600/20 rounded-xl flex items-center justify-center">
          <DollarSign size={18} className="text-electric-400" />
        </div>
        <div>
          <p className="text-white/50 text-xs">Estimated total</p>
          <p className="text-2xl font-bold text-white">AED {total}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <span className="flex items-center gap-1 text-xs text-white/40">
            <Ruler size={11} /> {distanceKm.toFixed(1)} km
          </span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2">
        {breakdown.map(row => (
          <div key={row.label} className="flex items-center justify-between text-sm">
            <span className="text-white/50 flex items-center gap-1.5">
              <MapPin size={11} className="opacity-50" />
              {row.label}
            </span>
            <span className="text-white/80 font-medium">{row.value}</span>
          </div>
        ))}
        <div className="h-px bg-white/10 my-1" />
        <div className="flex items-center justify-between text-sm font-semibold">
          <span className="text-white">Total</span>
          <span className="text-electric-400">AED {total}</span>
        </div>
      </div>

      <p className="text-white/30 text-xs mt-3 text-center">
        Final price may vary based on actual distance & conditions
      </p>
    </motion.div>
  )
}
