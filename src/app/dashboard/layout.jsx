import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { getUserSession } from "@/lib/core/session";

const DashboardLayout = async ({ children }) => {
  const user = await getUserSession();
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-zinc-950">
      <DashboardSidebar user={user} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <div className="md:hidden sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-zinc-800/50 bg-zinc-950/80 px-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10" />
          </div>
        </div>

        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;