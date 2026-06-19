import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";
import { getOpportunityById } from "@/lib/api/opportunities";
import { getCollaboratorStats } from "@/lib/api/applications";
import OpportunityApply from "./OpportunityApply";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const opportunity = await getOpportunityById(id);

  if (!opportunity) {
    return {
      title: "Apply for Opportunity",
      description: "Submit your opportunity application on StartupForge.",
    };
  }

  const title = opportunity.role_title || opportunity.title || "Opportunity Position";
  const startup = opportunity.startup_name || opportunity.startup || "";

  return {
    title: `Apply for ${title} ${startup ? `at ${startup}` : ""}`,
    description: `Complete and submit your application for the ${title} role on StartupForge.`,
  };
}

const ApplyPage = async ({ params }) => {
  const { id } = await params;
  const user = await getUserSession();

  if (!user) {
    redirect(`/login?redirect=/opportunities/${id}/apply`);
  }

  if (user.role !== "collaborator") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
        <div className="max-w-md w-full bg-zinc-900 border border-red-500/20 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
            <span className="text-5xl">🚫</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-3">Access Denied</h1>

          <p className="text-zinc-400 leading-relaxed">
            Only <span className="text-violet-400 font-semibold">Collaborators</span> can apply for opportunities.
            <br />
            Please sign in with a collaborator account to continue.
          </p>
        </div>
      </div>
    );
  }

  const stats = await getCollaboratorStats();
  if (stats && stats.maxLimit !== null && stats.currentMonthApplications >= stats.maxLimit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
        <div className="max-w-md w-full bg-zinc-900 border border-violet-500/20 rounded-2xl p-8 text-center shadow-2xl space-y-6">
          <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-violet-500/10 border border-violet-500/20">
            <span className="text-5xl">⚡</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white">Limit Reached</h1>
            <p className="text-sm text-zinc-400">
              You have applied to <span className="text-violet-400 font-bold">{stats.currentMonthApplications}</span> opportunities this month.
            </p>
          </div>

          <p className="text-zinc-400 leading-relaxed">
            Your current <span className="font-semibold text-violet-400">{stats.planName}</span> plan has a monthly limit of <span className="font-semibold text-white">{stats.maxLimit}</span> applications.
            Please upgrade your package to apply to more opportunities.
          </p>

          <div className="flex flex-col gap-3 pt-2">
            <Link href="/packages" className="w-full">
              <button className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-750 transition-all py-3 rounded-full hover:scale-102 shadow-lg shadow-violet-600/20">
                Upgrade Package
              </button>
            </Link>
            <Link href="/dashboard/collaborator" className="w-full">
              <button className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors bg-white/[0.02] border border-white/5 py-3 rounded-full hover:bg-white/[0.05]">
                Go to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const opportunity = await getOpportunityById(id);

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div>
          <span className="text-xs font-bold tracking-wider text-violet-400 uppercase">
            Application Portal
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Applying for{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
              {opportunity?.role_title || "Position"}
            </span>
          </h1>
          {opportunity?.startup_name && (
            <p className="mt-2 text-sm text-zinc-400">Startup: <span className="font-semibold text-zinc-300">{opportunity.startup_name}</span></p>
          )}
        </div>

        <OpportunityApply opportunity={opportunity} applicant={user} />
      </div>
    </div>
  );
};

export default ApplyPage;
