import React from "react";
import { Card, CardHeader, CardFooter, Button } from "@heroui/react";
import { MapPin, Briefcase, CircleDollar, ArrowRight } from "@gravity-ui/icons";
import Image from "next/image";
import Link from "next/link";

export default function OpportunityCard({ opportunity }) {
  // Guard clause in case the prop isn't passed or is loading
  if (!opportunity) return null;

  // Format salary string safely (e.g., "160000" becomes "160k")
  const formatSalary = (amount) => {
    if (!amount) return "0";
    const numericAmount = parseInt(amount, 10);
    return numericAmount >= 1000 ? `${numericAmount / 1000}k` : amount;
  };

  const salaryRange =
    opportunity.minSalary && opportunity.maxSalary
      ? `$${formatSalary(opportunity.minSalary)}–$${formatSalary(opportunity.maxSalary)} / year`
      : "Salary Negotiable";

  // Safely extract the ID string depending on your MongoDB data hydration setup
  const opportunityId = opportunity._id?.$oid || opportunity._id;

  return (
    <Card className="p-6 w-full max-w-[440px] border-none bg-zinc-900 text-zinc-100 rounded-[32px] shadow-2xl">
      {/* Card Header: Startup Info & Opportunity Title */}
      <CardHeader className="flex flex-col items-start gap-4 p-0 pb-3">
        <div className="flex items-center gap-3">
          {opportunity.logo && (
            <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden">
              <Image
                src={opportunity.logo}
                alt={`${opportunity.startup_name || "Startup"} logo`}
                width={24}
                height={24}
                unoptimized
                className="object-contain"
              />
            </div>
          )}
          <span className="text-lg font-medium text-zinc-300">
            {opportunity.startup_name || "Confidential"}
          </span>
        </div>

        <h3 className="text-3xl font-semibold tracking-tight text-white leading-tight">
          {opportunity.role_title}
        </h3>

        {opportunity.description && (
          <p className="text-base text-zinc-400 line-clamp-2">
            {opportunity.description}
          </p>
        )}
      </CardHeader>

      {/* Card Content: Badges/Tags & Technical Details */}
      <div className="flex flex-col gap-5 p-0 py-4">
        {/* Badge Grid matching your reference layout */}
        <div className="flex flex-wrap gap-2">
          {(opportunity.work_style || opportunity.work_type) && (
            <div className="flex items-center gap-2 bg-zinc-800/60 px-4 py-2 rounded-full border border-zinc-800">
              <MapPin className="text-purple-400 w-4 h-4" />
              <span className="text-sm font-medium text-zinc-200">
                {opportunity.work_style || opportunity.work_type}
              </span>
            </div>
          )}

          {opportunity.commitment_level && (
            <div className="flex items-center gap-2 bg-zinc-800/60 px-4 py-2 rounded-full border border-zinc-800">
              <Briefcase className="text-purple-400 w-4 h-4" />
              <span className="text-sm font-medium text-zinc-200 capitalize">
                {opportunity.commitment_level}
              </span>
            </div>
          )}

          {/* Salary Tag */}
          <div className="flex items-center gap-2 bg-zinc-800/60 px-4 py-2 rounded-full border border-zinc-800 w-fit">
            <div className="flex justify-center items-center bg-purple-500/20 rounded-full w-5 h-5">
              <CircleDollar className="text-purple-400 w-3 h-3" />
            </div>
            <span className="text-sm font-medium text-zinc-200">
              {salaryRange}
            </span>
          </div>
        </div>

        {/* Supplemental info strings */}
        {opportunity.required_skills && (
          <div className="text-xs text-zinc-550 space-y-1 border-t border-zinc-800/60 pt-3">
            <p>
              <strong className="text-zinc-400">Required Skills:</strong>{" "}
              {Array.isArray(opportunity.required_skills)
                ? opportunity.required_skills.join(", ")
                : opportunity.required_skills}
            </p>
          </div>
        )}
      </div>

      {/* Card Footer: Action Button */}
      <CardFooter className="p-0 pt-4">
        <Link
          href={`/opportunities/${opportunityId}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-violet-300 transition-all bg-white/[0.02] border border-white/5 px-4 py-2 rounded-full hover:bg-white/[0.05]"
        >
          Apply Now
          <ArrowRight className="w-4 h-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
