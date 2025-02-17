import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import MapExplorer from "./map-explorer";

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return <MapExplorer />;
}