"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap, Loader2, Users } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { signupSchema, type SignupFormValues } from "@/lib/validations/auth";

function SignupFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";
  const defaultRole = searchParams.get("role") === "tutor" ? "tutor" : "student";
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: defaultRole },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: SignupFormValues) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          role: data.role,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(data.role === "tutor" ? "/tutor" : redirect)}`,
      },
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Account created!", {
      description: "Check your email to verify your account, then sign in.",
    });

    router.push(data.role === "tutor" ? "/tutor" : redirect);
    router.refresh();
  };

  const signUpWithGoogle = async () => {
    setIsGoogleLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Join Learnly as a student or tutor. It&apos;s free to get started.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        {(
          [
            { value: "student", label: "Student", icon: Users },
            { value: "tutor", label: "Tutor", icon: GraduationCap },
          ] as const
        ).map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setValue("role", value)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors",
              selectedRole === value
                ? "border-primary bg-primary/5 text-primary"
                : "border-input hover:bg-muted",
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register("role")} />

        <div>
          <Label htmlFor="full_name">Full Name</Label>
          <Input id="full_name" autoComplete="name" className="mt-1.5" {...register("full_name")} />
          {errors.full_name && (
            <p className="text-destructive mt-1 text-xs">{errors.full_name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" className="mt-1.5" {...register("email")} />
          {errors.email && <p className="text-destructive mt-1 text-xs">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            className="mt-1.5"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-destructive mt-1 text-xs">{errors.password.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="confirm_password">Confirm Password</Label>
          <Input
            id="confirm_password"
            type="password"
            autoComplete="new-password"
            className="mt-1.5"
            {...register("confirm_password")}
          />
          {errors.confirm_password && (
            <p className="text-destructive mt-1 text-xs">{errors.confirm_password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">Or continue with</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={signUpWithGoogle}
        disabled={isGoogleLoading}
      >
        {isGoogleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Google"}
      </Button>

      <p className="text-muted-foreground mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export function SignupForm() {
  return (
    <Suspense fallback={<div className="bg-muted mx-auto h-96 max-w-md animate-pulse rounded-2xl" />}>
      <SignupFormInner />
    </Suspense>
  );
}
