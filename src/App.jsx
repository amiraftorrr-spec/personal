import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Hero from "./components/Hero";
import Particles from "./components/Particles";
import CustomCursor from "./components/CustomCursor";
import FilmGrain from "./components/FilmGrain";
import SectionDivider from "./components/SectionDivider";

// این کامپوننت‌ها پایین‌تر صفحه هستن، پس فقط وقتی لازم شدن لود میشن -
// این کار حجم بسته‌ی اولیه JS رو کم می‌کنه و لودِ اول صفحه سریع‌تر میشه
const About = lazy(() => import("./components/About"));
const Skills = lazy(() => import("./components/Skills"));
const P = lazy(() => import("./components/P"));
const Contact = lazy(() => import("./components/Contact"));
const Footer = lazy(() => import("./components/Footer"));
const AdminPanel = lazy(() => import("./components/AdminPanel"));

function MainSite() {
  return (
    <div className="relative">
      <Particles />
      <FilmGrain />
      <CustomCursor />
      <Hero />
      <SectionDivider />

      <Suspense fallback={null}>
        <About />
        <Skills />
        <P />
        <Contact />
        <Footer />
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainSite />} />
      <Route
        path="/admin"
        element={
          <Suspense
            fallback={
              <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center text-[#c8a96e]">
                در حال بارگذاری پنل مدیریت...
              </div>
            }
          >
            <AdminPanel />
          </Suspense>
        }
      />
    </Routes>
  );
}

export default App;