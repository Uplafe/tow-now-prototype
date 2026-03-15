export const MOCK_DRIVERS = [
  {
    id: 'driver_001',
    name: 'Ahmed Al-Rashid',
    phone: '+971 50 123 4567',
    rating: 4.9,
    tripsCompleted: 847,
    truckType: 'Flatbed',
    plateNumber: 'DXB 4521',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    eta: 4,
    isOnline: true,
  },
  {
    id: 'driver_002',
    name: 'Carlos Mendes',
    phone: '+971 55 987 6543',
    rating: 4.7,
    tripsCompleted: 523,
    truckType: 'Standard Tow',
    plateNumber: 'DXB 8812',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    eta: 7,
    isOnline: true,
  },
  {
    id: 'driver_003',
    name: 'Priya Sharma',
    phone: '+971 52 456 7890',
    rating: 4.8,
    tripsCompleted: 391,
    truckType: 'Heavy Recovery',
    plateNumber: 'SHJ 2234',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    eta: 11,
    isOnline: true,
  },
]

export const TOW_SERVICES = [
  {
    id: 'standard',
    name: 'Standard Tow',
    description: 'Regular towing for most vehicles',
    icon: '🚗',
    baseFare: 80,
    perKm: 8,
    color: 'blue',
    maxWeight: '3.5 tons',
  },
  {
    id: 'flatbed',
    name: 'Flatbed Tow',
    description: 'Safe flatbed for luxury & AWD cars',
    icon: '🚛',
    baseFare: 120,
    perKm: 12,
    color: 'purple',
    maxWeight: '5 tons',
  },
  {
    id: 'longdistance',
    name: 'Long Distance',
    description: 'Inter-city & highway transport',
    icon: '🛣️',
    baseFare: 200,
    perKm: 6,
    color: 'amber',
    maxWeight: '5 tons',
  },
  {
    id: 'emergency',
    name: 'Emergency Recovery',
    description: 'Urgent 24/7 accident recovery',
    icon: '🚨',
    baseFare: 250,
    perKm: 15,
    color: 'red',
    maxWeight: '8 tons',
  },
]

export const PAYMENT_METHODS = [
  { id: 'card',  label: 'Credit / Debit Card', icon: '💳', last4: '4242' },
  { id: 'apple', label: 'Apple Pay',            icon: '🍎' },
  { id: 'cash',  label: 'Cash on Arrival',      icon: '💵' },
]

// Dubai default center
export const DEFAULT_CENTER: [number, number] = [55.2708, 25.2048]

export function calcPrice(serviceId: string, distanceKm: number): number {
  const svc = TOW_SERVICES.find(s => s.id === serviceId)
  if (!svc) return 0
  return Math.round(svc.baseFare + svc.perKm * distanceKm)
}

export function calcDistance(
  a: [number, number],
  b: [number, number]
): number {
  const R = 6371
  const dLat = ((b[1] - a[1]) * Math.PI) / 180
  const dLon = ((b[0] - a[0]) * Math.PI) / 180
  const lat1 = (a[1] * Math.PI) / 180
  const lat2 = (b[1] * Math.PI) / 180
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}

export function randomNearby(
  center: [number, number],
  radiusKm = 2
): [number, number] {
  const r = radiusKm / 111
  const u = Math.random()
  const v = Math.random()
  const w = r * Math.sqrt(u)
  const t = 2 * Math.PI * v
  return [center[0] + w * Math.cos(t), center[1] + w * Math.sin(t)]
}
