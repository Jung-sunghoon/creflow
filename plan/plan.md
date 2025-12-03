# CreFlow MVP 개발 플랜

> 크리에이터의 진짜 수익을 3초 만에
> 순수익 = 총 수익 (플랫폼 + 광고) - 총 지출 (인건비 + 기타)

---

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트 | CreFlow - 크리에이터 수익/지출 관리 서비스 |
| 디렉토리 | `C:\Users\swoom\Desktop\dev\creflow` |
| 상태 | 빈 디렉토리 (새 프로젝트) |
| 패키지 매니저 | pnpm (shamefully-hoist=true) |
| Supabase | 이미 생성됨 (사용자가 환경변수 제공) |
| Google OAuth | 이미 설정됨 (사용자가 Supabase에 연동) |

---

## 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| Framework | Next.js (App Router) | 16 (최신) |
| React | React | 19 (최신) |
| Language | TypeScript | strict mode |
| Styling | Tailwind CSS + shadcn/ui | v4 |
| Database | Supabase (PostgreSQL) | - |
| Auth | Supabase Auth (Google OAuth) | - |
| Server State | TanStack Query | v5 |
| Client State | Zustand | - |
| Icons | Lucide React | 최소한 사용 |
| PDF | Playwright | HTML → PDF |
| Package Manager | pnpm | - |
| Deploy | Vercel | - |

---

## 아키텍처 원칙

### App Router 규칙

- page.tsx는 **최대한 간결하게**
- View 컴포넌트만 import해서 렌더링
- 비즈니스 로직, 데이터 페칭은 page.tsx에 두지 않음
- 라우팅 역할만 수행

```tsx
// ✅ 좋은 예시: app/(main)/income/page.tsx
import { IncomeListView } from '@/features/income/views/IncomeListView'

export default function IncomePage() {
  return <IncomeListView />
}

// ❌ 나쁜 예시: page.tsx에 로직 넣기
export default function IncomePage() {
  const { data } = useQuery(...)    // ❌ 여기 두지 마
  const [state, setState] = useState() // ❌ 여기 두지 마
  return <div>...</div>
}
```

### 폴더 구조: Feature-based + Shared

- 기능별로 features/ 하위에 모듈화
- 공통 코드는 shared/에 배치
- 각 feature는 독립적으로 동작 가능해야 함

---

## 폴더 구조

