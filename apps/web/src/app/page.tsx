export default function Page() {
  // Render client boundary that imports @buttergolf/app on the client only
  const HomeClient = require('./_components/HomeClient').default
  return <HomeClient />
}
