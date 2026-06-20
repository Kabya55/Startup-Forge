"use client";

import React, { useState } from "react";
import { Briefcase, Person } from "@gravity-ui/icons";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function AdminUsersTable({ users = [] }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  // Safe accessor for MongoDB OID
  const getUserId = (user) => user._id?.$oid || user._id || user.id;

  const handleBlockToggle = async (userId, isBlocked) => {
    setIsUpdating(true);
    const action = isBlocked ? "unblock" : "block";

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/${action}`, {
        method: "PATCH",
        credentials: "include",
      });

      if (res.ok) {
        toast.success(`User ${action}ed successfully!`);
        router.refresh();
        // Fallback reload if refresh isn't instant
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        toast.error(`Failed to ${action} user.`);
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative w-full">
      <div className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl font-sans text-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-zinc-400">
            {/* Header */}
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-300 font-bold bg-zinc-950">
                <th className="py-4 px-6 font-semibold">User Name</th>
                <th className="py-4 px-6 font-semibold">Email Address</th>
                <th className="py-4 px-6 font-semibold">Role</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-zinc-800 bg-zinc-905">
              {users.map((user) => {
                const userId = getUserId(user);
                const userRole = user.role?.toLowerCase() || "collaborator";
                const isBlocked = !!user.isBlocked;

                return (
                  <tr
                    key={userId}
                    className="hover:bg-zinc-800/20 transition-colors duration-150 border-b border-zinc-800/60"
                  >
                    {/* User Name + Initial Avatar */}
                    <td className="py-4 px-6 font-medium text-zinc-200 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <>
                            <img
                              src={user.image}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover bg-zinc-800 border border-zinc-750"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                if (e.currentTarget.nextSibling) {
                                  e.currentTarget.nextSibling.style.display = "flex";
                                }
                              }}
                            />
                            <div
                              style={{ display: "none" }}
                              className="w-8 h-8 rounded-full bg-zinc-700/60 flex items-center justify-center text-xs text-zinc-300 font-bold tracking-wider"
                            >
                              {user.name
                                ? user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                : "U"}
                            </div>
                          </>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-zinc-700/60 flex items-center justify-center text-xs text-zinc-300 font-bold tracking-wider">
                            {user.name
                              ? user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                              : "U"}
                          </div>
                        )}
                        <span>{user.name || "Unknown User"}</span>
                      </div>
                    </td>

                    {/* Email Address */}
                    <td className="py-4 px-6 text-zinc-300 whitespace-nowrap">
                      {user.email}
                    </td>

                    {/* Role Badge */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {userRole === "founder" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-indigo-950/40 text-indigo-400 border border-indigo-900/40">
                          <Briefcase width={12} height={12} />
                          Founder
                        </span>
                      ) : userRole === "admin" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-purple-950/40 text-purple-300 border border-purple-800/50 capitalize">
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-zinc-800/50 text-zinc-400 border border-zinc-700/50">
                          <Person width={12} height={12} />
                          Collaborator
                        </span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {!isBlocked ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-950/30 text-emerald-450 border border-emerald-900/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold rounded-full bg-rose-950/30 text-rose-450 border border-rose-900/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Blocked
                        </span>
                      )}
                    </td>

                    {/* Actions Column */}
                    <td className="py-4 px-6 text-right whitespace-nowrap text-xs font-semibold">
                      <div className="flex items-center justify-end gap-4">
                        {userRole !== "admin" && (
                          <button
                            disabled={isUpdating}
                            onClick={() => handleBlockToggle(userId, isBlocked)}
                            className={`rounded-xl px-4 py-2 font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed ${
                              isBlocked
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                : "bg-rose-600 hover:bg-rose-700 text-white"
                            }`}
                          >
                            {isBlocked ? "Unblock User" : "Block User"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
