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

export default function ScrollSkill() {
  const containerRef = useRef(null);
  const sectionsRef = useRef([]);
  const glowRefs = useRef([]);
  const dotRefs = useRef([]);
  const scrollAnimRef = useRef(null);

  const cardsSectionRef = useRef(null);
  const cardsRef = useRef([]);

  // ===== نسخه دسکتاپ: اسکرول افقی pin شده - فقط از 1024px به بالا فعال میشه =====
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const container = containerRef.current;
      const sections = sectionsRef.current;
      if (!container || sections.length === 0) return;

      const ctx = gsap.context(() => {
        const lastIndexRef = { current: -1 };

        const scrollAnimation = gsap.to(sections, {
          xPercent: -100 * (sections.length - 1),
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: container,
            pin: true,
            anticipatePin: 1,
            // فقط دنبال مقدار واقعی اسکرول کاربر میره - هیچ پرش یا
            // تکمیل خودکاری وجود نداره. اگه کاربر وسط راه دست بکشه،
            // همونجا می‌مونه و فقط با اسکرول بیشتر خودش جلو میره.
            scrub: 0.5,
            end: () => "+=" + container.offsetWidth * (sections.length - 1),
            onUpdate: (self) => {
              const idx = Math.round(self.progress * (sections.length - 1));
              // فقط وقتی ایندکس واقعاً عوض شده تویین جدید بساز - نه هر فریم اسکرول
              if (idx === lastIndexRef.current) return;
              lastIndexRef.current = idx;
              updateActive(idx);
            },
          },
        });
        scrollAnimRef.current = scrollAnimation;

        function updateActive(idx) {
          gsap.to(glowRefs.current, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            overwrite: "auto",
          });
          gsap.to(glowRefs.current[idx], {
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            overwrite: "auto",
          });
          dotRefs.current.forEach((d, i) => {
            if (!d) return;
            gsap.to(d, {
              scale: i === idx ? 1.4 : 1,
              backgroundColor: i === idx ? techStack[idx].color : "rgba(255,255,255,0.25)",
              boxShadow: i === idx ? `0 0 12px ${techStack[idx].color}` : "none",
              duration: 0.35,
              overwrite: "auto",
            });
          });
        }

        gsap.set(glowRefs.current, { opacity: 0 });
        gsap.set(glowRefs.current[0], { opacity: 1 });
        updateActive(0);

        sections.forEach((section, index) => {
          const icon = section.querySelector(".tech-icon");
          const title = section.querySelector(".tech-title");
          const desc = section.querySelector(".tech-desc");
          const features = section.querySelectorAll(".feature-item");
          const particles = section.querySelectorAll(".particle");
          const badge = section.querySelector(".intro-badge");

          if (icon) {
            gsap.fromTo(
              icon,
              { scale: 0.25, rotation: -50, opacity: 0, filter: "blur(25px)" },
              {
                scale: 1,
                rotation: 0,
                opacity: 1,
                filter: "blur(0px)",
                duration: 1.1,
                ease: "elastic.out(1, 0.5)",
                scrollTrigger: {
                  trigger: section,
                  containerAnimation: scrollAnimation,
                  start: "left center",
                  toggleActions: "play none none reverse",
                },
              }
            );
          }

          if (badge) {
            gsap.fromTo(
              badge,
              { scale: 0.5, rotation: -20, opacity: 0 },
              {
                scale: 1,
                rotation: 0,
                opacity: 1,
                duration: 0.9,
                ease: "elastic.out(1, 0.6)",
                scrollTrigger: {
                  trigger: section,
                  containerAnimation: scrollAnimation,
                  start: "left center",
                  toggleActions: "play none none reverse",
                },
              }
            );
          }

          if (title) {
            gsap.fromTo(
              title,
              { x: -100, opacity: 0, skewX: 10, clipPath: "inset(0 100% 0 0)" },
              {
                x: 0,
                opacity: 1,
                skewX: 0,
                clipPath: "inset(0 0% 0 0)",
                duration: 0.8,
                delay: 0.3,
                ease: "power4.out",
                scrollTrigger: {
                  trigger: section,
                  containerAnimation: scrollAnimation,
                  start: "left center",
                  toggleActions: "play none none reverse",
                },
              }
            );
          }

          if (desc) {
            gsap.fromTo(
              desc,
              { y: 50, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                delay: 0.5,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: section,
                  containerAnimation: scrollAnimation,
                  start: "left center",
                  toggleActions: "play none none reverse",
                },
              }
            );
          }

          if (features.length > 0) {
            gsap.fromTo(
              features,
              { x: -60, opacity: 0, rotateY: -60, transformOrigin: "left center" },
              {
                x: 0,
                opacity: 1,
                rotateY: 0,
                duration: 0.65,
                stagger: 0.1,
                delay: 0.7,
                ease: "back.out(1.8)",
                scrollTrigger: {
                  trigger: section,
                  containerAnimation: scrollAnimation,
                  start: "left center",
                  toggleActions: "play none none reverse",
                },
              }
            );
          }

          if (particles.length > 0) {
            particles.forEach((particle, i) => {
              const yValue = i % 2 === 0 ? -40 : 50;
              const xValue = i % 3 === 0 ? -25 : 30;
              const rotationValue = i * 45;
              const durationValue = 3.5 + (i % 3) * 0.5;
              gsap.to(particle, {
                y: yValue,
                x: xValue,
                rotation: rotationValue,
                duration: durationValue,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: i * 0.2,
              });
            });
          }
        });
      }, containerRef);

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
    <>
      {/* ============ نسخه دسکتاپ - اسکرول افقی pin شده ============ */}
      <div className="hidden lg:block relative w-full" style={{ backgroundColor: "#111111" }}>
        <style>{`
          @keyframes auroraShift {
            0%   { transform: translate(0px, 0px) scale(1); }
            50%  { transform: translate(30px, -20px) scale(1.15); }
            100% { transform: translate(-20px, 15px) scale(1.05); }
          }
          .glow-layer { animation: auroraShift 9s ease-in-out infinite alternate; }
          .feature-item, .intro-row { transition: transform .35s ease, background-color .35s ease; }
          .feature-item:hover, .intro-row:hover { transform: translateX(-10px) scale(1.03); background-color: rgba(255,255,255,0.06); }
        `}</style>

        <div ref={containerRef} className="relative h-screen overflow-hidden">
          {techStack.map((tech, i) => (
            <div
              key={tech.key}
              ref={(el) => (glowRefs.current[i] = el)}
              className="glow-layer pointer-events-none absolute inset-0 z-0"
              style={{
                background: `radial-gradient(ellipse 900px 650px at 25% 45%, ${tech.color}35, transparent 70%)`,
              }}
            />
          ))}

          <div
            className="relative z-10 flex h-full"
            style={{ width: `${techStack.length * 100}vw`, willChange: "transform" }}
          >
            {techStack.map((tech, index) => (
              <div
                key={tech.key}
                ref={(el) => {
                  if (el) sectionsRef.current[index] = el;
                }}
                className="relative w-screen h-screen flex items-center justify-center overflow-hidden"
              >
                <div className="absolute inset-0 pointer-events-none">
                  {[
                    { left: 10, top: 20 },
                    { left: 75, top: 15 },
                    { left: 25, top: 70 },
                    { left: 85, top: 60 },
                    { left: 50, top: 40 },
                    { left: 15, top: 85 },
                    { left: 65, top: 25 },
                    { left: 40, top: 55 },
                  ].map((pos, i) => (
                    <div
                      key={i}
                      className="particle absolute w-2 h-2 rounded-full opacity-20"
                      style={{
                        backgroundColor: tech.color,
                        left: `${pos.left}%`,
                        top: `${pos.top}%`,
                      }}
                    />
                  ))}
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
                            <div
                              key={i}
                              onClick={() => goTo(i + 1)}
                              className="intro-row feature-item flex cursor-pointer items-center gap-4 p-4 bg-dark-card/50 backdrop-blur-sm rounded-xl border border-dark-border"
                              style={{ borderColor: `${tech.color}40`, boxShadow: `0 0 20px ${tech.color}10` }}
                            >
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tech.color }} />
                              <span className="text-lg text-gray-200 font-medium">{feature}</span>
                            </div>
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
                              className="feature-item flex items-center gap-4 p-4 bg-dark-card/50 backdrop-blur-sm rounded-xl border border-dark-border"
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
                  className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
                  style={{ backgroundColor: tech.color }}
                />
                <div
                  className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-10"
                  style={{ backgroundColor: tech.color }}
                />
              </div>
            ))}
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {techStack.map((_, i) => (
              <div
                key={i}
                ref={(el) => (dotRefs.current[i] = el)}
                onClick={() => goTo(i)}
                className="h-2.5 w-2.5 rounded-full cursor-pointer bg-white/25"
              />
            ))}
          </div>
        </div>
      </div>

      {/* ============ نسخه موبایل/تبلت - کارت‌های شیشه‌ای (بدون انیمیشن) ============ */}
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
            transition: transform .4s ease, box-shadow .4s ease, border-color .4s ease, background .4s ease;
            overflow: hidden;
          }
          .skill-card::before {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 40%);
            pointer-events: none;
          }
          .skill-card:active {
            transform: translateY(-4px) scale(1.01);
            background: linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03));
            box-shadow: 0 20px 50px -10px var(--glow, transparent), inset 0 1px 0 rgba(255,255,255,0.15);
          }
        `}</style>

        <div className="max-w-6xl mx-auto text-center mb-12 sm:mb-16">
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

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
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
    </>
  );
}
