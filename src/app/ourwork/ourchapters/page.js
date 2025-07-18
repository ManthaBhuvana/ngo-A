"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// --- PRECISE DATA FOR INDIAN CHAPTERS ---
const chapters = [
  {
    id: "jaipur",
    name: "Jaipur",
    img: "/images/chapter-jaipur.jpg",
    volunteers: 120,
    contact: "jaipur@ngo-a.org",
    position: { top: "34%", left: "36%" },
  },
  {
    id: "hyd",
    name: "Hyderabad",
    img: "/images/chapter-hyd.jpg",
    volunteers: 220,
    contact: "hyd@ngo-a.org",
    position: { top: "62%", left: "44%" },
  },
];

// --- Local Components ---

const MapPin = ({ chapter, onMouseEnter, onMouseLeave, isHovered }) => (
  <motion.div
    onMouseEnter={() => onMouseEnter(chapter.id)}
    onMouseLeave={onMouseLeave}
    className="absolute z-10 cursor-pointer"
    style={{
      left: chapter.position.left,
      top: chapter.position.top,
      transform: "translate(-50%, -50%)",
    }}
    whileHover={{ scale: 1.5 }}
  >
    <div
      className={`w-4 h-4 rounded-full bg-pink-500 transition-all duration-300 ${
        isHovered ? "shadow-[0_0_15px_rgba(236,72,153,0.8)]" : "shadow-md"
      }`}
    ></div>
    <div className="absolute w-4 h-4 rounded-full bg-pink-500 animate-ping"></div>
  </motion.div>
);

