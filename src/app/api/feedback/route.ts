import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/shared/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || ''

const FEEDBACK_TYPE_LABELS: Record<string, string> = {
  feature: '기능 제안',
  bug: '버그 신고',
  other: '기타 의견',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, content, email } = body

    if (!type || !content) {
      return NextResponse.json(
        { error: '필수 항목을 입력해주세요' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 1. Supabase에 피드백 저장
    const { data: feedback, error: dbError } = await supabase
      .from('feedbacks')
      .insert({
        user_id: user?.id || null,
        type,
        content,
        email,
      })
      .select()
      .single()

    if (dbError) {
      console.error('피드백 저장 실패:', dbError)
      return NextResponse.json(
        { error: '피드백 저장에 실패했어요' },
        { status: 500 }
      )
    }

    // 2. Resend로 이메일 알림 전송
    if (!ADMIN_EMAIL) {
      console.warn('ADMIN_EMAIL 환경변수가 설정되지 않았습니다')
      return NextResponse.json(feedback)
    }

    try {
      await resend.emails.send({
        from: 'CreFlow <onboarding@resend.dev>',
        to: ADMIN_EMAIL,
        subject: `[CreFlow 피드백] ${FEEDBACK_TYPE_LABELS[type] || type}`,
        html: `
          <h2>새로운 피드백이 도착했습니다</h2>
          <p><strong>유형:</strong> ${FEEDBACK_TYPE_LABELS[type] || type}</p>
          <p><strong>내용:</strong></p>
          <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${content}</div>
          ${email ? `<p><strong>답변 이메일:</strong> ${email}</p>` : ''}
          ${user?.email ? `<p><strong>사용자:</strong> ${user.email}</p>` : '<p><strong>사용자:</strong> 비로그인</p>'}
          <hr />
          <p style="color: #666; font-size: 12px;">CreFlow 피드백 알림</p>
        `,
      })
    } catch (emailError) {
      // 이메일 실패해도 피드백은 저장됨
      console.error('이메일 전송 실패:', emailError)
    }

    return NextResponse.json(feedback)
  } catch (error) {
    console.error('피드백 처리 실패:', error)
    return NextResponse.json(
      { error: '처리 중 오류가 발생했어요' },
      { status: 500 }
    )
  }
}
