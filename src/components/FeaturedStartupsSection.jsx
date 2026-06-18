"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Factory, Person, ArrowRight, Star } from "@gravity-ui/icons";
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

export default function FeaturedStartupsSection() {
  const [startups, setStartups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/api/startups?status=approved`);
        if (res.ok) {
          const data = await res.json();
          setStartups(data.slice(0, 3) || []);
        }
      } catch (err) {
        console.error("Failed to fetch featured startups:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStartups();
  }, []);

  return (
    <section className="bg-black py-24 text-white relative border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center items-center gap-2 text-violet-500 font-semibold tracking-wider text-sm mb-4 uppercase">
              <span className="w-8 h-[1px] bg-violet-500/50" />
              Startups Section
              <span className="w-8 h-[1px] bg-violet-500/50" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Featured Startups
            </h2>
            <p className="mx-auto text-zinc-400 mt-3 max-w-xl text-sm md:text-base">
              Visionary companies built by leading innovators, looking for elite co-founders and key team members.
            </p>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : startups.length === 0 ? (
          <div className="text-center py-16 text-zinc-550 text-sm border border-dashed border-zinc-800 rounded-3xl">
            No registered startups found. Check back later!
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid gap-6 md:grid-cols-3"
          >
            {startups.map((startup) => {
              const startupId = startup._id?.$oid || startup._id;
              return (
                <motion.div
                  variants={item}
                  key={startupId}
                  className="group relative rounded-3xl bg-white/[0.02] border border-white/5 p-8 transition-all hover:bg-white/[0.04] hover:border-white/10 flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Logo & Title */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        {startup.logo ? (
                          <img
                            src={startup.logo}
                            alt={`${startup.startup_name} Logo`}
                            className="w-12 h-12 rounded-2xl object-cover bg-white p-1 border border-zinc-800"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-400">
                            SF
                          </div>
                        )}
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors">
                            {startup.startup_name}
                          </h3>
                          <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold uppercase tracking-wider text-violet-500 bg-violet-500/10 px-2 py-0.5 rounded-full">
                            {startup.funding_stage || "Early Stage"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-zinc-400 text-sm mb-6 leading-relaxed line-clamp-3">
                      {startup.description || "No description provided by this startup."}
                    </p>

                    {/* Metadata Information */}
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

                  {/* Actions */}
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
        {!isLoading && startups.length > 0 && (
          <div className="mt-12 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="/startups"
                className="inline-flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors bg-white/[0.02] border border-white/5 px-6 py-3 rounded-full hover:bg-white/[0.05]"
              >
                Browse All Startups <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        )}

      </div>
    </section>
  );
}