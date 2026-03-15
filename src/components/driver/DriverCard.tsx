'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Phone, Star, Clock } from 'lucide-react'
import type { DriverInfo } from '@/store/appStore'
import { Badge } from '@/components/ui'

interface DriverCardProps {
  driver: DriverInfo
  showEta?: boolean
  compact?: boolean
}

export default function DriverCard({ driver, showEta = true, compact = false }: DriverCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3"
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-navy-700">
          <Image
            src={driver.avatar}
            alt={driver.name}
            width={56}
            height={56}
            className="object-cover"
            unoptimized
          />
        </div>
        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-navy-800" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white text-sm truncate">{driver.name}</p>
        {!compact && (
          <p className="text-white/50 text-xs truncate">{driver.plateNumber}</p>
        )}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <Badge color="blue">{driver.truckType}</Badge>
          <span className="flex items-center gap-0.5 text-amber-400 text-xs">
            <Star size={11} fill="currentColor" />
            {driver.rating.toFixed(1)}
          </span>
          {!compact && (
            <span className="text-white/30 text-xs">{driver.tripsCompleted} trips</span>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        {showEta && (
          <div className="flex items-center gap-1 text-electric-400 text-sm font-medium">
            <Clock size={13} />
            {driver.eta} min
          </div>
        )}
        <a
          href={`tel:${driver.phone}`}
          className="w-8 h-8 bg-electric-600/20 border border-electric-500/30 rounded-full flex items-center justify-center text-electric-400 hover:bg-electric-600/40 transition-all"
          onClick={e => e.stopPropagation()}
        >
          <Phone size={14} />
        </a>
      </div>
    </motion.div>
  )
}
