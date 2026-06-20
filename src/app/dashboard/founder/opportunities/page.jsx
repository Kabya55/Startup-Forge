import { getLoggedInFounderStartup } from "@/lib/api/startups";
import { getStartupOpportunities } from "@/lib/api/opportunities";
import { Button } from "@heroui/react";
import Link from "next/link";
import ManageOpportunitiesTable from "@/components/dashboard/founder/ManageOpportunitiesTable";

export const metadata = {
  title: "Manage Opportunities",
  description:
    "View, update, and manage your current opportunity listings on StartupForge.",
};

const FounderOpportunityPage = async () => {
  const startup = await getLoggedInFounderStartup();

  let opportunities = [];
  if (startup && startup._id) {
    // get opportunities of startup
    const res = await getStartupOpportunities(startup._id);
    opportunities = res?.opportunities || res || [];
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 w-full max-w-[100vw] sm:max-w-7xl mx-auto space-y-6 bg-zinc-950 min-h-screen text-white overflow-x-hidden sm:overflow-visible">
      {/* Responsive Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 w-full">
        <div className="w-full flex-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight break-words">
            Manage Opportunities
          </h2>
          <p className="text-sm text-zinc-400 mt-1 break-words whitespace-normal">
            View and manage your open opportunity postings for{" "}
            <span className="font-medium text-zinc-300">
              {startup?.startup_name || "your startup"}
            </span>
            .
          </p>
        </div>

        {/* Add Opportunity Button */}
        <div className="w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
          <Link
            href="/dashboard/founder/opportunities/new"
            className="block w-full"
          >
            <Button className="w-full sm:w-auto bg-violet-600 hover:bg-violet-750 text-white font-bold rounded-xl px-5">
              Add Opportunity
            </Button>
          </Link>
        </div>
      </div>

      {/* Interactive Opportunities Table */}
      <ManageOpportunitiesTable initialOpportunities={opportunities} />
    </div>
  );
};

export default FounderOpportunityPage;
