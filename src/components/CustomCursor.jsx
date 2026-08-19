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

    const cursorEl = cursor.current;
    if (!cursorEl) return;

    const xSetter = gsap.quickSetter(cursorEl, "x", "px");
    const ySetter = gsap.quickSetter(cursorEl, "y", "px");

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = null;

    const move = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const render = () => {
      currentX += (mouseX - currentX) * 0.2;
      currentY += (mouseY - currentY) * 0.2;
      xSetter(currentX);
      ySetter(currentY);
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    window.addEventListener("mousemove", move, { passive: true });

    return () => {
      window.removeEventListener("mousemove", move);
      if (rafId) cancelAnimationFrame(rafId);
    };
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