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
  companyDescription: string
  responsibilities: string[]
  summary: string
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
    companyDescription: '베타브레인은 B2B 컨설팅 및 솔루션 제공 기업입니다.',
    responsibilities: [
      '풀스택 웹 애플리케이션 설계 및 개발, 배포 후 유지보수',
      '협력사 SI 개발',
      '솔루션 도입 문의 고객사 영업 지원',
    ],
    summary:
      'B2B 컨설팅 및 솔루션 제공 기업의 풀스택 개발을 담당하며, 프론트엔드와 백엔드를 아우르는 개발과 0 to 1 제품 메이킹 경험을 쌓고 있습니다.',
  },
  {
    company: '(주)데이터뱅크',
    title: 'Frontend Developer',
    start: '2024.05',
    end: '2025.06',
    link: 'https://www.data-bank.ai',
    companyDescription:
      '데이터뱅크는 에듀테크 솔루션 "테스트글라이더"를 제공하는 기업입니다.',
    responsibilities: ['테스트글라이더 웹, 백오피스 개발 및 유지보수'],
    summary:
      '에듀테크 솔루션 "테스트글라이더"의 프론트엔드 및 백오피스 개발을 담당하며, 대고객 서비스의 data driven UX/UI 개선을 지원했습니다.',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'Github', link: 'https://github.com/sscoderati' },
  { label: 'X', link: 'https://x.com/sscoderati' },
  { label: 'LinkedIn', link: 'https://www.linkedin.com/in/sscoderati' },
]

export const EMAIL = 'chungup5495@gmail.com'
