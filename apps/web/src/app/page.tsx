export const dynamic = 'force-dynamic'

export default function Page() {
  // Render client boundary that imports @buttergolf/app on the client only
  const MarketplaceHomeClient = require('./_components/MarketplaceHomeClient').default
  return <MarketplaceHomeClient />
}
