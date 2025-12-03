-- CreFlow 데이터베이스 스키마
-- Supabase SQL Editor에서 실행하세요.

-- =====================================================
-- 1. USERS 테이블 (Supabase Auth와 연동)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- users 테이블 코멘트
COMMENT ON TABLE public.users IS '사용자 프로필 정보';
COMMENT ON COLUMN public.users.onboarding_completed IS '온보딩 완료 여부';

-- =====================================================
-- 2. PLATFORMS 테이블 (플랫폼 설정)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.platforms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('youtube', 'soop', 'chzzk', 'instagram', 'tiktok', 'other')),
  tier TEXT CHECK (tier IN ('normal', 'best', 'partner', 'rookie', 'pro')),
  commission_rate NUMERIC(5,2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, type)
);

-- platforms 테이블 코멘트
COMMENT ON TABLE public.platforms IS '사용자별 플랫폼 설정';
COMMENT ON COLUMN public.platforms.tier IS 'SOOP: normal/best/partner, 치지직: rookie/pro/partner';
COMMENT ON COLUMN public.platforms.commission_rate IS '직접 입력 시 수수료율 (%)';

-- =====================================================
-- 3. COLLABORATORS 테이블 (협력자)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('fixed', 'percentage', 'hybrid')),
  base_amount INTEGER,
  percentage NUMERIC(5,2),
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- collaborators 테이블 코멘트
COMMENT ON TABLE public.collaborators IS '협력자 (편집자, 썸네일러 등)';
COMMENT ON COLUMN public.collaborators.payment_type IS 'fixed: 고정급, percentage: 수익배분, hybrid: 기본급+수익배분';

-- =====================================================
-- 4. CAMPAIGNS 테이블 (광고/협찬)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  payment_date DATE,
  is_paid BOOLEAN DEFAULT FALSE,
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- campaigns 테이블 코멘트
COMMENT ON TABLE public.campaigns IS '광고/협찬 캠페인';
COMMENT ON COLUMN public.campaigns.is_paid IS '입금 완료 여부';

-- =====================================================
-- 5. INCOMES 테이블 (수익)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.incomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('platform', 'ad')),
  source TEXT CHECK (source IN ('youtube', 'soop', 'chzzk', 'instagram', 'tiktok', 'other')),
  income_type TEXT CHECK (income_type IN ('ad', 'superchat', 'membership')),
  input_method TEXT CHECK (input_method IN ('direct', 'raw_count')),
  raw_count INTEGER,
  raw_amount INTEGER,
  commission_rate NUMERIC(5,2),
  commission_amount INTEGER,
  withholding_tax INTEGER,
  amount INTEGER NOT NULL,
  date DATE NOT NULL,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- incomes 테이블 코멘트
COMMENT ON TABLE public.incomes IS '수익 기록';
COMMENT ON COLUMN public.incomes.type IS 'platform: 플랫폼 수익, ad: 광고/협찬';
COMMENT ON COLUMN public.incomes.input_method IS 'direct: 실수령액 직접 입력, raw_count: 별풍선/치즈 개수 입력';
COMMENT ON COLUMN public.incomes.raw_count IS '별풍선/치즈 개수 (raw_count 입력 시)';
COMMENT ON COLUMN public.incomes.withholding_tax IS '원천징수 금액 (3.3%)';

-- =====================================================
-- 6. EXPENSES 테이블 (지출)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('collaborator', 'other')),
  collaborator_id UUID REFERENCES public.collaborators(id) ON DELETE SET NULL,
  description TEXT,
  amount INTEGER NOT NULL,
  date DATE NOT NULL,
  is_paid BOOLEAN DEFAULT FALSE,
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- expenses 테이블 코멘트
COMMENT ON TABLE public.expenses IS '지출 기록';
COMMENT ON COLUMN public.expenses.type IS 'collaborator: 인건비, other: 기타 지출';
COMMENT ON COLUMN public.expenses.is_paid IS '지급 완료 여부';

-- =====================================================
-- 7. FEEDBACKS 테이블 (피드백)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('feature', 'bug', 'other')),
  content TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- feedbacks 테이블 코멘트
COMMENT ON TABLE public.feedbacks IS '사용자 피드백';
COMMENT ON COLUMN public.feedbacks.type IS 'feature: 기능 제안, bug: 버그 신고, other: 기타';

-- =====================================================
-- 8. 인덱스 생성
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_platforms_user ON public.platforms(user_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_user ON public.collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_payment ON public.campaigns(user_id, payment_date);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_paid ON public.campaigns(user_id, is_paid);
CREATE INDEX IF NOT EXISTS idx_incomes_user_date ON public.incomes(user_id, date);
CREATE INDEX IF NOT EXISTS idx_incomes_user_type ON public.incomes(user_id, type);
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON public.expenses(user_id, date);
CREATE INDEX IF NOT EXISTS idx_expenses_user_paid ON public.expenses(user_id, is_paid);

-- =====================================================
-- 9. updated_at 자동 업데이트 트리거
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- users 테이블에 트리거 적용
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
