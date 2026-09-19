export const useApi = () => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  return $fetch.create({
    baseURL: (config.public.apiBaseUrl as string) || 'http://localhost:3001',
    credentials: 'include',
    onRequest({ options }) {
      if (auth.accessToken) {
        options.headers = new Headers(options.headers)
        options.headers.set('Authorization', `Bearer ${auth.accessToken}`)
      }
    },
  })
}
