import { ExpenseEditView } from '@/features/expense/views/ExpenseEditView'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ExpenseEditPage({ params }: PageProps) {
  const { id } = await params
  return <ExpenseEditView expenseId={id} />
}
