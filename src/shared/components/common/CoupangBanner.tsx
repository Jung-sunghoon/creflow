'use client'

interface CoupangBannerProps {
  className?: string
}

export function CoupangBanner({ className = '' }: CoupangBannerProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="w-full max-w-[320px] overflow-hidden rounded-lg">
        <iframe
          src="https://ads-partners.coupang.com/widgets.html?id=948222&template=carousel&trackingCode=AF2709925&subId=&width=320&height=100&tsource="
          width="320"
          height="100"
          frameBorder="0"
          scrolling="no"
          referrerPolicy="unsafe-url"
          title="쿠팡 파트너스 배너"
          className="w-full"
        />
      </div>
      <p className="sr-only">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </div>
  )
}
