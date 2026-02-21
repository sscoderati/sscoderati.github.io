type Project = {
  name: string
  description: string
  link: string
  video: string
  id: string
}

type WorkExperience = {
  company: string
  title: string
  start: string
  end: string
  link: string
  id: string
}

type BlogPost = {
  title: string
  description: string
  link: string
  date: string
  uid: string
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
    id: 'project1',
  },
  {
    name: 'Motion Primitives',
    description: 'UI kit to make beautiful, animated interfaces.',
    link: 'https://motion-primitives.com/',
    video:
      'https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/W2azTw5BVbMXfj7F53G92hMVIn32/XSfIvT7BUWbPRXhrbLed/ee6871c9-8400-49d2-8be9-e32675eabf7e.mp4?_a=DATAdtAAZAA0',
    id: 'project2',
  },
]

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: '(주)베타브레인',
    title: 'Fullstack Developer',
    start: '2025.07',
    end: 'Present',
    link: 'https://betabrain.co.kr',
    id: 'work2',
  },
  {
    company: '(주)데이터뱅크',
    title: 'Frontend Developer',
    start: '2024.05',
    end: '2025.06',
    link: 'https://data-bank.ai',
    id: 'work1',
  },
]

export const BLOG_POSTS: BlogPost[] = [
  {
    title: '글쓰기에 대한 스스로의 높은 기준치, 욕심에 대한 회고',
    description: '나는 어떻게 글을 써야 만족하는 사람일까? 그 고민의 결론',
    link: '/blog/direction-of-writing-post',
    date: '2024-02-05',
    uid: 'blog-1',
  },
  {
    title: 'V8 블로그 글에서 찾은 에러(진)',
    description:
      '작년 하반기에 우연히 찾은 공신력 높은 글의 에러(진)에 대해 작성해보았습니다.',
    link: '/blog/v8-faster-async-await-bug',
    date: '2024-02-15',
    uid: 'blog-2',
  },
  {
    title: '구글러의 답변을 받았다. 그리고 V8 기술 블로그의 기여자가 되었다?',
    description:
      'V8 블로그 글에서 다룬 await bug에 대해 질문하고 답변을 받은 이야기. 그리고 얼떨결에 기여자까지 되어버린 이야기.',
    link: '/blog/googler-replied-about-await-bug',
    date: '2024-03-07',
    uid: 'blog-3',
  },
  {
    title:
      'Gitmoji와 commitlint, husky로 가독성 높은 커밋 메시지의 일관성 지키기',
    description:
      'gitmoji와 commitlint, husky를 활용한 커밋 메시지 린트 시스템을 적용하는 방법에 대해 알아봅니다.',
    link: '/blog/gitmoji-commitlint',
    date: '2024-03-15',
    uid: 'blog-4',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'Github', link: 'https://github.com/sscoderati' },
  { label: 'Twitter', link: 'https://twitter.com/sscoderati' },
  { label: 'LinkedIn', link: 'https://www.linkedin.com/in/sscoderati' },
]

export const EMAIL = 'chungup5495@gmail.com'
