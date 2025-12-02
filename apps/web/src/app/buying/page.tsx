import { redirect } from "next/navigation";

/**
 * Buying Page
 *
 * Redirects to the listings/marketplace page.
 * This route exists to match the header navigation design.
 */
export default function BuyingPage() {
  redirect("/listings");
}
