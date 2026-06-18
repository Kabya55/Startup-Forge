import { protectedFetch } from "../core/server";

export const getApplications = async () => {
  return protectedFetch("/api/applications");
};

export const getApplicationsByApplicent = async () => {
  return getApplications();
};

export const getCollaboratorStats = async () => {
  return protectedFetch("/api/collaborator/stats");
};
