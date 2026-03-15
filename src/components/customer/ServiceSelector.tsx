'use client'
import { motion } from 'framer-motion'
import { TOW_SERVICES } from '@/lib/mockData'
import clsx from 'clsx'

const COLOR_MAP: Record<string, string> = {
  blue:   'border-blue-500/60 bg-blue-500/10 text-blue-300',
  purple: 'border-purple-500/60 bg-purple-500/10 text-purple-300',
  amber:  'border-amber-500/60 bg-amber-500/10 text-amber-300',
  red:    'border-red-500/60 bg-red-500/10 text-red-300',
}

interface ServiceSelectorProps {
  selected: string
  onSelect: (id: string) => void
}

export default function ServiceSelector({ selected, onSelect }: ServiceSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {TOW_SERVICES.map((svc, i) => {
        const isSelected = selected === svc.id
        return (
          <motion.button
            key={svc.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => onSelect(svc.id)}
            className={clsx(
              'relative text-left p-3.5 rounded-2xl border transition-all duration-200 active:scale-95',
              isSelected
                ? COLOR_MAP[svc.color] + ' shadow-lg scale-[1.02]'
                : 'border-white/10 bg-navy-800/60 hover:border-white/20'
            )}
          >
            {isSelected && (
              <motion.div
                layoutId="service-select"
                className="absolute inset-0 rounded-2xl border-2 border-current opacity-40"
              />
            )}
            <span className="text-2xl block mb-1.5">{svc.icon}</span>
            <p className="font-semibold text-white text-sm leading-tight">{svc.name}</p>
            <p className="text-white/40 text-xs mt-0.5 leading-tight">{svc.description}</p>
            <p className="text-white/60 text-xs mt-2">from AED {svc.baseFare}</p>
          </motion.button>
        )
      })}
    </div>
  )
}
