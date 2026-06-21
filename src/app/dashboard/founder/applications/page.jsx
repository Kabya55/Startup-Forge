"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
} from "@heroui/react";
import { updateApplicationStatus } from "@/lib/actions/applications";
import { toast } from "react-toastify";
import { ArrowUpRight } from "lucide-react";

import { useSession } from "@/lib/auth-client";

export default function FounderApplicationsPage() {
  const { data: session, isPending } = useSession();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApps = (token) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/applications`,
      {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      },
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load applications");
        return res.json();
      })
      .then((data) => {
        setApplications(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (isPending) return;

    if (!session?.session?.token) {
      setIsLoading(false);
      return;
    }

    fetchApps(session.session.token);
  }, [session, isPending]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await updateApplicationStatus(id, newStatus);
      if (res.modifiedCount > 0 || res.acknowledged) {
        toast.success(`Application successfully ${newStatus}!`);
        // Update local state directly
        setApplications((prev) =>
          prev.map((app) =>
            app._id === id ? { ...app, status: newStatus } : app,
          ),
        );
      } else {
        toast.error("Failed to update status.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
        <p className="text-zinc-400">Loading Applications...</p>
      </div>
    );
  }

  return (
    // Added w-full, max-w, and overflow-x-hidden to the main container
    <div className="p-4 sm:p-6 md:p-10 w-full max-w-[100vw] sm:max-w-7xl mx-auto space-y-6 bg-zinc-950 min-h-screen text-white overflow-x-hidden sm:overflow-visible">
      {/* Header Section */}
      <div className="w-full">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight break-words">
          Manage Applications
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 mt-1 break-words whitespace-normal">
          Review collaborator applications for your open roles and build your
          team.
        </p>
      </div>

      {/* Table Section - styled with w-full and max-w-full */}
      <div className="w-full max-w-full overflow-x-auto bg-zinc-900 border border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl text-white">
        <table className="w-full text-left border-collapse whitespace-nowrap min-w-[900px]">
          <thead>
            <tr className="border-b border-zinc-800 text-sm">
              <th className="py-4 px-4 sm:px-6 bg-zinc-800/50 text-zinc-300 font-bold rounded-tl-2xl sm:rounded-tl-3xl">
                Applicant Email
              </th>
              <th className="py-4 px-4 sm:px-6 bg-zinc-800/50 text-zinc-300 font-bold">
                Opportunity Role
              </th>
              <th className="py-4 px-4 sm:px-6 bg-zinc-800/50 text-zinc-300 font-bold">
                Portfolio Link
              </th>
              <th className="py-4 px-4 sm:px-6 bg-zinc-800/50 text-zinc-300 font-bold">
                Motivation Message
              </th>
              <th className="py-4 px-4 sm:px-6 bg-zinc-800/50 text-zinc-300 font-bold">
                Status
              </th>
              <th className="py-4 px-4 sm:px-6 bg-zinc-800/50 text-zinc-300 font-bold text-center rounded-tr-2xl sm:rounded-tr-3xl">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="py-8 px-4 text-center text-zinc-500 whitespace-normal"
                >
                  No applications received yet.
                </td>
              </tr>
            ) : (
              applications.map((app) => {
                const appId = app._id?.$oid || app._id;
                return (
                  <tr
                    key={appId}
                    className="border-b border-zinc-850 hover:bg-zinc-800/20 transition-colors text-sm"
                  >
                    <td className="py-4 px-4 sm:px-6 font-semibold text-zinc-150">
                      {app.applicant_email}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-zinc-200">
                      {app.role_title}
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <a
                        href={app.portfolio_link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-violet-400 hover:text-violet-300 underline inline-flex items-center gap-1 font-medium"
                      >
                        View Portfolio <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <p
                        className="text-zinc-400 max-w-xs truncate"
                        title={app.motivation}
                      >
                        {app.motivation}
                      </p>
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <Chip
                        size="sm"
                        variant="flat"
                        color={
                          app.status === "Accepted"
                            ? "success"
                            : app.status === "Rejected"
                              ? "danger"
                              : "warning"
                        }
                        className="capitalize font-bold"
                      >
                        {app.status || "Pending"}
                      </Chip>
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center justify-center gap-2">
                        {app.status === "Pending" ? (
                          <>
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs px-3 min-w-0"
                              onClick={() =>
                                handleStatusUpdate(appId, "Accepted")
                              }
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              className="bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs px-3 min-w-0"
                              onClick={() =>
                                handleStatusUpdate(appId, "Rejected")
                              }
                            >
                              Reject
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs text-zinc-500 whitespace-nowrap">
                            Decision Recorded
                          </span>
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
}
