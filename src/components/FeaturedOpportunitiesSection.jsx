"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Globe, Briefcase, ArrowRight } from "@gravity-ui/icons";
import { motion } from "motion/react";

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

export default function FeaturedOpportunitiesSection() {
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/api/opportunities?limit=6`);
        if (res.ok) {
          const data = await res.json();
          setOpportunities(data.opportunities || []);
        }
      } catch (err) {
        console.error("Failed to fetch featured opportunities:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const formatSalary = (amount) => {
    if (!amount) return "0";
    const numericAmount = parseInt(amount, 10);
    return numericAmount >= 1000 ? `${numericAmount / 1000}k` : amount;
  };

  const getSalaryRange = (opp) => {
    return opp.minSalary && opp.maxSalary
      ? `$${formatSalary(opp.minSalary)}–$${formatSalary(opp.maxSalary)} / year`
      : "Salary Negotiable";
  };

  return (
    <section className="bg-black py-24 text-white relative">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-2 text-violet-500 font-semibold tracking-wider text-sm mb-4 uppercase">
              <span className="w-8 h-[1px] bg-violet-500/50" />
              Featured Opportunities
              <span className="w-8 h-[1px] bg-violet-500/50" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
              The roles you&apos;d never
              <br />
              find by searching
            </h2>
          </motion.div>
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-16 text-zinc-550 text-sm">
            No active opportunities posted yet. Check back later!
          </div>
        ) : (
          /* Opportunities Grid */
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {opportunities.map((opportunity) => {
              const oppId = opportunity._id?.$oid || opportunity._id;
              return (
                <motion.div
                  variants={item}
                  key={oppId}
                  className="group relative rounded-3xl bg-white/[0.02] border border-white/5 p-8 transition-all hover:bg-white/[0.04] hover:border-white/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors">
                        {opportunity.role_title}
                      </h3>
                      {opportunity.logo && (
                        <img
                          src={opportunity.logo}
                          alt="logo"
                          className="w-8 h-8 rounded-full object-cover bg-white p-0.5"
                        />
                      )}
                    </div>
                    
                    <p className="text-zinc-200 text-xs font-semibold mb-2">
                      at {opportunity.startup_name || "Confidential"}
                    </p>

                    <p className="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-3">
                      {opportunity.description || "No description provided."}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">
                        <Globe className="w-3.5 h-3.5" />
                        {opportunity.location || "Remote"}
                      </span>
                      {opportunity.work_type && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">
                          <Briefcase className="w-3.5 h-3.5" />
                          {opportunity.work_type}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                    <span className="text-sm font-semibold text-white/90">
                      {getSalaryRange(opportunity)}
                    </span>
                    <Link
                      href={`/opportunities/${oppId}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-violet-300 transition-all bg-white/[0.02] border border-white/5 px-4 py-2 rounded-full hover:bg-white/[0.05]"
                    >
                      Apply Now <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {!isLoading && opportunities.length > 0 && (
          <div className="mt-12 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="/opportunities"
                className="inline-flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors bg-white/[0.02] border border-white/5 px-6 py-3 rounded-full hover:bg-white/[0.05]"
              >
                Browse All Opportunities <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