```
creflow/
├── app/                          # 라우팅만 담당 (간결하게)
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── callback/route.ts
│   ├── (main)/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # → HomeView
│   │   ├── income/
│   │   │   ├── page.tsx          # → IncomeListView
│   │   │   └── new/page.tsx      # → IncomeFormView
│   │   ├── expense/
│   │   │   ├── page.tsx          # → ExpenseListView
│   │   │   └── new/page.tsx      # → ExpenseFormView
│   │   ├── report/page.tsx       # → ReportView
│   │   └── settings/page.tsx     # → SettingsView
│   ├── onboarding/page.tsx       # → OnboardingView
│   ├── api/
│   │   └── report/pdf/route.ts
│   ├── layout.tsx
│   └── globals.css
│
├── features/                     # 기능별 모듈 (핵심)
│   ├── home/
│   │   ├── views/
│   │   │   └── HomeView.tsx
│   │   └── components/
│   │       ├── NetIncomeCard.tsx
│   │       ├── SummaryCards.tsx
│   │       └── UpcomingEvents.tsx
│   │
│   ├── income/
│   │   ├── views/
│   │   │   ├── IncomeListView.tsx
│   │   │   └── IncomeFormView.tsx
│   │   ├── components/
│   │   │   ├── IncomeCard.tsx
│   │   │   ├── PlatformIncomeForm.tsx
│   │   │   └── CampaignForm.tsx
│   │   ├── hooks/
│   │   │   └── useIncome.ts
│   │   └── api/
│   │       └── income.ts
│   │
│   ├── expense/
│   │   ├── views/
│   │   │   ├── ExpenseListView.tsx
│   │   │   └── ExpenseFormView.tsx
│   │   ├── components/
│   │   │   ├── ExpenseCard.tsx
│   │   │   └── ExpenseForm.tsx
│   │   ├── hooks/
│   │   │   └── useExpense.ts
│   │   └── api/
│   │       └── expense.ts
│   │
│   ├── collaborator/
│   │   ├── components/
│   │   │   ├── CollaboratorCard.tsx
│   │   │   └── CollaboratorForm.tsx
│   │   ├── hooks/
│   │   │   └── useCollaborator.ts
│   │   └── api/
│   │       └── collaborator.ts
│   │
│   ├── report/
│   │   ├── views/
│   │   │   └── ReportView.tsx
│   │   ├── components/
│   │   │   ├── AnnualSummary.tsx
│   │   │   ├── MonthlyList.tsx
│   │   │   └── PDFTemplate.tsx
│   │   └── hooks/
│   │       └── useReport.ts
│   │
│   ├── settings/
│   │   ├── views/
│   │   │   └── SettingsView.tsx
│   │   └── components/
│   │       ├── PlatformSettings.tsx
│   │       ├── CollaboratorSettings.tsx
│   │       └── FeedbackForm.tsx
│   │
│   ├── onboarding/
│   │   ├── views/
│   │   │   └── OnboardingView.tsx
│   │   └── components/
│   │       ├── PlatformStep.tsx
│   │       ├── TierStep.tsx
│   │       ├── CollaboratorStep.tsx
│   │       └── CompleteStep.tsx
│   │
│   └── auth/
│       ├── views/
│       │   └── LoginView.tsx
│       └── components/
│           └── GoogleLoginButton.tsx
│
├── shared/                       # 공통 코드
│   ├── components/
│   │   ├── ui/                   # shadcn/ui 컴포넌트
│   │   ├── layout/
│   │   │   ├── BottomNav.tsx
│   │   │   └── Header.tsx
│   │   └── common/
│   │       ├── EmptyState.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorBoundary.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   └── calculations.ts       # 수수료 계산 로직
│   ├── types/
│   │   └── index.ts
│   └── stores/
│       └── useAppStore.ts
│
├── supabase/                     # DB 스키마 (참고용)
│   ├── schema.sql
│   ├── rls.sql
│   └── triggers.sql
│
├── .env.local                    # 사용자가 직접 작성
├── .env.example
├── .npmrc                        # shamefully-hoist=true
├── middleware.ts                 # Auth 미들웨어
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## MVP 기능 범위

1. Google 로그인
2. 온보딩 (플랫폼 선택, 등급 설정, 협력자 등록)
3. 홈 대시보드 (이번 달 순수익, 수익, 지출)
4. 수익 관리 (플랫폼 수익, 광고/협찬 수동 입력)
5. 지출 관리 (협력자 인건비, 기타 지출)
6. 협력자 관리 (등록, 정산 방식 설정)
7. 연간 리포트 PDF 다운로드
8. 피드백 수집 폼

---

## 데이터베이스 스키마

### SQL 스키마 (supabase/schema.sql)

```sql
-- UUID 확장 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 사용자 (Supabase Auth와 연동)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 플랫폼 설정
CREATE TABLE public.platforms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(20) NOT NULL,  -- youtube/soop/chzzk/instagram/tiktok
  tier VARCHAR(20),           -- normal/best/partner
  commission_rate INTEGER,    -- 직접 입력 시 수수료율 (%)
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 협력자
CREATE TABLE public.collaborators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(30) NOT NULL,  -- editor/thumbnail/moderator/manager/other
  payment_type VARCHAR(20) NOT NULL,  -- monthly/per_work/revenue_share
  payment_amount INTEGER,
  revenue_share_percent INTEGER,
  payment_day INTEGER,
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 광고/협찬
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  brand_name VARCHAR(100) NOT NULL,
  amount INTEGER NOT NULL,
  payment_date DATE,
  is_paid BOOLEAN DEFAULT FALSE,
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 수익
CREATE TABLE public.incomes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(20) NOT NULL,  -- platform/ad
  source VARCHAR(20),         -- youtube/soop/chzzk/other
  income_type VARCHAR(20),    -- ad/superchat/membership (유튜브용)
  input_method VARCHAR(20),   -- direct/raw_count
  raw_count INTEGER,          -- 별풍선/치즈 개수
  raw_amount INTEGER,         -- 원본 금액
  commission_rate INTEGER,    -- 적용된 수수료율 (%)
  commission_amount INTEGER,  -- 수수료 금액
  withholding_tax INTEGER,    -- 원천징수 금액 (3.3%)
  amount INTEGER NOT NULL,    -- 실수령액
  date DATE NOT NULL,
  campaign_id UUID REFERENCES public.campaigns(id),
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 지출
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  collaborator_id UUID REFERENCES public.collaborators(id),
  category VARCHAR(30),       -- labor/equipment/subscription/other
  description TEXT,
  amount INTEGER NOT NULL,
  work_count INTEGER,
  date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'paid',  -- pending/paid
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 피드백
CREATE TABLE public.feedbacks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  type VARCHAR(20) NOT NULL,  -- feature/bug/other
  content TEXT NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_incomes_user_date ON public.incomes(user_id, date);
