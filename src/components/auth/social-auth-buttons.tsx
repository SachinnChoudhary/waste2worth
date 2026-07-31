"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleIcon, GitHubIcon } from "@/components/auth/social-icons";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface SocialAuthButtonsProps {
  mode: "login" | "signup";
}

export function SocialAuthButtons({ mode }: SocialAuthButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    setLoadingProvider(provider);
    try {
      const supabase = createClient();
      const origin = typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const redirectTo = `${origin}/auth/callback`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          queryParams: {
            prompt: "select_account",
          },
        },
      });

      if (error) {
        toast.error(error.message || `Failed to sign in with ${provider}`);
        setLoadingProvider(null);
        return;
      }

      // The PKCE flow returns a URL to redirect to
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoadingProvider(null);
    }
  };

  const label = mode === "login" ? "Sign in" : "Sign up";

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="relative h-11 border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow"
          onClick={() => handleOAuthSignIn("google")}
          disabled={loadingProvider !== null}
        >
          {loadingProvider === "google" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <GoogleIcon className="w-5 h-5" />
              <span className="text-sm font-medium text-slate-700">Google</span>
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="relative h-11 border-slate-200 bg-white hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-200 shadow-sm hover:shadow"
          onClick={() => handleOAuthSignIn("github")}
          disabled={loadingProvider !== null}
        >
          {loadingProvider === "github" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <GitHubIcon className="w-5 h-5" />
              <span className="text-sm font-medium">GitHub</span>
            </>
          )}
        </Button>
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-slate-400 font-medium tracking-wider">
            or {label.toLowerCase()} with email
          </span>
        </div>
      </div>
    </div>
  );
}
