# sscoderati.github.io

Astro에서 Next.js(App Router + MDX)로 마이그레이션한 블로그 프로젝트입니다.  
정적 export(`out/`)를 GitHub Pages로 배포합니다.

## 환경

- Node.js 20+
- pnpm 10+

## 자주 쓰는 명령어

### 1) 의존성 설치

```bash
pnpm install
```

### 2) 로컬 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 `http://localhost:3000` 접속

### 3) 프로덕션 빌드(static export)

```bash
pnpm build
```

`next.config.mjs`의 `output: 'export'` 설정으로 `out/` 디렉토리가 생성됩니다.

### 4) 빌드 결과 로컬 확인

```bash
pnpm start
```

### 5) 코드 검사

```bash
pnpm lint
pnpm typecheck
```

## 배포

- GitHub Actions 워크플로우: `.github/workflows/deploy.yml`
- `main` 브랜치에 push하면 `out/` 아티팩트를 GitHub Pages로 배포합니다.
