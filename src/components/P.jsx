import { forwardRef, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaChevronDown, FaArrowRight } from "react-icons/fa";
import lenis from "../lenis";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: "Gaming Store",
    tag: "E-Commerce",
    description: "An online game store with a modern design and smooth shopping experience.",
    image: "/p3.webp",
    link: "https://gamingtorr.vercel.app",
  },
  {
    id: 2,
    title: "School Website",
    tag: "Educational",
    description: "A Persian school website for Khajeh Nasiraldin Tousi vocational school, presenting courses and information.",
    image: "/p2.webp",
    link: "https://nasirsch.ir/",
  },
  {
    id: 3,
    title: "Webcam App",
    tag: "Web App",
    description: "A browser-based webcam app with a clean dark-mode interface for live video.",
    image: "/p1.webp",
    link: "https://edh-webcam.vercel.app/",
  },
  {
    id: 4,
    title: "Alo Zoghal",
    tag: "E-Commerce",
    description: "An online charcoal and barbecue supplies store with express delivery and online ordering.",
    image: "/alo.webp",
    link: "https://alo-zoghal.com",
  },
  {
    id: 5,
    title: "Wexun",
    tag: "Digital Studio",
    description: "A modern digital agency and studio website for branding, web development, and digital marketing.",
    image: "/wexun.webp",
    link: "https://wexun.vercel.app",
  },
  {
    id: 6,
    title: "Chat App",
    tag: "Real-Time",
    description: "A real-time chat application with instant messaging.",
    image: "/work.webp",
    link: "#",
  },
];

const BASE_BORDER = "rgba(200, 169, 110, 0.15)";

// آیا صفحه در حالت دسکتاپ هست؟ (>=1024px)
const isDesktop = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(min-width: 1024px)").matches;

