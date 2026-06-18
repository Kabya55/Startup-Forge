import { serverFetch } from "../core/server";

export const getPackageById = async (packageId) => {
  return serverFetch(`/api/packages?package_id=${packageId}`);
};
