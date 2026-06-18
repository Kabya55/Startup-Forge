import StatsSection from "@/components/StatsSection";
import FeaturedStartupsSection from "@/components/FeaturedStartupsSection";
import FeaturedOpportunitiesSection from "@/components/FeaturedOpportunitiesSection";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";

export default async function Home() {
  let stats = {
    totalApplications: 0,
    totalStartups: 0,
    totalOpportunities: 0
  };
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [appRes, startupRes, oppRes] = await Promise.all([
      fetch(`${apiUrl}/api/applications/count`, { cache: "no-store" }),
      fetch(`${apiUrl}/api/startups/count`, { cache: "no-store" }),
      fetch(`${apiUrl}/api/opportunities/count`, { cache: "no-store" })
    ]);

    if (appRes.ok) {
      const data = await appRes.json();
      stats.totalApplications = data.totalApplications || 0;
    }
    if (startupRes.ok) {
      const data = await startupRes.json();
      stats.totalStartups = data.totalStartups || 0;
    }
    if (oppRes.ok) {
      const data = await oppRes.json();
      stats.totalOpportunities = data.totalOpportunities || 0;
    }
  } catch (err) {
    console.error("Failed to fetch landing stats on server:", err);
  }

  return (
    <main className="flex min-h-screen flex-col bg-black">
      <StatsSection initialStats={stats} />
      <FeaturedStartupsSection />
      <FeaturedOpportunitiesSection />
      <FeaturesSection />
      <CTASection />
    </main>
  );
}