CREATE INDEX idx_expenses_user_date ON public.expenses(user_id, date);
CREATE INDEX idx_campaigns_user_paid ON public.campaigns(user_id, is_paid);
CREATE INDEX idx_platforms_user ON public.platforms(user_id);
CREATE INDEX idx_collaborators_user ON public.collaborators(user_id);
```

### RLS 정책 (supabase/rls.sql)

```sql
-- RLS 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- users 정책
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- platforms 정책
CREATE POLICY "Users can CRUD own platforms" ON public.platforms
  FOR ALL USING (auth.uid() = user_id);

-- collaborators 정책
CREATE POLICY "Users can CRUD own collaborators" ON public.collaborators
  FOR ALL USING (auth.uid() = user_id);

-- campaigns 정책
CREATE POLICY "Users can CRUD own campaigns" ON public.campaigns
  FOR ALL USING (auth.uid() = user_id);

-- incomes 정책
CREATE POLICY "Users can CRUD own incomes" ON public.incomes
  FOR ALL USING (auth.uid() = user_id);

-- expenses 정책
CREATE POLICY "Users can CRUD own expenses" ON public.expenses
  FOR ALL USING (auth.uid() = user_id);

-- feedbacks 정책
CREATE POLICY "Anyone can insert feedback" ON public.feedbacks
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own feedback" ON public.feedbacks
  FOR SELECT USING (auth.uid() = user_id);
```

### Trigger (supabase/triggers.sql)

```sql
-- Auth 가입 시 자동으로 users 테이블에 레코드 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 수수료 계산 로직

### 플랫폼별 수수료 구조

**SOOP (구 아프리카TV) - 별풍선**
| 등급 | 수수료 | 수령률 |
|------|--------|--------|
| 일반 BJ | 40% | 60% |
| 베스트 BJ | 30% | 70% |
| 파트너 BJ | 20% | 80% |

> 별풍선 1개 = 110원, 환전 시 3.3% 원천징수

**치지직 - 치즈**
| 등급 | 수수료 | 수령률 |
|------|--------|--------|
| 루키 | 35% | 65% |
| 프로 | 25% | 75% |
| 파트너 | 20% | 80% |

> 치즈 1개 = 1원, 환전 시 3.3% 원천징수

**유튜브**
| 수익 유형 | 수수료 | 수령률 |
|----------|--------|--------|
| 광고 수익 | 45% | 55% |
| 슈퍼챗/멤버십 | 30% | 70% |

### 계산 공식 (shared/lib/calculations.ts)

```typescript
// SOOP 별풍선
const rawAmount = count * 110
const afterCommission = rawAmount * (1 - commissionRate)
const netAmount = afterCommission * (1 - 0.033)

// 치지직 치즈
const rawAmount = count * 1
const afterCommission = rawAmount * (1 - commissionRate)
const netAmount = afterCommission * (1 - 0.033)
```

---

## 디자인 원칙

### 하지 말 것 (AI Slop)
- 보라색 그라데이션
- 글래스모피즘 (반투명 blur)
- shadow-2xl 이상
- rounded-3xl 이상
- 네온/형광 컬러
- 아이콘 남발
- 애니메이션 과다

### 해야 할 것
- 화이트 배경 + 미세한 그레이 구분
- 명확한 정보 위계
- 최소한의 포인트 컬러 (1-2개)
- 충분한 여백
- 4px 단위 간격
- 모바일 퍼스트

### 컬러 시스템