const ProjectCard = forwardRef(function ProjectCard({ project }, ref) {
  return (
    <div
      ref={ref}
      className="project-card cursor-hover group relative rounded-3xl overflow-hidden bg-white/[0.04] backdrop-blur-sm border shadow-[0_8px_32px_rgba(0,0,0,0.28)] transition-transform duration-200 active:scale-[0.98]"
      style={{ borderColor: BASE_BORDER, transform: "translateZ(0)" }}
    >
      {/* لایه گلو برای هاور پروکسیمیتی بر پایه GPU بدون لاگ */}
      <div
        className="card-glow pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300"
        style={{
          boxShadow: "0 0 35px rgba(200, 169, 110, 0.35)",
          border: "1px solid rgba(200, 169, 110, 0.6)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.07] via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]" />
      <div className="relative h-72 sm:h-80 w-full overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          draggable={false}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-top select-none transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/10 to-transparent" />

        <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide bg-[#111111]/70 border border-white/10 text-[#c8a96e]">
          {project.tag}
        </span>
      </div>

      <div className="p-7">
        <h3 className="text-2xl font-semibold text-white mb-3 transition-colors duration-300 group-hover:text-[#c8a96e]">
          {project.title}
        </h3>

        <p className="text-zinc-300 text-base leading-7 mb-6 min-h-[3.5rem]">
          {project.description}
        </p>

        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View project: ${project.title}`}
          className="cursor-hover inline-flex items-center gap-2 text-[#c8a96e] font-medium group/btn"
        >
          View Project
          <FaArrowRight className="text-sm transition-transform duration-300 group-hover/btn:translate-x-1" />
        </a>
      </div>
    </div>
  );
});

function ProjectRow({ projects: rowProjects, rowRef }) {
  const cardsRef = useRef([]);
  const centersRef = useRef([]);
  const rafRef = useRef(null);
  const isHoveringRef = useRef(false);

  const addCardRef = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  const updateCenters = () => {
    centersRef.current = cardsRef.current.map((card) => {
      if (!card) return null;
      const rect = card.getBoundingClientRect();
      return {
        centerX: rect.left + rect.width / 2,
        width: rect.width,
        glowEl: card.querySelector(".card-glow"),
      };
    });
  };

  const handleMouseEnter = () => {
    isHoveringRef.current = true;
    updateCenters();
  };

  const handleMouseMove = (e) => {
    if (!isHoveringRef.current) return;
    if (rafRef.current) return;
    const clientX = e.clientX;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (!centersRef.current.length) updateCenters();

      centersRef.current.forEach((info) => {
        if (!info || !info.glowEl) return;
        const distance = Math.abs(clientX - info.centerX);
        const influence = info.width * 1.15;
        const proximity = Math.max(0, 1 - distance / influence);
        info.glowEl.style.opacity = proximity > 0.02 ? (proximity * 0.95).toFixed(3) : "0";
      });
    });
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    centersRef.current.forEach((info) => {
      if (info && info.glowEl) {
        info.glowEl.style.opacity = "0";
      }
    });
  };

  return (
    <div
      ref={rowRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative z-[60] grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
    >
      {rowProjects.map((project) => (
        <ProjectCard key={project.id} project={project} ref={addCardRef} />
      ))}
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const firstRowRef = useRef(null);
  const extraRowRef = useRef(null);
  const arrowRef = useRef(null);

  const [open, setOpen] = useState(false);

  const firstRow = projects.slice(0, 3);
  const secondRow = projects.slice(3, 6);

  // انیمیشن‌های ورود موقع اسکرول - فقط دسکتاپ (>=1024px)
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const ctx = gsap.context(() => {
        gsap.from(headingRef.current, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          force3D: true,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        });

        const firstRowCards = firstRowRef.current?.querySelectorAll(".project-card");
        if (firstRowCards?.length) {
          gsap.from(firstRowCards, {
            y: 90,
            opacity: 0,
            scale: 0.92,
            duration: 1,
            stagger: 0.15,
            ease: "power4.out",
            force3D: true,
            scrollTrigger: {
              trigger: firstRowRef.current,
              start: "top 85%",
              once: true,
            },
          });
        }
      }, sectionRef);

      return () => ctx.revert();
    });

    // انیمیشن نرم و بهینه برای موبایل و تبلت با اسکرول (کامپوزیت سبک GPU)
    mm.add("(max-width: 1023px)", () => {
      const ctx = gsap.context(() => {
        gsap.from(headingRef.current, {
          y: 25,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          force3D: true,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        });

        const firstRowCards = firstRowRef.current?.querySelectorAll(".project-card");
        if (firstRowCards?.length) {
          gsap.from(firstRowCards, {
            y: 35,
            opacity: 0,
            scale: 0.96,
            duration: 0.65,
            stagger: 0.12,
            ease: "power2.out",
            force3D: true,
            scrollTrigger: {
              trigger: firstRowRef.current,
              start: "top 80%",
              once: true,
            },
          });
        }
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  // نمایش/مخفی شدن ردیف دوم با انیمیشن روان و سبک در دسکتاپ و موبایل
  useEffect(() => {
    if (open && extraRowRef.current) {
      const cards = extraRowRef.current.querySelectorAll(".project-card");

      if (isDesktop()) {
        gsap.fromTo(
          extraRowRef.current,
          { height: 0, opacity: 0 },
          {
            height: "auto",
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
            onComplete: () => {
              ScrollTrigger.refresh();
              if (lenis) {
                lenis.scrollTo(extraRowRef.current, {
                  offset: -80,
                  duration: 0.8,
                });
              } else {
                extraRowRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            },
          }
        );

        gsap.fromTo(
          cards,
          { y: 70, opacity: 0, scale: 0.94 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.12,
            delay: 0.1,
            ease: "back.out(1.4)",
            force3D: true,
          }
        );
      } else {
        gsap.fromTo(
          extraRowRef.current,
          { height: 0, opacity: 0 },
          {
            height: "auto",
            opacity: 1,
            duration: 0.45,
            ease: "power2.out",
            onComplete: () => {
              ScrollTrigger.refresh();
              extraRowRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
              });
            },
          }
        );

        gsap.fromTo(
          cards,
          { y: 30, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
            force3D: true,
          }
        );
      }
    }
  }, [open]);

  const toggleOpen = () => {
    if (isDesktop()) {
      gsap.to(arrowRef.current, {
        rotate: open ? 0 : 180,
        duration: 0.5,
        ease: "power3.inOut",
      });

      if (open) {
        gsap.to(extraRowRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.45,
          ease: "power3.in",
          onComplete: () => {
            setOpen(false);
            ScrollTrigger.refresh();
          },
        });
      } else {
        setOpen(true);
      }
    } else {
      gsap.to(arrowRef.current, {
        rotate: open ? 0 : 180,
        duration: 0.35,
        ease: "power2.inOut",
      });

      if (open) {
        gsap.to(extraRowRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.35,
          ease: "power2.in",
          onComplete: () => {
            setOpen(false);
            ScrollTrigger.refresh();
          },
        });
      } else {
        setOpen(true);
      }
    }
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative min-h-screen bg-[#111111] py-32 px-8 md:px-24 overflow-hidden"
    >
      <div
        className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle at center, rgba(200, 169, 110, 0.16) 0%, rgba(200, 169, 110, 0.05) 40%, transparent 70%)",
          transform: "translate3d(-50%, 0, 0)",
          contain: "paint",
        }}
      />

      <div ref={headingRef} className="text-center mb-20 relative z-10">
        <p className="uppercase tracking-[8px] text-[#c8a96e] mb-6">Portfolio</p>
        <h2 className="text-6xl font-bold text-white leading-tight">
          My <span className="text-[#c8a96e]">Projects</span>
        </h2>
        <p className="text-zinc-400 text-xl mt-6 max-w-2xl mx-auto">
          A showcase of projects I've crafted with care and precision
        </p>
      </div>

      <ProjectRow projects={firstRow} rowRef={firstRowRef} />

      {open && (
        <div
          ref={extraRowRef}
          className="relative z-[60] overflow-hidden mt-8"
          style={{ height: 0, opacity: 0 }}
        >
          <ProjectRow projects={secondRow} rowRef={null} />
        </div>
      )}

      <div className="relative z-10 flex items-center justify-center mt-12">
        <button
          type="button"
          onClick={toggleOpen}
          aria-expanded={open}
          aria-label={open ? "Show less projects" : "Show more projects"}
          className="cursor-hover w-14 h-14 flex items-center justify-center rounded-full border border-[#c8a96e]/40 text-[#c8a96e] transition-all duration-300 hover:bg-[#c8a96e] hover:text-black hover:scale-110 active:scale-95 hover:shadow-[0_0_25px_#c8a96e66] focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
        >
          <span ref={arrowRef} className="inline-flex">
            <FaChevronDown className="text-xl" />
          </span>
        </button>
      </div>
    </section>
  );
}
