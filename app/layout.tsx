import {
  SITE_AUTHOR,
  SITE_DESCRIPTION,
  SITE_NAME,
  WEBSITE_URL,
} from '@/lib/constants'
import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from 'next-themes'
import localFont from 'next/font/local'
import { Footer } from '../components/layout/footer'
import { Header } from '../components/layout/header'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  metadataBase: new URL(`${WEBSITE_URL}/`),
  alternates: { canonical: '/' },
  title: { default: SITE_NAME, template: '%s | Changgi Hong' },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_AUTHOR }],
  openGraph: {
    type: 'website',
    url: WEBSITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [{ url: '/og-card.png', width: 640, height: 335, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ['/og-card.png'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

const pretendard = localFont({
  src: [
    { path: '../public/fonts/Pretendard-ExtraLight.woff2', weight: '200' },
    { path: '../public/fonts/Pretendard-Light.woff2', weight: '300' },
    { path: '../public/fonts/Pretendard-Regular.woff2', weight: '400' },
    { path: '../public/fonts/Pretendard-Medium.woff2', weight: '500' },
    { path: '../public/fonts/Pretendard-SemiBold.woff2', weight: '600' },
    { path: '../public/fonts/Pretendard-Bold.woff2', weight: '700' },
    { path: '../public/fonts/Pretendard-ExtraBold.woff2', weight: '800' },
  ],
  variable: '--font-pretendard',
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko-KR" suppressHydrationWarning>
      <body
        className={`${pretendard.variable} bg-white tracking-tight antialiased dark:bg-zinc-950`}
      >
        <ThemeProvider
          enableSystem={true}
          enableColorScheme={false}
          attribute="class"
          storageKey="theme"
          defaultTheme="system"
        >
          <div className="flex min-h-screen w-full flex-col font-(family-name:--font-pretendard)">
            <div className="relative mx-auto w-full max-w-screen-sm flex-1 px-4 pt-20">
              <Header />
              {children}
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
