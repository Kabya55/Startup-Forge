"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@heroui/react";
// Gravity UI Icons for a high-quality production finish
import { CircleCheckFill, Envelope, ArrowLeft } from "@gravity-ui/icons";
import { authClient, useSession } from "@/lib/auth-client";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const session_id = searchParams.get("session_id");
  const confirmedRef = useRef(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentData, setPaymentData] = useState(null);

  const { data: session } = useSession();
  const user = session?.user;
  const isCollaborator = user?.role === "collaborator";
  const dashboardLink = isCollaborator ? "/dashboard/collaborator" : "/dashboard/founder";
  const dashboardText = isCollaborator ? "Go to Collaborator Dashboard" : "Go to Founder Dashboard";

  useEffect(() => {
    if (!session_id) {
      setError("Missing Stripe Session ID in URL parameters.");
      setIsLoading(false);
      return;
    }

    // Prevent double confirmation call on React StrictMode double mount
    if (confirmedRef.current) return;
    confirmedRef.current = true;

    const confirmPayment = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/api/payments/confirm`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ session_id }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to confirm payment with backend.");
        }

        const data = await res.json();
        setPaymentData(data.payment);

        // Force-refresh Better Auth session to sync the new premium package status
        await authClient.getSession();
        
      } catch (err) {
        console.error("Payment confirmation error:", err);
        setError(err.message || "An unexpected error occurred during confirmation.");
      } finally {
        setIsLoading(false);
      }
    };

    confirmPayment();
  }, [session_id]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-zinc-950 text-zinc-50 flex flex-col justify-center items-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-400 text-sm font-semibold tracking-wide animate-pulse">
            Verifying payment, please do not close this window...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-zinc-950 text-zinc-50 flex flex-col justify-center items-center p-6">
        <div className="max-w-md w-full bg-zinc-900 border border-red-900/50 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-50 tracking-tight mb-2">
            Verification Failed
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            {error}
          </p>
          <div className="space-y-3">
            <Link
              href="/packages"
              className="block w-full text-center text-xs font-semibold px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl border border-zinc-700/50 transition duration-200"
            >
              Return to Pricing Packages
            </Link>
            <Link
              href={dashboardLink}
              className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-350 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {dashboardText}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-zinc-50 flex flex-col justify-center items-center p-6 select-none relative">
      {/* Decorative ambient glow blur background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <section
        id="success"
        className="relative max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl text-center overflow-hidden"
      >
        {/* Animated Green Checkmark Badge Container */}
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-[0_0_24px_rgba(16,185,129,0.1)] animate-bounce">
          <CircleCheckFill className="w-8 h-8 text-emerald-500" />
        </div>

        {/* Core Status Message */}
        <h1 className="text-2xl font-extrabold text-zinc-50 tracking-tight mb-2">
          Payment Successful!
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed mb-6">
          We appreciate your business! Your account features have been
          provisioned and your package is now active.
        </p>

        {/* Receipt Info Box Card */}
        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-4 text-left space-y-3.5 text-xs mb-8">
          <div className="flex items-start gap-2.5">
            <Envelope className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
            <div>
              <span className="block font-semibold text-zinc-400 mb-0.5">
                Billing Account
              </span>
              <span className="text-zinc-200 break-all">{paymentData?.user_email || "Founder Account"}</span>
            </div>
          </div>

          {paymentData?.transaction_id && (
            <div className="border-t border-zinc-800/60 pt-3 flex flex-col gap-0.5">
              <span className="font-semibold text-zinc-400">Transaction ID</span>
              <span className="text-zinc-300 font-mono text-[10px] break-all">{paymentData.transaction_id}</span>
            </div>
          )}

          <div className="border-t border-zinc-800/60 pt-3 flex flex-col gap-1 text-zinc-500">
            <span>
              Have billing questions or need custom configuration support?
            </span>
            <a
              href="mailto:support@startupforge.com"
              className="text-violet-400 hover:text-violet-350 font-medium inline-flex items-center transition"
            >
              support@startupforge.com
            </a>
          </div>
        </div>

        {/* Interactive Navigation Calls to Action */}
        <div className="space-y-3">
          <Link
            href={dashboardLink}
            className="block w-full text-center text-xs font-semibold px-4 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl shadow-lg shadow-violet-950/30 transition duration-200"
          >
            {dashboardText}
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-zinc-450 hover:text-zinc-200 py-1 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Homepage
          </Link>
        </div>
      </section>
    </div>
  );
}
