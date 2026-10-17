import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const isDesktop =
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: fine)").matches;

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenis = null;

if (isDesktop && !prefersReducedMotion) {
  lenis = new Lenis({
    autoRaf: false,
    lerp: 0.1,
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: 1,
    infinite: false,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // غیرفعال کردن lagSmoothing برای جلوگیری از پرش و لگ در اسکرول روان
  gsap.ticker.lagSmoothing(0);
}

window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});

export default lenis;