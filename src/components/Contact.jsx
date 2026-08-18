import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaEnvelope,
  FaTelegramPlane,
  FaInstagram,
  FaPaperPlane,
} from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const BASE_BORDER = "rgba(200, 169, 110, 0.15)";

const NOISE_BG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

// آدرس بک‌اند - موقع دولوپ لوکال همینه، موقع دیپلوی این رو با متغیر
// محیطی (مثلا import.meta.env.VITE_API_URL یا process.env.NEXT_PUBLIC_API_URL)
// جایگزین کن تا هاردکد نمونه.
const CONTACT_API_URL = "http://localhost:3001/contact";

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
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 40%",
            invalidateOnRefresh: true,
          },
        });

        gsap.from(visualRef.current, {
          x: -80,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 35%",
            invalidateOnRefresh: true,
          },
        });

        const fields = formRef.current.querySelectorAll(".contact-field");
        gsap.from(fields, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 35%",
            invalidateOnRefresh: true,
          },
        });
      }, sectionRef);

      return () => ctx.revert();
    });

    const imgEl = imgRef.current;
    const handleImgLoad = () => ScrollTrigger.refresh();
    if (imgEl) {
      if (imgEl.complete) {
        ScrollTrigger.refresh();
      } else {
        imgEl.addEventListener("load", handleImgLoad);
      }
    }

    window.addEventListener("load", handleImgLoad);

    return () => {
      mm.revert();
      if (imgEl) imgEl.removeEventListener("load", handleImgLoad);
      window.removeEventListener("load", handleImgLoad);
    };
  }, []);

  const handleChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(CONTACT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "ارسال ناموفق بود");
      }

      setSent(true);
      setValues({ name: "", email: "", message: "" });
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      setError(
        typeof err?.message === "string"
          ? err.message
          : "مشکلی پیش اومد، دوباره امتحان کن."
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
        className="absolute top-24 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(200,169,110,0.14) 0%, rgba(200,169,110,0.06) 35%, rgba(200,169,110,0) 70%)",
          filter: "blur(80px)",
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
        className="relative z-40 max-w-6xl mx-auto rounded-3xl overflow-hidden border shadow-[0_8px_32px_rgba(0,0,0,0.28)] bg-white/[0.04] backdrop-blur-xl"
        style={{ borderColor: BASE_BORDER }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.07] via-transparent to-transparent z-10" />

        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.05] mix-blend-overlay"
          style={{ backgroundImage: NOISE_BG }}
        />

        <div className="relative z-20 grid grid-cols-1 lg:grid-cols-2 items-stretch">
          <div
            ref={visualRef}
            className="relative min-h-[420px] lg:min-h-full lg:border-r"
            style={{ borderColor: BASE_BORDER }}
          >
            <img
              ref={imgRef}
              src="/contact.webp"
              alt="Get in touch"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-[#111111]/10" />

            <div className="relative z-20 h-full flex flex-col justify-end p-8 gap-5">
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
            className="relative p-8 md:p-10 flex flex-col gap-6 group"
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
                value={values.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full bg-white/[0.03] border rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition-all duration-300 focus:border-[#c8a96e] focus:shadow-[0_0_0_3px_rgba(200,169,110,0.15)]"
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
                value={values.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-white/[0.03] border rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition-all duration-300 focus:border-[#c8a96e] focus:shadow-[0_0_0_3px_rgba(200,169,110,0.15)]"
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
                rows={6}
                value={values.message}
                onChange={handleChange}
                placeholder="Write your message..."
                className="w-full min-h-[140px] bg-white/[0.03] border rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 outline-none resize-none transition-all duration-300 focus:border-[#c8a96e] focus:shadow-[0_0_0_3px_rgba(200,169,110,0.15)]"
                style={{ borderColor: BASE_BORDER }}
              />
            </div>

            {error && (
              <p className="contact-field relative z-10 text-red-400 text-sm">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="cursor-hover contact-field shrink-0 relative z-10 mt-2 inline-flex items-center justify-center gap-3 rounded-full bg-[#1a1a1a] border-2 border-[#c8a96e] text-[#c8a96e] font-semibold py-4 transition-all duration-300 hover:bg-[#c8a96e] hover:text-[#111111] hover:shadow-[0_0_30px_#c8a96e80] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-[#1a1a1a] disabled:hover:text-[#c8a96e]"
            >
              {loading ? "Sending..." : sent ? "Message Sent" : "Send Message"}
              <FaPaperPlane className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
