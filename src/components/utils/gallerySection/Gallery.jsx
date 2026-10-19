"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS = [
  {
    title: "Literacy",
    image: "/gallery/literacy.webp",
    style: { top: "12%", left: "10%", rotate: "-18deg", zIndex: 10 },
  },
  {
    title: "Beat the Heat",
    image: "/gallery/heat.webp",
    style: { top: "18%", right: "12%", rotate: "14deg", zIndex: 9 },
  },
  {
    title: "Naya Sawera NGO",
    image: "/gallery/3.webp",
    style: { bottom: "18%", left: "8%", rotate: "-8deg", zIndex: 8 },
  },
  {
    title: "Sarthak Oldage Home",
    image: "/gallery/4.webp",
    style: { bottom: "10%", right: "8%", rotate: "22deg", zIndex: 7 },
  },
  {
    title: "Winter Drive",
    image: "/gallery/winterdrive.webp",
    style: { top: "28%", left: "22%", rotate: "-7deg", zIndex: 6 },
  },
  {
    title: "Medikit Drive",
    image: "/gallery/medikitdrive.webp",
    style: { top: "32%", right: "20%", rotate: "10deg", zIndex: 5 },
  },
  {
    title: "Food Donation Drive",
    image: "/gallery/7.webp",
    style: { bottom: "22%", left: "25%", rotate: "-15deg", zIndex: 4 },
  },
  {
    title: "Republic Day Celebrations",
    image: "/gallery/republicday.webp",
    style: { bottom: "25%", right: "25%", rotate: "16deg", zIndex: 3 },
  },
];

export function DraggableCardContainer({ className, children }) {
  return (
    <div className={cn("[perspective:2000px]", className)}>
      {children}
    </div>
  );
}

export function DraggableCardBody({
  item,
  index,
  onOpen,
  constraints,
}) {
  const pointerStart = useRef(null);
  const [dragged, setDragged] = useState(false);

  const handlePointerDown = (event) => {
    pointerStart.current = {
      x: event.clientX,
      y: event.clientY,
    };
    setDragged(false);
  };

  const handlePointerMove = (event) => {
    if (!pointerStart.current) return;

    const dx = event.clientX - pointerStart.current.x;
    const dy = event.clientY - pointerStart.current.y;

    if (Math.sqrt(dx * dx + dy * dy) > 8) {
      setDragged(true);
    }
  };

  const handleClick = (event) => {
    if (dragged) {
      event.preventDefault();
      event.stopPropagation();
      setDragged(false);
      return;
    }

    onOpen(index);
  };

  return (
    <motion.button
      type="button"
      drag
      dragConstraints={constraints}
      dragElastic={0.12}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={() => {
        // Allow the click event to run after pointer-up.
        window.setTimeout(() => {
          pointerStart.current = null;
        }, 0);
      }}
      onClick={handleClick}
      onDragStart={() => {
        setDragged(true);
        document.body.style.cursor = "grabbing";
      }}
      onDragEnd={() => {
        document.body.style.cursor = "";
        window.setTimeout(() => setDragged(false), 100);
      }}
      whileHover={{
        scale: 1.08,
        zIndex: 50,
        filter: "brightness(1.08)",
        boxShadow: "0 20px 55px rgba(236,72,153,0.4)",
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      style={{
        ...item.style,
        touchAction: "none",
      }}
      className={cn(
        "absolute flex min-h-60 w-48 cursor-pointer flex-col items-center overflow-hidden rounded-md bg-neutral-100 p-4 text-left shadow-2xl dark:bg-neutral-900",
        index === 0 && "md:top-[16%] md:left-[18%] md:[rotate:-14deg]"
      )}
      aria-label={`Enlarge photo: ${item.title}`}
    >
      <img
        src={item.image}
        alt={item.title}
        draggable={false}
        className="pointer-events-none relative z-10 h-36 w-36 select-none object-cover md:h-52"
      />

      <span className="pointer-events-none mt-2 text-center text-base font-bold text-neutral-700 dark:text-neutral-300 md:text-lg">
        {item.title}
      </span>
    </motion.button>
  );
}

export function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const constraintsRef = useRef(null);

  const selectedItem =
    selectedIndex === null ? null : ITEMS[selectedIndex];

  const closeViewer = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const showPrevious = useCallback(() => {
    setSelectedIndex((current) =>
      current === null
        ? 0
        : (current - 1 + ITEMS.length) % ITEMS.length
    );
  }, []);

  const showNext = useCallback(() => {
    setSelectedIndex((current) =>
      current === null ? 0 : (current + 1) % ITEMS.length
    );
  }, []);

  useEffect(() => {
    if (selectedIndex === null) return;

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeViewer();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedIndex, closeViewer, showPrevious, showNext]);

  return (
    <>
      <DraggableCardContainer
        className="relative flex min-h-screen w-full items-center justify-center overflow-clip bg-black"
      >
        <div ref={constraintsRef} className="pointer-events-none absolute inset-0" />

        <p className="pointer-events-none absolute top-1/2 z-0 mx-auto max-w-sm -translate-y-3/4 select-none text-center text-4xl font-black text-pink-500 md:text-6xl lg:text-8xl">
          GALLERY
        </p>

        {ITEMS.map((item, index) => (
          <div
            key={item.title}
            className="contents"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <DraggableCardBody
              item={item}
              index={index}
              onOpen={setSelectedIndex}
              constraints={constraintsRef}
            />
          </div>
        ))}
      </DraggableCardContainer>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeViewer}
            role="dialog"
            aria-modal="true"
            aria-label={selectedItem.title}
          >
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                closeViewer();
              }}
              className="absolute right-5 top-5 z-30 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white text-3xl text-black shadow-lg hover:bg-pink-100"
              aria-label="Close gallery"
            >
              &times;
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
              className="absolute left-3 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-4xl text-black shadow-lg transition hover:scale-110 hover:bg-pink-400 sm:left-8 sm:h-14 sm:w-14"
              aria-label="Previous photo"
            >
              ‹
            </button>

            <motion.div
              key={selectedItem.image}
              className="flex max-h-[90vh] max-w-5xl flex-col items-center"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="max-h-[78vh] max-w-[72vw] rounded-xl object-contain shadow-2xl"
              />

              <h2 className="mt-4 text-center text-xl font-bold text-white sm:text-2xl">
                {selectedItem.title}
              </h2>

              <p className="mt-1 text-sm text-white/70">
                {selectedIndex + 1} / {ITEMS.length}
              </p>
            </motion.div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
              className="absolute right-3 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-4xl text-black shadow-lg transition hover:scale-110 hover:bg-pink-400 sm:right-8 sm:h-14 sm:w-14"
              aria-label="Next photo"
            >
              ›
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}