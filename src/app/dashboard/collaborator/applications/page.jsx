// import ApplicationsTable from './ApplicationTable';

import { getApplicationsByApplicent } from "@/lib/api/applications";
import { getUserSession } from "@/lib/core/session";
import ApplicationsTable from "./ApplicationTable";

export const metadata = {
  title: "My Applications",
  description: "Track the status of your submitted opportunity applications on StartupForge.",
};

const ApplicationsPage = async () => {
  const user = await getUserSession();
  const opportunities = await getApplicationsByApplicent(user.id);
  return (
    <div>
      <h1>Applications: {opportunities.length}</h1>
      <ApplicationsTable opportunities={opportunities}></ApplicationsTable>
    </div>
  );
};

export default ApplicationsPage;
