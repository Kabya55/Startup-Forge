import React from "react";
import { Magnifier } from "@gravity-ui/icons";

export default function OpportunityFilters({
  searchQuery,
  setSearchQuery,
  selectedWorkStyle,
  setSelectedWorkStyle,
  selectedIndustry,
  setSelectedIndustry,
}) {
  return (
    <div className="flex flex-col gap-4 bg-zinc-900/50 p-6 rounded-[24px] border border-zinc-800/80 max-w-7xl mx-auto mb-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* 1. Search Text Field - Span 6 columns */}
        <div className="md:col-span-6">
          <span className="text-sm font-medium text-zinc-400 block mb-2">
            Search Opportunities
          </span>
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
              <Magnifier className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role title or required skills..."
              className="w-full bg-zinc-800 border border-zinc-700/80 text-white placeholder-zinc-550 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-purple-500 transition-all focus:ring-1 focus:ring-purple-500/20"
            />
          </div>
        </div>

        {/* 2. Work Type (work_style) Select Filter - Span 3 columns */}
        <div className="md:col-span-3">
          <span className="text-sm font-medium text-zinc-400 block mb-2">
            Work Type
          </span>
          <select
            value={selectedWorkStyle}
            onChange={(e) => setSelectedWorkStyle(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700/80 text-white rounded-xl py-2.5 px-4 text-sm outline-none focus:border-purple-500 transition-all focus:ring-1 focus:ring-purple-500/20 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%23a1a1aa%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%25200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10"
          >
            <option value="all" className="bg-zinc-900 text-zinc-200">All Work Types</option>
            <option value="Remote" className="bg-zinc-900 text-zinc-200">Remote</option>
            <option value="On-site" className="bg-zinc-900 text-zinc-200">On-site</option>
            <option value="Hybrid" className="bg-zinc-900 text-zinc-200">Hybrid</option>
          </select>
        </div>

        {/* 3. Industry Select Filter - Span 3 columns */}
        <div className="md:col-span-3">
          <span className="text-sm font-medium text-zinc-400 block mb-2">
            Industry
          </span>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700/80 text-white rounded-xl py-2.5 px-4 text-sm outline-none focus:border-purple-500 transition-all focus:ring-1 focus:ring-purple-500/20 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%23a1a1aa%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%25200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10"
          >
            <option value="all" className="bg-zinc-900 text-zinc-200">All Industries</option>
            <option value="Software" className="bg-zinc-900 text-zinc-200">Software</option>
            <option value="Fintech" className="bg-zinc-900 text-zinc-200">Fintech</option>
            <option value="Healthcare" className="bg-zinc-900 text-zinc-200">Healthcare</option>
            <option value="AI/ML" className="bg-zinc-900 text-zinc-200">AI/ML</option>
            <option value="E-Commerce" className="bg-zinc-900 text-zinc-200">E-Commerce</option>
            <option value="Education" className="bg-zinc-900 text-zinc-200">Education</option>
            <option value="Design" className="bg-zinc-900 text-zinc-200">Design</option>
            <option value="Marketing" className="bg-zinc-900 text-zinc-200">Marketing</option>
            <option value="Sales" className="bg-zinc-900 text-zinc-200">Sales</option>
          </select>
        </div>
      </div>
    </div>
  );
}
