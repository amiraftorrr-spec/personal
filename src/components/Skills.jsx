import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  SiJavascript,
  SiTailwindcss,
  SiTypescript,
  SiReact,
  SiNextdotjs,
} from "react-icons/si";
import { HiSparkles } from "react-icons/hi2";

gsap.registerPlugin(ScrollTrigger);

// دیتای نسخه دسکتاپ (اسکرول افقی) - شامل کارت intro
const techStack = [
  {
    key: "intro",
    isIntro: true,
    name: "My Skills",
    color: "#c8a96e",
    description: "Skills that transform ideas into reality",
    features: ["JavaScript", "TypeScript", "React js", "Tailwind CSS", "Next js"],
  },
  {
    key: "js",
    icon: <SiJavascript />,
    name: "JavaScript",
    color: "#F7DF1E",
    description: "The language of the web - Dynamic, versatile, and everywhere",
    features: ["ES6+ Features", "Async/Await", "DOM Manipulation", "Event Handling"],
  },
  {
    key: "tailwind",
    icon: <SiTailwindcss />,
    name: "Tailwind CSS",
    color: "#06B6D4",
    description: "Utility-first CSS framework for rapid UI development",
    features: ["Responsive Design", "Custom Themes", "Dark Mode", "JIT Compiler"],
  },
  {
    key: "ts",
    icon: <SiTypescript />,
    name: "TypeScript",
    color: "#3178C6",
    description: "JavaScript with superpowers - Type safety at scale",
    features: ["Type Safety", "IntelliSense", "Refactoring", "Scalability"],
  },
  {
    key: "react",
    icon: <SiReact />,
    name: "React",
    color: "#61DAFB",
    description: "A JavaScript library for building user interfaces",
    features: ["Component-Based", "Virtual DOM", "Hooks", "State Management"],
  },
  {
    key: "next",
    icon: <SiNextdotjs />,
    name: "Next.js",
    color: "#ffffff",
    description: "The React framework for production-grade applications",
    features: ["SSR & SSG", "File Routing", "API Routes", "Image Optimization"],
  },
];

// دیتای نسخه موبایل (کارت‌های شیشه‌ای) - بدون intro، توضیح کوتاه‌تر
const techCards = [
  {
    key: "js",
    icon: <SiJavascript />,
    name: "JavaScript",
    color: "#F7DF1E",
    description: "The dynamic language that powers the web",
  },
  {
    key: "tailwind",
    icon: <SiTailwindcss />,
    name: "Tailwind CSS",
    color: "#06B6D4",
    description: "Utility-first framework for rapid UI development",
  },
  {
    key: "ts",
    icon: <SiTypescript />,
    name: "TypeScript",
    color: "#3178C6",
    description: "JavaScript with type-safe superpowers",
  },
  {
    key: "react",
    icon: <SiReact />,
    name: "React",
    color: "#61DAFB",
    description: "A library for building modern user interfaces",
  },
  {
    key: "next",
    icon: <SiNextdotjs />,
    name: "Next.js",
    color: "#ffffff",
    description: "The React framework for production apps",
  },
];

// موقعیت ثابت ذرات - بیرون از رندر تا هر بار ساخته نشه
const PARTICLE_POSITIONS = [
  { left: 10, top: 20 },
  { left: 75, top: 15 },
  { left: 25, top: 70 },
  { left: 85, top: 60 },
  { left: 50, top: 40 },
  { left: 15, top: 85 },
  { left: 65, top: 25 },
  { left: 40, top: 55 },
];

