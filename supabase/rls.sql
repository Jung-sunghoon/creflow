-- CreFlow Row Level Security (RLS) 정책
-- schema.sql 실행 후 이 파일을 실행하세요.

-- =====================================================
-- 1. RLS 활성화
-- =====================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. USERS 테이블 정책
-- =====================================================
-- 기존 정책 삭제 (재실행 시 에러 방지)
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;

-- 자신의 데이터만 조회 가능
CREATE POLICY "Users can view own data"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- 자신의 데이터만 수정 가능
CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- 자신의 데이터만 삽입 가능
CREATE POLICY "Users can insert own data"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- 3. PLATFORMS 테이블 정책
-- =====================================================
DROP POLICY IF EXISTS "Users can manage own platforms" ON public.platforms;

CREATE POLICY "Users can manage own platforms"
  ON public.platforms
  FOR ALL
  USING (auth.uid() = user_id);

-- =====================================================
-- 4. COLLABORATORS 테이블 정책
-- =====================================================
DROP POLICY IF EXISTS "Users can manage own collaborators" ON public.collaborators;

CREATE POLICY "Users can manage own collaborators"
  ON public.collaborators
  FOR ALL
  USING (auth.uid() = user_id);

-- =====================================================
-- 5. CAMPAIGNS 테이블 정책
-- =====================================================
DROP POLICY IF EXISTS "Users can manage own campaigns" ON public.campaigns;

CREATE POLICY "Users can manage own campaigns"
  ON public.campaigns
  FOR ALL
  USING (auth.uid() = user_id);

-- =====================================================
-- 6. INCOMES 테이블 정책
-- =====================================================
DROP POLICY IF EXISTS "Users can manage own incomes" ON public.incomes;

CREATE POLICY "Users can manage own incomes"
  ON public.incomes
  FOR ALL
  USING (auth.uid() = user_id);

-- =====================================================
-- 7. EXPENSES 테이블 정책
-- =====================================================
DROP POLICY IF EXISTS "Users can manage own expenses" ON public.expenses;

CREATE POLICY "Users can manage own expenses"
  ON public.expenses
  FOR ALL
  USING (auth.uid() = user_id);

-- =====================================================
-- 8. FEEDBACKS 테이블 정책
-- =====================================================
DROP POLICY IF EXISTS "Anyone can insert feedback" ON public.feedbacks;
DROP POLICY IF EXISTS "Users can view own feedback" ON public.feedbacks;

-- 누구나 피드백 작성 가능 (비로그인 사용자 포함)
CREATE POLICY "Anyone can insert feedback"
  ON public.feedbacks
  FOR INSERT
  WITH CHECK (true);

-- 자신의 피드백만 조회 가능 (또는 익명 피드백)
CREATE POLICY "Users can view own feedback"
  ON public.feedbacks
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- =====================================================
-- 9. Auth Trigger: 새 사용자 자동 등록
-- =====================================================
-- 새 사용자가 가입하면 users 테이블에 자동 삽입
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url, onboarding_completed)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    NEW.raw_user_meta_data->>'avatar_url',
    FALSE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 기존 트리거 삭제 후 재생성
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 10. 서비스 역할 권한 설정 (Supabase 서비스에서 사용)
-- =====================================================
-- Supabase의 service_role은 RLS를 우회할 수 있음
-- 일반 anon 및 authenticated 역할만 RLS 적용됨

-- GRANT 문은 Supabase에서 기본 설정되어 있으므로 생략
