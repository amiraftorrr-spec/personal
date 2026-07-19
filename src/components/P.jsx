import { forwardRef, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaChevronDown, FaArrowRight } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: "Gaming Store",
    tag: "E-Commerce",
    description: "An online game store with a modern design and smooth shopping experience.",
    image: "/p3.webp",
    link: "https://gamingtor.vercel.app",
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
    title: "E-Commerce App",
    tag: "Full Stack",
    description: "An online store with a shopping cart and integrated payment gateway.",
    image: "/work.webp",
    link: "#",
  },
  {
    id: 5,
    title: "Landing Page",
    tag: "Marketing",
    description: "A landing page with eye-catching animations built to convert visitors.",
    image: "/work.webp",
    link: "#",
  },
  {
    id: 6,
    title: "Chat App",
    tag: "Real-Time",
    description: "A real-time chat application with instant messaging.",
    image: "/work.webp                 ",
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
      className="project-card cursor-hover group relative rounded-3xl overflow-hidden bg-white/[0.04] backdrop-blur-xl border shadow-[0_8px_32px_rgba(0,0,0,0.28)] will-change-[border-color,box-shadow]"
      style={{ borderColor: BASE_BORDER }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.07] via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]" />
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          draggable={false}
          className="w-full h-full object-cover select-none transition-transform duration-700 ease-out group-hover:scale-105"
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

        <p className="text-zinc-400 text-base leading-7 mb-6 min-h-[3.5rem]">
          {project.description}
        </p>

        <a href={project.link} target="_blank" rel="noopener noreferrer" className="cursor-hover inline-flex items-center gap-2 text-[#c8a96e] font-medium group/btn">
          View Project
          <FaArrowRight className="text-sm transition-transform duration-300 group-hover/btn:translate-x-1" />
        </a>
      </div>
    </div>
  );
});

function ProjectRow({ projects: rowProjects, rowRef }) {
  const cardsRef = useRef([]);
  cardsRef.current = [];

  const addCardRef = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  const handleMouseMove = (e) => {
    cardsRef.current.forEach((card) => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const distance = Math.abs(e.clientX - cardCenterX);
      const influence = rect.width * 1.15;
      const proximity = Math.max(0, 1 - distance / influence);

      gsap.to(card, {
        borderColor: `rgba(200, 169, 110, ${0.15 + proximity * 0.45})`,
        boxShadow: proximity > 0.02
          ? `0 0 ${Math.round(36 * proximity)}px rgba(200, 169, 110, ${(proximity * 0.22).toFixed(3)})`
          : "0 0 0px rgba(200, 169, 110, 0)",
        duration: 0.45,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  };

  const handleMouseLeave = () => {
    cardsRef.current.forEach((card) => {
      if (!card) return;
      gsap.to(card, {
        borderColor: BASE_BORDER,
        boxShadow: "0 0 0px rgba(200, 169, 110, 0)",
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  };

  return (
    <div
      ref={rowRef}
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
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        });

        const firstRowCards = firstRowRef.current.querySelectorAll(".project-card");

        gsap.from(firstRowCards, {
          y: 90,
          opacity: 0,
          scale: 0.92,
          duration: 1,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: { trigger: firstRowRef.current, start: "top 85%" },
        });
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  // نمایش/مخفی شدن ردیف دوم - انیمیشن فقط دسکتاپ، تو موبایل/تبلت فوری
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
              extraRowRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            },
          }
        );

        gsap.fromTo(
          cards,
          { y: 90, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            delay: 0.15,
            ease: "back.out(1.6)",
          }
        );
      } else {
        gsap.set(extraRowRef.current, { height: "auto", opacity: 1 });
        gsap.set(cards, { y: 0, opacity: 1, scale: 1 });
        extraRowRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
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
          duration: 0.5,
          ease: "power3.in",
          onComplete: () => setOpen(false),
        });
      } else {
        setOpen(true);
      }
    } else {
      gsap.set(arrowRef.current, { rotate: open ? 0 : 180 });

      if (open) {
        setOpen(false);
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
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#c8a96e]/10 blur-[160px] pointer-events-none" />

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
          onClick={toggleOpen}
          aria-label={open ? "Show less" : "Show more"}
          className="cursor-hover w-14 h-14 flex items-center justify-center rounded-full border border-[#c8a96e]/40 text-[#c8a96e] transition-all duration-300 hover:bg-[#c8a96e] hover:text-black hover:scale-110 hover:shadow-[0_0_25px_#c8a96e66]"
        >
          <span ref={arrowRef} className="inline-flex">
            <FaChevronDown className="text-xl" />
          </span>
        </button>
      </div>
    </section>
  );
}
