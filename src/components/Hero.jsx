import { useEffect, useRef } from "react";

import gsap from "gsap";
import lenis from "../lenis";

import {
  FaHtml5,
  FaCss3Alt,
  FaReact,
  FaJsSquare,
} from "react-icons/fa";

import {
  SiTailwindcss,
  SiTypescript,
  SiNextdotjs,
} from "react-icons/si";

export default function Hero() {

  const leftRef = useRef(null);

  const rightRef = useRef(null);

  const orbitRef = useRef(null);

  const heroRef = useRef(null);

  const icons = [
    FaHtml5,
    FaCss3Alt,
    FaJsSquare,
    FaReact,
    SiTailwindcss,
    SiTypescript,
    SiNextdotjs,
  ];

  useEffect(() => {

    // انیمیشن‌ها فقط از سایز لپ‌تاپ به بالا (lg: 1024px) اجرا میشن
    // تو موبایل و تبلت هیچ انیمیشنی اجرا نمیشه تا سبک بمونه
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {

      const ctx = gsap.context(() => {

        gsap.from(leftRef.current, {
          x: -100,
          opacity: 0,
          duration: 1.2,
        });

        gsap.from(rightRef.current, {
          x: 100,
          opacity: 0,
          duration: 1.2,
        });

        gsap.to(orbitRef.current, {
          rotate: 360,
          duration: 22,
          ease: "none",
          repeat: -1,
        });

        gsap.to(".skill-icon", {
          rotate: 360,
          duration: 8,
          ease: "none",
          repeat: -1,
        });

      }, heroRef);

      return () => ctx.revert();

    });

    return () => mm.revert();

  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) {
      console.warn(`Element with id "${id}" not found. Did you add id="${id}" to the section?`);
      return;
    }

    lenis.scrollTo(el, { offset: 0, immediate: true });
  };

  return (

    <section
      ref={heroRef}
      className="min-h-screen bg-[#111111] flex flex-col lg:flex-row items-center justify-center lg:justify-between px-6 sm:px-10 lg:px-24 overflow-hidden py-24 lg:py-0"
    >

      {/* LEFT */}
      <div
        ref={leftRef}
        className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left"
      >

        <p className="uppercase tracking-[6px] sm:tracking-[8px] text-[#c8a96e] mb-6 text-sm sm:text-base">
          Portfolio
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
          Crafting
          <br />
          Modern
          <span className="text-[#c8a96e]">
            {" "}Experiences
          </span>
        </h1>

        <p className="text-zinc-400 text-base sm:text-lg lg:text-xl mt-6 lg:mt-8 max-w-xl leading-8 lg:leading-9">
          Frontend Developer • UI Enthusiast • Creative Coder
        </p>

        {/* دکمه‌ها - وسط‌چین در موبایل و تبلت */}
        <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-5 mt-10 lg:mt-12">

          <button
            onClick={() => scrollToSection("projects")}
            className="
            cursor-hover
            relative
            bg-[#c8a96e]
            px-6
            sm:px-8
            py-3
            sm:py-4
            rounded-xl
            font-bold
            text-black
            text-sm
            sm:text-base
            transition-all
            duration-300
            hover:scale-105
            hover:shadow-[0_0_25px_#c8a96e66]
            "
          >
            View Projects
          </button>

          <button
            onClick={() => scrollToSection("contact")}
            className="
            cursor-hover
            relative
            border
            border-[#c8a96e]
            text-[#c8a96e]
            px-6
            sm:px-8
            py-3
            sm:py-4
            rounded-xl
            text-sm
            sm:text-base
            transition-all
            duration-300
            hover:bg-[#c8a96e]
            hover:text-black
            hover:scale-105
            hover:shadow-[0_0_20px_#c8a96e44]
            "
          >
            Contact Me
          </button>

        </div>

      </div>

      {/* RIGHT - فقط از سایز لپ‌تاپ به بالا نمایش داده میشه */}
      <div
        ref={rightRef}
        className="hidden lg:flex w-1/2 justify-center"
      >

        <div className="relative w-[620px] h-[620px]">

          {/* glowing ring */}
          <div
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              animationDuration: "10s",
              background: `conic-gradient(transparent,#c8a96e,transparent)`,
              WebkitMask:
                "radial-gradient(farthest-side,transparent calc(100% - 2px),#000 0)",
              mask:
                "radial-gradient(farthest-side,transparent calc(100% - 2px),#000 0)",
            }}
          />

          {/* outer circle */}
          <div className="absolute inset-0 rounded-full border border-[#c8a96e]/10" />

          {/* inner circle */}
          <div className="absolute inset-16 rounded-full border border-[#c8a96e]/20" />

          {/* ICONS */}
          <div ref={orbitRef} className="absolute inset-0">

            {icons.map((Icon, index) => {

              const angle = (360 / icons.length) * index;
              const radius = 250;

              const x =
                Math.cos((angle * Math.PI) / 180) * radius;

              const y =
                Math.sin((angle * Math.PI) / 180) * radius;

              return (
                <div
                  key={index}
                  className="
                  skill-icon
                  absolute
                  top-1/2
                  left-1/2
                  w-16
                  h-16
                  flex
                  items-center
                  justify-center
                  rounded-full
                  bg-white/5
                  backdrop-blur-xl
                  border
                  border-[#c8a96e]/20
                  text-[#c8a96e]
                  text-3xl
                  "
                  style={{
                    transform: `
                      translate(-50%,-50%)
                      translate(${x}px,${y}px)
                    `
                  }}
                >
                  <Icon />
                </div>
              );
            })}

          </div>

          {/* CENTER */}
          <div className="absolute inset-0 flex items-center justify-center">

            <div className="relative">

              <div className="absolute inset-0 bg-[#c8a96e] blur-[100px] opacity-30 rounded-full animate-pulse" />

              <div className="relative text-8xl text-[#c8a96e] font-bold px-10 py-8 rounded-3xl border border-[#c8a96e]/20 bg-white/5 backdrop-blur-xl">
                {"</>"}
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
