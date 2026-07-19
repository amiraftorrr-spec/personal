import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaCode } from "react-icons/fa";
import lenis from "../lenis";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    // انیمیشن‌ها فقط از سایز لپ‌تاپ به بالا (lg: 1024px) اجرا میشن
    // تو دیوایس‌های ضعیف (موبایل/تبلت) هیچ انیمیشنی اجرا نمیشه
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {

      const ctx = gsap.context(() => {
        // Image Animation
        gsap.from(imageRef.current, {
          x: -150,
          opacity: 0,
          scale: 0.8,
          rotate: -10,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "top 45%",
            scrub: 1,
          },
        });

        // Content Animation
        gsap.from(contentRef.current, {
          x: 150,
          opacity: 0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "top 45%",
            scrub: 1,
          },
        });

        // Floating Image
        gsap.to(imageRef.current, {
          y: -10,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".orb", {
          y: -40,
          duration: 4,
          stagger: 0.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".bg-code", {
          yPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(".star", {
          opacity: 0.15,
          scale: 0.4,
          stagger: {
            each: 0.25,
            repeat: -1,
            yoyo: true,
          },
          duration: 1.8,
        });
      }, sectionRef);

      return () => ctx.revert();

    });

    return () => mm.revert();
  }, []);

  const handleContactClick = () => {
    const target = document.getElementById("contact");
    if (target) {
      lenis.scrollTo(target, { immediate: true });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[#111111] flex items-center justify-center px-6 sm:px-8 md:px-20 py-20 lg:py-0"
    >


{/* Background */}

<div className="absolute inset-0 overflow-hidden pointer-events-none">

  <FaCode
    className="
    bg-code
    absolute
    right-20
    top-16
    text-[180px]
    sm:text-[240px]
    lg:text-[320px]
    text-[#c8a96e]/[0.03]
    rotate-12
    "
  />

  <div className="orb absolute left-[12%] top-[22%] w-52 h-52 rounded-full bg-[#c8a96e]/10 blur-[120px]" />

  <div className="orb absolute right-[10%] bottom-[20%] w-44 h-44 rounded-full bg-[#c8a96e]/10 blur-[110px]" />

  <div className="orb absolute left-1/2 top-[65%] w-36 h-36 rounded-full bg-[#c8a96e]/10 blur-[100px]" />

  <div className="star absolute left-[8%] top-[18%] w-1 h-1 bg-[#c8a96e] rounded-full shadow-[0_0_18px_#c8a96e]" />

  <div className="star absolute left-[24%] top-[72%] w-1 h-1 bg-[#c8a96e] rounded-full shadow-[0_0_18px_#c8a96e]" />

  <div className="star absolute right-[18%] top-[20%] w-1 h-1 bg-[#c8a96e] rounded-full shadow-[0_0_18px_#c8a96e]" />

  <div className="star absolute right-[12%] bottom-[24%] w-1 h-1 bg-[#c8a96e] rounded-full shadow-[0_0_18px_#c8a96e]" />

  <div className="star absolute left-[46%] top-[14%] w-1 h-1 bg-[#c8a96e] rounded-full shadow-[0_0_18px_#c8a96e]" />

  <div className="star absolute left-[62%] bottom-[12%] w-1 h-1 bg-[#c8a96e] rounded-full shadow-[0_0_18px_#c8a96e]" />

</div>


      <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* IMAGE */}
        <div ref={imageRef} className="flex justify-center relative z-[999]">
          <div className="relative group">
            <div className="absolute inset-0 rounded-full bg-[#c8a96e]/30 blur-[90px] group-hover:blur-[120px] duration-500" />

            <div className="absolute -inset-4 rounded-full border border-[#c8a96e]/20" />

            <div
              className="
              relative
              w-56
              h-56
              sm:w-64
              sm:h-64
              md:w-72
              md:h-72
              lg:w-80
              lg:h-80
              rounded-full
              overflow-hidden
              border-4
              border-[#c8a96e]/30
              bg-[#111111]
              transition-all
              duration-500
              group-hover:scale-105
              group-hover:shadow-[0_0_60px_#c8a96e55]
              "
              style={{
                isolation: "isolate",
              }}
            >
              <img
                src="/me.webp"
                alt="me"
                draggable={false}
                className="w-full h-full object-cover select-none"
              />
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div
          ref={contentRef}
          className="flex flex-col items-center text-center md:items-start md:text-left"
        >
          <p className="uppercase tracking-[6px] sm:tracking-[8px] text-[#c8a96e] mb-6 text-sm sm:text-base">
            About Me
          </p>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Hello,
            <br />
            <span className="text-[#c8a96e]">I'm AmirAftor</span>
          </h2>

          <p className="text-zinc-400 text-base sm:text-lg lg:text-xl leading-8 lg:leading-10 mt-6 lg:mt-8 max-w-xl">
            I'm a Frontend Developer passionate about crafting modern,
            interactive and visually engaging web experiences. I enjoy building
            fast, responsive and elegant interfaces with React, Next.js,
            Tailwind CSS and GSAP.
          </p>

          <button
            onClick={handleContactClick}
            className="
            cursor-hover
            mt-10
            lg:mt-12
            px-6
            sm:px-8
            py-3
            sm:py-4
            rounded-xl
            bg-[#c8a96e]
            text-black
            font-semibold
            text-sm
            sm:text-base
            transition-all
            duration-300
            hover:scale-105
            hover:shadow-[0_0_35px_#c8a96e66]
            active:scale-95
            "
          >
            Contact Me
          </button>
        </div>
      </div>
    </section>
    
  );
}
