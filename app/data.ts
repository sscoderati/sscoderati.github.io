type Project = {
  name: string
  description: string
  link: string
  video: string
}

type WorkExperience = {
  company: string
  title: string
  start: string
  end: string
  link: string
}

type SocialLink = { label: string; link: string }

export const PROJECTS: Project[] = [
  {
    name: 'Motion Primitives Pro',
    description:
      'Advanced components and templates to craft beautiful websites.',
    link: 'https://pro.motion-primitives.com/',
    video:
      'https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/W2azTw5BVbMXfj7F53G92hMVIn32/newProfileItem/d898be8a-7037-4c71-af0c-8997239b050d.mp4?_a=DATAdtAAZAA0',
  },
  {
    name: 'Motion Primitives',
    description: 'UI kit to make beautiful, animated interfaces.',
    link: 'https://motion-primitives.com/',
    video:
      'https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/W2azTw5BVbMXfj7F53G92hMVIn32/XSfIvT7BUWbPRXhrbLed/ee6871c9-8400-49d2-8be9-e32675eabf7e.mp4?_a=DATAdtAAZAA0',
  },
]

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: '(주)베타브레인',
    title: 'Fullstack Developer',
    start: '2025.07',
    end: 'Present',
    link: 'https://betabrain.co.kr',
  },
  {
    company: '(주)데이터뱅크',
    title: 'Frontend Developer',
    start: '2024.05',
    end: '2025.06',
    link: 'https://www.data-bank.ai',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'Github', link: 'https://github.com/sscoderati' },
  { label: 'X', link: 'https://x.com/sscoderati' },
  { label: 'LinkedIn', link: 'https://www.linkedin.com/in/sscoderati' },
]

export const EMAIL = 'chungup5495@gmail.com'
