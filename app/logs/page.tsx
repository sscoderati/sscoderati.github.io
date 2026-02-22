import { AnimatedBackground } from '@/components/ui/animated-background'
import { getLogSeries } from '@/lib/log-posts'
import Link from 'next/link'

export const metadata = {
  title: 'Logs',
  description: '공부 기록 목록입니다.',
  alternates: {
    canonical: '/logs',
  },
}

export default async function LogsIndexPage() {
  const categories = await getLogSeries()

  return (
    <main className="mt-24 pb-20">
      <h1 className="text-xl font-semibold">Logs</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        공부하며 정리한 기록들입니다.
      </p>
      <div className="mt-10 flex flex-col gap-10">
        {categories.map((category) => (
          <section key={category.key}>
            <h2 className="mb-4 text-base font-medium text-zinc-800 dark:text-zinc-200">
              {category.label}
            </h2>
            <div className="flex flex-col gap-1">
              <AnimatedBackground
                enableHover
                className="h-full w-full rounded-lg bg-zinc-100 dark:bg-zinc-900/80"
                transition={{
                  type: 'spring',
                  bounce: 0,
                  duration: 0.2,
                }}
              >
                {category.series.map((series) => (
                  <Link
                    key={series.slug}
                    className="-mx-3 rounded-xl px-3 py-3 no-underline hover:no-underline"
                    href={series.link}
                    data-id={series.slug}
                  >
                    <div className="flex items-center gap-1">
                      <div className="flex flex-col space-y-1">
                        <h4 className="m-0! font-normal dark:text-zinc-100">
                          {series.label}
                        </h4>
                      </div>
                      <span className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500">
                        {series.postCount}편
                      </span>
                    </div>
                  </Link>
                ))}
              </AnimatedBackground>
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
