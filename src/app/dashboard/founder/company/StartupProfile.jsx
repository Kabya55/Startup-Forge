"use client";

import React, { useState } from "react";
import {
  Input,
  Button,
} from "@heroui/react";
import { Globe, Factory, Pencil, ArrowUp } from "lucide-react";
import { createStartup } from "@/lib/actions/startups";
import { toast } from "react-toastify";
import Image from "next/image";

export default function StartupProfile({ founder, founderStartup }) {
  const [startup, setStartup] = useState(founderStartup);
  const [isEditing, setIsEditing] = useState(!founderStartup?._id);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(founderStartup?.logo || "");
  const [industry, setIndustry] = useState(founderStartup?.industry || "Software");
  const [fundingStage, setFundingStage] = useState(founderStartup?.funding_stage || "Seed");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (!data.startup_name) {
      toast.error("Startup Name is required");
      setIsSaving(false);
      return;
    }

    let imageUrl = logoPreview;

    try {
      // 1. Upload to ImgBB if there's a new file
      if (logoFile) {
        setIsUploading(true);
        const imgData = new FormData();
        imgData.append("image", logoFile);

        const imgbbApiKey = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API || "faf00257f10ee8655832b6d9a48f02a6";
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
          method: "POST",
          body: imgData,
        });
        const result = await response.json();
        if (result?.data?.url) {
          imageUrl = result.data.url;
        } else {
          toast.error("Logo upload failed. Using placeholder.");
        }
        setIsUploading(false);
      }

      // 2. Submit to backend
      const payload = {
        startup_name: data.startup_name,
        logo: imageUrl || "https://i.ibb.co/5GzXkwP/avatar-placeholder.png",
        industry: industry,
        description: data.description || "",
        funding_stage: fundingStage,
        founder_email: founder?.email,
        status: startup?.status || "pending", // default pending
      };

      const res = await createStartup(payload);
      if (res.insertedId || res.modifiedCount || res.upsertedId) {
        toast.success("Startup profile saved successfully!");
        setStartup({ ...payload, _id: res.insertedId || startup?._id });
        setIsEditing(false);
      } else {
        toast.error("Failed to save startup details.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  // 1. Setup view (if not registered yet)
  if (!startup?._id && !isEditing) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center space-y-6 text-white">
        <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center mx-auto border border-zinc-800">
          <Factory size={24} className="text-violet-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">No Startup Registered</h2>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto">
            You need to set up your startup profile before you can post team opportunities or view applicant pipelines.
          </p>
        </div>
        <Button
          onClick={() => setIsEditing(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl px-6"
        >
          Create Startup Profile
        </Button>
      </div>
    );
  }

  // 2. Presentation view (if registered and not editing)
  if (startup && !isEditing) {
    return (
      <div className="max-w-4xl mx-auto my-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-8 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-4">
            {startup.logo ? (
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white p-2 border border-zinc-800 flex items-center justify-center">
                <Image
                  src={startup.logo}
                  alt={startup.startup_name}
                  width={48}
                  height={48}
                  unoptimized
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-zinc-950 flex items-center justify-center border border-zinc-800">
                <Factory size={24} className="text-zinc-650" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-extrabold text-white">
                  {startup.startup_name}
                </h1>
                <span className="text-xs px-3 py-1 rounded-full font-bold border border-emerald-900/50 bg-emerald-950/40 text-emerald-400 capitalize">
                  {startup.status || "Approved"}
                </span>
              </div>
              <p className="text-sm text-zinc-400 mt-1 flex items-center gap-1">
                <Globe size={14} className="text-zinc-500" />
                {founder?.email}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-zinc-800 hover:bg-zinc-750 text-white font-bold rounded-xl flex items-center gap-2 border border-zinc-700"
          >
            <Pencil size={14} /> Edit Profile
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-950/60 border border-zinc-800 p-5 rounded-2xl">
            <span className="text-xs text-zinc-500 uppercase font-bold block">
              Industry Category
            </span>
            <span className="text-zinc-200 font-bold mt-1 block text-lg">
              {startup.industry}
            </span>
          </div>
          <div className="bg-zinc-950/60 border border-zinc-800 p-5 rounded-2xl">
            <span className="text-xs text-zinc-500 uppercase font-bold block">
              Funding Stage
            </span>
            <span className="text-zinc-200 font-bold mt-1 block text-lg">
              {startup.funding_stage}
            </span>
          </div>
          <div className="bg-zinc-950/60 border border-zinc-800 p-5 rounded-2xl">
            <span className="text-xs text-zinc-500 uppercase font-bold block">
              Founder Email
            </span>
            <span className="text-zinc-200 font-bold mt-1 block text-sm overflow-hidden text-ellipsis">
              {startup.founder_email || founder?.email}
            </span>
          </div>
        </div>

        {/* Description */}
        {startup.description && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
              About our Vision & Culture
            </h3>
            <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap bg-zinc-950/30 border border-zinc-800/60 p-5 rounded-2xl">
              {startup.description}
            </p>
          </div>
        )}
      </div>
    );
  }

  // 3. Edit Form
  return (
    <div className="max-w-3xl mx-auto my-8 bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 text-white shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-3xl font-extrabold border-b border-zinc-850 pb-4 mb-4">
          Configure Startup Profile
        </h2>

        {/* Startup Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-350">Startup Name</label>
          <input
            required
            name="startup_name"
            defaultValue={startup?.startup_name || ""}
            placeholder="e.g. NextGen Robotics"
            className="w-full h-[56px] border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 focus:bg-zinc-950 focus:border-violet-500 text-white rounded-xl px-3.5 text-sm outline-none transition-colors"
          />
        </div>

        {/* Industry Category & Funding Stage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-350">Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
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
            <label className="text-xs font-semibold text-zinc-350">Funding Stage</label>
            <select
              value={fundingStage}
              onChange={(e) => setFundingStage(e.target.value)}
              className="w-full h-[56px] border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 focus:bg-zinc-950 focus:border-violet-500 text-white rounded-xl px-3.5 text-sm outline-none transition-colors"
            >
              <option value="Bootstrapped">Bootstrapped</option>
              <option value="Pre-seed">Pre-seed</option>
              <option value="Seed">Seed</option>
              <option value="Series A">Series A</option>
              <option value="Series B+">Series B+</option>
            </select>
          </div>
        </div>

        {/* Logo File upload */}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-350">Startup Logo</span>
          <div className="flex items-center gap-4 border border-zinc-800 rounded-xl p-4 bg-zinc-950">
            <label className="w-14 h-14 border border-dashed border-zinc-750 hover:border-zinc-650 bg-zinc-900 flex items-center justify-center cursor-pointer rounded-xl overflow-hidden relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
              ) : (
                <ArrowUp className="w-5 h-5 text-zinc-500" />
              )}
            </label>
            <div>
              <p className="text-sm font-bold text-zinc-200">
                {isUploading ? "Uploading Logo..." : "Upload Startup Logo"}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">PNG, JPG up to 5MB (Uploaded via ImgBB)</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-350">Startup Description / Pitch</label>
          <textarea
            name="description"
            defaultValue={startup?.description || ""}
            placeholder="Briefly pitch your startup mission, team values, and core goals..."
            rows={5}
            className="w-full min-h-[120px] border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 focus:bg-zinc-950 focus:border-violet-500 text-white rounded-xl p-3.5 text-sm outline-none transition-colors"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-zinc-850">
          {startup?._id && (
            <Button
              type="button"
              variant="flat"
              onClick={() => setIsEditing(false)}
              className="bg-zinc-800 text-zinc-300 hover:bg-zinc-750 font-bold rounded-xl"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            className="bg-violet-600 hover:bg-violet-750 text-white font-bold rounded-xl px-6"
            isLoading={isSaving}
            isDisabled={isSaving}
          >
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
