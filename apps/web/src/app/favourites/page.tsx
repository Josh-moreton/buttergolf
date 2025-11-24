import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FavoritesClient } from "./_components/FavoritesClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Favorites | ButterGolf",
  description: "View your saved golf equipment listings",
};

export default async function FavoritesPage() {
  const { userId } = await auth();

  // Require authentication
  if (!userId) {
    redirect("/sign-in?redirect_url=/favorites");
  }

  return <FavoritesClient />;
}
