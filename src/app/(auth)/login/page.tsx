import { Metadata } from 'next'
import { LoginView } from '@/features/auth/views/LoginView'

export const metadata: Metadata = {
  title: 'CreFlow - 크리에이터 수익 관리 시작하기',
  description: '유튜브, 숲, 치지직, 광고 수익을 한 곳에서 관리하세요. 팀 정산까지 깔끔하게.',
  openGraph: {
    title: 'CreFlow - 크리에이터 수익 관리',
    description: '흩어진 수익, 한눈에 정리하세요',
  },
}

export default function LoginPage() {
  return <LoginView />
}
