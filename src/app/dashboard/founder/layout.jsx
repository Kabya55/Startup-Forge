import { requireRole } from "@/lib/core/session";

export const metadata = {
  title: "Founder Dashboard",
  description: "Manage your opportunity listings, search applicants, and update your startup profile.",
};

const FounderLayout = async ({ children }) => {
  await requireRole("founder");
  return <div>{children}</div>;
};

export default FounderLayout;
