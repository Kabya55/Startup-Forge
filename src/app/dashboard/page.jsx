import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getUserSession();

  if (!user) {
    redirect("/login");
  }

  // Redirect based on role
  if (user.role === "admin") {
    redirect("/dashboard/admin");
  } else if (user.role === "founder") {
    redirect("/dashboard/founder");
  } else if (user.role === "collaborator") {
    redirect("/dashboard/collaborator");
  } else {
    redirect("/login");
  }

  return null;
}
