import { protectedFetch } from "../core/server";

export const getUsersList = async () => {
  return protectedFetch("/api/users");
};

export const getFounderStats = async () => {
  return protectedFetch("/api/founder/stats");
};
