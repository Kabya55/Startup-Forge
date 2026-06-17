import { headers, cookies } from "next/headers";
import { auth } from "../auth";
import { redirect } from "next/navigation";

export const getUserSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user || null;
};

export const getUserToken = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("better-auth.session_token")?.value || cookieStore.get("__Secure-better-auth.session_token")?.value;
    if (token) {
      return token;
    }
  } catch (err) {
    console.error("Error reading session token cookie in getUserToken:", err);
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.session?.token || null;
};

export const requireRole = async (allowedRoles) => {
  const user = await getUserSession();

  // Trim user role to remove any accidental whitespace from the database
  const userRole = user?.role?.trim();

  if (!user) {
    redirect("/login");
  }

  if (Array.isArray(allowedRoles)) {
    if (!allowedRoles.includes(userRole)) {
      redirect("/unauthorized");
    }
  } else {
    if (userRole !== allowedRoles) {
      redirect("/unauthorized");
    }
  }

  return user;
};
