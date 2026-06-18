import Link from "next/link";
import { LogoFacebook, LogoLinkedin, LogoGithub } from "@gravity-ui/icons";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* TOP SECTION */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* LEFT */}
          <div className="space-y-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              {/* <span className="text-2xl font-black bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                StartupForge
              </span> */}
              <Image
                src="/images/logo.png"
                alt="StartupForge Logo"
                width={150}
                height={75}
                className="w-32 sm:w-[150px]"
                suppressHydrationWarning
              />
            </Link>

            {/* Description */}
            <p className="max-w-xs leading-8 text-zinc-400 text-sm">
              The premier co-founder matching and startup team builder platform.
              Connecting visionary founders with top-tier collaborators.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-4">
              <Link
                href="https://www.facebook.com/kabya55"
                target="_blank"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 hover:border-violet-500 text-zinc-400 hover:text-white transition-all"
              >
                <LogoFacebook className="h-4 w-4" suppressHydrationWarning />
              </Link>

              <Link
                href="https://github.com/Kabya55"
                target="_blank"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 hover:border-violet-500 text-zinc-400 hover:text-white transition-all"
              >
                <LogoGithub className="h-4 w-4" suppressHydrationWarning />
              </Link>

              <Link
                href="https://www.linkedin.com/in/kabya-kishor-halder"
                target="_blank"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 hover:border-violet-500 text-zinc-400 hover:text-white transition-all"
              >
                <LogoLinkedin className="h-4 w-4" suppressHydrationWarning />
              </Link>
            </div>
          </div>

          {/* EXPLORE */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-violet-400">
              Explore
            </h3>

            <ul className="space-y-4 text-sm text-zinc-400">
              <li>
                <Link
                  href="/opportunities"
                  className="transition hover:text-white"
                >
                  Browse Opportunities
                </Link>
              </li>
              <li>
                <Link href="/startups" className="transition hover:text-white">
                  Browse Startups
                </Link>
              </li>
              <li>
                <Link href="/packages" className="transition hover:text-white">
                  Premium Packages
                </Link>
              </li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-violet-400">
              Company
            </h3>

            <ul className="space-y-4 text-sm text-zinc-400">
              <li>
                <Link href="#" className="transition hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="transition hover:text-white">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="#" className="transition hover:text-white">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT INFO */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-violet-400">
              Contact Us
            </h3>

            <ul className="space-y-4 text-sm text-zinc-400">
              <li>Email: kabyakishor017@gmail.com</li>
              <li>Phone: +8801750084574</li>
              <li>Address: Bisal,Swarupkathi,Pirojpur,Barishal,Bangladesh</li>
            </ul>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-zinc-800/80 pt-8 text-xs text-zinc-500 md:flex-row">
          <p>
            {`Copyright © ${new Date().getFullYear()} — StartupForge. All rights reserved Kabya.`}
          </p>

          <div className="flex items-center gap-6">
            <Link href="#" className="transition hover:text-zinc-350">
              Terms & Policy
            </Link>

            <Link href="#" className="transition hover:text-zinc-350">
              Privacy Guideline
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
