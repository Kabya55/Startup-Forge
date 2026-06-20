import { getUserSession } from "@/lib/core/session";
import StartupProfile from "./StartupProfile";
import { getFounderStartup } from "@/lib/api/startups";

export const metadata = {
  title: "Startup Profile",
  description: "Manage and update your startup details, logo, and website link.",
};

const StartupPage = async () => {
  const user = await getUserSession();
  const startup = await getFounderStartup();
  return (
    <div>
      <StartupProfile founder={user} founderStartup={startup} />
    </div>
  );
};

export default StartupPage;
