"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Navbar />}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      {!isDashboard && <Footer />}
    </>
  );
}
