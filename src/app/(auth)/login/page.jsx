"use client";

import { useState } from "react";
import { Card, Button, Link } from "@heroui/react";
import { Eye, EyeSlash, At, ShieldKeyhole } from "@gravity-ui/icons";
import { signIn } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  // UI States
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSignin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const { data, error: authError } = await signIn.email({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || "Invalid email or password.");
      } else {
        setSuccess("Signed in successfully! Redirecting...");
        setEmail("");
        setPassword("");

        router.push(redirectPath);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: redirectPath
      });
    } catch (err) {
      setError("Google Login failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <Card className="w-full max-w-md p-6 shadow-xl border border-zinc-800 bg-zinc-900 text-white">
        {/* Header Container */}
        <div className="flex flex-col items-center justify-center gap-1 pb-6 border-b border-zinc-800 mb-6 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Welcome back
          </h1>
          <p className="text-sm text-zinc-400">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSignin} className="flex flex-col gap-5">
          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-300">Email Address</label>
            <div className="flex items-center gap-2 border border-zinc-800 rounded-xl px-3 bg-zinc-950 focus-within:border-violet-500 transition-colors">
              <At className="text-zinc-500 pointer-events-none" size={16} />
              <input
                required
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent py-2.5 text-sm outline-none border-none text-zinc-100 placeholder-zinc-650"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-300">Password</label>
            <div className="flex items-center gap-2 border border-zinc-800 rounded-xl px-3 bg-zinc-950 focus-within:border-violet-500 transition-colors">
              <ShieldKeyhole className="text-zinc-500 pointer-events-none" size={16} />
              <input
                required
                type={isVisible ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent py-2.5 text-sm outline-none border-none text-zinc-100 placeholder-zinc-650"
              />
              <button
                className="focus:outline-none text-zinc-500 hover:text-zinc-300 transition"
                type="button"
                onClick={toggleVisibility}
                aria-label="toggle password visibility"
              >
                {isVisible ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Dynamic Status Badges */}
          {error && (
            <div className="p-3 text-xs font-medium rounded-xl bg-red-950/50 text-red-400 border border-red-900">
              <span className="font-semibold">Error:</span> {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-xs font-medium rounded-xl bg-emerald-950/50 text-emerald-400 border border-emerald-900">
              <span className="font-semibold">Success:</span> {success}
            </div>
          )}

          {/* Action Button */}
          <Button
            type="submit"
            className="w-full font-bold bg-violet-600 hover:bg-violet-750 text-white rounded-xl text-sm h-12 transition-colors"
            isLoading={isLoading}
            isDisabled={isLoading}
          >
            Sign In
          </Button>

          {/* Social Provider */}
          <div className="relative my-2 flex items-center justify-center text-xs uppercase">
            <span className="absolute w-full border-t border-zinc-800" />
            <span className="relative bg-zinc-900 px-2 text-zinc-400">Or continue with</span>
          </div>

          <Button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full font-semibold border border-zinc-800 hover:border-zinc-700 bg-zinc-950 text-white rounded-xl text-sm h-12 transition-colors"
          >
            Sign In with Google
          </Button>

          {/* Navigation Option */}
          <div className="text-center pt-4 border-t border-zinc-800 mt-2 text-sm text-zinc-400">
            New to StartupForge?{" "}
            <Link
              href={`/signup?redirect=${redirectPath}`}
              className="font-medium cursor-pointer text-sm text-violet-400 hover:text-violet-300"
            >
              Create an account
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
