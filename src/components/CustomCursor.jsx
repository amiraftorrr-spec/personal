import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursor = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(pointer: fine)");
    const motionMql = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateIsDesktop = () => setIsDesktop(mql.matches && !motionMql.matches);
    updateIsDesktop();

    mql.addEventListener("change", updateIsDesktop);
    motionMql.addEventListener("change", updateIsDesktop);
    return () => {
      mql.removeEventListener("change", updateIsDesktop);
      motionMql.removeEventListener("change", updateIsDesktop);
    };
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const cursorEl = cursor.current;
    if (!cursorEl) return;

    gsap.set(cursorEl, { xPercent: -50, yPercent: -50, force3D: true });

    const xSetter = gsap.quickSetter(cursorEl, "x", "px");
    const ySetter = gsap.quickSetter(cursorEl, "y", "px");

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let isRunning = false;
    let rafId = null;

    const render = () => {
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;

      currentX += dx * 0.2;
      currentY += dy * 0.2;

      xSetter(currentX);
      ySetter(currentY);

      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        rafId = requestAnimationFrame(render);
      } else {
        isRunning = false;
      }
    };

    const move = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(render);
      }
    };

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
      aria-hidden="true"
      className="
      fixed
      top-0
      left-0
      w-6
      h-6
      rounded-full
      border
      border-[#c8a96e]
      pointer-events-none
      z-[9999]
      will-change-transform
      "
    />
  );
}