import { redirect } from 'next/navigation'

// Vangnet: /admin/* zonder taalprefix doorsturen naar /en/admin/*
export default async function AdminRedirect({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params
  redirect(`/en/admin${slug?.length ? `/${slug.join('/')}` : ''}`)
}
