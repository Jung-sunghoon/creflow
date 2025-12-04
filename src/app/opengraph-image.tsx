import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'CreFlow - 크리에이터 수익 관리'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#FAFAFA',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
        }}
      >
        {/* 로고 아이콘 */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 18,
            background: '#2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          C
        </div>

        {/* 서비스명 */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: '#18181B',
          }}
        >
          CreFlow
        </div>

        {/* 슬로건 */}
        <div
          style={{
            fontSize: 28,
            color: '#71717A',
          }}
        >
          흩어진 수익, 한눈에 정리하세요
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
