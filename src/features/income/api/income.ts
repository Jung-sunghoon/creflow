import { createClient } from '@/shared/lib/supabase/client'
import type { Income, IncomeFormData, Campaign } from '@/shared/types'

export async function getIncomes(
  userId: string,
  month?: string // YYYY-MM 형식
): Promise<Income[]> {
  const supabase = createClient()

  let query = supabase
    .from('incomes')
    .select('*')
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

export async function getIncome(id: string): Promise<Income | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('incomes')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function getCampaign(id: string): Promise<Campaign | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function createIncome(
  userId: string,
  data: IncomeFormData
): Promise<Income> {
  const supabase = createClient()

  // 광고/협찬인 경우 campaigns 테이블에도 저장
  let campaignId: string | null = null

  if (data.type === 'ad' && data.brand_name) {
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .insert({
        user_id: userId,
        brand_name: data.brand_name,
        amount: data.amount,
        payment_date: data.payment_date,
        is_paid: data.is_paid ?? false,
      })
      .select()
      .single()

    if (campaignError) throw campaignError
    campaignId = campaign.id
  }

  const { data: income, error } = await supabase
    .from('incomes')
    .insert({
      user_id: userId,
      type: data.type,
      source: data.source,
      income_type: data.income_type,
      input_method: data.input_method,
      raw_count: data.raw_count,
      amount: data.amount,
      date: data.date,
      campaign_id: campaignId,
      memo: data.memo,
    })
    .select()
    .single()

  if (error) throw error
  return income
}

export async function updateIncome(
  id: string,
  data: Partial<IncomeFormData>
): Promise<Income> {
  const supabase = createClient()

  const { data: income, error } = await supabase
    .from('incomes')
    .update({
      source: data.source,
      income_type: data.income_type,
      input_method: data.input_method,
      raw_count: data.raw_count,
      amount: data.amount,
      date: data.date,
      memo: data.memo,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return income
}

export async function deleteIncome(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from('incomes').delete().eq('id', id)

  if (error) throw error
}

// 캠페인 (광고/협찬) 관련
export async function getCampaigns(
  userId: string,
  month?: string
): Promise<Campaign[]> {
  const supabase = createClient()

  let query = supabase
    .from('campaigns')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (month) {
    const startDate = `${month}-01`
    const endDate = `${month}-31`
    query = query.gte('payment_date', startDate).lte('payment_date', endDate)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function updateCampaignStatus(
  id: string,
  isPaid: boolean
): Promise<Campaign> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('campaigns')
    .update({ is_paid: isPaid })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateCampaign(
  id: string,
  data: Partial<Campaign>
): Promise<Campaign> {
  const supabase = createClient()

  const { data: campaign, error } = await supabase
    .from('campaigns')
    .update({
      brand_name: data.brand_name,
      amount: data.amount,
      payment_date: data.payment_date,
      is_paid: data.is_paid,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return campaign
}

export async function deleteCampaign(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from('campaigns').delete().eq('id', id)

  if (error) throw error
}
