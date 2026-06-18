"use client";

import { useState } from "react";
import { Check } from "@gravity-ui/icons";
import { motion } from "motion/react";

const packages = [
  {
    name: "Starter",
    price: "0",
    description: "Start tracking your next role today.",
    features: [
      "Target resume to 5 opportunities/mo",
      "AI match score for 10",
      "Connect with founders/mo",
      "Priority application pass",
    ],
    buttonText: "Choose this package",
    popular: false,
  },
  {
    name: "Growth",
    price: "17",
    description: "Start tracking your next role today.",
    features: [
      "Target resume to 5 opportunities/mo",
      "AI match score for 10",
      "Connect with founders/mo",
      "Priority application pass",
    ],
    buttonText: "Choose this package",
    popular: true,
  },
  {
    name: "Premium",
    price: "99",
    description: "Start tracking your next role today.",
    features: [
      "Target resume to 5 opportunities/mo",
      "AI match score for 10",
      "Connect with founders/mo",
      "Priority application pass",
    ],
    buttonText: "Choose this package",
    popular: false,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="bg-black py-24 text-white relative border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-2 text-violet-500 font-semibold tracking-wider text-sm mb-4 uppercase">
              <span className="w-8 h-[1px] bg-violet-500/50" />
              Pricing
              <span className="w-8 h-[1px] bg-violet-500/50" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-8">
              Pay for the leverage,
              <br />
              not the listings
            </h2>
          </motion.div>

          {/* Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 p-1"
          >
            <button
              onClick={() => setIsYearly(false)}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${!isYearly ? "bg-white text-black" : "text-gray-400 hover:text-white"
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${isYearly ? "bg-white text-black" : "text-gray-400 hover:text-white"
                }`}
            >
              Yearly
              <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${isYearly ? "bg-violet-100 text-violet-700" : "bg-violet-500/20 text-violet-400"}`}>
                Save
              </span>
            </button>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto pt-6"
        >
          {packages.map((pkg, index) => (
            <motion.div
              variants={item}
              key={index}
              whileHover={{ y: -12, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative rounded-3xl p-[1px] bg-white/10"
            >

              <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-0">
                <div
                  className={`absolute inset-0 w-[200%] h-[200%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_20%,#8b5cf6_40%,transparent_60%,#ec4899_80%,transparent_100%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${pkg.popular ? "opacity-100 animate-spin-border" : "group-hover:animate-spin-border"
                    }`}
                />
              </div>


              {pkg.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 whitespace-nowrap">
                  <span className="bg-violet-500 text-white text-xs font-extrabold uppercase tracking-widest py-1.5 px-5 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.8)]">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Card inner body content  */}
              <div className="relative w-full h-full rounded-[23px] p-8 bg-[#0b0b0c] flex flex-col justify-between z-10">
                <div>
                  <div className="flex items-center gap-2 mb-4 text-violet-400 mt-2">
                    <span className="w-2 h-2 rounded-full bg-violet-500" />
                    <h3 className="font-bold text-lg tracking-wide">{pkg.name}</h3>
                  </div>

                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold text-white">${pkg.price}</span>
                    <span className="text-gray-400 text-sm">/month</span>
                  </div>

                  <p className="text-sm text-gray-400 mb-8 h-10">
                    {pkg.description}
                  </p>

                  <ul className="space-y-4 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                        <Check className="w-5 h-5 text-violet-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  className={`w-full rounded-xl py-3.5 text-sm font-semibold transition-all duration-300 ${pkg.popular
                    ? "bg-white text-black hover:bg-gray-100 shadow-lg shadow-white/10"
                    : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                >
                  {pkg.buttonText}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}