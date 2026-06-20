import { getLoggedInFounderStartup } from "@/lib/api/startups";
import { getFounderStats } from "@/lib/api/users";
import PostOpportunityForm from "./PostOpportunityForm";

import Link from "next/link";

export const metadata = {
  title: "Post a New Opportunity",
  description: "Post a new opportunity opening on StartupForge to hire top talent.",
};

const PostOpportunityPage = async () => {
  const startup = await getLoggedInFounderStartup();
  const stats = await getFounderStats();

  if (stats && stats.maxLimit !== null && stats.currentMonthOpportunities >= stats.maxLimit) {
    return (
      <div className="p-6 md:p-10 max-w-3xl mx-auto text-center space-y-6 text-white pt-24">
        <div className="w-16 h-16 bg-violet-900/30 text-violet-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-violet-700/50">
          <span className="text-3xl">⚡</span>
        </div>
        <h2 className="text-3xl font-bold">Post Limit Reached</h2>
        <p className="text-zinc-400">
          You have posted <span className="text-violet-400 font-bold">{stats.currentMonthOpportunities}</span> opportunities this month on the <span className="font-semibold text-white">{stats.planName}</span> plan.
          Please upgrade your plan to post more opportunities.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <Link href="/packages">
            <button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white font-bold rounded-xl px-6 py-2.5 shadow-lg shadow-violet-950/50 transition-all text-sm">
              Upgrade Plan
            </button>
          </Link>
          <Link href="/dashboard/founder/opportunities">
            <button className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl px-6 py-2.5 border border-zinc-700 text-sm">
              Go Back
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // If the startup doesn't exist
  if (!startup?._id) {
    return (
      <div className="p-6 md:p-10 max-w-3xl mx-auto text-center space-y-6 text-white pt-20">
        <h2 className="text-3xl font-bold">Profile Setup Required</h2>
        <p className="text-zinc-400">You must create your startup profile before you can post opportunities.</p>
        <Link href="/dashboard/founder/company">
          <button className="bg-violet-600 hover:bg-violet-750 text-white font-bold rounded-xl px-5 py-2.5 mt-4">
            Setup Profile
          </button>
        </Link>
      </div>
    );
  }

  // If the startup exists but is NOT approved
  if (startup.status?.toLowerCase() !== "approved") {
    return (
      <div className="p-6 md:p-10 max-w-3xl mx-auto text-center space-y-6 text-white pt-20">
        <div className="w-16 h-16 bg-yellow-900/30 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-700/50">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <h2 className="text-3xl font-bold">Approval Pending</h2>
        <p className="text-zinc-400">
          Your startup profile is currently under review by our moderation team. You will be able to post team opportunities once your company is approved.
        </p>
        <Link href="/dashboard/founder/opportunities">
          <button className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl px-5 py-2.5 mt-4 border border-zinc-700">
            Go Back
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PostOpportunityForm startup={startup} />
    </div>
  );
};

export default PostOpportunityPage;
