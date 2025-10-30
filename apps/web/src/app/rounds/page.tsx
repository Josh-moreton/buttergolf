import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function Page() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }
  const RoundsClient = require('../_components/RoundsClient').default
  return <RoundsClient />
}
