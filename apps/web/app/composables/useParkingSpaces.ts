import type { ParkingSpace } from '~/types/parking'

interface ParkingSpacesResponse {
  data: ParkingSpace[]
}

export const useParkingSpaces = () => {
  const api = useApi()

  const { data, error, status, refresh } = useAsyncData(
    'parking-spaces',
    () => api<ParkingSpacesResponse>('/parking-spaces'),
  )

  const spaces = computed(() => data.value?.data ?? [])
  const total = computed(() => spaces.value.length)
  const available = computed(() => spaces.value.filter(item => item.status === 'AVAILABLE').length)
  const occupied = computed(() => spaces.value.filter(item => item.status === 'OCCUPIED').length)
  const outOfService = computed(() => spaces.value.filter(item => item.status === 'OUT_OF_SERVICE').length)
  const occupancyPercentage = computed(() => total.value === 0 ? 0 : Math.round((occupied.value / total.value) * 100))

  return {
    spaces,
    total,
    available,
    occupied,
    outOfService,
    occupancyPercentage,
    error,
    status,
    refresh,
  }
}
