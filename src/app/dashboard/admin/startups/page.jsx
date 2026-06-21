import StartupTable from "@/components/dashboard/StartupTable";
import { getStartups } from "@/lib/api/startups";

export const metadata = {
  title: "Manage Startups",
  description: "Review and manage startups registered on StartupForge.",
};

const AdminStartupsPage = async () => {
  const data = await getStartups();
  const startups = Array.isArray(data) ? data : [];

  return (
    <div className="min-h-screen bg-[#0d0d0f] p-8 text-neutral-100">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-neutral-200">
            Startups for review
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Total items submitted: {startups.length}
          </p>
        </div>

        <StartupTable startups={startups} />
      </div>
    </div>
  );
};

export default AdminStartupsPage;
