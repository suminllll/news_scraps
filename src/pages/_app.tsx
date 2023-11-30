import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '../styles/globals.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        networkMode: 'offlineFirst',
      },
      mutations: {
        networkMode: 'offlineFirst',
      },
    },
  })
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  )
}

export default MyApp
