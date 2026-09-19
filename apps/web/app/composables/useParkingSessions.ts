interface CheckInPayload {
  plate: string
  brand?: string
  model?: string
  color?: string
  type: 'CAR' | 'MOTORCYCLE'
}

export const useParkingSessions = () => {
  const api = useApi()

  const checkIn = (payload: CheckInPayload) => {
    return api('/parking-sessions', {
      method: 'POST',
      body: payload,
    })
  }

  return { checkIn }
}
