import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaEnvelope,
  FaTelegramPlane,
  FaInstagram,
  FaPaperPlane,
  FaCheckCircle,
} from "react-icons/fa";
import { submitContactMessage } from "../services/contactService";

gsap.registerPlugin(ScrollTrigger);

const BASE_BORDER = "rgba(200, 169, 110, 0.15)";

const NOISE_BG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

export default function Contact() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const visualRef = useRef(null);
  const formRef = useRef(null);
  const imgRef = useRef(null);

  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const mm = gsap.matchMedia();

    // انیمیشن‌ها فقط تو دسکتاپ (>=1024px) اجرا میشن
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
            start: "top 75%",
            once: true,
          },
        });

        gsap.from(visualRef.current, {
          x: -80,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          force3D: true,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          },
        });

        const fields = formRef.current?.querySelectorAll(".contact-field");
        if (fields?.length) {
          gsap.from(fields, {
            y: 50,
            opacity: 0,
            duration: 0.9,
            stagger: 0.15,
            ease: "power3.out",
            force3D: true,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              once: true,
            },
          });
        }
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => {
      mm.revert();
    };
  }, []);

  const handleChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setLoading(true);
    setError("");

    try {
      await submitContactMessage(values);

      setSent(true);
      setValues({ name: "", email: "", message: "" });
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      setError(
        typeof err?.message === "string"
          ? err.message
          : "Something went wrong, please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen bg-[#111111] py-32 px-8 md:px-24 overflow-hidden"
    >
      <div
        className="pointer-events-none absolute top-24 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(200,169,110,0.14) 0%, rgba(200,169,110,0.06) 40%, transparent 70%)",
          transform: "translate3d(-50%, 0, 0)",
          contain: "paint",
        }}
      />

      <div ref={headingRef} className="text-center mb-20 relative z-10">
        <p className="uppercase tracking-[8px] text-[#c8a96e] mb-6">Contact</p>
        <h2 className="text-6xl font-bold text-white leading-tight">
          Get In <span className="text-[#c8a96e]">Touch</span>
        </h2>
        <p className="text-zinc-400 text-xl mt-6 max-w-2xl mx-auto">
          Have a project in mind? Let's talk about how we can bring it to life.
        </p>
      </div>

      <div
        className="relative z-40 max-w-6xl mx-auto rounded-3xl overflow-hidden border shadow-[0_8px_32px_rgba(0,0,0,0.28)] bg-white/[0.04] backdrop-blur-sm"
        style={{ borderColor: BASE_BORDER, transform: "translateZ(0)" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.07] via-transparent to-transparent z-10" />

        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]"
          style={{ backgroundImage: NOISE_BG }}
        />

        <div className="relative z-20 grid grid-cols-1 lg:grid-cols-2 items-stretch">
          <div
            ref={visualRef}
            className="relative min-h-[460px] lg:min-h-[660px] lg:border-r"
            style={{ borderColor: BASE_BORDER }}
          >
            <img
              ref={imgRef}
              src="/contact.webp"
              alt="Get in touch"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-[#111111]/10" />

            <div className="relative z-20 h-full flex flex-col justify-end p-8 sm:p-10 gap-5">
              <div className="flex items-center gap-4">
                <span className="w-11 h-11 flex items-center justify-center rounded-full border border-[#c8a96e]/40 text-[#c8a96e] bg-[#111111]/70">
                  <FaEnvelope />
                </span>
                <div>
                  <p className="text-zinc-400 text-sm">Email</p>
                  <p className="text-white font-medium">aftordev@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="w-11 h-11 flex items-center justify-center rounded-full border border-[#c8a96e]/40 text-[#c8a96e] bg-[#111111]/70">
                  <FaTelegramPlane />
                </span>
                <div>
                  <p className="text-zinc-400 text-sm">Telegram</p>
                  <p className="text-white font-medium">@amiraftor</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="w-11 h-11 flex items-center justify-center rounded-full border border-[#c8a96e]/40 text-[#c8a96e] bg-[#111111]/70">
                  <FaInstagram />
                </span>
                <div>
                  <p className="text-zinc-400 text-sm">Instagram</p>
                  <p className="text-white font-medium">@amir.aftor</p>
                </div>
              </div>
            </div>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="relative p-8 sm:p-10 md:p-12 lg:p-14 flex flex-col justify-between gap-6 group min-h-[580px] lg:min-h-[660px]"
          >
            <div className="contact-field relative z-10">
              <label className="block text-sm text-zinc-400 mb-2" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                value={values.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full bg-white/[0.03] border rounded-xl px-4 py-3.5 text-white placeholder:text-zinc-500 outline-none transition-all duration-300 focus:border-[#c8a96e] focus:shadow-[0_0_0_3px_rgba(200,169,110,0.15)]"
                style={{ borderColor: BASE_BORDER }}
              />
            </div>

            <div className="contact-field relative z-10">
              <label className="block text-sm text-zinc-400 mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-white/[0.03] border rounded-xl px-4 py-3.5 text-white placeholder:text-zinc-500 outline-none transition-all duration-300 focus:border-[#c8a96e] focus:shadow-[0_0_0_3px_rgba(200,169,110,0.15)]"
                style={{ borderColor: BASE_BORDER }}
              />
            </div>

            <div className="contact-field relative z-10">
              <label className="block text-sm text-zinc-400 mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={7}
                value={values.message}
                onChange={handleChange}
                placeholder="Write your message..."
                className="w-full min-h-[170px] bg-white/[0.03] border rounded-xl px-4 py-3.5 text-white placeholder:text-zinc-500 outline-none resize-none transition-all duration-300 focus:border-[#c8a96e] focus:shadow-[0_0_0_3px_rgba(200,169,110,0.15)]"
                style={{ borderColor: BASE_BORDER }}
              />
            </div>

            {sent && (
              <div
                role="status"
                aria-live="polite"
                className="relative z-10 p-4 rounded-xl bg-[#c8a96e]/10 border border-[#c8a96e]/40 text-[#c8a96e] flex items-center gap-3 text-sm font-medium shadow-[0_0_25px_rgba(200,169,110,0.15)] transition-all"
              >
                <FaCheckCircle className="text-xl shrink-0 text-[#c8a96e]" />
                <div>
                  <p className="font-semibold text-white">Successful!</p>
                  <p className="text-xs text-zinc-300">Your message has been sent successfully.</p>
                </div>
              </div>
            )}

            {error && (
              <p role="alert" aria-live="assertive" className="relative z-10 text-red-400 text-sm">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              aria-label="Send message"
              className="cursor-hover shrink-0 relative z-10 mt-2 inline-flex items-center justify-center gap-3 rounded-full bg-[#1a1a1a] border-2 border-[#c8a96e] text-[#c8a96e] font-semibold py-4 px-8 transition-all duration-300 hover:bg-[#c8a96e] hover:text-[#111111] hover:shadow-[0_0_30px_#c8a96e80] hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#c8a96e] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-[#1a1a1a] disabled:hover:text-[#c8a96e]"
            >
              {loading ? "Sending..." : sent ? "Successful!" : "Send Message"}
              {sent ? (
                <FaCheckCircle className="text-sm text-[#c8a96e]" />
              ) : (
                <FaPaperPlane className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
