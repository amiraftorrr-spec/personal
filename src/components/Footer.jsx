import { useEffect, useRef } from "react";
import gsap from "gsap";
import lenis from "../lenis";
import {
  FaEnvelope,
  FaTelegramPlane,
  FaInstagram,
  FaArrowUp,
} from "react-icons/fa";

const BASE_BORDER = "rgba(200, 169, 110, 0.15)";

const SKILLS = [
  "React",
  "JavaScript",
  "Tailwind CSS",
  "GSAP",
  "Node.js",
  "Next.js",
];

export default function Footer() {
  const footerRef = useRef(null);
  const colsRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // انیمیشن فقط تو دسکتاپ (>=1024px) اجرا میشه
    mm.add("(min-width: 1024px)", () => {
      const cols = colsRef.current.querySelectorAll(".footer-col");

      gsap.set(cols, { y: 40 });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.to(cols, {
                y: 0,
                opacity: 1,
                duration: 0.9,
                stagger: 0.15,
                ease: "power3.out",
              });
              observer.disconnect();
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: "0px 0px -10% 0px",
        }
      );

      observer.observe(footerRef.current);

      return () => observer.disconnect();
    });

    return () => mm.revert();
  }, []);

  const scrollToTop = () => {
    lenis.scrollTo(0, { immediate: true });
  };

  return (
    <footer
      ref={footerRef}
      className="relative bg-[#111111] pt-24 pb-10 px-8 md:px-24 overflow-hidden"
    >
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(200,169,110,0.10) 0%, rgba(200,169,110,0.04) 35%, rgba(200,169,110,0) 70%)",
          filter: "blur(90px)",
        }}
      />

      <div
        ref={colsRef}
        className="relative z-40 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 pb-16"
      >
        <div className="footer-col opacity-100 lg:opacity-0 md:col-span-2">
          <h3 className="text-3xl font-bold text-white mb-4">
            amir<span className="text-[#c8a96e]">aftor</span>
          </h3>
          <p className="text-zinc-400 leading-relaxed max-w-sm">
            We craft thoughtful digital experiences, from concept to
            launch, with an eye for detail and a passion for design.
          </p>

          <div className="flex items-center gap-4 mt-6">
            <a
              href="mailto:aftordev@gmail.com"
              aria-label="Send an email to aftordev@gmail.com"
              className="cursor-hover w-11 h-11 flex items-center justify-center rounded-full border border-[#c8a96e]/40 text-[#c8a96e] transition-all duration-300 hover:bg-[#c8a96e] hover:text-[#111111] hover:shadow-[0_0_20px_#c8a96e66]"
            >
              <FaEnvelope />
            </a>
            <a
              href="https://t.me/amiraftor"
              target="_blank"
              rel="noreferrer"
              aria-label="Telegram Profile"
              className="cursor-hover w-11 h-11 flex items-center justify-center rounded-full border border-[#c8a96e]/40 text-[#c8a96e] transition-all duration-300 hover:bg-[#c8a96e] hover:text-[#111111] hover:shadow-[0_0_20px_#c8a96e66]"
            >
              <FaTelegramPlane />
            </a>
            <a
              href="https://instagram.com/amir.aftor"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram Profile"
              className="cursor-hover w-11 h-11 flex items-center justify-center rounded-full border border-[#c8a96e]/40 text-[#c8a96e] transition-all duration-300 hover:bg-[#c8a96e] hover:text-[#111111] hover:shadow-[0_0_20px_#c8a96e66]"
            >
              <FaInstagram />
            </a>
          </div>
        </div>

        <div className="footer-col opacity-100 lg:opacity-0">
          <h4 className="text-white font-semibold mb-5 uppercase tracking-[2px] text-sm">
            Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map((skill) => (
              <span
                key={skill}
                className="text-xs text-[#c8a96e] border border-[#c8a96e]/30 rounded-full px-3 py-1.5 bg-[#c8a96e]/5"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="footer-col opacity-100 lg:opacity-0">
          <h4 className="text-white font-semibold mb-5 uppercase tracking-[2px] text-sm">
            Get In Touch
          </h4>
          <ul className="flex flex-col gap-3 text-zinc-400">
            <li>aftordev@gmail.com</li>
            <li>@amiraftor</li>
            <li>Iran</li>
          </ul>
        </div>
      </div>

      <div
        className="relative z-40 max-w-6xl mx-auto pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ borderColor: BASE_BORDER }}
      >
        <p className="text-zinc-500 text-sm text-center md:text-left">
          {"\u00A9"} {new Date().getFullYear()} amiraftor. All rights reserved.
        </p>

        <button
          onClick={scrollToTop}
          className="cursor-hover flex items-center gap-2 text-sm text-[#c8a96e] border border-[#c8a96e]/40 rounded-full px-5 py-2 transition-all duration-300 hover:bg-[#c8a96e] hover:text-[#111111] hover:shadow-[0_0_20px_#c8a96e66]"
        >
          Back to top
          <FaArrowUp className="text-xs" />
        </button>
      </div>
    </footer>
  );
}
