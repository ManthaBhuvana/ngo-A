"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const COVER_DURATION = 500;
const OPEN_DURATION = 650;

function removeOverlay() {
  document.getElementById("avasa-page-transition")?.remove();
}

function createOverlay() {
  removeOverlay();

  const overlay = document.createElement("div");
  overlay.id = "avasa-page-transition";

  Object.assign(overlay.style, {
    position: "fixed",
    inset: "0",
    zIndex: "99999",
    background: "#fff",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    transform: "translateX(100%)",
    willChange: "transform",
  });

  // Curved edge on the right side of the white page.
  const edge = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );

  edge.setAttribute("viewBox", "0 0 100 100");
  edge.setAttribute("preserveAspectRatio", "none");

  Object.assign(edge.style, {
    position: "absolute",
    right: "-1px",
    top: "0",
    width: "12vw",
    minWidth: "50px",
    height: "100%",
  });

  const path = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  path.setAttribute("d", "M100 0 C15 25 15 75 100 100 L100 0 Z");
  path.setAttribute("fill", "#fff");
  edge.appendChild(path);
  overlay.appendChild(edge);

  const logo = document.createElement("img");
  logo.src = "/svg/AVASA.svg";
  logo.alt = "AVASA Foundation";

  Object.assign(logo.style, {
    position: "absolute",
    width: "clamp(90px, 12vw, 150px)",
    height: "auto",
    objectFit: "contain",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    opacity: "0",
    filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.08))",
  });

  overlay.appendChild(logo);
  document.body.appendChild(overlay);

  return { overlay, logo };
}

function getRewrittenHref(href) {
  if (href === "/ourwork") return "/";
  if (href === "/contactus/maplocation") return "/contactus/map";
  return href;
}

export const TransitionLink = ({
  children,
  href,
  onClick,
  ...props
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [clientHref, setClientHref] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const rewrittenHref = getRewrittenHref(href);

  useEffect(() => {
    setClientHref(rewrittenHref);
  }, [rewrittenHref]);

  useEffect(() => {
    setIsTransitioning(false);
    removeOverlay();
  }, [pathname]);

  useEffect(() => {
    return () => removeOverlay();
  }, []);

  const handleTransition = useCallback(
    async (event) => {
      onClick?.(event);

      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const destination = clientHref ?? rewrittenHref;

      if (
        typeof destination !== "string" ||
        destination.startsWith("http") ||
        destination.startsWith("mailto:") ||
        destination.startsWith("tel:") ||
        destination.startsWith("#")
      ) {
        return;
      }

      event.preventDefault();

      if (isTransitioning) return;

      const target = new URL(destination, window.location.origin);
      const current = new URL(window.location.href);

      if (
        target.pathname === current.pathname &&
        target.search === current.search &&
        target.hash === current.hash
      ) {
        return;
      }

      setIsTransitioning(true);

      const { overlay, logo } = createOverlay();

      try {
        // Stage 1: the branded white page sweeps in.
        const coverAnimation = overlay.animate(
          [
            { transform: "translateX(100%)" },
            { transform: "translateX(0%)" },
          ],
          {
            duration: COVER_DURATION,
            easing: "cubic-bezier(0.76, 0, 0.24, 1)",
            fill: "forwards",
          }
        );

        const logoIn = logo.animate(
          [
            { opacity: 0, transform: "translate(-50%, -42%) scale(0.82)" },
            { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
          ],
          {
            duration: 400,
            delay: 180,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards",
          }
        );

        await coverAnimation.finished;

        // Stage 2: change pages while the screen is covered.
        router.push(destination);

        // Brief pause lets the destination start rendering underneath.
        await new Promise((resolve) => setTimeout(resolve, 180));

        // Stage 3: the branded page opens to reveal the destination.
        const opening = overlay.animate(
          [
            { transform: "translateX(0%)" },
            { transform: "translateX(-105%)" },
          ],
          {
            duration: OPEN_DURATION,
            easing: "cubic-bezier(0.76, 0, 0.24, 1)",
            fill: "forwards",
          }
        );

        logo.animate(
          [
            { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
            { opacity: 0, transform: "translate(-50%, -50%) scale(0.92)" },
          ],
          {
            duration: 260,
            easing: "ease-in",
            fill: "forwards",
          }
        );

        await opening.finished;
      } catch (error) {
        console.error("Page transition interrupted:", error);
      } finally {
        removeOverlay();
        setIsTransitioning(false);
      }
    },
    [clientHref, rewrittenHref, router, onClick, isTransitioning]
  );

  return (
    <Link
      {...props}
      href={clientHref ?? href}
      onClick={handleTransition}
      aria-busy={isTransitioning}
    >
      {children}
    </Link>
  );
};