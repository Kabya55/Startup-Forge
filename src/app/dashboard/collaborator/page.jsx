import React from "react";
import { getUserSession } from "@/lib/core/session";
import { getApplicationsByApplicent, getCollaboratorStats } from "@/lib/api/applications";
import ApplicationsTable from "./applications/ApplicationTable";
import Link from "next/link";
import { Button } from "@heroui/react";

export const metadata = {
  title: "Collaborator Dashboard",
  description:
    "Track your opportunity applications and match status on StartupForge.",
};

export default async function CollaboratorDashboard() {
  const user = await getUserSession();

  let applications = [];
  let stats = null;
  if (user) {
    applications = await getApplicationsByApplicent();
    stats = await getCollaboratorStats();
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto space-y-8 bg-zinc-950 min-h-screen text-white">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">
          Collaborator Dashboard
        </h1>
        <p className="text-zinc-400 mt-2">
          Welcome back,{" "}
          <span className="font-semibold text-violet-400">{user?.name}</span>!
          Track your startup co-founder matching and role applications.
        </p>
      </div>

      {stats && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-sm text-zinc-400 font-semibold uppercase tracking-wider">Current Package</div>
            <div className="text-xl font-bold text-violet-400 mt-1">{stats.planName} Plan</div>
          </div>
          <div>
            <div className="text-sm text-zinc-400 font-semibold uppercase tracking-wider">Monthly Applications Limit</div>
            <div className="text-lg font-bold text-zinc-200 mt-1">
              {stats.currentMonthApplications} / {stats.maxLimit === null ? "Unlimited" : stats.maxLimit} Used
            </div>
          </div>
          <div className="w-full md:w-auto">
            {stats.maxLimit !== null && stats.currentMonthApplications >= stats.maxLimit ? (
              <Link href="/packages" className="block w-full">
                <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white font-bold rounded-xl px-6 py-2.5 shadow-lg shadow-violet-950/50 transition-all text-sm">
                  Upgrade to Apply More
                </Button>
              </Link>
            ) : (
              <Link href="/packages" className="block w-full">
                <Button className="w-full border border-zinc-700 hover:border-violet-500 hover:bg-violet-950/20 text-zinc-300 font-bold rounded-xl px-5 py-2.5 text-sm transition-all" variant="bordered">
                  View Packages
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}

      <ApplicationsTable opportunities={applications} stats={stats} />
    </div>
  );
}
