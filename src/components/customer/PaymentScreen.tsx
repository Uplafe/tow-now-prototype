'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { PAYMENT_METHODS } from '@/lib/mockData'
import { Button, Card } from '@/components/ui'
import { Check } from 'lucide-react'
import clsx from 'clsx'

interface PaymentScreenProps {
  total: number
  onPay: (method: string) => void
  loading?: boolean
}

export default function PaymentScreen({ total, onPay, loading }: PaymentScreenProps) {
  const [selected, setSelected] = useState('card')

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="text-center py-2">
        <p className="text-white/50 text-sm">Amount due</p>
        <p className="text-4xl font-bold text-white mt-1">AED {total}</p>
      </div>

      <div className="space-y-2.5">
        {PAYMENT_METHODS.map(pm => (
          <Card
            key={pm.id}
            onClick={() => setSelected(pm.id)}
            className={clsx(
              'flex items-center gap-3 transition-all',
              selected === pm.id && 'border-electric-500/60 bg-electric-600/10'
            )}
          >
            <span className="text-2xl">{pm.icon}</span>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{pm.label}</p>
              {pm.last4 && (
                <p className="text-white/40 text-xs">•••• {pm.last4}</p>
              )}
            </div>
            <div className={clsx(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
              selected === pm.id ? 'border-electric-500 bg-electric-600' : 'border-white/20'
            )}>
              {selected === pm.id && <Check size={11} />}
            </div>
          </Card>
        ))}
      </div>

      <Button
        fullWidth
        size="lg"
        onClick={() => onPay(selected)}
        loading={loading}
      >
        {selected === 'cash' ? 'Confirm Cash Payment' : `Pay AED ${total}`}
      </Button>
    </motion.div>
  )
}
