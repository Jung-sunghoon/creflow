import type { AnnualReport, PlatformType } from '@/shared/types'
import { PLATFORMS } from '@/shared/lib/constants'

interface PDFTemplateProps {
  report: AnnualReport
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function PDFTemplate({ report }: PDFTemplateProps) {
  const activeMonths = report.monthlySummaries.filter(
    (s) => s.totalIncome > 0 || s.totalExpense > 0
  )

  const incomeEntries = Object.entries(report.incomeBySource)
    .filter(([, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1])

  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <style dangerouslySetInnerHTML={{ __html: `
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            padding: 40px;
            color: #09090B;
            font-size: 14px;
            line-height: 1.5;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #E4E4E7;
          }
          .header h1 {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 8px;
          }
          .header p {
            color: #71717A;
          }
          .section {
            margin-bottom: 32px;
          }
          .section h2 {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 16px;
            color: #18181B;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
          .summary-card {
            background: #FAFAFA;
            border-radius: 8px;
            padding: 16px;
            text-align: center;
          }
          .summary-card .label {
            font-size: 12px;
            color: #71717A;
            margin-bottom: 4px;
          }
          .summary-card .value {
            font-size: 18px;
            font-weight: 700;
          }
          .summary-card .value.income { color: #2563EB; }
          .summary-card .value.expense { color: #DC2626; }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #E4E4E7;
          }
          th {
            font-weight: 600;
            background: #FAFAFA;
            font-size: 12px;
            color: #71717A;
          }
          td {
            font-size: 13px;
          }
          .text-right {
            text-align: right;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #E4E4E7;
            text-align: center;
            font-size: 12px;
            color: #71717A;
          }
        ` }} />
      </head>
      <body>
        <div className="header">
          <h1>CreFlow 연간 리포트</h1>
          <p>{report.year}년 수익/지출 요약</p>
        </div>

        <div className="section">
          <h2>연간 요약</h2>
          <div className="summary-grid">
            <div className="summary-card">
              <div className="label">총 수익</div>
              <div className="value income">{formatCurrency(report.totalIncome)}</div>
            </div>
            <div className="summary-card">
              <div className="label">총 지출</div>
              <div className="value expense">{formatCurrency(report.totalExpense)}</div>
            </div>
            <div className="summary-card">
              <div className="label">순수익</div>
              <div className="value">{formatCurrency(report.netIncome)}</div>
            </div>
          </div>
        </div>

        {incomeEntries.length > 0 && (
          <div className="section">
            <h2>수익 구성</h2>
            <table>
              <thead>
                <tr>
                  <th>출처</th>
                  <th className="text-right">금액</th>
                </tr>
              </thead>
              <tbody>
                {incomeEntries.map(([source, amount]) => (
                  <tr key={source}>
                    <td>
                      {source === 'ad'
                        ? '광고/협찬'
                        : PLATFORMS[source as PlatformType]?.label || source}
                    </td>
                    <td className="text-right">{formatCurrency(amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {report.expenseByCollaborator.length > 0 && (
          <div className="section">
            <h2>협력자별 지출</h2>
            <table>
              <thead>
                <tr>
                  <th>협력자</th>
                  <th className="text-right">금액</th>
                </tr>
              </thead>
              <tbody>
                {report.expenseByCollaborator.map(({ name, amount }) => (
                  <tr key={name}>
                    <td>{name}</td>
                    <td className="text-right">{formatCurrency(amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeMonths.length > 0 && (
          <div className="section">
            <h2>월별 내역</h2>
            <table>
              <thead>
                <tr>
                  <th>월</th>
                  <th className="text-right">수익</th>
                  <th className="text-right">지출</th>
                  <th className="text-right">순수익</th>
                </tr>
              </thead>
              <tbody>
                {activeMonths.map((summary) => {
                  const [, month] = summary.month.split('-')
                  return (
                    <tr key={summary.month}>
                      <td>{parseInt(month, 10)}월</td>
                      <td className="text-right">{formatCurrency(summary.totalIncome)}</td>
                      <td className="text-right">{formatCurrency(summary.totalExpense)}</td>
                      <td className="text-right">{formatCurrency(summary.netIncome)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="footer">
          <p>CreFlow로 생성됨 · {new Date().toLocaleDateString('ko-KR')}</p>
        </div>
      </body>
    </html>
  )
}
