import { computed, ref } from 'vue'
import type { ParkingSpace, ParkingSpaceStatus } from '~/types/parking'

export const useParkingMock = () => {
  const spaces = ref<ParkingSpace[]>([
    { id: 'A01', code: 'A01', zone: 'A', type: 'REGULAR', status: 'AVAILABLE', active: true },
    { id: 'A02', code: 'A02', zone: 'A', type: 'REGULAR', status: 'AVAILABLE', active: true },
    { id: 'A03', code: 'A03', zone: 'A', type: 'REGULAR', status: 'AVAILABLE', active: true },
    { id: 'A04', code: 'A04', zone: 'A', type: 'REGULAR', status: 'AVAILABLE', active: true },
    { id: 'B01', code: 'B01', zone: 'B', type: 'REGULAR', status: 'AVAILABLE', active: true },
    { id: 'B02', code: 'B02', zone: 'B', type: 'REGULAR', status: 'AVAILABLE', active: true },
  ])

  const total = computed(() => spaces.value.length)
  const available = computed(() => spaces.value.filter(item => item.status === 'AVAILABLE').length)
  const occupied = computed(() => spaces.value.filter(item => item.status === 'OCCUPIED').length)
  const outOfService = computed(() => spaces.value.filter(item => item.status === 'OUT_OF_SERVICE').length)

  const occupancyPercentage = computed(() => {
    if (total.value === 0) return 0
    return Math.round((occupied.value / total.value) * 100)
  })

  const updateStatus = (id: string, status: ParkingSpaceStatus) => {
    const space = spaces.value.find(item => item.id === id)
    if (space) space.status = status
  }

  return {
    spaces,
    total,
    available,
    occupied,
    outOfService,
    occupancyPercentage,
    updateStatus,
  }
}
