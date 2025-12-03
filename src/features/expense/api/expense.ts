import { createClient } from '@/shared/lib/supabase/client'
import type { Expense, ExpenseFormData } from '@/shared/types'

export async function getExpenses(
  userId: string,
  month?: string // YYYY-MM 형식
): Promise<Expense[]> {
  const supabase = createClient()

  let query = supabase
    .from('expenses')
    .select('*, collaborators(*)')
    .eq('user_id', userId)
    .order('date', { ascending: false })

  if (month) {
    const startDate = `${month}-01`
    const endDate = `${month}-31`
    query = query.gte('date', startDate).lte('date', endDate)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function getExpense(id: string): Promise<Expense | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function createExpense(
  userId: string,
  data: ExpenseFormData
): Promise<Expense> {
  const supabase = createClient()

  const { data: expense, error } = await supabase
    .from('expenses')
    .insert({
      user_id: userId,
      type: data.type,
      collaborator_id: data.collaborator_id,
      description: data.description,
      amount: data.amount,
      date: data.date,
      is_paid: data.is_paid ?? false,
      memo: data.memo,
    })
    .select()
    .single()

  if (error) throw error
  return expense
}

export async function updateExpense(
  id: string,
  data: Partial<ExpenseFormData>
): Promise<Expense> {
  const supabase = createClient()

  const { data: expense, error } = await supabase
    .from('expenses')
    .update({
      type: data.type,
      collaborator_id: data.collaborator_id,
      description: data.description,
      amount: data.amount,
      date: data.date,
      is_paid: data.is_paid,
      memo: data.memo,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return expense
}

export async function deleteExpense(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from('expenses').delete().eq('id', id)

  if (error) throw error
}

export async function updateExpenseStatus(
  id: string,
  isPaid: boolean
): Promise<Expense> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('expenses')
    .update({ is_paid: isPaid })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}
