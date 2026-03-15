'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import clsx from 'clsx'
import React from 'react'

// ── Bottom Sheet ──────────────────────────────────────────────────
interface BottomSheetProps {
  isOpen: boolean
  onClose?: () => void
  children: React.ReactNode
  title?: string
  className?: string
  closeable?: boolean
  peek?: boolean
}

export function BottomSheet({
  isOpen, onClose, children, title, className = '', closeable = true, peek = false,
}: BottomSheetProps) {
  return (
    <AnimatePresence>
      {(isOpen || peek) && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className={clsx(
            'absolute bottom-0 left-0 right-0 bg-navy-800/95 bottom-sheet',
            'border-t border-white/10 rounded-t-3xl z-30 safe-bottom',
            className
          )}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-white/20 rounded-full" />
          </div>

          {/* Header */}
          {(title || closeable) && (
            <div className="flex items-center justify-between px-5 pt-2 pb-1">
              {title && <h3 className="font-semibold text-white text-base">{title}</h3>}
              {closeable && onClose && (
                <button onClick={onClose} className="text-white/50 hover:text-white ml-auto">
                  <X size={20} />
                </button>
              )}
            </div>
          )}

          <div className="px-5 pb-6">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Button ────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary', size = 'md', loading, fullWidth, children, className, disabled, ...rest
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    primary:   'bg-electric-600 hover:bg-electric-500 text-white shadow-float',
    secondary: 'bg-navy-700 hover:bg-navy-600 border border-white/10 text-white',
    ghost:     'bg-transparent hover:bg-white/5 text-blue-200 hover:text-white',
    danger:    'bg-red-600 hover:bg-red-500 text-white',
  }
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
  }
  return (
    <button
      className={clsx(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}

// ── Badge ─────────────────────────────────────────────────────────
interface BadgeProps { children: React.ReactNode; color?: 'blue' | 'green' | 'amber' | 'red' | 'purple' }
export function Badge({ children, color = 'blue' }: BadgeProps) {
  const colors = {
    blue:   'bg-blue-500/20 text-blue-300 border-blue-500/30',
    green:  'bg-green-500/20 text-green-300 border-green-500/30',
    amber:  'bg-amber-500/20 text-amber-300 border-amber-500/30',
    red:    'bg-red-500/20 text-red-300 border-red-500/30',
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  }
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', colors[color])}>
      {children}
    </span>
  )
}

// ── Card ──────────────────────────────────────────────────────────
interface CardProps { children: React.ReactNode; className?: string; onClick?: () => void }
export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-navy-800/80 border border-white/10 rounded-2xl p-4',
        onClick && 'cursor-pointer hover:border-electric-500/50 transition-all duration-200 active:scale-[0.98]',
        className
      )}
    >
      {children}
    </div>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={clsx('skeleton rounded-xl bg-white/5', className)} />
}

// ── Stars ─────────────────────────────────────────────────────────
interface StarsProps { value: number; onChange?: (v: number) => void; size?: number }
export function Stars({ value, onChange, size = 32 }: StarsProps) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          onClick={() => onChange?.(n)}
          className={clsx('star-btn text-3xl transition-all', n <= value ? 'active' : 'opacity-30')}
          style={{ fontSize: size }}
        >
          ⭐
        </button>
      ))}
    </div>
  )
}

// ── Divider ───────────────────────────────────────────────────────
export function Divider({ label }: { label?: string }) {
  if (!label) return <div className="h-px bg-white/10 my-4" />
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-white/10" />
      <span className="text-xs text-white/30">{label}</span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  )
}

// ── StatusPill ────────────────────────────────────────────────────
interface StatusPillProps { status: string }
const STATUS_MAP: Record<string, { label: string; color: string }> = {
  idle:        { label: 'Ready', color: 'bg-white/10 text-white/60' },
  searching:   { label: 'Finding driver…', color: 'bg-amber-500/20 text-amber-300' },
  assigned:    { label: 'Driver assigned', color: 'bg-blue-500/20 text-blue-300' },
  en_route:    { label: 'On the way', color: 'bg-electric-600/30 text-electric-400' },
  arrived:     { label: 'Driver arrived', color: 'bg-green-500/20 text-green-300' },
  in_progress: { label: 'Towing…', color: 'bg-purple-500/20 text-purple-300' },
  completed:   { label: 'Completed', color: 'bg-green-500/20 text-green-300' },
}
export function StatusPill({ status }: StatusPillProps) {
  const s = STATUS_MAP[status] ?? { label: status, color: 'bg-white/10 text-white/60' }
  return (
    <span className={clsx('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium', s.color)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {s.label}
    </span>
  )
}
