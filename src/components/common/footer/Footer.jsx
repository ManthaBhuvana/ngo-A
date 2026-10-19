"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SOCIALS = [
  {
    href: "https://www.instagram.com/avasa.foundation/",
    src: "instagram",
    emoji: "📸",
  },
  {
    href: "https://www.youtube.com/@avasafoundation-f1q",
    src: "youtube",
    emoji: "📺",
  },
  {
    href: "https://www.facebook.com/share/16EjtnRFj8/",
    src: "facebook",
    emoji: "👥",
  },
  {
    href: "https://www.linkedin.com/company/the-avasa-foundation/?originalSubdomain=in",
    src: "linkedin",
    emoji: "💼",
  },
];

const QUICK_LINKS = [
  { name: "About Us", icon: "ℹ️", href: "/aboutus" },
  { name: "Our Work", icon: "🛠️", href: "/ourwork" },
  { name: "Join us", icon: "📞", href: "/joinus" },
  { name: "Contact Us", icon: "🔒", href: "/contactus" },
];

const ADDRESS = (
  <span className="block text-left">
    H.no.6-3-1100/A-1, ground floor,
    <br />
    near matrika hospital, Thyagaraja nagar,
    <br />
    Somajiguda, Hyderabad -500082.
  </span>
);

const Footer = () => {
  const router = useRouter();
  const copyrightYear = 2026;

  return (
    <footer
      className="relative z-50 flex-none w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black px-4 py-8 text-white shadow-2xl sm:px-8 lg:px-12"
    >
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:gap-10">
        {/* Follow Us */}
        <div className="mb-0 flex flex-1 flex-col items-center md:items-start">
          <h3 className="mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-lg font-bold tracking-wide text-transparent drop-shadow sm:text-xl">
            🌟 Follow Us
          </h3>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {SOCIALS.map(({ href, src, emoji }) => (
              <a
                key={src}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit Avasa Foundation on ${src}`}
                className="group relative"
              >
                <div className="relative">
                  <img
                    src={`https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/${src}.svg`}
                    alt=""
                    className="h-7 w-7 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow sm:h-8 sm:w-8"
                    style={{ filter: "invert(1) brightness(2)" }}
                  />

                  <span className="absolute -right-2 -top-2 text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {emoji}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-0 flex flex-1 flex-col items-center md:items-start">
          <h3 className="mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-lg font-bold tracking-wide text-transparent drop-shadow sm:text-xl">
            🚀 Quick Links
          </h3>

          <ul className="flex flex-wrap items-start justify-center gap-x-4 gap-y-2 text-sm font-medium md:flex-col">
            {QUICK_LINKS.map(({ name, icon, href }) => (
              <li key={name} className="group">
                <Link
                  href={href}
                  className="flex items-center gap-2 text-white transition-all duration-300 hover:translate-x-1 hover:text-pink-400"
                >
                  <span className="text-xs">{icon}</span>
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Us */}
        <div className="flex flex-1 flex-col items-center md:items-start">
          <h3 className="mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-lg font-bold tracking-wide text-transparent drop-shadow sm:text-xl">
            📞 Contact Us
          </h3>

          <div className="text-center text-sm md:text-left">
            <p className="mb-2 flex items-center justify-center gap-2 text-white md:justify-start">
              <span>📧</span>
              Email:{" "}
              <a
                href="mailto:avasafoundation28@gmail.com"
                className="break-all underline transition-colors hover:text-pink-400"
              >
                avasafoundation28@gmail.com
              </a>
            </p>

            <p className="mb-4 flex items-start justify-center gap-2 text-white md:justify-start">
              <span>📍</span>
              Address:{" "}
              <span className="block text-xs text-gray-300 sm:text-sm">
                {ADDRESS}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/payment")}
            className="relative mt-4 w-40 overflow-hidden border-2 border-pink-300 bg-gradient-to-r from-pink-500 to-pink-700 px-6 py-2 text-xs font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-pink-600 hover:to-pink-800 hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] md:mt-0"
          >
            <span className="relative z-10">SUPPORT A CAUSE</span>
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 opacity-0 transition-opacity duration-300 hover:opacity-20" />
          </button>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative z-10 mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
        <span className="font-semibold text-pink-400">Avasa Foundation</span>{" "}
        &copy; {copyrightYear} &mdash; All rights reserved.

        <div className="mt-2 flex flex-col items-center justify-center gap-1 text-xs text-gray-500">
          <span>Registered NGO: AVASA FOUNDATION, Reg. No. 1108</span>
          <span className="max-w-xs break-words sm:max-w-none">
            H.no.6-3-1100/A-1, ground floor, near matrika hospital, Thyagaraja
            nagar, Somajiguda, Hyderabad -500082.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;