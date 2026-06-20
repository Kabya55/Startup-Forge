import { requireRole } from "@/lib/core/session";

export const metadata = {
  title: "Collaborator Dashboard",
  description: "Track your opportunity applications, view matches, and manage your career profile.",
};

const CollaboratorLayout = async ({ children }) => {
  await requireRole("collaborator");
  return <div>{children}</div>;
};

export default CollaboratorLayout;
