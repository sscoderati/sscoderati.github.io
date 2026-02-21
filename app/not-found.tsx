import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mt-24 pb-20">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        요청한 페이지를 찾을 수 없습니다.
      </p>
      <Link href="/" className="mt-6 inline-block text-sm underline underline-offset-4">
        홈으로 돌아가기
      </Link>
    </main>
  )
}
