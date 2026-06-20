import { requireRole } from "@/lib/core/session";

export const metadata = {
  title: "Admin Dashboard",
  description: "Platform management dashboard for site administrators.",
};

const AdminDashboardLayout = async ({ children }) => {
  await requireRole("admin");
  return children;
};

export default AdminDashboardLayout;
