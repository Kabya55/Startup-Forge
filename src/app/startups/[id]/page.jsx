import React from "react";
import Link from "next/link";
import { Factory, Person, Star, Globe, Briefcase, Calendar, ArrowRight } from "@gravity-ui/icons";
import { getStartupById } from "@/lib/api/startups";
import { getOpportunities } from "@/lib/api/opportunities";
import Image from "next/image";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const startup = await getStartupById(id);

  if (!startup) {
    return {
      title: "Startup Not Found",
      description: "This startup page could not be found or is no longer active.",
    };
  }

  return {
    title: `${startup.startup_name} - Startup Profile`,
    description: startup.description || `Learn more about ${startup.startup_name} on StartupForge.`,
  };
}

export default async function StartupDetailsPage({ params }) {
  const { id } = await params;
  const startup = await getStartupById(id);

  if (!startup) {
    return (
      <div className="w-full min-h-screen bg-zinc-950 flex flex-col justify-center items-center text-white p-6">
        <p className="text-zinc-400 text-lg">Startup not found or is no longer active.</p>
      </div>
    );
  }

  // Fetch opportunities for this startup
  let opportunities = [];
  try {
    const data = await getOpportunities(`startup_id=${id}&limit=10`);
    opportunities = data.opportunities || [];
  } catch (err) {
    console.error("Failed to fetch startup opportunities:", err);
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="w-full min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 lg:p-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left Column: Startup details (spans 2) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-800">
            <div className="flex items-center gap-5">
              {startup.logo ? (
                <div className="w-20 h-20 rounded-2xl bg-white border border-zinc-800 p-2 flex items-center justify-center overflow-hidden shrink-0">
                  <Image
                    src={startup.logo}
                    alt={`${startup.startup_name} Logo`}
                    width={64}
                    height={64}
                    unoptimized
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl font-bold text-zinc-450 shrink-0">
                  SF
                </div>
              )}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                  {startup.startup_name}
                </h1>
                <p className="text-sm text-violet-400 capitalize font-medium mt-1">
                  {startup.industry} Startup
                </p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <section className="space-y-3">
            <h3 className="text-xl font-semibold text-white">About the Startup</h3>
            <p className="text-zinc-300 text-base leading-relaxed whitespace-pre-line">
              {startup.description || "No description provided."}
            </p>
          </section>

          {/* Open Positions Section */}
          <section className="space-y-6 pt-6">
            <h3 className="text-xl font-semibold text-white">Open Positions</h3>
            {opportunities.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-zinc-800 rounded-2xl">
                <p className="text-zinc-500 text-sm">No open positions posted at the moment.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {opportunities.map((opp) => {
                  const oppId = opp._id?.$oid || opp._id;
                  return (
                    <div
                      key={oppId}
                      className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl hover:border-zinc-700 hover:bg-zinc-900/60 transition"
                    >
                      <div>
                        <h4 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors">
                          {opp.role_title}
                        </h4>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-zinc-400">
                          <span className="capitalize">{opp.work_type}</span>
                          <span>•</span>
                          <span className="capitalize">{opp.commitment_level}</span>
                          <span>•</span>
                          <span>Deadline: {formatDate(opp.deadline)}</span>
                        </div>
                      </div>
                      <Link
                        href={`/opportunities/${oppId}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-all bg-white/[0.02] border border-white/5 px-3.5 py-1.5 rounded-full hover:bg-white/[0.05]"
                      >
                        <span>Apply Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Overview Card */}
        <aside className="bg-zinc-900 border border-zinc-800/80 rounded-[32px] p-6 lg:sticky lg:top-8 space-y-6 shadow-xl">
          <h3 className="text-lg font-semibold text-white">Startup Overview</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Person className="text-purple-400 w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-zinc-500 block">Founder Name</span>
                <span className="text-sm font-medium text-zinc-200">{startup.founder_name}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe className="text-purple-400 w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-zinc-500 block">Founder Email</span>
                <span className="text-sm font-medium text-zinc-200">{startup.founder_email}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Briefcase className="text-purple-400 w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-zinc-500 block">Funding Stage</span>
                <span className="text-sm font-medium text-zinc-200 capitalize">{startup.funding_stage || "Early Stage"}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="text-purple-400 w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-zinc-500 block">Team Size Needed</span>
                <span className="text-sm font-medium text-zinc-200">
                  {startup.opportunityCount || 0} position(s)
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
