import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FavouritesClient } from "./_components/FavouritesClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Favourites | ButterGolf",
  description: "View your saved golf equipment listings",
};

export default async function FavouritesPage() {
  const { userId } = await auth();

  // Require authentication
  if (!userId) {
    redirect("/sign-in?redirect_url=/favourites");
  }

  return <FavouritesClient />;
}
