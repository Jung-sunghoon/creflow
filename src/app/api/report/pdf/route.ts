import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/shared/lib/supabase/server'
import { getAnnualReport } from '@/features/report/api/report'
import { PDFTemplate } from '@/features/report/components/PDFTemplate'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()), 10)

    // 인증 확인
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    // 리포트 데이터 조회
    const report = await getAnnualReport(user.id, year)

    // HTML 생성 (dynamic import로 Turbopack 제한 우회)
    const { renderToStaticMarkup } = await import('react-dom/server')
    const html = renderToStaticMarkup(PDFTemplate({ report }))

    // Playwright로 PDF 생성
    const { chromium } = await import('playwright')
    const browser = await chromium.launch({ headless: true })
    const page = await browser.newPage()

    await page.setContent(html, { waitUntil: 'networkidle' })

    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
      printBackground: true,
    })

    await browser.close()

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="creflow-report-${year}.pdf"`,
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'PDF 생성에 실패했습니다' },
      { status: 500 }
    )
  }
}
