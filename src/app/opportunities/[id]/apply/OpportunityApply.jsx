"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Link, ArrowRight } from "@gravity-ui/icons";
import { submitApplication } from "@/lib/actions/applications";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const OpportunityApply = ({ opportunity, applicant }) => {
  const [portfolioLink, setPortfolioLink] = useState("");
  const [motivation, setMotivation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      opportunity_id: opportunity?._id,
      applicant_email: applicant?.email,
      portfolio_link: portfolioLink,
      motivation: motivation,
      status: "Pending",
      applied_at: new Date()
    };

    try {
      const res = await submitApplication(payload);

      if (res.insertedId) {
        toast.success("Application submitted successfully!");
        setPortfolioLink("");
        setMotivation("");
        router.push("/dashboard/collaborator");
      } else {
        toast.error(res.message || "Failed to submit application.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-6 bg-zinc-900 rounded-2xl border border-zinc-800 text-white shadow-xl">
      {/* Header */}
      <div className="mb-6">
        <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">
          Application Details
        </span>

        <h2 className="text-2xl font-bold mt-1">
          Apply for {opportunity?.role_title || "this position"}
        </h2>

        {applicant?.name && (
          <p className="text-sm text-zinc-400 mt-1">
            Applying as:{" "}
            <span className="font-semibold text-zinc-300">
              {applicant.name} ({applicant.email})
            </span>
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
        {/* Portfolio */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
            <Link className="w-4 h-4 text-violet-400" />
            Portfolio Link (Required)
          </label>
          <input
            required
            type="url"
            value={portfolioLink}
            onChange={(e) => setPortfolioLink(e.target.value)}
            placeholder="https://yourportfolio.com"
            className="w-full border border-zinc-800 rounded-xl px-3 py-2.5 bg-zinc-950 text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        {/* Motivation */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">
            Motivation Message / Covering Note
          </label>
          <textarea
            required
            rows={5}
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
            className="w-full border border-zinc-800 rounded-xl px-3 py-2.5 bg-zinc-950 text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:border-violet-500 transition-colors"
            placeholder="Introduce yourself and explain why you're a good fit for this role..."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-4">
          <Button
            type="submit"
            className="inline-flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-violet-300 transition-all bg-white/[0.02] border border-white/5 px-6 py-2.5 rounded-full hover:bg-white/[0.05]"
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
            endContent={<ArrowRight className="w-4 h-4" />}
          >
            Submit Application
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OpportunityApply;
