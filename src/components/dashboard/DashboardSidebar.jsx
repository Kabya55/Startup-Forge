"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Briefcase,
  FileText,
  Building,
  User,
  Users,
  CreditCard,
  PlusCircle,
  MoreVertical,
  X,
} from "lucide-react";

export default function DashboardSidebar({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const founderNavLinks = [
    { icon: Home, href: "/dashboard/founder", label: "Overview" },
    { icon: Building, href: "/dashboard/founder/company", label: "My Startup" },
    {
      icon: PlusCircle,
      href: "/dashboard/founder/opportunities/new",
      label: "Add Opportunity",
    },
    {
      icon: Briefcase,
      href: "/dashboard/founder/opportunities",
      label: "Manage Opportunities",
    },
    {
      icon: FileText,
      href: "/dashboard/founder/applications",
      label: "Applications",
    },
  ];

  const collaboratorNavLinks = [
    {
      icon: Home,
      href: "/dashboard/collaborator",
      label: "Overview & Applications",
    },
    { icon: Briefcase, href: "/opportunities", label: "Browse Opportunities" },
    {
      icon: User,
      href: "/dashboard/collaborator/profile",
      label: "My Profile",
    },
  ];

  const adminNavLinks = [
    { icon: Home, href: "/dashboard/admin", label: "Overview" },
    { icon: Users, href: "/dashboard/admin/users", label: "Manage Users" },
    {
      icon: Building,
      href: "/dashboard/admin/startups",
      label: "Manage Startups",
    },
    {
      icon: CreditCard,
      href: "/dashboard/admin/payments",
      label: "Transactions",
    },
  ];

  const navLinksMap = {
    collaborator: collaboratorNavLinks,
    founder: founderNavLinks,
    admin: adminNavLinks,
  };

  const navItems = navLinksMap[user?.role] || navLinksMap.collaborator;

  return (
    <>
      {/* Mobile Toggle Button (3 Dots) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden fixed top-3 left-4 z-[60] p-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg shadow-lg hover:bg-zinc-700 transition-all"
          aria-label="Open Sidebar"
        >
          <MoreVertical className="w-5 h-5" suppressHydrationWarning />
        </button>
      )}

      {/* Background Overlay for Mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/70 z-[60] backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] w-64 border-r border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between shrink-0 text-white min-h-screen transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          }`}
      >
        {/* Mobile Close Button (Cross) */}
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute top-5 right-5 p-1.5 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-md transition-colors shadow-sm"
          aria-label="Close Sidebar"
        >
          <X className="w-5 h-5" suppressHydrationWarning />
        </button>

        <div className="space-y-6">
          {/* User Badge Info */}
          <div className="border-b border-zinc-850 pb-4 pr-6">
            <p className="text-sm font-semibold text-zinc-200 truncate">
              {user?.name || "User Dashboard"}
            </p>
            <p className="text-xs text-zinc-550 capitalize mt-1">
              Role:{" "}
              <span className="text-violet-400 font-medium">{user?.role}</span>
            </p>
          </div>

          {/* Navigation items */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors group ${isActive
                    ? "bg-violet-600/15 text-violet-400 border border-violet-500/20"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white border border-transparent"
                    }`}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${isActive
                      ? "text-violet-400"
                      : "text-zinc-500 group-hover:text-white"
                      }`}
                    suppressHydrationWarning
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-zinc-850">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-500 hover:text-zinc-350 transition-colors"
          >
            &larr; Back to Main Site
          </Link>
        </div>
      </aside>
    </>
  );
}
