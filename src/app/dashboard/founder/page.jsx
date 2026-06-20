"use client";

import { useEffect, useState } from "react";
import { Briefcase, Persons, CircleCheck } from "@gravity-ui/icons";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { Button } from "@heroui/react";

const FounderPage = () => {
  const { data: session, isPending } = useSession();
  const [stats, setStats] = useState({
    totalOpportunities: 0,
    totalApplications: 0,
    acceptedMembers: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (!session?.user) return;
    
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    };
    const token = getCookie("better-auth.session_token") || getCookie("__Secure-better-auth.session_token");

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/founder/stats`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: "include"
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stats");
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setIsLoadingStats(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoadingStats(false);
      });
  }, [session]);

  if (isPending || isLoadingStats) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
        <p className="text-zinc-400">Loading Dashboard Overview...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
        <p className="text-zinc-405">You must be logged in to view this page.</p>
      </div>
    );
  }

  const user = session?.user;

  const founderStats = [
    { title: "Total Opportunities", value: stats.totalOpportunities.toString(), icon: Briefcase },
    { title: "Total Applications", value: stats.totalApplications.toString(), icon: Persons },
    { title: "Accepted Members", value: stats.acceptedMembers.toString(), icon: CircleCheck },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8 bg-zinc-950 min-h-screen text-white">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">Founder Dashboard</h1>
        <p className="text-zinc-400 mt-2">
          Welcome back, <span className="font-semibold text-violet-400">{user?.name}</span>! Here is your startup progress.
        </p>
      </div>

      {stats.planName && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-sm text-zinc-400 font-semibold uppercase tracking-wider">Current Package</div>
            <div className="text-xl font-bold text-violet-400 mt-1">{stats.planName} Plan</div>
          </div>
          <div>
            <div className="text-sm text-zinc-400 font-semibold uppercase tracking-wider">Monthly Opportunity Postings Limit</div>
            <div className="text-lg font-bold text-zinc-200 mt-1">
              {stats.currentMonthOpportunities} / {stats.maxLimit === null ? "Unlimited" : stats.maxLimit} Used
            </div>
          </div>
          <div className="w-full md:w-auto">
            {stats.maxLimit !== null && stats.currentMonthOpportunities >= stats.maxLimit ? (
              <Link href="/packages" className="block w-full">
                <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white font-bold rounded-xl px-6 py-2.5 shadow-lg shadow-violet-950/50 transition-all text-sm">
                  Upgrade to Post More
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

      <DashboardStats statsData={founderStats} />
    </div>
  );
};

export default FounderPage;
