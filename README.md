# Creflow

크리에이터를 위한 수입/지출 관리 웹 애플리케이션

## 소개

Creflow는 스트리머, 유튜버, 인플루언서 등 콘텐츠 크리에이터가 다양한 플랫폼에서 발생하는 수입과 지출을 효율적으로 관리할 수 있도록 도와주는 서비스입니다.

## 주요 기능

### 수입 관리
- **플랫폼 수입**: YouTube, SOOP(아프리카TV), 치지직, Instagram, TikTok 등
- **광고/협찬**: 브랜드별 협찬 수입 관리
- **자동 계산**: 플랫폼 수수료, 원천징수(3.3%) 자동 계산
- **별풍선/치즈 변환**: 개수 입력 시 실수령액 자동 계산

### 지출 관리
- **협력자 비용**: 편집자, 썸네일러, 매니저 등
- **기타 비용**: 장비, 소프트웨어 등 운영 비용

### 협력자 관리
- 고정급, 퍼센티지, 하이브리드 정산 방식 지원
- 역할별 협력자 관리

### 리포트
- 연간/월별 수입/지출 요약
- 수입원별, 협력자별 분석
- PDF 리포트 생성 및 다운로드

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI**: React 19, Tailwind CSS 4, shadcn/ui
- **Backend**: Supabase (Authentication, Database)
- **State**: Zustand, TanStack Query
- **Form**: React Hook Form, Zod
- **Package Manager**: pnpm

## 프로젝트 구조

```
creflow/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (auth)/        # 인증 관련 페이지
│   │   ├── (main)/        # 메인 페이지 (대시보드, 수입, 지출, 리포트, 설정)
│   │   ├── api/           # API Routes
│   │   └── onboarding/    # 온보딩 페이지
│   ├── features/          # 기능별 모듈
│   │   ├── auth/          # 인증
│   │   ├── home/          # 홈/대시보드
│   │   ├── income/        # 수입 관리
│   │   ├── expense/       # 지출 관리
│   │   ├── collaborator/  # 협력자 관리
│   │   ├── report/        # 리포트
│   │   ├── settings/      # 설정
│   │   └── onboarding/    # 온보딩
│   └── shared/            # 공유 모듈
│       ├── components/    # 공통 컴포넌트
│       │   ├── ui/       # shadcn/ui 컴포넌트
│       │   ├── layout/   # 레이아웃 컴포넌트
│       │   └── common/   # 공통 유틸 컴포넌트
│       ├── lib/          # 유틸리티 함수
│       └── types/        # TypeScript 타입 정의
└── public/                # 정적 파일
```

## 시작하기

### 사전 요구사항

- Node.js 18.0 이상
- pnpm

### 설치

```bash
# 저장소 클론
git clone https://github.com/Jung-sunghoon/creflow.git
cd creflow

# 의존성 설치
pnpm install
```

### 환경 변수 설정

`.env.example`을 참고하여 `.env.local` 파일을 생성합니다:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 개발 서버 실행

```bash
pnpm dev
```

[http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인할 수 있습니다.

### 빌드

```bash
pnpm build
```

## 라이선스

MIT License
