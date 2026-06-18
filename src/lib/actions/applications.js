"use server";

import { serverMutation } from "../core/server";

export const submitApplication = async (payload) => {
  return serverMutation(`/api/applications`, payload);
};

export const updateApplicationStatus = async (id, status) => {
  return serverMutation(`/api/applications/${id}/status`, { status }, "PATCH");
};
