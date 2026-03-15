'use client'
import { useEffect, useRef, useState } from 'react'

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function useDriverTracking(
  driverStart: [number, number] | null,
  destination: [number, number] | null,
  active: boolean
) {
  const [driverPos, setDriverPos] = useState<[number, number] | null>(driverStart)
  const progressRef = useRef(0)
  const rafRef = useRef<number>()

  useEffect(() => {
    if (!active || !driverStart || !destination) return
    progressRef.current = 0
    setDriverPos(driverStart)

    const step = () => {
      progressRef.current = Math.min(progressRef.current + 0.002, 1)
      const t = progressRef.current
      const lng = lerp(driverStart[0], destination[0], t)
      const lat = lerp(driverStart[1], destination[1], t)
      // small jitter for realistic movement
      const jitter = (Math.random() - 0.5) * 0.0002 * (1 - t)
      setDriverPos([lng + jitter, lat + jitter])
      if (t < 1) rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [active, driverStart, destination])

  const progress = progressRef.current
  return { driverPos, progress }
}
