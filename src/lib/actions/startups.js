"use server";

import { revalidatePath } from "next/cache";
import { serverMutation } from "../core/server";

export const createStartup = async (newStartupData) => {
  return await serverMutation("/api/startups", newStartupData);
};

export const updateStartup = async (id, data) => {
  const result = await serverMutation(`/api/startups/${id}`, data, "PATCH");
  revalidatePath("/dashboard/admin/startups");

  return result;
};

// const baseUrl = process.env.NEXT_PUBLIC_API_URL;
// export const createStartup = async (newStartupData) => {
//   const res = await fetch(`${baseUrl}/api/startups`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(newStartupData),
//   });

//   return res.json();
// };
