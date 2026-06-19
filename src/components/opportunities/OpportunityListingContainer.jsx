"use client";

import React, { useState, useEffect } from "react";
import OpportunityCard from "@/components/opportunities/OpportunityCard";
import OpportunityFilters from "@/components/opportunities/OpportunityFilters";
import { useRouter } from "next/navigation";

export default function OpportunityListingContainer({ opportunities, filters, total }) {
  const [searchQuery, setSearchQuery] = useState(filters.search || "");
  const [selectedWorkStyle, setSelectedWorkStyle] = useState(filters.work_style || "all");
  const [selectedIndustry, setSelectedIndustry] = useState(filters.industry || "all");
  const [page, setPage] = useState(Number(filters.page) || 1);

  const router = useRouter();

  const totalItems = total || 0;
  const itemsPerPage = 6; // Matching page size on the server side limit
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // Handle changes with reset page count for better user experience
  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setPage(1);
  };

  const handleWorkStyleChange = (val) => {
    setSelectedWorkStyle(val);
    setPage(1);
  };

  const handleIndustryChange = (val) => {
    setSelectedIndustry(val);
    setPage(1);
  };

  useEffect(() => {
    const sp = new URLSearchParams();

    if (searchQuery) sp.set("search", searchQuery);
    if (selectedWorkStyle !== "all") sp.set("work_style", selectedWorkStyle);
    if (selectedIndustry !== "all") sp.set("industry", selectedIndustry);
    if (page > 1) sp.set("page", page);

    const path = `?${sp.toString()}`;
    router.push(path);
  }, [router, searchQuery, selectedWorkStyle, selectedIndustry, page]);

  return (
    <>
      <OpportunityFilters
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        selectedWorkStyle={selectedWorkStyle}
        setSelectedWorkStyle={handleWorkStyleChange}
        selectedIndustry={selectedIndustry}
        setSelectedIndustry={handleIndustryChange}
      />

      <div className="max-w-7xl mx-auto mb-6 text-sm text-zinc-400">
        Showing {opportunities.length} position{opportunities.length !== 1 && "s"} of {totalItems} total
      </div>

      {opportunities.length > 0 ? (
        <>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mb-10">
            {opportunities.map((opportunityItem) => (
              <OpportunityCard
                key={opportunityItem._id?.$oid || opportunityItem._id}
                opportunity={opportunityItem}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="w-full flex justify-center py-6 mt-8">
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-colors"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => {
                    const p = i + 1;
                    // Show current, first, last, and neighbors (simple logic for small pages)
                    if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors ${
                            page === p ? "bg-violet-600 text-white" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    }
                    if (p === page - 2 || p === page + 2) {
                      return <span key={p} className="text-zinc-500">...</span>;
                    }
                    return null;
                  })}
                </div>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-[32px] max-w-7xl mx-auto">
          <p className="text-zinc-500 text-lg">
            No positions match your search criteria.
          </p>
        </div>
      )}
    </>
  );
}
