import { CampaignEditView } from '@/features/income/views/CampaignEditView'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CampaignEditPage({ params }: PageProps) {
  const { id } = await params
  return <CampaignEditView campaignId={id} />
}
