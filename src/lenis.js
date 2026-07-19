import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  autoRaf: false,

  // سرعت طبیعی
  duration: 0.8,

  // حس نرم ولی کنترل‌شده
  lerp: 0.08,

  smoothWheel: true,
  syncTouch: true,
  touchInertiaMultiplier: 1.2,

  wheelMultiplier: 0.9,

  infinite: false,
});

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);
 
requestAnimationFrame(() => {
  ScrollTrigger.refresh();
});

window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});

window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});

export default lenis;