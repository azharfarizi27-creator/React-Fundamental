import { FaArrowDown, FaBriefcase, FaCompass } from "react-icons/fa";

function Hero({ totalJobs = 16, onExploreClick }) {
  return (
    <section id="hero" className="bg-white border-b border-slate-200/80 pt-12 pb-14 sm:pt-16 sm:pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
        {/* Subtle Category Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>{totalJobs} Posisi Tersedia Minggu Ini</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Peluang Karier Teknologi & Digital di Indonesia
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Temukan lowongan dari startup terpercaya hingga korporasi besar. Gunakan filter lokasi, tipe kerja, dan kisaran gaji yang transparan.
        </p>

        {/* Quick Tags / Stats in a subtle row */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-50 border border-slate-200 font-medium">
            <FaBriefcase className="text-slate-400 text-[10px]" /> Full Time & Remote
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-50 border border-slate-200 font-medium">
            <FaCompass className="text-slate-400 text-[10px]" /> Standar Gaji Terbuka
          </span>
        </div>
      </div>
    </section>
  );
}

export default Hero;