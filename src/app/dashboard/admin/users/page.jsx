import AdminUsersTable from "@/components/dashboard/AdminUsersTable";
import { getUsersList } from "@/lib/api/users";

export const metadata = {
  title: "Manage Users",
  description: "View and manage user accounts, roles, and permissions on StartupForge.",
};

export default async function AdminUsersPage() {
  const users = await getUsersList() || [];

  return (
    <div className="min-h-screen bg-zinc-950 p-8 text-zinc-200">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="border-b border-zinc-800 pb-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            User Management
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            Total users registered: <span className="font-semibold text-violet-400">{users.length}</span>
          </p>
        </div>

        <AdminUsersTable users={users} />
      </div>
    </div>
  );
}
