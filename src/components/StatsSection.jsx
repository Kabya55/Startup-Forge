"use client";

import { Briefcase, Factory, Magnifier, Star, Globe, ArrowRight } from "@gravity-ui/icons";
import { motion } from "motion/react";
import Link from "next/link";

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

export default function StatsSection({ initialStats }) {
  const formatNumber = (num) => {
    if (num === null || num === undefined) return "0";
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num.toString();
  };

  const opportunitiesVal = initialStats ? formatNumber(initialStats.totalApplications) : "0";
  const startupsVal = initialStats ? formatNumber(initialStats.totalStartups) : "0";
  const collaboratorsVal = initialStats ? formatNumber(initialStats.totalOpportunities) : "0";

  const stats = [
    {
      id: 1,
      icon: <Briefcase className="h-5 w-5" />,
      value: opportunitiesVal,
      label: "Active Opportunities",
    },
    {
      id: 2,
      icon: <Factory className="h-5 w-5" />,
      value: startupsVal,
      label: "Startups",
    },
    {
      id: 3,
      icon: <Magnifier className="h-5 w-5" />,
      value: collaboratorsVal,
      label: "Total Opportunity",
    },
    {
      id: 4,
      icon: <Star className="h-5 w-5" />,
      value: "97%",
      label: "Satisfaction Rate",
    },
  ];

  return (
    <>
      {/* Main background globe image - covers the entire area */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90 pointer-events-none"
        style={{
          backgroundImage: "url('/images/globe.png')",
        }}
      />

      {/* Hero Content Section (no solid bg-black) */}
      <div className="relative overflow-hidden pt-32 pb-16 text-white sm:pt-40 sm:pb-24">
        {/* Glow Effect */}
        <div className="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/30 blur-[120px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl"
          >
            {/* Top badge */}
            <div className="mb-8 flex justify-center">
              <span className="inline-flex items-center gap-x-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/80">
                <span className="flex h-2 w-2 rounded-full bg-orange-500"></span>
                StartupForge is now available in beta
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-white">
              Find Your Dream Opportunity Today
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              StartupForge provides the tools, opportunity insights and community to help you
              land your perfect career or next opportunity. Join our community
              today.
            </p>

            <div className="mt-8 flex items-center justify-center gap-x-4">
              <Link
                href="/opportunities"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-900 transition-all px-6 py-3 rounded-full hover:scale-105 shadow-lg shadow-violet-600/20"
              >
                Explore Opportunities <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/startups"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-violet-400 transition-colors bg-white/[0.02] border border-white/5 px-6 py-3 rounded-full hover:bg-white/[0.05]"
              >
                Browse Startups <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-10 max-w-3xl"
          >
            <div className="flex flex-col sm:flex-row items-center gap-2 rounded-3xl bg-white/5 p-2 border border-white/10 backdrop-blur-md">
              <div className="flex-1 flex items-center gap-3 px-4 py-2 text-gray-400">
                <Magnifier className="h-5 w-5" />
                <input
                  type="text"
                  placeholder="Opportunity title, keyword, or startup"
                  className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none"
                />
              </div>

              <div className="hidden sm:block h-8 w-[1px] bg-white/10" />

              <div className="flex-1 flex items-center gap-3 px-4 py-2 text-gray-400 border-t border-white/10 sm:border-0 w-full sm:w-auto">
                <Globe className="h-5 w-5" />
                <input
                  type="text"
                  placeholder="Location or remote"
                  className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none"
                />
              </div>

              <button className="flex items-center justify-center rounded-2xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 w-full sm:w-auto">
                <Magnifier className="h-5 w-5" />
              </button>
            </div>
          </motion.div>

          {/* Trending Searches */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <span className="text-sm text-gray-400">Trending Searches:</span>
            {["Remote Opportunity", "Healthcare Opportunity", "IT Opportunity", "Junior Level"].map(
              (term) => (
                <button
                  key={term}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-gray-300 transition hover:bg-white/10"
                >
                  {term}
                </button>
              )
            )}
          </motion.div>
        </div>
      </div>

      {/* Stats Section (no bg-black or overlay color) */}
      <div className="relative overflow-hidden py-28 text-white">
        {/* Glow Effect */}
        <div className="absolute left-1/2 top-[25%] h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-violet-600/30 blur-[140px]" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          {/* Heading - curly braces used to avoid JSX text warnings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="text-2xl font-medium leading-relaxed text-white/90">
              {"Assisting over 15,000 opportunity collaborators"}
              <br />
              {"find their dream positions."}
            </h2>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((stat) => (
              <motion.div
                variants={item}
                key={stat.id}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition duration-300 hover:border-violet-500/30"
              >
                {/* Card Glow */}
                <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-white/10 blur-3xl transition duration-300 group-hover:bg-violet-500/20" />

                {/* Icon */}
                <div className="relative z-10 text-white/90">{stat.icon}</div>

                {/* Number */}
                <h3 className="relative z-10 mt-10 text-5xl font-bold tracking-tight">
                  {stat.value}
                </h3>

                {/* Label */}
                <p className="relative z-10 mt-4 text-base text-gray-300">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}