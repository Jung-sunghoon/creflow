import { Metadata } from 'next'
import { CloseButton } from '@/shared/components/common/CloseButton'

export const metadata: Metadata = {
  title: '이용약관 - CreFlow',
  description: 'CreFlow 서비스 이용약관을 확인하세요.',
  openGraph: {
    title: '이용약관 - CreFlow',
    description: 'CreFlow 서비스 이용약관',
    type: 'website',
  },
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">이용약관</h1>
            <p className="text-sm text-neutral-500 mt-2">최종 수정일: 2025년 12월 4일</p>
          </div>
          <CloseButton />
        </header>

        {/* 약관 내용 */}
        <article className="prose prose-neutral prose-sm max-w-none">
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">제1조 (목적)</h2>
            <p className="text-neutral-700 leading-relaxed">
              본 약관은 CreFlow(이하 &quot;서비스&quot;)가 제공하는 크리에이터 수익 관리 서비스의
              이용 조건 및 절차, 회원과 서비스 간의 권리와 의무를 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">제2조 (서비스의 내용)</h2>
            <p className="text-neutral-700 leading-relaxed mb-3">
              서비스는 다음과 같은 기능을 제공합니다:
            </p>
            <ul className="list-disc list-inside text-neutral-700 space-y-1">
              <li>플랫폼별 수익 기록 및 관리</li>
              <li>광고/협찬 수익 관리</li>
              <li>지출 내역 기록 및 관리</li>
              <li>월별/연간 수익 리포트</li>
              <li>협업자 수익 배분 계산</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">제3조 (회원가입)</h2>
            <p className="text-neutral-700 leading-relaxed">
              회원가입은 Google 계정을 통해 이루어지며, 가입 시 본 약관과 개인정보처리방침에
              동의한 것으로 간주합니다. 서비스는 만 14세 이상의 개인만 이용할 수 있습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">제4조 (회원의 의무)</h2>
            <ul className="list-disc list-inside text-neutral-700 space-y-1">
              <li>정확한 정보를 입력해야 합니다.</li>
              <li>타인의 계정을 도용하거나 부정 사용해서는 안 됩니다.</li>
              <li>서비스를 불법적인 목적으로 사용해서는 안 됩니다.</li>
              <li>서비스의 운영을 방해하는 행위를 해서는 안 됩니다.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">제5조 (서비스의 책임 범위)</h2>
            <p className="text-neutral-700 leading-relaxed">
              서비스는 회원이 입력한 데이터의 정확성을 보장하지 않으며,
              해당 데이터를 기반으로 한 세금 신고나 재무 결정에 대한 책임을 지지 않습니다.
              정확한 세무 처리를 위해서는 전문 세무사와 상담하시기 바랍니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">제6조 (서비스 중단)</h2>
            <p className="text-neutral-700 leading-relaxed">
              서비스는 시스템 점검, 장애 복구, 천재지변 등의 사유로 일시적으로 중단될 수 있으며,
              사전 공지가 가능한 경우 공지합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">제7조 (회원 탈퇴)</h2>
            <p className="text-neutral-700 leading-relaxed">
              회원은 언제든지 서비스 내 설정에서 탈퇴할 수 있으며,
              탈퇴 시 모든 개인 데이터는 즉시 삭제됩니다.
              단, 법령에 따라 보관이 필요한 정보는 해당 기간 동안 보관됩니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">제8조 (약관의 변경)</h2>
            <p className="text-neutral-700 leading-relaxed">
              서비스는 필요한 경우 본 약관을 변경할 수 있으며,
              변경 시 서비스 내 공지를 통해 알립니다.
              변경된 약관에 동의하지 않는 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">제9조 (문의)</h2>
            <p className="text-neutral-700 leading-relaxed">
              본 약관에 대한 문의는 서비스 내 피드백 기능을 통해 연락해 주시기 바랍니다.
            </p>
          </section>
        </article>
      </div>
    </main>
  )
}
