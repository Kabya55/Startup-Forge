import { MapPin, Briefcase, CircleDollar, Calendar } from "@gravity-ui/icons";
import { getOpportunityById } from "@/lib/api/opportunities";
import Image from "next/image";
import { getUserSession } from "@/lib/core/session";
import ApplyButton from "@/components/opportunities/ApplyButton";
import { getApplications } from "@/lib/api/applications";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const opportunity = await getOpportunityById(id);

  if (!opportunity) {
    return {
      title: "Opportunity Not Found",
      description:
        "This opportunity listing could not be found or is no longer active.",
    };
  }

  const title =
    opportunity.role_title || opportunity.title || "Opportunity Position";
  const startup =
    opportunity.startup_name || opportunity.startup || "StartupForge";
  const desc =
    opportunity.responsibilities ||
    opportunity.requirements ||
    `Apply for the ${title} position at ${startup} on StartupForge.`;

  return {
    title: `${title} at ${startup}`,
    description: desc.length > 155 ? desc.substring(0, 152) + "..." : desc,
  };
}

const Page = async ({ params }) => {
  const { id } = await params;

  const [opportunity, session] = await Promise.all([
    getOpportunityById(id),
    getUserSession(),
  ]);

  const userRole = session?.user?.role || session?.role || "user";
 
  let hasApplied = false;
  if (session && userRole === "collaborator") {
    try {
      const applications = await getApplications();
      if (Array.isArray(applications)) {
        hasApplied = applications.some((app) => app.opportunity_id === id);
      }
    } catch (err) {
      console.error("Error checking application status:", err);
    }
  }

  // Guard clause in case API fails or returns null
  if (!opportunity) {
    return (
      <div className="w-full min-h-screen bg-zinc-950 flex flex-col justify-center items-center text-white p-6">
        <p className="text-zinc-400 text-lg">
          Opportunity position could not be found or is no longer active.
        </p>
      </div>
    );
  }

  // Salary string utility formatter
  const formatSalary = (amount) => {
    if (!amount) return "0";
    const numericAmount = parseInt(amount, 10);
    return numericAmount >= 1000
      ? `${(numericAmount / 1000).toLocaleString()}k`
      : amount;
  };

  // Humanize standard date formats (e.g. 2026-07-21 -> July 21, 2026)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const salaryRange =
    opportunity.minSalary && opportunity.maxSalary
      ? `$${formatSalary(opportunity.minSalary)}–$${formatSalary(opportunity.maxSalary)} / year`
      : "Salary Negotiable";

  return (
    <main className="w-full min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 lg:p-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* LEFT BLOCK: Corporate Identity, Description & Details (Spans 2 columns) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Group */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {opportunity.logo && (
                <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 p-2 flex items-center justify-center overflow-hidden">
                  <Image
                    src={opportunity.logo}
                    alt={`${opportunity.startup_name} Logo`}
                    width={48}
                    height={48}
                    unoptimized
                    className="object-contain"
                  />
                </div>
              )}
              <div>
                <h2 className="text-xl font-medium text-zinc-300">
                  {opportunity.startup_name}
                </h2>
                <p className="text-sm text-zinc-500 capitalize">
                  {opportunity.industry} Role
                </p>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              {opportunity.role_title}
            </h1>
          </div>

          {/* Section: Description / Responsibilities */}
          <section className="space-y-3">
            <h3 className="text-xl font-semibold text-white">
              Core Description / Responsibilities
            </h3>
            <p className="text-zinc-300 text-base leading-relaxed whitespace-pre-line">
              {opportunity.description ||
                "No description responsibilities specified for this listing."}
            </p>
          </section>

          {/* Section: Core Technical Requirements */}
          <section className="space-y-3">
            <h3 className="text-xl font-semibold text-white">
              Requirements & Skills
            </h3>
            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-5">
              <p className="text-zinc-300 text-base leading-relaxed">
                {Array.isArray(opportunity.required_skills)
                  ? opportunity.required_skills.join(", ")
                  : opportunity.required_skills ||
                    "Standard industry standards apply."}
              </p>
            </div>
          </section>
        </div>

        {/* RIGHT BLOCK: Core Structural Metadata Panel Widget */}
        <aside className="bg-zinc-900 border border-zinc-800/80 rounded-[32px] p-6 lg:sticky lg:top-8 space-y-6 shadow-xl">
          <h3 className="text-lg font-semibold text-white">
            Opportunity Overview
          </h3>

          <div className="space-y-4">
            {/* Work Type Element */}
            <div className="flex items-start gap-3">
              <MapPin className="text-purple-400 w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs text-zinc-500 block">Work Type</span>
                <span className="text-sm font-medium text-zinc-200 capitalize">
                  {opportunity.work_type || (opportunity.isRemote ? "Remote" : "On-site")}
                </span>
              </div>
            </div>

            {/* Location Element (if not Remote) */}
            {opportunity.location && opportunity.location !== "Remote" && (
              <div className="flex items-start gap-3">
                <MapPin className="text-purple-400 w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-xs text-zinc-500 block">Location / City</span>
                  <span className="text-sm font-medium text-zinc-200">
                    {opportunity.location}
                  </span>
                </div>
              </div>
            )}

            {/* Category Element */}
            <div className="flex items-start gap-3">
              <Briefcase className="text-purple-400 w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs text-zinc-500 block">Category</span>
                <span className="text-sm font-medium text-zinc-200 capitalize">
                  {opportunity.industry}
                </span>
              </div>
            </div>

            {/* Position Type Element */}
            <div className="flex items-start gap-3">
              <Briefcase className="text-purple-400 w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs text-zinc-500 block">
                  Commitment Level
                </span>
                <span className="text-sm font-medium text-zinc-200 capitalize">
                  {opportunity.commitment_level}
                </span>
              </div>
            </div>

            {/* Comp/Salary Element */}
            <div className="flex items-start gap-3">
              <CircleDollar className="text-purple-400 w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs text-zinc-500 block">
                  Salary Range / Comp
                </span>
                <span className="text-sm font-medium text-zinc-200">
                  {salaryRange}
                </span>
              </div>
            </div>

            {/* Deadline Element */}
            <div className="flex items-start gap-3">
              <Calendar className="text-purple-400 w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs text-zinc-500 block">
                  Application Deadline
                </span>
                <span className="text-sm font-medium text-zinc-200">
                  {formatDate(opportunity.deadline)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button: Apply Routing Link Container */}
          <div className="block w-full">
            <ApplyButton opportunityId={id} userRole={userRole} hasApplied={hasApplied} />
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Page;
