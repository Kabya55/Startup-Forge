"use client";

import React, { useEffect, useState } from "react";
import { Users, Building, Briefcase, CreditCard } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { DashboardStats } from "@/components/dashboard/DashboardStats";

export default function AdminDashboardHomePage() {
  const { data: session, isPending } = useSession();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStartups: 0,
    totalOpportunities: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;

    if (!session?.session?.token) {
      setIsLoading(false);
      return;
    }

    const token = session.session.token;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Failed to load admin stats: ${res.status} ${errText}`);
        }
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [session, isPending]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
        <p className="text-zinc-400">Loading Admin Overview...</p>
      </div>
    );
  }

  const adminStats = [
    { title: "Total Users", value: stats.totalUsers.toString(), icon: Users },
    { title: "Total Startups", value: stats.totalStartups.toString(), icon: Building },
    { title: "Total Opportunities", value: stats.totalOpportunities.toString(), icon: Briefcase },
    { title: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: CreditCard },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8 bg-zinc-950 min-h-screen text-white">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">Admin Overview</h1>
        <p className="text-zinc-400 mt-2">
          Monitor platform metrics, manage registered users, moderate startups, and track payments.
        </p>
      </div>

      <DashboardStats statsData={adminStats} />
    </div>
  );
}
