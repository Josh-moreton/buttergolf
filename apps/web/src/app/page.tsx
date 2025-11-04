import MarketplaceHomeClient from "./_components/MarketplaceHomeClient";
import { getRecentProducts } from "./actions/products";

export const dynamic = "force-dynamic";

export default async function Page() {
  const products = await getRecentProducts(12);

  return <MarketplaceHomeClient products={products} />;
}
