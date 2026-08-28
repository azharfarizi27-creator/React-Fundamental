import { useState } from "react";
import { FaBriefcase, FaBars, FaTimes, FaPlus } from "react-icons/fa";

function Header({ onAddNewJob, totalJobsCount = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm font-semibold group-hover:bg-blue-600 transition-colors">
              <FaBriefcase className="text-xs" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              CareerHub
            </span>
          </a>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#jobs" className="text-slate-900 font-semibold hover:text-blue-600 transition-colors">
              Eksplor Lowongan
            </a>
            <a href="#about" className="hover:text-slate-900 transition-colors">
              Tentang
            </a>
            <a href="#about" className="hover:text-slate-900 transition-colors">
              Kontak
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium mr-1">
              {totalJobsCount} lowongan aktif
            </span>
            <button
              onClick={onAddNewJob}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer active:scale-98"
            >
              <FaPlus className="text-[10px]" />
              <span>Tambah Lowongan</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-md">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
            <a
              href="#jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-slate-50 text-slate-900 font-semibold"
            >
              Eksplor Lowongan ({totalJobsCount})
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Tentang Kami
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Kontak
            </a>
          </nav>
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onAddNewJob();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg"
            >
              <FaPlus className="text-[10px]" />
              <span>Tambah Lowongan Baru</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;