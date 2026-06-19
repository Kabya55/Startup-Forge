"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Factory, Person, ArrowRight, Star, Magnifier, ChevronDown } from "@gravity-ui/icons";
import { motion } from "motion/react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function BrowseStartupsPage() {
  const [startups, setStartups] = useState([]);
  const [filteredStartups, setFilteredStartups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/api/startups?status=approved`);
        if (res.ok) {
          const data = await res.json();
          setStartups(data || []);
          setFilteredStartups(data || []);
        }
      } catch (err) {
        console.error("Failed to fetch startups:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStartups();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = startups;

    // Search Query Filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.startup_name.toLowerCase().includes(query) ||
          s.industry.toLowerCase().includes(query)
      );
    }

    // Industry Filter
    if (selectedIndustry !== "all") {
      result = result.filter(
        (s) => s.industry.toLowerCase() === selectedIndustry.toLowerCase()
      );
    }

    setFilteredStartups(result);
  }, [searchQuery, selectedIndustry, startups]);

  const industries = ["all", "Software", "Fintech", "Healthcare", "AI/ML", "E-Commerce", "Education", "Design", "Marketing", "Sales"];

  return (
    <div className="w-full min-h-screen bg-zinc-950 p-6 md:p-12 text-white">
      {/* Title Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Visionary Startups</h1>
        <p className="text-zinc-400 mt-2">
          Discover high-growth startups building the future.
        </p>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900/50 p-6 rounded-[24px] border border-zinc-800/80">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-550">
            <Magnifier className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by name or industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700/80 text-white placeholder-zinc-500 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-purple-500 transition-all"
          />
        </div>

        {/* Industry Filter Dropdown */}
        <div className="relative w-full md:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-450">
            <Factory className="w-4 h-4" />
          </span>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700/80 text-white rounded-xl py-2.5 pl-10 pr-10 text-sm outline-none focus:border-purple-500 transition-all appearance-none cursor-pointer"
          >
            {industries.map((ind) => (
              <option key={ind} value={ind} className="bg-zinc-900 text-white">
                {ind === "all" ? "All Industries" : ind}
              </option>
            ))}
          </select>
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-zinc-400">
            <ChevronDown className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* List / Grid of Startups */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredStartups.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-[32px] max-w-7xl mx-auto">
          <p className="text-zinc-500 text-lg">No startups match your filters.</p>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mb-10"
        >
          {filteredStartups.map((startup) => {
            const startupId = startup._id?.$oid || startup._id;
            return (
              <motion.div
                variants={item}
                key={startupId}
                className="group relative w-full rounded-3xl bg-white/[0.02] border border-white/5 p-8 transition-all hover:bg-white/[0.04] hover:border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      {startup.logo ? (
                        <img
                          src={startup.logo}
                          alt={`${startup.startup_name} Logo`}
                          className="w-12 h-12 rounded-2xl object-cover bg-white p-1 border border-zinc-800"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-450 font-sans">
                          SF
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors">
                          {startup.startup_name}
                        </h3>
                        <span className="inline-flex items-center mt-1 text-[10px] font-bold uppercase tracking-wider text-violet-500 bg-violet-500/10 px-2 py-0.5 rounded-full">
                          {startup.funding_stage || "Early Stage"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-zinc-400 text-sm mb-6 leading-relaxed line-clamp-3">
                    {startup.description || "No description provided."}
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                      <Person className="w-4 h-4 text-violet-400 shrink-0" />
                      <span>Founder: <span className="font-semibold text-zinc-100">{startup.founder_name}</span></span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                      <Factory className="w-4 h-4 text-violet-400 shrink-0" />
                      <span>Industry: <span className="font-semibold text-zinc-100 capitalize">{startup.industry}</span></span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                      <Star className="w-4 h-4 text-violet-400 shrink-0" />
                      <span>Team Size Needed: <span className="font-semibold text-zinc-100">{startup.opportunityCount || 0} position(s)</span></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <Link
                    href={`/startups/${startupId}`}
                    className="flex w-full justify-between items-center text-sm font-semibold text-violet-400 hover:text-violet-300 transition-all bg-white/[0.02] border border-white/5 px-4 py-2 rounded-full hover:bg-white/[0.05]"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
