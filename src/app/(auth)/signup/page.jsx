"use client";

import { useState } from "react";
import {
  Card,
  Button,
  Link,
} from "@heroui/react";
import { Eye, EyeSlash, Person, At, ShieldKeyhole } from "@gravity-ui/icons";
import { signUp, signIn } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignupPage() {
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [role, setRole] = useState("collaborator"); // Default role is "collaborator"

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  // UI States
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleGoogleSignup = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: redirectPath
      });
    } catch (err) {
      setError("Google Signup failed. Please try again.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setIsLoading(true);

    // Password validation rules
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      setIsLoading(false);
      return;
    }
    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter.");
      setIsLoading(false);
      return;
    }

    let imageUrl = "https://i.ibb.co/5GzXkwP/avatar-placeholder.png";

    try {
      // 1. Upload file to ImgBB if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const imgbbApiKey = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API || "faf00257f10ee8655832b6d9a48f02a6";
        const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
          method: "POST",
          body: formData,
        });

        const imgbbData = await imgbbRes.json();
        if (imgbbData?.data?.url) {
          imageUrl = imgbbData.data.url;
        } else {
          setError("Failed to upload image. Please try again.");
          setIsLoading(false);
          return;
        }
      }

      // 2. SignUp via Better Auth
      const packageType = role === "collaborator" ? "collaborator_free" : "founder_free";
      const { data, error: authError } = await signUp.email({
        email,
        password,
        name,
        image: imageUrl,
        role: role || "collaborator",
        package: packageType,
      });

      if (authError) {
        setError(authError.message || "Something went wrong during signup.");
      } else {
        setSuccess("Account created successfully! Welcome.");
        setName("");
        setEmail("");
        setPassword("");
        setImageFile(null);
        router.push(redirectPath);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred during signup.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12">
      <Card className="w-full max-w-md p-6 shadow-xl border border-zinc-800 bg-zinc-900 text-white">
        {/* Header Container */}
        <div className="flex flex-col items-center justify-center gap-1 pb-6 border-b border-zinc-850 mb-6 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Create an account
          </h1>
          <p className="text-sm text-zinc-400">
            Fill in the fields below to join StartupForge
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSignup} className="flex flex-col gap-5">
          {/* Name Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-300">Name</label>
            <div className="flex items-center gap-2 border border-zinc-800 rounded-xl px-3 bg-zinc-950 focus-within:border-violet-500 transition-colors">
              <Person className="text-zinc-500 pointer-events-none" size={16} />
              <input
                required
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent py-2.5 text-sm outline-none border-none text-zinc-100 placeholder-zinc-650"
              />
            </div>
          </div>

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

          {/* Profile Image Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-300">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full border border-zinc-800 rounded-xl px-3 py-2 bg-zinc-950 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-violet-600 file:text-white hover:file:bg-violet-700"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-300">Password</label>
            <div className="flex items-center gap-2 border border-zinc-800 rounded-xl px-3 bg-zinc-950 focus-within:border-violet-500 transition-colors">
              <ShieldKeyhole className="text-zinc-500 pointer-events-none" size={16} />
              <input
                required
                type={isVisible ? "text" : "password"}
                placeholder="Choose a password (min 6 chars, A-Z, a-z)"
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

          {/* Role Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-350">Join as a</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value || "collaborator")}
              className="w-full h-[48px] border border-zinc-850 bg-zinc-950 hover:bg-zinc-900 focus:bg-zinc-950 focus:border-violet-500 text-white rounded-xl px-3.5 text-sm outline-none transition-colors"
            >
              <option value="collaborator">Collaborator</option>
              <option value="founder">Startup Founder</option>
            </select>
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
            Sign Up
          </Button>

          {/* Social Provider */}
          <div className="relative my-2 flex items-center justify-center text-xs uppercase">
            <span className="absolute w-full border-t border-zinc-800" />
            <span className="relative bg-zinc-900 px-2 text-zinc-400">Or continue with</span>
          </div>

          <Button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full font-semibold border border-zinc-800 hover:border-zinc-700 bg-zinc-950 text-white rounded-xl text-sm h-12 transition-colors"
          >
            Sign Up with Google
          </Button>

          {/* Navigation Option */}
          <div className="text-center pt-4 border-t border-zinc-800 mt-2 text-sm text-zinc-400">
            Already have an account?{" "}
            <Link
              href={`/login?redirect=${redirectPath}`}
              className="font-medium cursor-pointer text-sm text-violet-400 hover:text-violet-300"
            >
              Sign in instead
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
