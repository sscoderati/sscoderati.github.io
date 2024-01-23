interface SiteConfig {
	author: string
	title: string
	description: string
	lang: string
	ogLocale: string
	shareMessage: string
	paginationSize: number
}

export const siteConfig: SiteConfig = {
	author: 'Chang Gi Hong', // Site author
	title: "Chang Gi Hong's Devlog", // Site title.
	description: '기타치는 개발자, 홍창기의 개발 블로그입니다.', // Description to display in the meta tags
	lang: 'ko-KR',
	ogLocale: 'ko_KR',
	shareMessage: '이 글을 공유합니다', // Message to share a post on social media
	paginationSize: 6 // Number of posts per page
}
