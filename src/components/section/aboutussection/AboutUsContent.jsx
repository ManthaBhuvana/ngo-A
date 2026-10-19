"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

export default function AboutUsContent() {
  const [selectedMember, setSelectedMember] = useState(null);

  const team = [
    {
      name: "V. Radha Priyanka",
      role: "Founder/ President",
      desc: "Visionary and compassionate, she leads Avasa with purpose, heart, and unwavering commitment to its mission.",
      img: "/meet/radha.webp",
    },
    {
      name: "V. Keerthi Sri",
      role: "Vice President",
      desc: "Provides strategic oversight, ensuring organizational alignment, operational excellence, and effective implementation of programs.",
      img: "/meet/keert.webp",
    },
    {
      name: "Ananya Pandey",
      role: "General Secretary",
      desc: "Manages administrative affairs, ensures clear communication, and upholds governance with integrity.",
      img: "/meet/ananya.webp",
    },
    {
      name: "M.V. Nageswara Rao",
      role: "Joint Secretary",
      desc: "Supports administrative functions and streamlines coordination to ensure operational efficiency.",
      img: "/meet/mvnag1.webp",
    },
    {
      name: "V. Lakshmi Prasanna",
      role: "Treasurer",
      desc: "Manages financial operations, maintains transparent records, and ensures accountable use of funds.",
      img: "/meet/prasanna2.webp",
    },
    {
      name: "K. Usha Bhargavi",
      role: "Executive member",
      desc: "Contributes to decision-making, supports program execution, and upholds the organization's mission through active involvement.",
      img: "/meet/usha.webp",
    },
    {
      name: "V. Sai Harini",
      role: "Executive member",
      desc: "Contributes in organizational activities, offering insights and assistance to drive impactful initiatives forward.",
      img: "/meet/harini2.webp",
    },
    {
      name: "Ch. Vinathi",
      role: "Head of Finance",
      desc: "Oversees financial planning, budgeting, and compliance to ensure fiscal responsibility and sustainability.",
      img: "/meet/vinathi.webp",
    },
    {
      name: "R.V.R. Vamsi",
      role: "Head of Social Media",
      desc: "Leads the organization's digital presence by strategizing, creating, and managing content to amplify outreach and engagement.",
    },
  ];

  return (
    <div className="mt-8 w-full min-h-screen text-white bg-black">
      <div className="py-16 px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl font-bold text-transparent bg-pink-500 bg-clip-text sm:text-5xl">
            About Us
          </h1>
        </motion.div>
      </div>

      <div
        id="who-we-are"
        className="grid items-center gap-8 px-4 sm:px-40 lg:grid-cols-2 scroll-mt-28"
      >
        <div>
          <h2 className="mb-6 text-3xl font-semibold text-transparent bg-pink-300 bg-clip-text sm:text-4xl">
            Who We Are
          </h2>
          <div className="text-justify space-y-4">
            <p>
              What began as a heartfelt initiative by{" "}
              <strong className="text-[#fb64b6]">V. Radha Priyanka</strong> and
              her close friends in 2022 has now grown into a registered movement
              of compassion and change. Rooted in Hyderabad, our journey started
              with simple acts—distributing clothes and food to those in need.
            </p>
            <p>
              As our vision expanded, so did our reach. We built a dedicated
              team and extended to Jaipur—taking our mission of care to more
              communities. From refreshment drives and medical kit distributions
              to visits to orphanages and old age homes, every effort is driven
              by the same purpose—to bring hope, dignity, and support.
            </p>
            <p>
              Founded in 2022 and officially incorporated as a{" "}
              <strong className="text-[#fb64b6]">
                registered NGO in November 2024
              </strong>
              , Avasa is registered under the{" "}
              <strong className="text-[#fb64b6]">
                Telangana Societies Registration Act, 2001
              </strong>{" "}
              with registration number{" "}
              <strong className="text-[#fb64b6]">1108 of 2024</strong>. This
              recognition enables us to scale our initiatives and deepen our
              commitment to meaningful, community-driven change.
            </p>
          </div>
        </div>
        <div className="overflow-hidden relative w-full h-64 rounded-xl sm:h-96">
          <Image
            fill
            src="/images/aboutus1.webp"
            alt="Avasa NGO team members"
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div
        id="what-we-do"
        className="relative px-4 py-12 py-20 sm:px-40 scroll-mt-28"
      >
        <h2 className="mb-10 text-3xl font-semibold text-center text-pink-300 sm:text-4xl lg:text-4xl">
          What We Do
        </h2>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center p-6 bg-neutral-900 rounded-xl shadow-md lg:p-8">
            <div className="overflow-hidden flex items-center justify-center mb-4 w-40 h-40 bg-neutral-800 border-2 border-pink-400">
              <Image
                src="/aboutus/love.webp"
                alt="Love and Care"
                width={160}
                height={160}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-pink-400 text-center lg:text-2xl">
              1. Love and Care
            </h3>
            <p className="text-center lg:text-lg">
              Regular visits to orphanages and old age homes to foster
              connections and holistic well-being.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-neutral-900 rounded-xl shadow-md lg:p-8">
            <div className="overflow-hidden flex items-center justify-center mb-4 w-40 h-40 bg-neutral-800 border-2 border-pink-400">
              <Image
                src="/aboutus/seasonal.webp"
                alt="Seasonal & Awareness Drives"
                width={160}
                height={160}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-pink-400 text-center lg:text-2xl">
              2. Seasonal & Awareness Drives
            </h3>
            <ul className="text-center list-disc list-inside space-y-1 lg:text-lg">
              <li>
                <strong className="text-pink-400">Winter:</strong> Warm clothing
              </li>
              <li>
                <strong className="text-pink-400">Summer:</strong> Hydration
                kits & refreshments
              </li>
              <li>
                <strong className="text-pink-400">Medical & Period Kits</strong>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center p-6 bg-neutral-900 rounded-xl shadow-md lg:p-8">
            <div className="overflow-hidden flex items-center justify-center mb-4 w-40 h-40 bg-neutral-800 border-2 border-pink-400">
              <Image
                src="/aboutus/development.webp"
                alt="Development Support"
                width={160}
                height={160}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-pink-400 text-center lg:text-2xl">
              3. Development Support
            </h3>
            <ul className="text-center list-disc list-inside space-y-1 lg:text-lg">
              <li>Educational aids: projectors, stationery</li>
              <li>Basic school infrastructure</li>
              <li>Community upliftment programs</li>
            </ul>
          </div>
        </div>
      </div>

      <h2
        id="meet-our-team"
        className="relative mb-15 text-3xl font-bold text-center text-pink-300 md:text-4xl scroll-mt-28"
      >
        Meet Our Team
      </h2>

      <div className="grid grid-cols-1 gap-8 mb-20 mx-auto px-6 max-w-7xl sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {team.map((member, index) => {
          const isSelected = selectedMember === member.name;

          return (
            <motion.div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                setSelectedMember((current) =>
                  current === member.name ? null : member.name
                );
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();

                  setSelectedMember((current) =>
                    current === member.name ? null : member.name
                  );
                }
              }}
              whileTap={{ scale: 0.98 }}
              animate={{
                scale: isSelected ? 1.035 : 1,
                borderColor: isSelected ? "#ff69b4" : "rgba(255,255,255,0.06)",
                boxShadow: isSelected
                  ? "0 0 28px rgba(255,105,180,0.38)"
                  : "0 4px 14px rgba(0,0,0,0.22)",
              }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`flex w-full flex-col items-center rounded-2xl border-2 p-6 mb-5 min-h-[350px] text-center bg-neutral-900 md:min-h-[380px] lg:min-h-[200px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 ${
                isSelected ? "border-pink-400" : "border-transparent"
              }`}
            >
              <div className="overflow-hidden flex items-center justify-center mb-10 mx-auto w-32 h-32 rounded-full">
                {member.img ? (
                  <Image
                    src={member.img}
                    alt={member.name}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-pink-400 text-4xl font-bold bg-neutral-800">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                )}
              </div>
              <h3 className="text-xl font-semibold text-white">{member.name}</h3>
              <p className="mb-2 text-sm font-medium text-pink-400">
                {member.role}
              </p>
              <p className="text-sm text-white">{member.desc}</p>
              {isSelected && (
                <span className="mt-4 text-xs font-semibold uppercase tracking-wider text-pink-300">
                  Selected member
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