```css
--primary: #18181B;
--accent: #2563EB;       /* 블루 (입금, 성공) */
--accent-red: #DC2626;   /* 레드 (마감, 경고) */
--accent-green: #16A34A; /* 그린 (완료) */
--background: #FFFFFF;
--card: #FAFAFA;
--border: #E4E4E7;
--muted: #71717A;
```

### 레이아웃
- 모바일: 100vw, 하단 탭 네비게이션
- 데스크톱: max-width 480px 중앙 정렬 (모바일 앱 느낌)

---

## 실행 순서

### Step 1: 프로젝트 초기화
1. Next.js 16 프로젝트 생성
2. .npmrc 설정 (shamefully-hoist=true)
3. Tailwind CSS v4 설정
4. shadcn/ui 설치 및 설정
5. 추가 패키지 설치 (TanStack Query v5, Zustand, Lucide React 등)
6. 폴더 구조 생성
7. .env.example 생성

### Step 2: 타입 정의 & 유틸리티
1. shared/types/index.ts - 모든 타입 정의
2. shared/lib/constants.ts - 상수 (플랫폼, 수수료율 등)
3. shared/lib/calculations.ts - 수수료 계산 로직
4. shared/lib/utils.ts - 유틸리티 함수

### Step 3: Supabase 연동
1. shared/lib/supabase/client.ts
2. shared/lib/supabase/server.ts
3. shared/lib/supabase/middleware.ts
4. middleware.ts (Auth 미들웨어)

### Step 4: 인증 구현
1. features/auth/views/LoginView.tsx
2. features/auth/components/GoogleLoginButton.tsx
3. app/(auth)/login/page.tsx
4. app/(auth)/callback/route.ts

### Step 5: 온보딩 구현
1. features/onboarding/views/OnboardingView.tsx
2. features/onboarding/components/* (스텝별 컴포넌트)
3. app/onboarding/page.tsx

### Step 6: 레이아웃 & 네비게이션
1. shared/components/layout/BottomNav.tsx
2. shared/components/layout/Header.tsx
3. app/(main)/layout.tsx

### Step 7: 홈 대시보드
1. features/home/views/HomeView.tsx
2. features/home/components/* (카드 컴포넌트들)
3. app/(main)/page.tsx

### Step 8: 수익 CRUD
1. features/income/views/*
2. features/income/components/*
3. features/income/hooks/useIncome.ts
4. features/income/api/income.ts
5. app/(main)/income/page.tsx
6. app/(main)/income/new/page.tsx

### Step 9: 지출 CRUD
1. features/expense/views/*
2. features/expense/components/*
3. features/expense/hooks/useExpense.ts
4. features/expense/api/expense.ts
5. app/(main)/expense/page.tsx
6. app/(main)/expense/new/page.tsx

### Step 10: 협력자 관리
1. features/collaborator/components/*
2. features/collaborator/hooks/useCollaborator.ts
3. features/collaborator/api/collaborator.ts

### Step 11: 리포트 & PDF
1. features/report/views/ReportView.tsx
2. features/report/components/*
3. app/api/report/pdf/route.ts
4. app/(main)/report/page.tsx

### Step 12: 설정 & 피드백
1. features/settings/views/SettingsView.tsx
2. features/settings/components/*
3. app/(main)/settings/page.tsx

### Step 13: 마무리
1. 에러 핸들링 (shared/components/common/ErrorBoundary.tsx)
2. Empty State (shared/components/common/EmptyState.tsx)
3. 로딩 상태 (shared/components/common/LoadingSpinner.tsx)
4. 반응형 점검
5. 배포 준비

---

## 보안 주의사항

### AI가 하지 않을 것
- Supabase 프로젝트 생성
- Google OAuth 앱 생성
- API 키/시크릿 발급
- .env 파일 내용 작성 (템플릿만 제공)

### AI가 할 것
- SQL 스키마 코드 작성
- RLS 정책 코드 작성
- 인증 관련 UI/로직 구현
- 클라이언트 코드 전체

---

## 사용자 액션 필요

1. **Supabase SQL Editor**에서 스키마/RLS/트리거 SQL 실행
2. **.env.local** 파일에 환경변수 직접 입력
3. **Supabase Dashboard**에서 Google OAuth 연동 확인

---

*이 플랜을 승인하시면 Step 1부터 순차적으로 구현을 시작합니다.*
