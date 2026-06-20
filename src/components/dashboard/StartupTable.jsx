"use client";

import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Chip } from "@heroui/react";
import { toast } from "react-toastify";
import Image from "next/image";

const StartupTable = ({ startups = [] }) => {
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/startups/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });

      if (res.ok) {
        toast.success(`Startup successfully ${status}!`);
        // Force reload page to refresh server data
        window.location.reload();
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="w-full bg-zinc-900 text-neutral-200 p-6 rounded-[32px] border border-zinc-800 shadow-2xl">
      <div className="overflow-x-auto bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-zinc-800 text-sm">
              <th className="py-4 px-6 bg-zinc-800/50 text-zinc-300 font-bold rounded-tl-xl">Startup Name</th>
              <th className="py-4 px-6 bg-zinc-800/50 text-zinc-300 font-bold">Founder Email</th>
              <th className="py-4 px-6 bg-zinc-800/50 text-zinc-300 font-bold">Industry</th>
              <th className="py-4 px-6 bg-zinc-800/50 text-zinc-300 font-bold">Opportunities Count</th>
              <th className="py-4 px-6 bg-zinc-800/50 text-zinc-300 font-bold">Funding Stage</th>
              <th className="py-4 px-6 bg-zinc-800/50 text-zinc-300 font-bold">Status</th>
              <th className="py-4 px-6 bg-zinc-800/50 text-zinc-300 font-bold">Submitted</th>
              <th className="py-4 px-6 bg-zinc-800/50 text-zinc-300 font-bold text-center rounded-tr-xl">Actions</th>
            </tr>
          </thead>
          <tbody>
            {startups.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-8 text-center text-zinc-500">
                  No startups submitted for review.
                </td>
              </tr>
            ) : (
              startups.map((startup) => {
                const startupId = startup._id?.$oid || startup._id;
                const status = startup.status || "pending";

                return (
                  <tr key={startupId} className="border-b border-zinc-800/60 hover:bg-zinc-800/20 transition-colors text-sm">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {startup.logo ? (
                          <div className="w-9 h-9 rounded-xl overflow-hidden bg-white p-1.5 border border-zinc-850 flex items-center justify-center">
                            <Image
                              src={startup.logo}
                              alt={`${startup.startup_name} Logo`}
                              width={24}
                              height={24}
                              unoptimized
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-450">
                            SF
                          </div>
                        )}
                        <span className="font-semibold text-zinc-100">{startup.startup_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-zinc-300">{startup.founder_email}</td>
                    <td className="py-4 px-6">
                      <Chip size="sm" variant="flat" className="capitalize text-zinc-300">
                        {startup.industry}
                      </Chip>
                    </td>
                    <td className="py-4 px-6 text-zinc-350">{startup.opportunityCount ?? 0}</td>
                    <td className="py-4 px-6 text-zinc-300">{startup.funding_stage || "N/A"}</td>
                    <td className="py-4 px-6">
                      <Chip
                        size="sm"
                        variant="flat"
                        color={
                          status === "approved" || status === "Approved"
                            ? "success"
                            : status === "rejected" || status === "Rejected"
                            ? "danger"
                            : "warning"
                        }
                        className="capitalize font-bold"
                      >
                        {status}
                      </Chip>
                    </td>
                    <td className="py-4 px-6 text-zinc-450 text-xs">{formatDate(startup.createdAt)}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        {status?.toLowerCase() !== "approved" && (
                          <Button
                            size="sm"
                            className="bg-emerald-650 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
                            onClick={() => updateStatus(startupId, "approved")}
                          >
                            Approve
                          </Button>
                        )}
                        {status?.toLowerCase() !== "rejected" && (
                          <Button
                            size="sm"
                            className="bg-rose-650 hover:bg-rose-700 text-white font-bold rounded-xl text-xs"
                            onClick={() => updateStatus(startupId, "rejected")}
                          >
                            Reject
                          </Button>
                        )}
                      </div>
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

export default StartupTable;
