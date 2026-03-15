'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Stars, Button } from '@/components/ui'
import type { DriverInfo } from '@/store/appStore'
import Image from 'next/image'

const QUICK_TAGS = [
  'On time', 'Friendly', 'Careful with car', 'Professional',
  'Clean truck', 'Great communication',
]

interface RatingScreenProps {
  driver: DriverInfo
  total: number
  onSubmit: (rating: number, comment: string) => void
}

export default function RatingScreen({ driver, total, onSubmit }: RatingScreenProps) {
  const [rating, setRating] = useState(5)
  const [tags, setTags] = useState<string[]>([])
  const [comment, setComment] = useState('')

  const toggleTag = (t: string) =>
    setTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

  const handleSubmit = () => onSubmit(rating, [...tags, comment].filter(Boolean).join(', '))

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Driver info */}
      <div className="flex flex-col items-center text-center gap-2 pt-2">
        <div className="w-16 h-16 rounded-2xl overflow-hidden">
          <Image src={driver.avatar} alt={driver.name} width={64} height={64} className="object-cover" unoptimized />
        </div>
        <div>
          <p className="font-semibold text-white">How was {driver.name}?</p>
          <p className="text-white/40 text-sm">Your trip has been completed · AED {total} paid</p>
        </div>
        {/* Stars */}
        <Stars value={rating} onChange={setRating} size={36} />
      </div>

      {/* Quick tags */}
      <div className="flex flex-wrap gap-2">
        {QUICK_TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              tags.includes(tag)
                ? 'bg-electric-600 border-electric-500 text-white'
                : 'bg-transparent border-white/15 text-white/60 hover:border-white/30'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Comment box */}
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Add a comment (optional)…"
        rows={3}
        className="w-full bg-navy-900/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 resize-none focus:outline-none focus:border-electric-500 transition-colors"
      />

      <Button fullWidth size="lg" onClick={handleSubmit}>
        Submit Rating
      </Button>
    </motion.div>
  )
}
