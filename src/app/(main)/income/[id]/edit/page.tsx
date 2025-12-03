import { IncomeEditView } from '@/features/income/views/IncomeEditView'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function IncomeEditPage({ params }: PageProps) {
  const { id } = await params
  return <IncomeEditView incomeId={id} />
}
