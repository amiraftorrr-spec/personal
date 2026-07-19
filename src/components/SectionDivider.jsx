import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SectionDivider() {

  const lineRef = useRef(null);

 useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.fromTo(
      lineRef.current,
      {
        scaleX: 1,
        opacity: 1,
      },
      {
        scaleX: 0,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: lineRef.current,
          start: "top center",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    );
  });

  ScrollTrigger.refresh();

  return () => ctx.revert();
}, []);

  return(

    <div className="relative h-24 flex items-center justify-center">

      <div
      ref={lineRef}
      className="
      origin-center
      w-[80%]
      h-[2px]
      rounded-full
      bg-gradient-to-r
      from-transparent
      via-[#c8a96e]
      to-transparent
      shadow-[0_0_20px_#c8a96e]
      "
      />

    </div>

  )

}
