"use client";

import React, { useState, useEffect, useCallback, Suspense, lazy } from "react";
import "@/app/globals.css";

const BackgroundLines = lazy(() =>
  import("@/components/utils/background/background-lines")
);

const games = [
  { title: "Care Meal", image: "/main gallery/a.webp", description: "Serving smiles and lunch at Nayasawera NGO, Jaipur." },
  { title: "Refreshment Drive", image: "/main gallery/b.webp", description: "Serving smiles and energy through every sip and snack." },
  { title: "Beat the Heat Drive", image: "/main gallery/c.webp", description: "Bringing cool relief to warm days — serving hydration with heart." },
  { title: "Golden Bonds", image: "/main gallery/d.webp", description: "Sharing smiles and stories with the golden generation." },
  { title: "Threads of Kindness", image: "/main gallery/e.webp", description: "From our hearts to their hands — a gesture of warmth and dignity." },
  { title: "Health in Hand", image: "/main gallery/f.webp", description: "Distributing essential medical kits — a step towards safer, healthier lives." },
  { title: "Nourish with Love", image: "/main gallery/g.webp", description: "Serving not just food, but kindness and connection." },
  { title: "Steps of Joy", image: "/main gallery/h.webp", description: "Dancing beyond limits, spreading joy and confidence with every move." },
  { title: "Golden Moments", image: "/main gallery/i.webp", description: "Spreading joy and warmth while celebrating with the wise hearts of our community." },
  { title: "Little lights", image: "/main gallery/j.webp", description: "Sharing laughter, stories, and unforgettable moments with the bright stars of tomorrow." },
  { title: "Meals that matter", image: "/main gallery/k.webp", description: "Extending a helping hand with every meal to those who need it most." },
  { title: "Milestone Moment", image: "/main gallery/l.webp", description: "Celebrating our official registration — a new chapter of purpose and impact begins." },
  { title: "Meals of Kindness", image: "/main gallery/m.webp", description: "Joining hands to serve nourishing meals with love at the NGO." },
  { title: "Young Connections", image: "/main gallery/n.webp", description: "Spreading smiles and inspiration while engaging with bright young minds at the government school." },
  { title: "Medikit Drive", image: "/main gallery/o.webp", description: "Providing essential health kits to support safer and healthier communities." },
  { title: "Cool Relief", image: "/main gallery/p.webp", description: "A small gesture to help beat the heat — refreshing drinks for those in need." },
  { title: "Hygiene for her", image: "/main gallery/q.webp", description: "Empowering women with access to menstrual hygiene and dignity." },
  { title: "Joyful Bonds", image: "/main gallery/r.webp", description: "Creating joyful memories through laughter, love, and learning with the kids at the NGO." },
  { title: "Little Smiles", image: "/main gallery/s.webp", description: "A day full of fun, friendship, and heartfelt connection." },
  { title: "Equip to Learn", image: "/main gallery/t.webp", description: "Equipping young minds with the tools to learn, dream, and grow." },
  { title: "Wellness for Women", image: "/main gallery/u.webp", description: "Spreading awareness and distributing sanitary pads to support women's hygiene and dignity in the village." },
  { title: "Lunch with Love", image: "/main gallery/v.webp", description: "Spending heartfelt moments over lunch, laughter, and stories with the elderly." },
  { title: "Care & Connection", image: "/main gallery/w.webp", description: "Lighting up young hearts with time, care, and kindness." },
  { title: "Heartfelt Hours", image: "/main gallery/x.webp", description: "Time, laughter, and love — all shared in one special visit." },
  { title: "Timeless Fun", image: "/main gallery/y.webp", description: "From carrom to conversations, every moment was filled with laughter and light." },
  { title: "Roots of Change", image: "/main gallery/z.webp", description: "Sharing thoughts, solutions, and support with inspiring women in the village." },
  { title: "Wellness Outreach", image: "/main gallery/a1.webp", description: "Bringing basic healthcare closer to the slum communities through medical kits." },
  { title: "Jaipur's First Step", image: "/main gallery/a2.webp", description: "Launched our first Jaipur event by connecting with the brightest hearts — the kids." },
];

