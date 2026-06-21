"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { ArrowUp, User, Mail, Shield, Sparkles } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function CollaboratorProfilePage() {
  const { data: session, isPending } = useSession();

  // Full Database User Object State
  const [userData, setUserData] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Modal Visibility State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields State
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const token = session?.session?.token;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        }
      );
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (session?.session?.token) {
      fetchUserProfile();
    } else if (!isPending) {
      setIsLoadingProfile(false);
    }
  }, [session, isPending]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    let imageUrl = imagePreview;

    try {
      // 1. Upload logo via ImgBB if there's a new file
      if (imageFile) {
        setIsUploading(true);
        const imgData = new FormData();
        imgData.append("image", imageFile);

        const imgbbApiKey =
          process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API ||
          "faf00257f10ee8655832b6d9a48f02a6";
        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
          {
            method: "POST",
            body: imgData,
          },
        );
        const result = await response.json();
        if (result?.data?.url) {
          imageUrl = result.data.url;
        } else {
          toast.error("Profile image upload failed. Using current image.");
        }
        setIsUploading(false);
      }

      // 2. Submit to backend
      const token = session?.session?.token;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            name,
            image: imageUrl,
            skills,
            bio,
          }),
          credentials: "include",
        },
      );

      if (res.ok) {
        toast.success("Profile updated successfully!");
        await fetchUserProfile(); // Fetch fresh data from database
        setIsModalOpen(false);
      } else {
        toast.error("Failed to update profile details.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during submission.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending || isLoadingProfile) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const user = userData || session?.user;

  return (
    <div className="p-4 sm:p-6 md:p-10 space-y-6 bg-zinc-950 min-h-screen text-white w-full max-w-[100vw] sm:max-w-7xl mx-auto overflow-x-hidden sm:overflow-visible">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 w-full">
        <div className="w-full flex-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight break-words">
            Collaborator Profile
          </h1>
          <p className="text-sm text-zinc-400 mt-1 break-words whitespace-normal">
            Maintain your personal developer, designer, or marketer skills profile to get matching founder offers.
          </p>
        </div>
        <div className="w-full sm:w-auto shrink-0">
          <Button
            onClick={() => {
              // Populate input fields with current user state when opening modal
              setName(user?.name || "");
              setBio(user?.bio || "");
              setSkills(user?.skills || "");
              setImagePreview(user?.image || "");
              setImageFile(null);
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto bg-violet-600 hover:bg-violet-750 text-white font-bold rounded-xl px-6 transition-all"
          >
            Update Profile
          </Button>
        </div>
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start border-b border-zinc-800 pb-8">
          {/* Avatar container */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-zinc-700 overflow-hidden bg-zinc-950 flex items-center justify-center shrink-0 shadow-lg">
            {user?.image ? (
              <>
                <img
                  src={user.image}
                  alt={user.name || "Profile picture"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    if (e.currentTarget.nextSibling) {
                      e.currentTarget.nextSibling.style.display = "block";
                    }
                  }}
                />
                <User style={{ display: "none" }} className="text-zinc-500 w-12 h-12" />
              </>
            ) : (
              <User className="text-zinc-500 w-12 h-12" />
            )}
          </div>

          {/* Profile Core Data Display */}
          <div className="flex-1 space-y-4 text-center md:text-left w-full">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-white break-all">
                {user?.name || "Anonymous User"}
              </h2>
              <p className="text-zinc-450 flex items-center justify-center md:justify-start gap-2 text-sm break-all">
                <Mail className="w-4 h-4 text-zinc-550 shrink-0" />
                {user?.email}
              </p>
            </div>

            {/* Badges details grid */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <span className="flex items-center gap-1.5 text-xs font-semibold bg-zinc-950 border border-zinc-800 text-zinc-300 px-3.5 py-1.5 rounded-full capitalize">
                <Shield className="w-3.5 h-3.5 text-violet-400" />
                Role: {user?.role || "Collaborator"}
              </span>

              <span className="text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3.5 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-yellow-550" />
                Plan: {user?.package?.replace("collaborator_", "")?.replace("founder_", "") || "Free"}
              </span>

              {/* {user?.isPremium && (
                <span className="text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3.5 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                  ★ Premium Member
                </span>
              )} */}
            </div>
          </div>
        </div>

        {/* Expertise / Skills section */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-zinc-300">My Expertise & Skills</h3>
          {user?.skills ? (
            <div className="flex flex-wrap gap-2 bg-zinc-950/40 border border-zinc-850 p-5 rounded-2xl">
              {user.skills
                .split(",")
                .map((skill) => skill.trim())
                .filter((skill) => skill !== "")
                .map((skill, index) => (
                  <span
                    key={index}
                    className="text-sm font-semibold bg-zinc-800 border border-zinc-700/80 text-zinc-200 px-4 py-1.5 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
            </div>
          ) : (
            <div className="text-zinc-550 italic text-sm bg-zinc-950/40 border border-zinc-850 p-6 rounded-2xl text-center">
              No skills added yet. Click "Update Profile" to display your skills.
            </div>
          )}
        </div>

        {/* Bio summary section */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-zinc-300">Bio / Professional Summary</h3>
          <div className="bg-zinc-950/40 border border-zinc-850 p-5 rounded-2xl">
            <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
              {user?.bio || "Describe your professional background, past project achievements, and skill expertise here..."}
            </p>
          </div>
        </div>
      </div>

      {/* UPDATE PROFILE POPUP MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 text-left my-8 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="border-b border-zinc-850 pb-4">
              <h2 className="text-2xl font-bold text-white">Update Profile Settings</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Edit your developer, designer, or creator credentials below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image upload inside modal */}
              <div className="flex items-center gap-4 border border-zinc-800 rounded-2xl p-4 bg-zinc-950">
                <div className="w-14 h-14 border border-dashed border-zinc-750 hover:border-zinc-650 bg-zinc-900 flex items-center justify-center rounded-xl overflow-hidden relative shrink-0">
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          if (e.currentTarget.nextSibling) {
                            e.currentTarget.nextSibling.style.display = "block";
                          }
                        }}
                      />
                      <ArrowUp style={{ display: "none" }} className="w-5 h-5 text-zinc-500" />
                    </>
                  ) : (
                    <ArrowUp className="w-5 h-5 text-zinc-500" />
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-zinc-300">
                    {isUploading ? "Uploading Image..." : "Upload Profile Picture"}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-xs text-zinc-400 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-750 cursor-pointer"
                  />
                </div>
              </div>

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-350">Full Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full h-[56px] border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 focus:bg-zinc-950 focus:border-violet-500 text-white rounded-xl px-3.5 text-sm outline-none transition-colors"
                />
              </div>

              {/* Email (Gmail disabled) */}
              <div className="flex flex-col gap-1.5 opacity-60">
                <label className="text-xs font-semibold text-zinc-350">Email Address (Gmail cannot be edited)</label>
                <input
                  disabled
                  type="email"
                  value={user?.email || ""}
                  className="w-full h-[56px] border border-zinc-800 bg-zinc-950/45 text-zinc-400 rounded-xl px-3.5 text-sm outline-none cursor-not-allowed"
                />
              </div>

              {/* Skills */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-350">Skills (Comma separated)</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. React, Node.js, Photoshop, Figma, SEO"
                  className="w-full h-[56px] border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 focus:bg-zinc-950 focus:border-violet-500 text-white rounded-xl px-3.5 text-sm outline-none transition-colors"
                />
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-350">Bio / Professional Summary</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell co-founders about yourself, past experiences, and goals..."
                  rows={4}
                  className="w-full min-h-[100px] border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 focus:bg-zinc-950 focus:border-violet-500 text-white rounded-xl p-3.5 text-sm outline-none transition-colors"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-850">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setImageFile(null);
                  }}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-750 text-white font-bold rounded-2xl text-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-violet-600 hover:bg-violet-750 text-white font-bold rounded-2xl text-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {isSaving ? "Saving..." : "Save Updates"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
