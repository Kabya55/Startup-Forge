"use client";

import React, { useState } from "react";
import { Input, Button } from "@heroui/react";
import { Briefcase } from "@gravity-ui/icons";
import { updateOpportunity } from "@/lib/actions/opportunities";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function EditOpportunityForm({ opportunity, startup }) {
  const router = useRouter();
  const oppId = opportunity._id?.$oid || opportunity._id;

  const [workStyle, setWorkStyle] = useState(opportunity.work_style || "Remote");
  const [workType, setWorkType] = useState(opportunity.work_type || "Software");
  const [commitment, setCommitment] = useState(opportunity.commitment_level || "Full-time");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Basic Validation
    if (!data.role_title) {
      toast.error("Opportunity Title is required");
      setIsLoading(false);
      return;
    }
    if (!data.required_skills) {
      toast.error("Required Skills are required");
      setIsLoading(false);
      return;
    }
    if (!data.deadline) {
      toast.error("Application Deadline is required");
      setIsLoading(false);
      return;
    }

    const payload = {
      role_title: data.role_title,
      work_type: workType, // Category/Industry (Software, Design, etc.)
      commitment_level: commitment,
      minSalary: data.minSalary || "0",
      maxSalary: data.maxSalary || "0",
      isRemote: workStyle === "Remote",
      work_style: workStyle, // Work Style (Remote, On-site, Hybrid)
      location: workStyle === "Remote" ? "Remote" : data.location || workStyle,
      deadline: data.deadline,
      description: data.description || "",
      required_skills: data.required_skills,
      industry: startup?.industry || "Software",
    };

    try {
      const res = await updateOpportunity(oppId, payload);
      if (res.modifiedCount > 0 || res.matchedCount > 0) {
        toast.success("Opportunity updated successfully!");
        router.push(`/dashboard/founder/opportunities`);
        router.refresh();
      } else {
        toast.error(res.message || "Failed to update opportunity details.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 shadow-2xl space-y-8">
        {/* Form Header block */}
        <div className="border-b border-zinc-850 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Edit Opportunity Listings
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Modify the parameters of your posted opportunity.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-2 text-xs text-zinc-400">
            <Briefcase size={14} className="text-zinc-500" />
            Posting as:{" "}
            <span className="font-semibold text-zinc-200">
              {startup?.startup_name || "Startup"}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Opportunity Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-350">
              Opportunity Title
            </label>
            <Input
              required
              name="role_title"
              defaultValue={opportunity.role_title || ""}
              label="Opportunity Title"
              placeholder="e.g. Lead Frontend Architect"
              className="w-full h-[56px] border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 focus:bg-zinc-950 focus:border-violet-500 text-white rounded-xl px-3.5 text-sm outline-none transition-colors"
            />
          </div>

          {/* Work Category (work_type) & Commitment Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-350">
                Work Category / Industry
              </label>
              <select
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                className="w-full h-[56px] border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 focus:bg-zinc-950 focus:border-violet-500 text-white rounded-xl px-3.5 text-sm outline-none transition-colors"
              >
                <option value="Software">Software</option>
                <option value="Fintech">Fintech</option>
                <option value="Healthcare">Healthcare</option>
                <option value="AI/ML">AI/ML</option>
                <option value="E-Commerce">E-Commerce</option>
                <option value="Education">Education</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-350">
                Commitment Level
              </label>
              <select
                value={commitment}
                onChange={(e) => setCommitment(e.target.value)}
                className="w-full h-[56px] border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 focus:bg-zinc-950 focus:border-violet-500 text-white rounded-xl px-3.5 text-sm outline-none transition-colors"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract / Freelance</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          {/* Salary Ranges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-350">
                Minimum Salary (Annual USD)
              </label>
              <Input
                name="minSalary"
                type="number"
                defaultValue={opportunity.minSalary || ""}
                label="Minimum Salary (Annual USD)"
                placeholder="e.g. 50000"
                className="w-full h-[56px] border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 focus:bg-zinc-950 focus:border-violet-500 text-white rounded-xl px-3.5 text-sm outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-350">
                Maximum Salary (Annual USD)
              </label>
              <Input
                name="maxSalary"
                type="number"
                defaultValue={opportunity.maxSalary || ""}
                label="Maximum Salary (Annual USD)"
                placeholder="e.g. 120000"
                className="w-full h-[56px] border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 focus:bg-zinc-950 focus:border-violet-500 text-white rounded-xl px-3.5 text-sm outline-none transition-colors"
              />
            </div>
          </div>

          {/* Work Style & Location (Only if On-site/Hybrid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-350">
                Work Style
              </label>
              <select
                value={workStyle}
                onChange={(e) => setWorkStyle(e.target.value)}
                className="w-full h-[56px] border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 focus:bg-zinc-950 focus:border-violet-500 text-white rounded-xl px-3.5 text-sm outline-none transition-colors"
              >
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {workStyle !== "Remote" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-350">
                  Location / City
                </label>
                <Input
                  required
                  name="location"
                  defaultValue={opportunity.location || ""}
                  label="Location / City"
                  placeholder="e.g. San Francisco, CA"
                  className="w-full h-[56px] border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 focus:bg-zinc-950 focus:border-violet-500 text-white rounded-xl px-3.5 text-sm outline-none transition-colors"
                />
              </div>
            )}
          </div>

          {/* Application Deadline */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-350">
              Application Deadline
            </label>
            <Input
              required
              name="deadline"
              type="date"
              defaultValue={opportunity.deadline || ""}
              label="Application Deadline"
              className="w-full h-[56px] border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 focus:bg-zinc-950 focus:border-violet-500 text-white rounded-xl px-3.5 text-sm outline-none transition-colors"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-350">
              Opportunity Description / Responsibilities
            </label>
            <textarea
              name="description"
              defaultValue={opportunity.description || ""}
              placeholder="Outline role responsibilities, growth potentials, or candidate details..."
              rows={6}
              className="w-full min-h-[140px] border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 focus:bg-zinc-950 focus:border-violet-500 text-white rounded-xl p-3.5 text-sm outline-none transition-colors"
            />
          </div>

          {/* Required Skills */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-350">
              Required Skills (Comma separated)
            </label>
            <Input
              required
              name="required_skills"
              defaultValue={opportunity.required_skills || ""}
              label="Required Skills"
              placeholder="e.g. React, Node.js, AWS, TailwindCSS"
              className="w-full h-[56px] border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 focus:bg-zinc-950 focus:border-violet-500 text-white rounded-xl px-3.5 text-sm outline-none transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-zinc-850">
            <Button
              type="button"
              onClick={() => router.push("/dashboard/founder/opportunities")}
              className="bg-zinc-800 hover:bg-zinc-750 text-white font-bold rounded-xl px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              className="bg-violet-600 hover:bg-violet-750 text-white font-bold rounded-xl px-6"
            >
              Save Updates
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