function AnimatedWord({ word }) {
  return (
    <span className="animated-word">
      {word.split("").map((char, index) => (
        <span
          key={index}
          className="animated-letter"
          style={{ animationDelay: `${index * 0.08}s` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

export default function GameCarousel() {
  const [selectedGameIndex, setSelectedGameIndex] = useState(null);

  const closeViewer = useCallback(() => {
    setSelectedGameIndex(null);
  }, []);

  useEffect(() => {
    if (selectedGameIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeViewer();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedGameIndex, closeViewer]);

  return (
    <section className="game-section centered-section">
      <div className="background-lines-wrapper">
        <Suspense fallback={null}>
          <BackgroundLines />
        </Suspense>
      </div>

      <h2 className="line-title animated-title">
        <AnimatedWord word="GALLERY" />
      </h2>

      <div className="custom-carousel">
        <div className="gallery-marquee">
          <div className="gallery-track">
            {[...games, ...games].map((game, index) => {
              const originalIndex = index % games.length;

              return (
                <button
                  type="button"
                  key={`${game.image}-${index}`}
                  className="marquee-card"
                  onClick={() => setSelectedGameIndex(originalIndex)}
                  aria-label={`Open photo: ${game.title}`}
                >
                  <img
                    src={game.image}
                    alt={game.title}
                    draggable={false}
                    loading={index < games.length ? "eager" : "lazy"}
                  />
                  <div className="marquee-card-caption">
                    <h3>{game.title}</h3>
                    <p>{game.description}</p>
                    <span className="open-photo-hint">Click to enlarge</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selectedGameIndex !== null && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery photo viewer"
          onClick={closeViewer}
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={closeViewer}
            aria-label="Close photo viewer"
          >
            &times;
          </button>

          <div
            className="lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              className="lightbox-image"
              src={games[selectedGameIndex].image}
              alt={games[selectedGameIndex].title}
            />
            <h2 className="lightbox-title">
              {games[selectedGameIndex].title}
            </h2>
            <p className="lightbox-description">
              {games[selectedGameIndex].description}
            </p>
            <div className="lightbox-counter">
              {selectedGameIndex + 1} / {games.length}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .game-section {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 36px 0;
          background: #000;
          color: white;
        }

        .background-lines-wrapper {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .line-title {
          position: relative;
          z-index: 2;
          margin: 0 auto 36px;
          padding: 12px 20px;
          text-align: center;
          font-size: clamp(2.4rem, 5vw, 4.5rem);
          font-weight: 700;
          text-transform: uppercase;
          background: rgba(0, 0, 0, 0.7);
          color: #ff69b4;
        }

        .animated-word,
        .animated-letter {
          display: inline-block;
        }

        .animated-letter {
          opacity: 0;
          animation: letterIn 0.5s ease forwards;
        }

        .custom-carousel {
          position: relative;
          z-index: 1;
          width: 100%;
          overflow: hidden;
        }

        .gallery-marquee {
          width: 100%;
          overflow: hidden;
          padding: 28px 0 40px;
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 4%,
            black 96%,
            transparent
          );
          mask-image: linear-gradient(
            to right,
            transparent,
            black 4%,
            black 96%,
            transparent
          );
        }

        .gallery-track {
          display: flex;
          align-items: center;
          gap: 28px;
          width: max-content;
          animation: gallery-flow 110s linear infinite;
          will-change: transform;
        }

        .gallery-marquee:hover .gallery-track {
          animation-play-state: paused;
        }

        .marquee-card {
          position: relative;
          display: block;
          flex: 0 0 320px;
          width: 320px;
          height: 400px;
          padding: 0;
          overflow: hidden;
          border: 1px solid rgba(255, 105, 180, 0.22);
          border-radius: 16px;
          background: #222;
          text-align: left;
          cursor: pointer;
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .marquee-card:hover {
          transform: translateY(-7px) scale(1.025);
          box-shadow: 0 0 28px rgba(255, 105, 180, 0.3);
        }

        .marquee-card > img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.4s ease;
        }

        .marquee-card:hover > img {
          transform: scale(1.04);
        }

        .marquee-card::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.02) 28%,
            rgba(0, 0, 0, 0.88) 100%
          );
        }

        .marquee-card-caption {
          position: absolute;
          z-index: 1;
          right: 0;
          bottom: 0;
          left: 0;
          padding: 24px 20px;
          color: white;
        }

        .marquee-card-caption h3 {
          margin: 0 0 8px;
          color: #ff69b4;
          font-size: 21px;
          font-weight: 700;
        }

        .marquee-card-caption p {
          margin: 0;
          color: white;
          font-size: 14px;
          line-height: 1.5;
        }

        .open-photo-hint {
          display: inline-block;
          margin-top: 10px;
          color: #ffc2e1;
          font-size: 12px;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .marquee-card:hover .open-photo-hint,
        .marquee-card:focus-visible .open-photo-hint {
          opacity: 1;
        }

        .gallery-lightbox {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 70px 24px 24px;
          background: rgba(0, 0, 0, 0.96);
          backdrop-filter: blur(8px);
          animation: lightboxIn 0.2s ease both;
        }

        .lightbox-content {
          width: min(900px, 90vw);
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          text-align: center;
        }

        .lightbox-image {
          display: block;
          max-width: 100%;
          max-height: 65vh;
          width: auto;
          height: auto;
          object-fit: contain;
          border-radius: 10px;
          box-shadow: 0 0 32px rgba(255, 105, 180, 0.15);
        }

        .lightbox-title {
          margin: 0;
          color: #ff69b4;
          font-size: clamp(20px, 3vw, 30px);
          font-weight: 700;
        }

        .lightbox-description {
          margin: 0;
          max-width: 650px;
          color: #fff;
          font-size: 15px;
          line-height: 1.6;
        }

        .lightbox-counter {
          color: #ccc;
          font-size: 14px;
        }

        .lightbox-close {
          position: absolute;
          top: 18px;
          right: 24px;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 46px;
          height: 46px;
          border: 1px solid #555;
          border-radius: 50%;
          background: #222;
          color: white;
          font-size: 32px;
          line-height: 1;
          cursor: pointer;
        }

        .lightbox-close:hover {
          background: #333;
        }

        @keyframes gallery-flow {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes letterIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes lightboxIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @media (max-width: 767px) {
          .game-section {
            padding: 28px 0;
          }

          .line-title {
            margin-bottom: 22px;
            font-size: 30px;
          }

          .gallery-track {
            gap: 16px;
            animation-duration: 85s;
          }

          .marquee-card {
            flex-basis: 245px;
            width: 245px;
            height: 330px;
          }

          .marquee-card-caption {
            padding: 18px 14px;
          }

          .marquee-card-caption h3 {
            font-size: 18px;
          }

          .marquee-card-caption p {
            font-size: 12px;
          }

          .lightbox-content {
            width: 94vw;
          }

          .lightbox-image {
            max-height: 55vh;
          }

          .lightbox-close {
            top: 12px;
            right: 12px;
          }

          .lightbox-description {
            font-size: 13px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gallery-track {
            animation: none;
          }

          .animated-letter,
          .gallery-lightbox {
            animation: none;
          }

          .animated-letter {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
