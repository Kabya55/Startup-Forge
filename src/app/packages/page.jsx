"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button, Modal } from "@heroui/react";
import {
  Check,
  CircleQuestion,
  ChevronDown,
  Person,
  Briefcase,
  Rocket,
  Star,
} from "@gravity-ui/icons";

const PricingPage = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [billingTarget, setBillingTarget] = useState("collaborator")
  const [openFaq, setOpenFaq] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState("");

  // Sync tab with user's role on load
  useEffect(() => {
    if (user?.role) {
      setBillingTarget(user.role);
    }
  }, [user]);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleCheckout = async (packageId) => {
    setError("");
    if (!user) {
      router.push(`/login?redirect=/packages`);
      return;
    }

    // 1. If the user is a founder, they cannot purchase collaborator packages.
    if (user.role === "founder" && packageId.includes("collaborator")) {
      setError("Founders cannot purchase collaborator packages.");
      return;
    }

    // 2. If the user is a collaborator, they cannot purchase founder packages.
    if (user.role === "collaborator" && packageId.includes("founder")) {
      setError("Collaborators cannot purchase founder packages.");
      return;
    }

    // 3. If the user's role is neither founder nor collaborator
    if (user.role !== "founder" && user.role !== "collaborator") {
      setError("You do not have permission to purchase packages.");
      return;
    }

    // Call checkout session API on the backend
    try {
      setLoadingId(packageId);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(
        `${apiUrl}/api/payments/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ packageId, email: user.email }),
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Failed to initiate payment session.",
        );
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Stripe session URL not returned.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred while initiating checkout.");
    } finally {
      setLoadingId(null);
    }
  };

  const collaboratorPackages = [
    {
      name: "Free",
      id: "collaborator_free",
      price: "$0",
      period: "/forever",
      description:
        "Essential features for getting started and organizing your initial search tracking.",
      icon: <Person className="w-5 h-5 text-zinc-400" />,
      features: [
        "Apply to up to 3 opportunities per month",
        "Basic profile page",
        "Standard email alerts",
      ],
      cta: "Get Started",
      popular: false,
      isFree: true,
    },
    {
      name: "Pro",
      id: "collaborator_pro",
      price: "$19.99",
      period: "/month",
      description:
        "Our most popular option for serious active candidates looking to rapidly accelerate landing a role.",
      icon: <Star className="w-5 h-5 text-blue-400" />,
      features: [
        "Apply to up to 30 opportunities per month",
        "Unlimited saved opportunities",
        "Advanced application tracking dashboard",
        "Comprehensive salary insights",
      ],
      cta: "Upgrade to Pro",
      popular: true,
      isPremium: true,
    },
    {
      name: "Premium",
      id: "collaborator_premium",
      price: "$39.99",
      period: "/month",
      description:
        "Uncapped potential and priority visibility tools tailored for elite competitive talent placement.",
      icon: <Star className="w-5 h-5 text-purple-400" />,
      features: [
        "Everything in Pro + Unlimited applications",
        "Profile boost directly to founder feeds",
        "Early access to freshly published opportunities",
        "24/7 Priority customer support queue",
      ],
      cta: "Go Premium",
      popular: false,
      isPremium: true,
    },
  ];

  const founderPackages = [
    {
      name: "Free",
      id: "founder_free",
      price: "$0",
      period: "/forever",
      description:
        "Ideal baseline solution matching startups launching their initial hiring infrastructure pipeline.",
      icon: <Briefcase className="w-5 h-5 text-zinc-400" />,
      features: [
        "Up to 3 active opportunity posts simultaneously",
        "Basic applicant management pipeline",
        "Standard organic listing search visibility",
        "Great for a startup’s first year of hiring",
      ],
      cta: "Start Free Posting",
      popular: false,
      isFree: true,
    },
    {
      name: "Growth",
      id: "founder_growth",
      price: "$49",
      period: "/month",
      description:
        "Expanded allocation built for expanding startups with active multi-departmental team tracks.",
      icon: <Rocket className="w-5 h-5 text-blue-400" />,
      features: [
        "Up to 30 active opportunity posts simultaneously",
        "Full automated applicant tracking workflow",
        "Advanced listing performance metrics & analytics",
        "Dedicated email support desk response",
      ],
      cta: "Scale Your Hiring (Buy Premium)",
      popular: true,
      isPremium: true,
    },
    {
      name: "Enterprise",
      id: "founder_enterprise",
      price: "$149",
      period: "/month",
      description:
        "High performance structural operations for organizations with continuous large-scale talent acquisition.",
      icon: <Star className="w-5 h-5 text-purple-400" />,
      features: [
        "Unlimited active opportunity posts simultaneously",
        "Advanced interactive analytics visual dashboard",
        "Premium featured opportunity listing styling boosts",
        "Dedicated account manager + priority support",
      ],
      cta: "Upgrade to Enterprise",
      popular: false,
      isPremium: true,
    },
  ];

  const faqs = [
    {
      question: "Can I cancel my payment at any time?",
      answer:
        "Yes, absolutely. All our premium tiers operate on flexible, non-binding month-to-month payment structures. You can easily modify, downgrade, or cancel your renewal configurations through your profile billing dashboard settings at any time with no penalties.",
    },
    {
      question: "How do refunds work if I change my mind?",
      answer:
        "We maintain a 14-day satisfaction policy. If you determine the premium features aren’t a proper fit for your current search or hiring sequence within your initial two weeks of service, reach out to support for a complete refund.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We support all major international credit/debit networks including Visa, Mastercard, American Express, and Discover. Enterprise-grade founders also have options to establish monthly or annual invoicing arrangements via bank wire transfers.",
    },
    {
      question: "What happens if I decide to switch packages mid-month?",
      answer:
        "If you upgrade your package tier mid-cycle, the transition occurs immediately, and your remaining days on the old tier are applied as a pro-rated credit toward your updated invoice. Downgrades take effect starting with your subsequent billing date.",
    },
  ];

  const activePackages =
    billingTarget === "collaborator" ? collaboratorPackages : founderPackages;

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-zinc-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Title Typography */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-violet-500">
            Transparent Pricing
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 mt-2 tracking-tight">
            Flexible packages tailored to your goals
          </h1>
          <p className="text-zinc-400 mt-3 text-sm sm:text-base leading-relaxed">
            Whether you are an ambitious opportunity collaborator hunting for
            your next milestone or an expanding operation tracking down pristine
            talent, we have got you covered.
          </p>
        </div>

        {/* Switch Segment Control Toggle Grid Wrapper */}
        <div className="flex justify-center mb-8">
          <div className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-1 shadow-inner">
            <button
              onClick={() => {
                setBillingTarget("collaborator");
                setError("");
              }}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${billingTarget === "collaborator"
                ? "bg-zinc-800 text-white shadow-md border border-zinc-700/50"
                : "text-zinc-400 hover:text-zinc-200"
                }`}
            >
              <Person className="w-4 h-4" />
              For Opportunity Collaborators
            </button>
            <button
              onClick={() => {
                setBillingTarget("founder");
                setError("");
              }}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${billingTarget === "founder"
                ? "bg-zinc-800 text-white shadow-md border border-zinc-700/50"
                : "text-zinc-400 hover:text-zinc-200"
                }`}
            >
              <Briefcase className="w-4 h-4" />
              For Founders
            </button>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-950/50 border border-red-900 text-red-400 rounded-xl text-center text-xs font-semibold">
            {error}
          </div>
        )}

        {/* 3-Tier Pricing Cards Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-24">
          {activePackages.map((pkg, idx) => (
            <div
              key={idx}
              className={`relative bg-zinc-900 border rounded-2xl p-6 shadow-xl flex flex-col justify-between min-h-[480px] transition-all duration-300 hover:-translate-y-1 ${pkg.popular
                ? "border-violet-500/80 ring-2 ring-violet-500/10"
                : "border-zinc-800 hover:border-zinc-700"
                }`}
            >
              {/* Popular Highlight Pill */}
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] font-bold text-white bg-violet-600 rounded-full uppercase tracking-wider shadow-md">
                  Most Popular
                </span>
              )}

              {/* Package Name & Core Header Metadata */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="text-xl font-bold text-zinc-100">
                    {pkg.name}
                  </h3>
                  <div className="p-2 bg-zinc-950/60 rounded-lg border border-zinc-800/80">
                    {pkg.icon}
                  </div>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed min-h-[36px]">
                  {pkg.description}
                </p>

                {/* Dynamic Price Indicator Text Block */}
                <div className="my-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-zinc-50 tracking-tight">
                    {pkg.price}
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">
                    {pkg.period}
                  </span>
                </div>

                <hr className="border-zinc-800/80 mb-6" />

                {/* Interactive Checkbox Checklist Array Mapping */}
                <ul className="space-y-3">
                  {pkg.features.map((feature, fIdx) => (
                    <li
                      key={fIdx}
                      className="flex items-start gap-2.5 text-xs text-zinc-300"
                    >
                      <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="leading-normal">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Package Action CTA Callout */}
              <div className="mt-8">
                {pkg.isFree ? (
                  <Button
                    onClick={() => {
                      if (!user) {
                        router.push("/login?redirect=/packages");
                        return;
                      }
                      const userPlan = user.package || `${user.role}_free`;
                      if (userPlan === pkg.id) {
                        setIsModalOpen(true);
                      } else {
                        router.push(user.role === "founder" ? "/dashboard/founder" : "/dashboard/collaborator");
                      }
                    }}
                    className="w-full text-center text-xs font-semibold px-4 py-3 rounded-xl border border-zinc-700/50 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition duration-200"
                  >
                    {pkg.cta}
                  </Button>
                ) : pkg.isPremium ? (
                  <Button
                    isLoading={loadingId === pkg.id}
                    isDisabled={loadingId !== null}
                    onClick={() => handleCheckout(pkg.id)}
                    className={`w-full text-center text-xs font-semibold px-4 py-3 rounded-xl transition duration-200 ${pkg.popular
                      ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/20"
                      : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/50"
                      }`}
                  >
                    {loadingId === pkg.id ? "Redirecting..." : pkg.cta}
                  </Button>
                ) : (
                  <Button
                    isDisabled
                    className="w-full text-center text-xs font-semibold px-4 py-3 rounded-xl bg-zinc-800 text-zinc-500 border border-zinc-850 cursor-not-allowed"
                  >
                    {pkg.cta}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Accordion Section Layout Wrapper */}
        <div className="max-w-3xl mx-auto border-t border-zinc-800 pt-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 mb-3">
              <CircleQuestion className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Have concerns regarding billing pipelines? Find instant clarify
              indicators below.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden transition-colors duration-200"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between text-left p-4 gap-4 text-zinc-200 hover:text-white transition"
                  >
                    <span className="text-sm font-semibold">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-violet-400" : ""
                        }`}
                    />
                  </button>

                  {/* Collapsible Accordion Element View Body */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen
                      ? "max-h-40 border-t border-zinc-800/60"
                      : "max-h-0"
                      }`}
                  >
                    <div className="p-4 text-xs text-zinc-400 leading-relaxed bg-zinc-900/50">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-[360px]">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>Plan Active</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <p>
                  You are already on this Free plan.
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button className="w-full bg-[#8338ec] text-white hover:bg-[#702bcf]" slot="close">
                  Close
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
};

export default PricingPage;
