"use client";

import { Button } from "@heroui/react";
import { ArrowUpRight } from "@gravity-ui/icons";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function ApplyButton({ opportunityId, userRole, hasApplied }) {
  const router = useRouter();
 
  const handleApply = () => {
    if (userRole !== "collaborator") {
      toast.error(
        "You are not a collaborator. You cannot apply for this opportunity.",
      );
      return;
    }
 
    router.push(`/opportunities/${opportunityId}/apply`);
  };
 
  return (
    <Button
      onPress={handleApply}
      isDisabled={hasApplied}
      disabled={hasApplied}
      className={`w-full font-bold py-6 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 text-sm ${
        hasApplied
          ? "bg-zinc-800/50 text-zinc-500 border border-zinc-800 cursor-not-allowed opacity-80"
          : "text-violet-400 hover:text-violet-300 bg-white/[0.02] border border-white/5 hover:bg-white/[0.05]"
      }`}
      endContent={!hasApplied && <ArrowUpRight className="w-4 h-4" />}
    >
      {hasApplied ? "Already Applied" : "Apply For This Opportunity"}
    </Button>
  );
}
