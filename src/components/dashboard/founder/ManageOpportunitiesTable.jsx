"use client";

import React, { useState } from "react";
import { Button, Tooltip } from "@heroui/react";
import { Eye, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { deleteOpportunity } from "@/lib/actions/opportunities";

export default function ManageOpportunitiesTable({ initialOpportunities }) {
  const [opportunities, setOpportunities] = useState(initialOpportunities || []);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [oppToDelete, setOppToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteModal = (id) => {
    setOppToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!oppToDelete) return;
    setIsDeleting(true);

    try {
      const res = await deleteOpportunity(oppToDelete);
      if (res.deletedCount > 0) {
        toast.success("Opportunity deleted successfully!");
        setOpportunities(opportunities.filter((opp) => (opp._id?.$oid || opp._id) !== oppToDelete));
      } else {
        toast.error(res.message || "Failed to delete opportunity.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setOppToDelete(null);
    }
  };

  return (
    <>
      <div className="w-full max-w-full overflow-x-auto bg-zinc-900 border border-zinc-800 rounded-2xl sm:rounded-3xl text-white">
        <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
          <thead>
            <tr className="border-b border-zinc-800 text-sm">
              <th className="py-4 px-4 sm:px-6 bg-zinc-800/50 text-zinc-300 font-bold rounded-tl-2xl sm:rounded-tl-3xl">
                Opportunity Title
              </th>
              <th className="py-4 px-4 sm:px-6 bg-zinc-800/50 text-zinc-300 font-bold">
                Type / Category
              </th>
              <th className="py-4 px-4 sm:px-6 bg-zinc-800/50 text-zinc-300 font-bold">
                Location
              </th>
              <th className="py-4 px-4 sm:px-6 bg-zinc-800/50 text-zinc-300 font-bold">
                Commitment
              </th>
              <th className="py-4 px-4 sm:px-6 bg-zinc-800/50 text-zinc-300 font-bold rounded-tr-2xl sm:rounded-tr-3xl">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {opportunities.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="py-8 px-4 text-center text-zinc-500 whitespace-normal"
                >
                  No opportunities found. Click Add Opportunity above to create
                  one.
                </td>
              </tr>
            ) : (
              opportunities.map((opp) => {
                const oppId = opp._id?.$oid || opp._id;
                return (
                  <tr
                    key={oppId}
                    className="border-b border-zinc-800/60 hover:bg-zinc-800/20 transition-colors text-sm"
                  >
                    <td className="py-4 px-4 sm:px-6 font-semibold text-zinc-100">
                      {opp.role_title}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-zinc-300">
                      {opp.work_type}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-zinc-350">
                      {opp.isRemote ? "Remote" : opp.location || "On-site"}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-zinc-300 capitalize">
                      {opp.commitment_level}
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-2">
                        <Link href={`/opportunities/${oppId}`}>
                          <Tooltip content="View Listing">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              aria-label="View Details"
                            >
                              <Eye className="text-zinc-400 w-4 h-4 hover:text-white" />
                            </Button>
                          </Tooltip>
                        </Link>

                        <Link href={`/dashboard/founder/opportunities/${oppId}/edit`}>
                          <Tooltip content="Edit Listing">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              aria-label="Edit Listing"
                            >
                              <Edit2 className="text-zinc-400 w-4 h-4 hover:text-white" />
                            </Button>
                          </Tooltip>
                        </Link>

                        <Tooltip content="Delete">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="danger"
                            onPress={() => openDeleteModal(oppId)}
                            aria-label="Delete"
                          >
                            <Trash2 className="text-red-500 w-4 h-4 hover:text-red-400" />
                          </Button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 shadow-2xl space-y-6 text-left animate-in fade-in zoom-in duration-200">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Delete Opportunity?
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Are you sure you want to delete this opportunity? This action cannot be undone and will permanently remove it from the job board.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setOppToDelete(null);
                }}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-750 text-white font-bold rounded-2xl text-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl text-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
