import { FaBriefcase, FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <footer id="about" className="bg-white border-t border-slate-200 mt-12 py-10 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs">
              <FaBriefcase className="text-[10px]" />
            </div>
            <span className="font-bold text-slate-900 text-sm">CareerHub</span>
            <span className="text-slate-400 ml-2">Job Management App</span>
          </div>

          <div className="flex items-center gap-6 text-slate-500">
            <a href="#jobs" className="hover:text-slate-900 transition-colors">Lowongan</a>
            <a href="#about" className="hover:text-slate-900 transition-colors">Tentang</a>
            <a href="#about" className="hover:text-slate-900 transition-colors">Kontak</a>
          </div>

          <p className="text-slate-400">
            © {new Date().getFullYear()} CareerHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;