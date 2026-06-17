import { protectedFetch, serverFetch } from "../core/server";

export const getFounderStartup = async () => {
  return protectedFetch("/api/my/startups");
};

export const getLoggedInFounderStartup = async () => {
  return getFounderStartup();
};

export const getStartups = async (status = "") => {
  const query = status ? `?status=${status}` : "";
  return serverFetch(`/api/startups${query}`);
};

export const getStartupById = async (id) => {
  return serverFetch(`/api/startups/${id}`);
};
