"use server";
import { serverFetch } from "./../core/server";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getOpportunities = async (querySearch) => {
  return serverFetch(`/api/opportunities?${querySearch}`);
};

export const getOpportunityById = async (id) => {
  return serverFetch(`/api/opportunities/${id}`);
};

export async function getStartupOpportunities(startupId, status = "active") {
  const res = await fetch(
    `${baseUrl}/api/opportunities?startupId=${startupId}&status=${status}`,
  );
  return res.json();
}
