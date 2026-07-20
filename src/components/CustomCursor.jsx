import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursor = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(pointer: fine)");

    const updateIsDesktop = () => setIsDesktop(mql.matches);
    updateIsDesktop();

    mql.addEventListener("change", updateIsDesktop);
    return () => mql.removeEventListener("change", updateIsDesktop);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const move = (e) => {
      gsap.to(cursor.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
      });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <div
      ref={cursor}
      className="
      fixed
      w-6
      h-6
      rounded-full
      border
      border-[#c8a96e]
      pointer-events-none
      z-[9999]
      -translate-x-1/2
      -translate-y-1/2
      "
    />
  );
}