export default function ScrollSkill() {
  const containerRef = useRef(null);
  const sectionsRef = useRef([]);
  const dotRefs = useRef([]);
  const scrollAnimRef = useRef(null);
  const activeIdxRef = useRef(0);

  const cardsSectionRef = useRef(null);
  const cardsRef = useRef([]);

  // ===== نسخه دسکتاپ: اسکرول افقی pin شده - فقط از 1024px به بالا فعال میشه =====
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const container = containerRef.current;
      const sections = sectionsRef.current;
      if (!container || sections.length === 0) return;

      ScrollTrigger.config({ ignoreMobileResize: true, autoRefreshEvents: "visibilitychange,DOMContentLoaded,load" });

      const ctx = gsap.context(() => {
        let lastIndex = 0;

        // آماده‌سازی GPU بدون تحمیل لایه‌های سنگین
        gsap.set(sections, { force3D: true, transformPerspective: 1000 });

        const totalPanels = sections.length;
        const scrollAnimation = gsap.to(sections, {
          xPercent: -100 * (totalPanels - 1),
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: container,
            pin: true,
            anticipatePin: 1,
            scrub: 0.3,
            fastScrollEnd: true,
            preventOverlaps: true,
            snap: {
              snapTo: 1 / (totalPanels - 1),
              delay: 0.2,
              duration: { min: 0.2, max: 0.4 },
              ease: "power2.out",
              inertia: false,
            },
            end: () => "+=" + container.offsetWidth * (totalPanels - 1),
            onUpdate: (self) => {
              const rawIdx = Math.round(self.progress * (totalPanels - 1));
              const idx = Math.max(0, Math.min(totalPanels - 1, rawIdx));
              if (idx === lastIndex) return;
              lastIndex = idx;
              activeIdxRef.current = idx;
              updateActive(idx);
            },
          },
        });
        scrollAnimRef.current = scrollAnimation;

        // متوقف کردن انیمیشن ذرات وقتی سکشن اسکیلز خارج از دید است
        ScrollTrigger.create({
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          onLeave: () => {
            container?.classList.add("skills-paused");
          },
          onEnter: () => {
            container?.classList.remove("skills-paused");
          },
          onEnterBack: () => {
            container?.classList.remove("skills-paused");
          },
          onLeaveBack: () => {
            container?.classList.add("skills-paused");
          },
        });

        function updateActive(idx) {
          dotRefs.current.forEach((d, i) => {
            if (!d) return;
            const isActive = i === idx;
            d.style.transform = isActive ? "scale(1.4)" : "scale(1)";
            d.style.backgroundColor = isActive ? techStack[idx].color : "rgba(255,255,255,0.25)";
            d.style.boxShadow = isActive ? `0 0 12px ${techStack[idx].color}` : "none";
          });
        }

        // تنظیم اولیه سریع
        updateActive(0);

        sections.forEach((section) => {
          const icon = section.querySelector(".tech-icon");
          const title = section.querySelector(".tech-title");
          const desc = section.querySelector(".tech-desc");
          const features = section.querySelectorAll(".feature-item");
          const badge = section.querySelector(".intro-badge");

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              containerAnimation: scrollAnimation,
              start: "left 65%",
              toggleActions: "play none none reverse",
              fastScrollEnd: true,
              preventOverlaps: true,
            },
            defaults: { overwrite: "auto", force3D: true },
          });

          if (icon) {
            tl.fromTo(
              icon,
              { scale: 0.35, rotation: -30, opacity: 0 },
              { scale: 1, rotation: 0, opacity: 1, duration: 0.7, ease: "back.out(1.4)" },
              0
            );
          }

          if (badge) {
            tl.fromTo(
              badge,
              { scale: 0.6, rotation: -15, opacity: 0 },
              { scale: 1, rotation: 0, opacity: 1, duration: 0.6, ease: "back.out(1.4)" },
              0
            );
          }

          if (title) {
            tl.fromTo(
              title,
              { x: -60, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
              0.15
            );
          }

          if (desc) {
            tl.fromTo(
              desc,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
              0.25
            );
          }

          if (features.length > 0) {
            tl.fromTo(
              features,
              { x: -40, opacity: 0, scale: 0.95 },
              { x: 0, opacity: 1, scale: 1, duration: 0.45, stagger: 0.06, ease: "power3.out" },
              0.35
            );
          }
        });
      }, containerRef);

      return () => ctx.revert();
    });

    // انیمیشن ورود کارت‌ها در موبایل/تبلت با اسکرول (کامپوزیت سبک GPU)
    mm.add("(max-width: 1023px)", () => {
      const cardsSection = cardsSectionRef.current;
      if (!cardsSection) return;

      const validCards = cardsRef.current.filter(Boolean);

      const ctx = gsap.context(() => {
        const headerEl = cardsSection.querySelector(".skills-mobile-header");
        if (headerEl) {
          gsap.from(headerEl.children, {
            y: 25,
            opacity: 0,
            duration: 0.65,
            stagger: 0.1,
            ease: "power2.out",
            force3D: true,
            scrollTrigger: {
              trigger: cardsSection,
              start: "top 80%",
              once: true,
            },
          });
        }

        if (validCards.length > 0) {
          gsap.from(validCards, {
            y: 35,
            opacity: 0,
            scale: 0.96,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            force3D: true,
            scrollTrigger: {
              trigger: cardsSection.querySelector(".skills-mobile-grid") || cardsSection,
              start: "top 78%",
              once: true,
            },
          });
        }
      }, cardsSection);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  function goTo(index) {
    const scrollAnimation = scrollAnimRef.current;
    if (!scrollAnimation) return;
    const st = scrollAnimation.scrollTrigger;
    const progress = index / (techStack.length - 1);
    const target = st.start + progress * (st.end - st.start);
    window.scrollTo({ top: target, behavior: "smooth" });
  }

  return (
    <section id="skills" aria-label="Skills">
      {/* ============ نسخه دسکتاپ - اسکرول افقی pin شده ============ */}
      <div className="hidden lg:block relative w-full" style={{ backgroundColor: "#111111" }}>
        <style>{`
          .feature-item, .intro-row { transition: transform .35s ease, background-color .35s ease; }
          .feature-item:hover, .intro-row:hover { transform: translateX(-10px) scale(1.03); background-color: rgba(255,255,255,0.06); }

          .skills-particle {
            animation: floatParticle var(--pd, 4s) ease-in-out infinite;
            animation-delay: var(--pdelay, 0s);
            will-change: transform;
          }
          .skills-paused .skills-particle {
            animation-play-state: paused !important;
          }
          @keyframes floatParticle {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(var(--px, 20px), var(--py, -30px)) rotate(180deg); }
          }
        `}</style>

        <div ref={containerRef} className="relative h-screen overflow-hidden">
          <div
            className="relative z-10 flex h-full"
            style={{ width: `${techStack.length * 100}vw` }}
          >
            {techStack.map((tech, index) => (
              <div
                key={tech.key}
                ref={(el) => {
                  if (el) sectionsRef.current[index] = el;
                }}
                className="relative w-screen h-screen flex items-center justify-center overflow-hidden"
                style={{
                  contain: "layout style paint",
                }}
              >
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                  {PARTICLE_POSITIONS.map((pos, i) => {
                    const yValue = i % 2 === 0 ? -40 : 50;
                    const xValue = i % 3 === 0 ? -25 : 30;
                    const durationValue = 3.5 + (i % 3) * 0.5;
                    const delayValue = i * 0.2;
                    return (
                      <div
                        key={i}
                        className="skills-particle absolute w-2 h-2 rounded-full opacity-20"
                        style={{
                          backgroundColor: tech.color,
                          left: `${pos.left}%`,
                          top: `${pos.top}%`,
                          "--px": `${xValue}px`,
                          "--py": `${yValue}px`,
                          "--pd": `${durationValue}s`,
                          "--pdelay": `${delayValue}s`,
                        }}
                      />
                    );
                  })}
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-12 grid grid-cols-2 gap-16 items-center">
                  {tech.isIntro ? (
                    <>
                      <div className="flex flex-col items-center space-y-8">
                        <div
                          className="intro-badge flex h-56 w-56 items-center justify-center rounded-3xl border"
                          style={{ borderColor: `${tech.color}55`, boxShadow: `0 0 60px ${tech.color}55` }}
                        >
                          <HiSparkles style={{ width: "50%", height: "50%", color: tech.color }} />
                        </div>
                        <h2 className="tech-title text-7xl font-black" style={{ color: tech.color }}>
                          {tech.name}
                        </h2>
                      </div>

                      <div className="space-y-8">
                        <p className="tech-desc text-2xl text-gray-300 leading-relaxed">
                          {tech.description}
                        </p>
                        <div className="space-y-4">
                          {tech.features.map((feature, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => goTo(i + 1)}
                              className="intro-row feature-item w-full text-left flex cursor-pointer items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
                              style={{ borderColor: `${tech.color}40`, boxShadow: `0 0 20px ${tech.color}10` }}
                            >
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tech.color }} />
                              <span className="text-lg text-gray-200 font-medium">{feature}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-8">
                        <div
                          className="tech-icon text-[300px] flex items-center justify-center"
                          style={{ color: tech.color, filter: `drop-shadow(0 0 55px ${tech.color}70)` }}
                        >
                          {tech.icon}
                        </div>
                        <div className="text-center">
                          <h2 className="tech-title text-7xl font-black" style={{ color: tech.color }}>
                            {tech.name}
                          </h2>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <p className="tech-desc text-2xl text-gray-300 leading-relaxed">
                          {tech.description}
                        </p>
                        <div className="space-y-4">
                          {tech.features.map((feature, i) => (
                            <div
                              key={i}
                              className="feature-item flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
                              style={{ borderColor: `${tech.color}40`, boxShadow: `0 0 20px ${tech.color}10` }}
                            >
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tech.color }} />
                              <span className="text-lg text-gray-200 font-medium">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div
                  className="pointer-events-none absolute top-10 right-12 w-80 h-80 rounded-full"
                  style={{
                    background: `radial-gradient(circle at center, ${tech.color}40 0%, ${tech.color}15 35%, transparent 68%)`,
                    filter: "blur(35px)",
                  }}
                />
                <div
                  className="pointer-events-none absolute bottom-16 left-12 w-96 h-96 rounded-full"
                  style={{
                    background: `radial-gradient(circle at center, ${tech.color}30 0%, ${tech.color}10 35%, transparent 68%)`,
                    filter: "blur(40px)",
                  }}
                />
              </div>
            ))}
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3" role="tablist" aria-label="Skills navigation">
            {techStack.map((tech, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-label={`Go to ${tech.name} skill`}
                ref={(el) => (dotRefs.current[i] = el)}
                onClick={() => goTo(i)}
                className="h-2.5 w-2.5 rounded-full cursor-pointer bg-white/25 border-0 p-0 focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
              />
            ))}
          </div>
        </div>
      </div>

      {/* ============ نسخه موبایل/تبلت - کارت‌های شیشه‌ای ============ */}
      <section
        ref={cardsSectionRef}
        className="block lg:hidden relative w-full py-20 sm:py-24 px-5 sm:px-8"
        style={{ backgroundColor: "#111111" }}
      >
        <style>{`
          .skill-card {
            position: relative;
            background: linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.015));
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease, background .3s ease;
            overflow: hidden;
            -webkit-tap-highlight-color: transparent;
            will-change: transform, opacity;
          }
          .skill-card::before {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 40%);
            pointer-events: none;
          }
          .skill-card:active {
            transform: scale(0.97);
            background: linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03));
            box-shadow: 0 10px 30px -10px var(--glow, transparent), inset 0 1px 0 rgba(255,255,255,0.15);
          }
        `}</style>

        <div className="skills-mobile-header max-w-6xl mx-auto text-center mb-12 sm:mb-16">
          <div
            className="mx-auto mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl border"
            style={{
              borderColor: "#c8a96e55",
              boxShadow: "0 0 40px #c8a96e33",
            }}
          >
            <HiSparkles className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: "#c8a96e" }} />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black" style={{ color: "#c8a96e" }}>
            My Skills
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base mt-4 max-w-xl mx-auto">
            Skills that transform ideas into reality
          </p>
        </div>

        <div className="skills-mobile-grid max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {techCards.map((tech, index) => (
            <div
              key={tech.key}
              ref={(el) => (cardsRef.current[index] = el)}
              className="skill-card group flex flex-col items-center text-center gap-4 p-6 sm:p-8 rounded-2xl border"
              style={{
                borderColor: "rgba(255,255,255,0.1)",
                boxShadow: `0 8px 30px -10px ${tech.color}20, inset 0 1px 0 rgba(255,255,255,0.08)`,
                "--glow": `${tech.color}55`,
              }}
            >
              <div
                className="flex items-center justify-center rounded-xl w-16 h-16 sm:w-20 sm:h-20 text-4xl sm:text-5xl border"
                style={{
                  color: tech.color,
                  filter: `drop-shadow(0 0 20px ${tech.color}70)`,
                  background: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                {tech.icon}
              </div>

              <h3 className="text-xl sm:text-2xl font-bold" style={{ color: tech.color }}>
                {tech.name}
              </h3>

              <p className="text-zinc-400 text-sm sm:text-base leading-6">
                {tech.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
