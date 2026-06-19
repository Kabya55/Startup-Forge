import OpportunityListingContainer from "@/components/opportunities/OpportunityListingContainer";
import { getOpportunities } from "@/lib/api/opportunities";

export const metadata = {
  title: "Browse Opportunities",
  description:
    "Explore open opportunity positions on StartupForge. Search by title, type, category, or location.",
};

export default async function opportunitiesPage({ searchParams }) {
  const filters = await searchParams;

  const querySearch = new URLSearchParams(filters).toString();
  // Fetched server-side on the initial request
  const { opportunities, total } = await getOpportunities(querySearch);

  return (
    <div className="w-full min-h-screen bg-zinc-950 p-6 md:p-12 text-white">
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Open Positions</h1>
        <p className="text-zinc-400 mt-2">
          Discover your next engineering challenge.
        </p>
      </div>

      {/* Pass data to the Client Wrapper to handle filtering interactivity */}
      <OpportunityListingContainer
        filters={filters}
        opportunities={opportunities || []}
        total={total}
      />
    </div>
  );
}
