"use client";

import React, { useState } from "react";
import { Input, Button } from "@heroui/react";
import { Briefcase } from "@gravity-ui/icons";
import { createOpportunity } from "@/lib/actions/opportunities";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function PostOpportunityForm({ startup }) {
  const router = useRouter();
  const [workStyle, setWorkStyle] = useState("Remote");
  const [workType, setWorkType] = useState("Software");
  const [commitment, setCommitment] = useState("Full-time");
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
      work_type: workStyle,
      industry: workType,
      commitment_level: commitment,
      minSalary: data.minSalary || "0",
      maxSalary: data.maxSalary || "0",
      isRemote: workStyle === "Remote",
      location: workStyle === "Remote" ? "Remote" : data.location || workStyle,
      deadline: data.deadline,
      description: data.description || "",
      required_skills: data.required_skills,

      // Only necessary startup info will be sent
      startup_id: startup?._id,
      startup_name: startup?.startup_name || "Startup",
      logo: startup?.logo || "",
      status: "active"
    };

    try {
      const res = await createOpportunity(payload);
      if (res.insertedId) {
        toast.success("Opportunity posted successfully!");
        router.push(`/dashboard/founder/opportunities`);
        router.refresh();
      } else {
        toast.error(
          res.message ||
          "Failed to post opportunity. You might need to buy Premium if you reached the limit of 3.",
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Guard: Startup profile is required to post opportunities
  if (!startup || !startup._id) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center space-y-4">
          <p className="text-zinc-400">
            You must create and save your Startup Profile before posting team
            opportunities.
          </p>
          <Button
            onClick={() => router.push("/dashboard/founder/company")}
            className="bg-violet-600 text-white font-bold rounded-xl"
          >
            Create Startup Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 shadow-2xl space-y-8">
        {/* Form Header block */}
        <div className="border-b border-zinc-850 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Post a New Opportunity
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Fill out the details below to publish your open team position.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-2 text-xs text-zinc-400">
            <Briefcase size={14} className="text-zinc-500" />
            Posting as:{" "}
            <span className="font-semibold text-zinc-200">
              {startup.startup_name}
            </span>
            <span className="text-emerald-400 font-medium bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/50 capitalize">
              {startup.status}
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
                label="Maximum Salary (Annual USD)"
                placeholder="e.g. 120000"
                className="w-full h-[56px] border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 focus:bg-zinc-950 focus:border-violet-500 text-white rounded-xl px-3.5 text-sm outline-none transition-colors"
              />
            </div>
          </div>

          {/* Work Type Dropdown & Location Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-350">
                Work Type
              </label>
              <select
                value={workStyle}
                onChange={(e) => setWorkStyle(e.target.value)}
                className="w-full h-[56px] border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 focus:bg-zinc-950 focus:border-violet-500 text-white rounded-xl px-3.5 text-sm outline-none transition-colors cursor-pointer"
              >
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Location Input - Visible only when NOT Remote */}
            {workStyle !== "Remote" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-350">
                  Location / City
                </label>
                <Input
                  name="location"
                  required
                  label="Location / City"
                  placeholder="e.g. Austin, TX"
                  className="w-full h-[56px] border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 focus:bg-zinc-950 focus:border-violet-500 text-white rounded-xl px-3.5 text-sm outline-none transition-colors"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Deadline */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-350">
                Application Deadline
              </label>
              <Input
                required
                name="deadline"
                type="date"
                label="Application Deadline"
                placeholder=" "
                className=" h-[56px]  border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 focus:bg-zinc-950 focus:border-violet-500 text-white rounded-xl px-3.5 text-sm outline-none transition-colors"
              />
            </div>

            {/* Required Skills */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-zinc-350">
                Required Skills
              </label>
              <Input
                required
                name="required_skills"
                label="Required Skills (comma separated)"
                placeholder="e.g. React, TailwindCSS, Node.js"
                className="w-full h-[56px] border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 focus:bg-zinc-950 focus:border-violet-500 text-white rounded-xl px-3.5 text-sm outline-none transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-350">
              Opportunity Description
            </label>
            <textarea
              name="description"
              placeholder="Describe the opportunity, core responsibilities, project scope, etc."
              rows={5}
              className="w-full min-h-[120px] border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 focus:bg-zinc-950 focus:border-violet-500 text-white rounded-xl p-3.5 text-sm outline-none transition-colors"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-zinc-850">
            <Button
              type="button"
              variant="flat"
              onClick={() => router.back()}
              className="bg-zinc-800 text-zinc-300 hover:bg-zinc-750 font-bold rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl px-6"
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              Post Opportunity
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
