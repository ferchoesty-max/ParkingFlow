export const useApi = () => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  return $fetch.create({
    baseURL: (config.public.apiBaseUrl as string) || 'http://localhost:3001/api/v1',
    credentials: 'include',
    async onRequest({ options }) {
      if (!auth.accessToken && typeof window !== 'undefined') {
        try {
          const res = await $fetch<{ data: { accessToken: string; user: any } }>(
            'http://localhost:3001/api/v1/auth/login',
            {
              method: 'POST',
              body: { email: 'admin@parkingflow.local', password: 'Admin123!' },
            },
          )
          if (res?.data?.accessToken) {
            auth.setSession(res.data.accessToken, res.data.user)
          }
        } catch {
          // ignore error if server not reached
        }
      }

      if (auth.accessToken) {
        options.headers = new Headers(options.headers)
        options.headers.set('Authorization', `Bearer ${auth.accessToken}`)
      }
    },
  })
}