const ChapterCard = ({ chapter }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -8, scale: 1.03 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="bg-neutral-900 rounded-xl flex flex-col border border-neutral-800 transition-shadow duration-300 hover:shadow-pink-glow"
  >
    <div className="relative h-48 w-full rounded-t-xl overflow-hidden">
      <Image
        src={chapter.img}
        alt={`View of ${chapter.name}`}
        layout="fill"
        objectFit="cover"
      />
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-2xl font-semibold text-pink-400 mb-2">
        {chapter.name}
      </h3>
      <p className="text-neutral-400 mb-4 flex-grow">
        {chapter.volunteers}+ Active Volunteers
      </p>
      <div className="mt-auto pt-4">
        <Link href={`mailto:${chapter.contact}`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="w-full bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white font-bold py-3 rounded-lg transition-all duration-300"
          >
            Contact Chapter
          </motion.button>
        </Link>
      </div>
    </div>
  </motion.div>
);

const FeatureListItem = ({ title, description }) => (
  <motion.div
    variants={itemVariants}
    className="border-t border-neutral-800 py-6"
  >
    <h3 className="font-semibold text-lg text-pink-400 mb-2">{title}</h3>
    <p className="text-neutral-300 leading-relaxed">{description}</p>
  </motion.div>
);

const FaqItem = ({ question, answer }) => (
  <motion.div
    variants={itemVariants}
    className="border-t border-neutral-800 py-6"
  >
    <h3 className="font-semibold text-lg text-white mb-2">{question}</h3>
    <p className="text-neutral-400 leading-relaxed">{answer}</p>
  </motion.div>
);

// --- Main Our Chapters Page Component ---

export default function OurChaptersPage() {
  const [hoveredChapter, setHoveredChapter] = useState(null);
  const getChapterById = (id) => chapters.find((c) => c.id === id);

  return (
    <main className="text-white bg-black min-h-fit">
      {/* --- Hero Section --- */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-center p-4">
        <Image
          src="/images/chapter-hero.jpg"
          alt="A diverse group of volunteers from around India"
          layout="fill"
          objectFit="cover"
          className="z-0 opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10"></div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative z-20"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Our Roots, <span className="text-pink-500">Your Community</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-neutral-200 mx-auto max-w-3xl mb-10 leading-relaxed"
          >
            From bustling metros to local neighborhoods, our mission is powered
            by dedicated chapters across India. Find yours today.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link href="#map">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-lg shadow-pink-800/60"
              >
                Explore Our Chapters
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* --- Interactive Map Section --- */}
      <section id="map" className="relative py-24 -mt-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-pink-500 mb-12 text-center">
            Find a Chapter Near You
          </h2>
          <div className="relative w-full max-w-2xl mx-auto aspect-video rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-inner">
            <Image
              src="/images/india-map.png"
              alt="Map of India"
              layout="fill"
              objectFit="contain"
              className="opacity-10"
            />
            {chapters.map((chapter) => (
              <MapPin
                key={chapter.id}
                chapter={chapter}
                onMouseEnter={setHoveredChapter}
                onMouseLeave={() => setHoveredChapter(null)}
                isHovered={hoveredChapter === chapter.id}
              />
            ))}
            <AnimatePresence>
              {hoveredChapter && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-4 left-4 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20"
                >
                  <h3 className="font-bold text-pink-400 text-lg">
                    {getChapterById(hoveredChapter)?.name}
                  </h3>
                  <p className="text-neutral-200">
                    {getChapterById(hoveredChapter)?.volunteers}+ Volunteers
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* --- Chapter Cards Section --- */}
      <section
        id="chapter-list"
        className="bg-neutral-950 py-24 border-y border-neutral-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-pink-500 mb-12 text-center">
            Our Chapters
          </h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true, amount: 0.1 }}
            className="grid gap-10 md:grid-cols-2 max-w-4xl mx-auto"
          >
            {chapters.map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- "Heart of Community" Section --- */}
      <section className="bg-black py-24 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true, amount: 0.2 }}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <div>
              <h2 className="text-4xl font-bold text-pink-500 mb-8">
                The Heart of Our Community
              </h2>
              <div className="space-y-6">
                <FeatureListItem
                  title="Local Events & Drives"
                  description="From charity drives to awareness campaigns, our chapters are active on the ground, making a visible difference."
                />
                <FeatureListItem
                  title="Skill-Building Workshops"
                  description="We host workshops to empower our volunteers with new skills in leadership, communication, and project management."
                />
                <FeatureListItem
                  title="Collaborative Projects"
                  description="Each chapter works on unique, localized projects that address the specific needs of their community."
                />
              </div>
            </div>
            <motion.div
              variants={itemVariants}
              className="relative h-[500px] w-full"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 3 }}
                className="absolute top-0 right-0 h-4/5 w-3/5 rounded-2xl overflow-hidden shadow-2xl z-10"
              >
                <Image
                  src="/images/chapter-jaipur.jpg"
                  alt="Jaipur chapter activity"
                  layout="fill"
                  objectFit="cover"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, rotate: -2 }}
                className="absolute bottom-0 left-0 h-3/5 w-2/5 rounded-2xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="/images/chapter-hyd.jpg"
                  alt="Hyderabad chapter activity"
                  layout="fill"
                  objectFit="cover"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="bg-neutral-950 py-24 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-pink-500 mb-12 text-center">
              Starting a Chapter: FAQs
            </h2>
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={containerVariants}
              viewport={{ once: true, amount: 0.1 }}
              className="space-y-6"
            >
              <FaqItem
                question="What is the first step to starting a chapter?"
                answer="The first step is to reach out to us through our contact page! We'll provide you with an starter kit and guide you through the initial process of gathering interested members in your community."
              />
              <FaqItem
                question="How many people do I need to start a chapter?"
                answer="You can start with a small, dedicated core team of just 3-5 people. The most important thing is passion and commitment; your chapter will grow from there as you host events and gain visibility."
              />
              <FaqItem
                question="What kind of support will we receive from the main foundation?"
                answer="We provide comprehensive support including branding materials, a guide to best practices for events, access to our central digital platforms, and mentorship from experienced chapter leaders."
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="pt- 0 pb-0">
        <div
          className="relative min-h-[60vh] flex items-center justify-center"
          style={{ top: "10rem" }}
        >
          <div className="max-w-4xl w-full text-center px-4">
            <h2 className="text-4xl font-bold text-pink-500 mb-6">
              Ready to Lead the Change?
            </h2>
            <p className="text-lg text-neutral-300 mb-8 leading-relaxed">
              Be a pioneer in your community. We provide the resources and
              support to help you establish a new chapter and start making a
              difference right where you are.
            </p>
            <Link href="/contactus">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white font-bold py-4 px-10 rounded-full transition-all duration-300"
              >
                Start a Chapter
              </motion.button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
