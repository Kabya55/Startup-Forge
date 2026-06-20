"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
} from "@heroui/react";
import { Code, Layout, Database, Cloud, Cpu, Settings } from "lucide-react";
import Link from "next/link";

// Utility helper to format the "Applied" relative time string
const formatRelativeTime = (dateString) => {
  if (!dateString) return "Just now";
  const now = new Date();
  const appliedDate = new Date(dateString);
  const diffInMs = now - appliedDate;

  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  if (diffInHours < 24) {
    return diffInHours <= 1 ? "1 hour ago" : `${diffInHours} hours ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  return diffInWeeks === 1 ? "1 week ago" : `${diffInWeeks} weeks ago`;
};

// Helper mapping to choose icons and background colors based on the opportunity title
const getOpportunityStyle = (title = "") => {
  const lowerTitle = title.toLowerCase();
  if (
    lowerTitle.includes("frontend") ||
    lowerTitle.includes("web") ||
    lowerTitle.includes("developer")
  ) {
    return {
      icon: <Code width="16" height="16" />,
      bg: "bg-zinc-800 text-zinc-350",
    };
  }
  if (
    lowerTitle.includes("designer") ||
    lowerTitle.includes("product") ||
    lowerTitle.includes("ui")
  ) {
    return {
      icon: <Layout width="16" height="16" />,
      bg: "bg-violet-950/60 text-violet-400",
    };
  }
  if (
    lowerTitle.includes("data") ||
    lowerTitle.includes("analyst") ||
    lowerTitle.includes("backend")
  ) {
    return {
      icon: <Database width="16" height="16" />,
      bg: "bg-zinc-800 text-zinc-400",
    };
  }
  return {
    icon: <Settings width="16" height="16" />,
    bg: "bg-zinc-800 text-zinc-350",
  };
};

const getStatusChip = (status = "Pending") => {
  const normalized = status.toLowerCase();
  switch (normalized) {
    case "pending":
      return (
        <Chip
          variant="bordered"
          className="border-zinc-700 text-zinc-350 text-xs font-semibold px-2 py-0.5"
        >
          Pending
        </Chip>
      );
    case "accepted":
      return (
        <Chip
          variant="bordered"
          className="border-emerald-600/70 text-emerald-400 text-xs font-bold px-2 py-0.5 bg-emerald-950/20"
        >
          Accepted
        </Chip>
      );
    case "rejected":
      return (
        <Chip
          variant="bordered"
          className="border-rose-700/70 text-rose-400 text-xs font-bold px-2 py-0.5 bg-rose-950/20"
        >
          Rejected
        </Chip>
      );
    default:
      return (
        <Chip
          variant="bordered"
          className="border-zinc-700 text-zinc-350 text-xs font-bold"
        >
          {status}
        </Chip>
      );
  }
};

const ApplicationsTable = ({ opportunities = [], stats = null }) => {
  const safeOpportunities = Array.isArray(opportunities) ? opportunities : [];
  const mappedOpportunities = safeOpportunities.map((app, index) => ({
    ...app,
    id: app._id || `app-${index}`,
  }));

  return (
    // Added min-w-0 and overflow-hidden to prevent the card from expanding outside the screen
    <div className="w-full min-w-0 max-w-[100vw] overflow-hidden bg-zinc-900 p-4 sm:p-6 rounded-2xl sm:rounded-[32px] border border-zinc-800 text-zinc-100 shadow-2xl">
      <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-zinc-200 truncate">
        Applications History ({stats ? `${stats.currentMonthApplications} / ${stats.maxLimit === null ? 'Unlimited' : stats.maxLimit}` : safeOpportunities.length})
      </h2>

      {/* Added overflow-x-auto to the table wrapper so only this section scrolls */}
      <div className="w-full overflow-x-auto pb-2">
        <table className="w-full text-left border-collapse whitespace-nowrap min-w-[650px] sm:min-w-[700px]">
          <thead>
            <tr className="border-b border-zinc-800 text-sm">
              <th className="py-4 px-3 sm:px-4 bg-zinc-800/50 text-zinc-300 font-bold rounded-tl-xl sm:rounded-tl-2xl">
                Opportunity Title
              </th>
              <th className="py-4 px-3 sm:px-4 bg-zinc-800/50 text-zinc-300 font-bold">
                Startup
              </th>
              <th className="py-4 px-3 sm:px-4 bg-zinc-800/50 text-zinc-300 font-bold">
                Applied Date
              </th>
              <th className="py-4 px-3 sm:px-4 bg-zinc-800/50 text-zinc-300 font-bold">
                Status
              </th>
              <th className="py-4 px-3 sm:px-4 bg-zinc-800/50 text-zinc-300 font-bold rounded-tr-xl sm:rounded-tr-2xl">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {mappedOpportunities.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="py-8 px-4 text-center text-zinc-500 whitespace-normal"
                >
                  You have not applied to any opportunities yet.
                </td>
              </tr>
            ) : (
              mappedOpportunities.map((app) => {
                const style = getOpportunityStyle(app.role_title);
                const appliedDate = app.applied_at || app.createdAt;
                const appStatus = app.status || "Pending";
                const optId = app.opportunity_id;

                return (
                  <tr
                    key={app.id}
                    className="border-b border-zinc-800/60 hover:bg-zinc-800/30 transition-colors text-sm"
                  >
                    <td className="py-4 px-3 sm:px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 sm:p-2.5 rounded-xl flex items-center justify-center shrink-0 ${style.bg}`}
                        >
                          {style.icon}
                        </div>
                        <span className="font-semibold text-zinc-100 text-[14px] sm:text-[15px]">
                          {app.role_title}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-3 sm:px-4 text-zinc-300">
                      {app.startup_name}
                    </td>
                    <td className="py-4 px-3 sm:px-4 text-zinc-400 text-xs">
                      {formatRelativeTime(appliedDate)}
                    </td>
                    <td className="py-4 px-3 sm:px-4">
                      {getStatusChip(appStatus)}
                    </td>
                    <td className="py-4 px-3 sm:px-4">
                      <Link href={`/opportunities/${optId}`}>
                        <Button
                          size="sm"
                          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl text-xs"
                        >
                          View Role
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationsTable;
