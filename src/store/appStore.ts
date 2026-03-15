import { create } from 'zustand'
import type { User } from 'firebase/auth'

export type JobStatus =
  | 'idle'
  | 'selecting'
  | 'estimating'
  | 'searching'
  | 'assigned'
  | 'en_route'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'payment'
  | 'rating'

export interface DriverInfo {
  id: string
  name: string
  phone: string
  rating: number
  tripsCompleted: number
  truckType: string
  plateNumber: string
  avatar: string
  eta: number
  isOnline: boolean
  location?: [number, number]
}

export interface JobRequest {
  id: string
  customerId: string
  pickup: { coords: [number, number]; address: string }
  dropoff: { coords: [number, number]; address: string } | null
  serviceType: string
  estimatedPrice: number
  distance: number
  status: JobStatus
  driver?: DriverInfo
  createdAt: number
  paymentMethod?: string
  rating?: number
}

interface AppState {
  user: User | null
  isDriver: boolean
  currentJob: JobRequest | null
  driverStatus: 'offline' | 'online' | 'busy'
  earnings: number
  completedJobs: number

  setUser: (u: User | null) => void
  setIsDriver: (v: boolean) => void
  setCurrentJob: (j: JobRequest | null) => void
  updateJobStatus: (s: JobStatus) => void
  setDriverStatus: (s: 'offline' | 'online' | 'busy') => void
  addEarnings: (amount: number) => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isDriver: false,
  currentJob: null,
  driverStatus: 'offline',
  earnings: 0,
  completedJobs: 0,

  setUser: (u) => set({ user: u }),
  setIsDriver: (v) => set({ isDriver: v }),
  setCurrentJob: (j) => set({ currentJob: j }),
  updateJobStatus: (s) =>
    set((state) => ({
      currentJob: state.currentJob ? { ...state.currentJob, status: s } : null,
    })),
  setDriverStatus: (s) => set({ driverStatus: s }),
  addEarnings: (amount) =>
    set((state) => ({
      earnings: state.earnings + amount,
      completedJobs: state.completedJobs + 1,
    })),
}))
