import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { LoginForm } from "@/components/login-form";
import { Skeleton } from "@/components/ui/badge";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AppShell>
      <Suspense
        fallback={
          <div className="mx-auto max-w-4xl px-4 py-12">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-4 h-72 w-full" />
          </div>
        }
      >
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          <h1 className="mb-6 text-center text-3xl font-bold">
            Welcome to FoodBridge
          </h1>
          <LoginForm />
        </div>
      </Suspense>
    </AppShell>
  );
}
