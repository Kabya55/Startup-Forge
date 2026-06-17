import { redirect } from "next/navigation";
import { getUserToken } from "./session";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const authHeader = async () => {
  const token = await getUserToken();
  const header = token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
  return header;
};

export const serverFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`);
  return hendelStatusCode(res);
};

export const protectedFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: await authHeader(),
  });
  return hendelStatusCode(res);
};

export const serverMutation = async (path, data, method = "POST") => {
  const res = await fetch(`${baseUrl}${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...(await authHeader()),
    },
    body: JSON.stringify(data),
  });

  return hendelStatusCode(res);
};

//  hendele 401, 403, 404
const hendelStatusCode = async (res) => {
  if (res.status === 401) {
    redirect("/unauthorized");
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    if (res.status === 403 && (!data.message || data.message === "forbidden access")) {
      redirect("/forbidden");
    }
    return data; // Return error JSON to be displayed by the component
  }

  return res.json();
};
