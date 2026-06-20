import EditOpportunityForm from "@/components/dashboard/founder/EditOpportunityForm";
import { getOpportunityById } from "@/lib/api/opportunities";
import { getLoggedInFounderStartup } from "@/lib/api/startups";

export const metadata = {
  title: "Edit Opportunity Listing",
  description: "Modify parameters of your posted opportunity.",
};

export default async function EditOpportunityPage({ params }) {
  const { id } = await params;

  const [opportunity, startup] = await Promise.all([
    getOpportunityById(id),
    getLoggedInFounderStartup(),
  ]);

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
        <p className="text-zinc-400 text-lg">Opportunity Listing not found.</p>
      </div>
    );
  }

  return (
    <EditOpportunityForm opportunity={opportunity} startup={startup} />
  );
}
