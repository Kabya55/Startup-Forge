"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data: session } = authClient.useSession();
  const user = session?.user;
  const pathname = usePathname();
  const router = useRouter();

  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [user?.image]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => pathname === path;

  const handelsignout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  const navLinks = [
    { label: "Browse Startups", href: "/startups" },
    { label: "Browse Opportunities", href: "/opportunities" },
    { label: "Premium Packages", href: "/packages" },
  ];

  const dashboardLinks = {
    collaborator: "/dashboard/collaborator",
    founder: "/dashboard/founder",
    admin: "/dashboard/admin",
  };

  const targetHref = user?.role
    ? dashboardLinks[user.role] || "/dashboard/collaborator"
    : "/dashboard/collaborator";

  return (
    <nav className="sticky top-0 z-50 w-full bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Left Side: Mobile Toggle Menu + Logo */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Mobile Toggle Button (Visible only on md and sm) */}
            <button
              aria-label="Toggle Menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 md:hidden transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" suppressHydrationWarning />
              ) : (
                <Menu className="h-6 w-6" suppressHydrationWarning />
              )}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image
                src="/images/logo.png"
                alt="StartupForge Logo"
                width={150}
                height={75}
                className="w-32 sm:w-[150px]"
                suppressHydrationWarning
              />
            </Link>
          </div>

          {/* Right Side: Desktop Nav + Auth/Profile */}
          <div className="flex items-center gap-4 md:gap-8">
            {/* Desktop Navigation Links (Hidden on mobile) */}
            <div className="hidden items-center md:flex">
              <ul className="flex items-center gap-8">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`text-sm transition-colors px-3 py-2 rounded-lg ${
                        isActive(link.href)
                          ? "text-violet-400 bg-violet-500/10 font-semibold"
                          : "text-zinc-400 font-medium hover:text-white hover:bg-zinc-800/50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Auth / Profile Section (Visible on ALL devices) */}
            <div className="flex items-center relative" ref={dropdownRef}>
              {user ? (
                <div>
                  {/* Profile Image / Button */}
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-zinc-800 bg-zinc-900 transition-all hover:border-violet-500 overflow-hidden focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
                  >
                    {user.image && !imageError ? (
                      <Image
                        src={user.image}
                        alt={user.name || "Profile"}
                        width={40}
                        height={40}
                        className="object-cover h-full w-full"
                        unoptimized
                        suppressHydrationWarning
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <span className="text-violet-400 font-bold text-sm">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Menu (Desktop & Mobile) */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-56 rounded-xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-zinc-800/50 mb-1">
                        <p className="font-semibold text-sm text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-zinc-400 truncate">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        href={targetHref}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/50"
                      >
                        <LayoutDashboard className="h-4 w-4 text-violet-400" suppressHydrationWarning />
                        Dashboard
                      </Link>

                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          handelsignout();
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        <LogOut className="h-4 w-4" suppressHydrationWarning />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3 sm:gap-4">
                  <Link
                    href="/login"
                    className="hidden sm:block text-sm font-semibold text-zinc-300 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/signup"
                    className="rounded-xl bg-violet-600 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-violet-700 shadow-lg shadow-violet-600/20"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Nav Links Wrapper (Only shows navigation links now) */}
        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            isMenuOpen ? "max-h-[300px] opacity-100 py-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/95 p-4 backdrop-blur-xl shadow-xl">
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      isActive(link.href)
                        ? "bg-violet-500/10 text-violet-400 font-semibold"
                        : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
