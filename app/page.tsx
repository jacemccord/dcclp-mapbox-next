import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs";

export default async function Home() {
  const { userId } = await auth();

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight">
          Welcome to DCCLP MapApp
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Explore locations with our interactive map application
        </p>
        <div className="mt-8 flex justify-center gap-4">
          {!userId ? (
            <>
              <Button asChild>
                <Link href="/sign-up">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </>
          ) : (
            <Button asChild>
              <Link href="/dashboard">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}