import { Metadata } from 'next'
import { CloseButton } from '@/shared/components/common/CloseButton'

export const metadata: Metadata = {
  title: '개인정보처리방침 - CreFlow',
  description: 'CreFlow의 개인정보 수집, 이용, 보관에 대한 정책을 확인하세요.',
  openGraph: {
    title: '개인정보처리방침 - CreFlow',
    description: 'CreFlow 개인정보처리방침',
    type: 'website',
  },
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">개인정보처리방침</h1>
            <p className="text-sm text-neutral-500 mt-2">최종 수정일: 2025년 12월 4일</p>
          </div>
          <CloseButton />
        </header>

        {/* 방침 내용 */}
        <article className="prose prose-neutral prose-sm max-w-none">
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">1. 수집하는 개인정보</h2>
            <p className="text-neutral-700 leading-relaxed mb-3">
              CreFlow(이하 &quot;서비스&quot;)는 다음과 같은 개인정보를 수집합니다:
            </p>
            <ul className="list-disc list-inside text-neutral-700 space-y-1">
              <li><strong>Google 계정 정보:</strong> 이메일 주소, 이름, 프로필 사진</li>
              <li><strong>서비스 이용 정보:</strong> 수익/지출 기록, 협업자 정보, 설정 정보</li>
              <li><strong>자동 수집 정보:</strong> 접속 시간, 기기 정보, 브라우저 정보</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">2. 개인정보의 이용 목적</h2>
            <ul className="list-disc list-inside text-neutral-700 space-y-1">
              <li>서비스 제공 및 회원 식별</li>
              <li>수익/지출 데이터 저장 및 관리</li>
              <li>서비스 개선 및 신규 기능 개발</li>
              <li>고객 문의 응대</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">3. 개인정보의 보관 및 파기</h2>
            <p className="text-neutral-700 leading-relaxed mb-3">
              회원 탈퇴 시 모든 개인정보는 즉시 파기됩니다. 단, 다음의 경우 명시된 기간 동안 보관됩니다:
            </p>
            <ul className="list-disc list-inside text-neutral-700 space-y-1">
              <li>전자상거래법에 따른 계약/청약철회 기록: 5년</li>
              <li>전자상거래법에 따른 소비자 불만/분쟁 처리 기록: 3년</li>
              <li>통신비밀보호법에 따른 접속 로그: 3개월</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">4. 개인정보의 제3자 제공</h2>
            <p className="text-neutral-700 leading-relaxed">
              서비스는 원칙적으로 회원의 개인정보를 제3자에게 제공하지 않습니다.
              다만, 법령에 따라 수사기관의 요청이 있는 경우에는 제공될 수 있습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">5. 개인정보의 위탁</h2>
            <p className="text-neutral-700 leading-relaxed mb-3">
              서비스는 원활한 서비스 제공을 위해 다음과 같이 개인정보 처리를 위탁하고 있습니다:
            </p>
            <ul className="list-disc list-inside text-neutral-700 space-y-1">
              <li><strong>Supabase:</strong> 데이터베이스 운영 및 인증 처리</li>
              <li><strong>Vercel:</strong> 웹 서비스 호스팅</li>
              <li><strong>Google:</strong> 소셜 로그인 인증</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">6. 회원의 권리</h2>
            <p className="text-neutral-700 leading-relaxed mb-3">
              회원은 다음과 같은 권리를 행사할 수 있습니다:
            </p>
            <ul className="list-disc list-inside text-neutral-700 space-y-1">
              <li>개인정보 열람, 정정, 삭제 요청</li>
              <li>개인정보 처리 정지 요청</li>
              <li>회원 탈퇴</li>
            </ul>
            <p className="text-neutral-700 leading-relaxed mt-3">
              위 권리 행사는 서비스 내 설정 또는 피드백 기능을 통해 요청할 수 있습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">7. 개인정보의 안전성 확보 조치</h2>
            <ul className="list-disc list-inside text-neutral-700 space-y-1">
              <li>데이터 전송 시 SSL/TLS 암호화</li>
              <li>비밀번호는 저장하지 않음 (Google OAuth 사용)</li>
              <li>데이터베이스 접근 권한 최소화</li>
              <li>정기적인 보안 점검</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">8. 쿠키 사용</h2>
            <p className="text-neutral-700 leading-relaxed">
              서비스는 로그인 세션 유지를 위해 쿠키를 사용합니다.
              브라우저 설정에서 쿠키를 거부할 수 있으나, 이 경우 서비스 이용이 제한될 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">9. 문의</h2>
            <p className="text-neutral-700 leading-relaxed">
              개인정보 처리에 관한 문의는 서비스 내 피드백 기능을 통해 연락해 주시기 바랍니다.
            </p>
          </section>
        </article>
      </div>
    </main>
  )
}
