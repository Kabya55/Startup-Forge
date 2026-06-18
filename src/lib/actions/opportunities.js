"use server";

import { serverMutation } from "../core/server";

export const createOpportunity = async (newOpportunityData) => {
  return await serverMutation("/api/opportunities", newOpportunityData);
};

export const updateOpportunity = async (id, updatedData) => {
  return await serverMutation(`/api/opportunities/${id}`, updatedData, "PATCH");
};

export const deleteOpportunity = async (id) => {
  return await serverMutation(`/api/opportunities/${id}`, {}, "DELETE");
};
