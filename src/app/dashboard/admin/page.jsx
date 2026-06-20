"use client";

import React, { useEffect, useState } from "react";
import { Users, Building, Briefcase, CreditCard } from "lucide-react";
import { DashboardStats } from "@/components/dashboard/DashboardStats";

export default function AdminDashboardHomePage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStartups: 0,
    totalOpportunities: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    };
    const token = getCookie("better-auth.session_token") || getCookie("__Secure-better-auth.session_token");

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load admin stats");
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
  }, []);

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
