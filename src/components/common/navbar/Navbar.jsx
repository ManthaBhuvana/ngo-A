"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import navLinks from "@/data/navbar";
import { TransitionLink } from "@/components/utils/transitionlink/TransitionLink";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hideNav, setHideNav] = useState(false);
  const lastScrollY = useRef(0);

  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleMobileNavClick = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const MobileTransitionLink = ({ href, children, ...props }) => (
    <TransitionLink
      href={href}
      {...props}
      onClick={(e) => {
        setIsMenuOpen(false);
        if (props.onClick) props.onClick(e);
      }}
    >
      {children}
    </TransitionLink>
  );

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (typeof window === "undefined") return;
      const currentScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (currentScrollY > lastScrollY.current && currentScrollY > 1) {
            setHideNav(true);
          } else if (currentScrollY < lastScrollY.current) {
            setHideNav(false);
          }
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handler for Donate button (desktop and mobile)
  const handleDonateClick = (e) => {
    e.preventDefault();
    window.location.assign("/payment");
  };

  return (
    <div
      className={`z-[1000] fixed left-1/2 w-[90%] h-15 w-[60%] bg-white border-gray-200 rounded-full shadow-lg transition-transform duration-700 -translate-x-1/2 border sm:top-7 lg:w-[70%] xl:w-[70%] ${
        hideNav ? "-translate-y-[150%]" : "top-4 translate-y-0"
      }`}
      style={{
        top: hideNav ? 0 : undefined,
        transitionProperty: "transform, box-shadow, background-color, top",
        willChange: "transform, top",
      }}
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center">
            <TransitionLink href="/" className="pl-2">
              <Image
                src="/svg/AVASA.svg"
                alt="logo"
                width={38}
                height={40}
                className="w-[42px] h-[38px]sm:w-[44px] md:w-[54px]"
                priority
              />
            </TransitionLink>
          </div>
          <span className="absolute left-17.5 w-45 text-black text-base text-lg sm:left-22 md:text-xl">
            Avasa Foundation
          </span>
          <div className="absolute right-30 hidden items-center gap-6 font-medium md:flex">
            {navLinks.middle.map((link) => (
              <div key={link.id} className="relative group">
                {link.label === "Contact Us" ? (
                  <TransitionLink
                    href="/contactus"
                    className="relative cursor-pointer text-black after:block after:content-[''] after:absolute after:h-[2px] after:bg-pink-400 after:w-full after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left text-medium"
                  >
                    Contact Us
                  </TransitionLink>
                ) : (
                  <p className="relative cursor-default text-black after:block after:content-[''] after:absolute after:h-[2px] after:bg-pink-400 after:w-full after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left text-medium">
                    {link.label}
                  </p>
                )}
                {link.dialog && (
                  <div className="z-50 absolute top-full left-0 hidden flex-col mt-1 w-40 bg-white rounded-lg shadow-md border group-hover:flex">
                    {link.dialog.map((el) => (
                      <TransitionLink href={el.path} key={el.id}>
                        <p className="px-4 py-2 text-black hover:bg-gray-100">
                          {el.title}
                        </p>
                      </TransitionLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="hidden items-center md:flex">
            {/* Change: Open /payment instead of /donate */}
            <button
              className="relative px-4 py-2 text-white font-bold text-sm bg-gradient-to-r from-pink-500 to-pink-700 rounded-full border-2 border-pink-300 shadow-lg transition-all duration-[6000ms] hover:shadow-[0_0_50px_rgba(236,72,153,0.8)] hover:shadow-[0_0_100px_rgba(236,72,153,0.6)] hover:shadow-[0_0_150px_rgba(236,72,153,0.4)] hover:scale-110 hover:bg-gradient-to-r hover:from-pink-600 hover:to-pink-800 before:absolute before:inset-0 before:rounded-full before:border-2 before:border-pink-400 before:animate-ping before:transition-all before:duration-[6000ms] before:delay-[2000ms] after:absolute after:inset-0 after:rounded-full after:border-2 after:border-pink-300 after:animate-ping after:transition-all after:duration-[6000ms] after:delay-[4000ms] [&>*:nth-child(3)]:absolute [&>*:nth-child(3)]:inset-0 [&>*:nth-child(3)]:rounded-full [&>*:nth-child(3)]:border-2 [&>*:nth-child(3)]:border-pink-200 [&>*:nth-child(3)]:animate-ping [&>*:nth-child(3)]:transition-all [&>*:nth-child(3)]:duration-[6000ms] [&>*:nth-child(3)]:delay-[6000ms]"
              onClick={handleDonateClick}
            >
              Donate
            </button>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <div
                className={`flex flex-col justify-between w-[28px] h-[28px] relative right-3 top-[-7px] transition-transform duration-[330ms] ease-out cursor-pointer ${
                  isMenuOpen ? "rotate-[-45deg]" : ""
                }`}
              >
                <div
                  className={`w-1/2 h-[3px] bg-pink-400 rounded-[3px] transition-transform duration-[330ms] ease-[cubic-bezier(0.54,-0.81,0.57,0.57)] origin-right ${
                    isMenuOpen ? "rotate-[-90deg] translate-x-[-0.5px]" : ""
                  }`}
                ></div>
                <div className="w-full h-[3px] bg-pink-400 rounded-[3px]"></div>
                <div
                  className={`self-end w-1/2 h-[3px] bg-pink-400 rounded-[3px] transition-transform duration-[330ms] ease-[cubic-bezier(0.54,-0.81,0.57,0.57)] origin-left ${
                    isMenuOpen ? "rotate-[-90deg] translate-x-[-1.5px]" : ""
                  }`}
                ></div>
              </div>
            </button>
          </div>
        </nav>
        <div
          className={`z-50 absolute top-full left-0 mt-3 px-4 py-4 w-full bg-white rounded-xl shadow-lg border md:hidden
            transition-transform transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
            ${
              isMenuOpen
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-90 pointer-events-none"
            }
          `}
          style={{
            visibility: isMenuOpen ? "visible" : "hidden",
          }}
        >
          <div className="flex flex-col gap-4">
            {navLinks.middle.map((link, idx) => (
              <div
                key={link.id}
                className={`transition-all duration-500
                  ${isMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-90"}
                `}
                style={{
                  transitionDelay: isMenuOpen ? `${idx * 80 + 100}ms` : "0ms",
                }}
              >
                <p className="text-black font-medium cursor-default">
                  {link.label}
                </p>
                {link.dialog && (
                  <div className="pl-4 mt-1 space-y-1">
                    {link.dialog.map((el, subIdx) => (
                      <MobileTransitionLink href={el.path} key={el.id}>
                        <p
                          className={`text-gray-600 text-sm hover:text-black transition-all duration-400
                            ${
                              isMenuOpen
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-90"
                            }
                          `}
                          style={{
                            transitionDelay: isMenuOpen
                              ? `${idx * 80 + subIdx * 40 + 200}ms`
                              : "0ms",
                          }}
                        >
                          {el.title}
                        </p>
                      </MobileTransitionLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex justify-center">
              {/* Change: Open /payment instead of /donate */}
              <button
                className="relative px-16 py-2 w-full max-w-[30rem] text-white font-bold text-sm tracking-widest bg-gradient-to-r from-pink-500 to-pink-700 rounded-none border-2 border-pink-300 shadow-lg transition-all duration-500 hover:shadow-[0_0_50px_rgba(236,72,153,0.8)] hover:shadow-[0_0_100px_rgba(236,72,153,0.6)] hover:shadow-[0_0_150px_rgba(236,72,153,0.4)] hover:scale-110 hover:bg-gradient-to-r hover:from-pink-600 hover:to-pink-800 before:absolute before:inset-0 before:rounded-none before:border-2 before:border-pink-400 before:animate-ping before:transition-all before:duration-[6000ms] before:delay-[2000ms] after:absolute after:inset-0 after:rounded-none after:border-2 after:border-pink-300 after:animate-ping after:transition-all after:duration-[6000ms] after:delay-[4000ms] [&>*:nth-child(3)]:absolute [&>*:nth-child(3)]:inset-0 [&>*:nth-child(3)]:rounded-none [&>*:nth-child(3)]:border-2 [&>*:nth-child(3)]:border-pink-200 [&>*:nth-child(3)]:animate-ping [&>*:nth-child(3)]:transition-all [&>*:nth-child(3)]:duration-[6000ms] [&>*:nth-child(3)]:delay-[6000ms] uppercase animate-scale-fade-in md:max-w-[32rem]"
                onClick={handleDonateClick}
              >
                Donate
              </button>
            </div>
          </div>
          <style jsx>{`
            @keyframes scale-fade-in {
              0% {
                opacity: 0;
                transform: scale(0.85);
              }
              60% {
                opacity: 1;
                transform: scale(1.05);
              }
              80% {
                transform: scale(0.98);
              }
              100% {
                opacity: 1;
                transform: scale(1);
              }
            }
            .animate-scale-fade-in {
              animation: scale-fade-in 0.7s cubic-bezier(0.4, 0, 0.2, 1);
            }
          `}</style>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
