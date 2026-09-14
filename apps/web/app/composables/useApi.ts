export const useApi = () => {
  const config = useRuntimeConfig()

  return $fetch.create({
    baseURL: (config.public.apiBaseUrl as string) || 'http://localhost:3001',
  })
}
