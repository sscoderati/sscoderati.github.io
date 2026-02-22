'use client'

import { AnimatedBackground } from '@/components/ui/animated-background'
import { Magnetic } from '@/components/ui/magnetic'
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
  MorphingDialogDescription,
  MorphingDialogClose,
} from '@/components/ui/morphing-dialog'
import { Spotlight } from '@/components/ui/spotlight'
import type { BlogPost } from '@/lib/blog-posts'
import type { LogCategory } from '@/lib/log-posts'
import { motion } from 'motion/react'
import Link from 'next/link'
import { EMAIL, SOCIAL_LINKS, WORK_EXPERIENCE } from '../../constants/data'

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

const TRANSITION_SECTION = {
  duration: 0.3,
}

function MagneticSocialLink({
  children,
  link,
}: {
  children: React.ReactNode
  link: string
}) {
  return (
    <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
      <a
        href={link}
        className="group relative inline-flex shrink-0 items-center gap-[1px] rounded-full bg-zinc-100 px-2.5 py-1 text-sm text-black transition-colors duration-200 hover:bg-zinc-950 hover:text-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
      >
        {children}
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
        >
          <path
            d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      </a>
    </Magnetic>
  )
}

export default function HomeClient({
  blogPosts,
  logCategories,
}: {
  blogPosts: BlogPost[]
  logCategories: LogCategory[]
}) {
  return (
    <motion.main
      className="space-y-24"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <div className="flex-1">
          <p className="text-zinc-600 dark:text-zinc-400">
            팀에서 제품이 성장하기 위해 시도하는 아이디어의 의도가 최대한
            투명하게 제품에 반영될 수 있도록 개발합니다. 직군 간 입장의 차이를
            인지하고 부드럽게 논의하며, 더 나은 해결책을 위한 책임감있는 반박을
            지향합니다.
          </p>
        </div>
      </motion.section>

      {/* 프로젝트 섹션: 추후 추가 예정 */}
      {/* <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-5 text-lg font-medium">Selected Projects</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {PROJECTS.map((project) => (
            <div key={project.name} className="space-y-2">
              <div className="relative rounded-2xl bg-zinc-50/40 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50">
                <ProjectVideo src={project.video} />
              </div>
              <div className="px-1">
                <a
                  className="font-base group relative inline-block font-[450] text-zinc-900 dark:text-zinc-50"
                  href={project.link}
                  target="_blank"
                >
                  {project.name}
                  <span className="absolute bottom-0.5 left-0 block h-[1px] w-full max-w-0 bg-zinc-900 dark:bg-zinc-50 transition-all duration-200 group-hover:max-w-full"></span>
                </a>
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.section> */}

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-5 text-lg font-medium dark:text-zinc-100">
          Work Experience
        </h3>
        <div className="flex flex-col space-y-2">
          {WORK_EXPERIENCE.map((job) => (
            <MorphingDialog
              key={job.link}
              transition={{ type: 'spring', bounce: 0.05, duration: 0.25 }}
            >
              <MorphingDialogTrigger>
                <div className="relative overflow-hidden rounded-2xl bg-zinc-300/40 p-px dark:bg-zinc-700/40">
                  <Spotlight
                    className="from-blue-600 via-blue-500 to-blue-400 blur-3xl dark:from-blue-200 dark:via-blue-300 dark:to-blue-400"
                    size={180}
                  />
                  <div className="relative block h-full w-full rounded-[14px] bg-white p-4 dark:bg-zinc-950">
                    <div className="relative flex w-full flex-row justify-between">
                      <div>
                        <MorphingDialogTitle>
                          <h4 className="font-normal dark:text-zinc-100">
                            {job.title}
                          </h4>
                        </MorphingDialogTitle>
                        <MorphingDialogSubtitle>
                          <p className="text-zinc-500 dark:text-zinc-400">
                            {job.company}
                          </p>
                        </MorphingDialogSubtitle>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400">
                        {job.start} - {job.end}
                      </p>
                    </div>
                  </div>
                </div>
              </MorphingDialogTrigger>
              <MorphingDialogContainer>
                <MorphingDialogContent className="relative w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 pt-8 dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-start justify-between pr-8">
                      <div>
                        <MorphingDialogTitle>
                          <h3 className="text-lg font-medium dark:text-zinc-100">
                            {job.title}
                          </h3>
                        </MorphingDialogTitle>
                        <MorphingDialogSubtitle>
                          <p className="text-zinc-500 dark:text-zinc-400">
                            {job.company}
                          </p>
                        </MorphingDialogSubtitle>
                      </div>
                      <span className="shrink-0 text-sm text-zinc-500 dark:text-zinc-400">
                        {job.start} - {job.end}
                      </span>
                    </div>
                    <MorphingDialogDescription
                      disableLayoutAnimation
                      variants={{
                        initial: { opacity: 0, scale: 0.95, y: 10 },
                        animate: { opacity: 1, scale: 1, y: 0 },
                        exit: { opacity: 0, scale: 0.95, y: 10 },
                      }}
                    >
                      <div className="space-y-4 text-sm">
                        <div>
                          <h4 className="mb-1 font-medium text-zinc-800 dark:text-zinc-200">
                            회사 소개
                          </h4>
                          <p className="text-zinc-600 dark:text-zinc-400">
                            {job.companyDescription}
                          </p>
                        </div>
                        <div>
                          <h4 className="mb-1 font-medium text-zinc-800 dark:text-zinc-200">
                            담당 업무
                          </h4>
                          <ul className="list-inside list-disc space-y-1 text-zinc-600 dark:text-zinc-400">
                            {job.responsibilities.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="mb-1 font-medium text-zinc-800 dark:text-zinc-200">
                            경력 요약
                          </h4>
                          <p className="text-zinc-600 dark:text-zinc-400">
                            {job.summary}
                          </p>
                        </div>
                        <a
                          href={job.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400"
                        >
                          회사 웹사이트 방문
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                          >
                            <path
                              d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            />
                          </svg>
                        </a>
                      </div>
                    </MorphingDialogDescription>
                  </div>
                  <MorphingDialogClose className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200" />
                </MorphingDialogContent>
              </MorphingDialogContainer>
            </MorphingDialog>
          ))}
        </div>
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-medium dark:text-zinc-100">Blog</h3>
          <Link
            href="/blog"
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            More {'>'}
          </Link>
        </div>
        <div className="flex flex-col space-y-0">
          <AnimatedBackground
            enableHover
            className="h-full w-full rounded-lg bg-zinc-100 dark:bg-zinc-900/80"
            transition={{
              type: 'spring',
              bounce: 0,
              duration: 0.2,
            }}
          >
            {blogPosts.map((post) => (
              <Link
                key={post.link}
                className="-mx-3 rounded-xl px-3 py-3"
                href={post.link}
                data-id={post.link}
              >
                <div className="flex flex-col space-y-1">
                  <h4 className="font-normal dark:text-zinc-100">
                    {post.title}
                  </h4>
                  <p className="flex flex-col gap-1 text-zinc-500 dark:text-zinc-400">
                    <span className="text-sm">{post.description}</span>
                    <span className="text-xs">{post.date}</span>
                  </p>
                </div>
              </Link>
            ))}
          </AnimatedBackground>
        </div>
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-medium dark:text-zinc-100">Logs</h3>
          <Link
            href="/logs"
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            More {'>'}
          </Link>
        </div>
        <div className="flex flex-col gap-6">
          {logCategories.map((category) => (
            <div key={category.key}>
              <h4 className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {category.label}
              </h4>
              <div className="flex flex-col space-y-0">
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
                      className="-mx-3 rounded-xl px-3 py-2.5"
                      href={series.link}
                      data-id={series.slug}
                    >
                      <div className="flex items-center gap-1">
                        <h5 className="font-normal dark:text-zinc-100">
                          {series.label}
                        </h5>
                        <span className="text-xs text-zinc-400 dark:text-zinc-500">
                          {series.postCount}편
                        </span>
                      </div>
                    </Link>
                  ))}
                </AnimatedBackground>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-5 text-lg font-medium dark:text-zinc-100">Contact</h3>
        <p className="mb-5 text-zinc-600 dark:text-zinc-400">
          <a className="underline dark:text-zinc-300" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
        </p>
        <div className="flex items-center justify-start space-x-3">
          {SOCIAL_LINKS.map((link) => (
            <MagneticSocialLink key={link.label} link={link.link}>
              {link.label}
            </MagneticSocialLink>
          ))}
        </div>
      </motion.section>
    </motion.main>
  )
}
