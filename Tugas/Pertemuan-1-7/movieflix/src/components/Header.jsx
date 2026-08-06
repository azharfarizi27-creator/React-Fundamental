import { Search, UserCircle2 } from "lucide-react";

function Header() {
  return (
    <header
      className="
        sticky
        top-0
        z-50
        bg-slate-950/90
        backdrop-blur-md
        border-b
        border-slate-800
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          h-20
          flex
          items-center
          justify-between
        "
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎬</span>

          <h1 className="text-2xl font-bold text-white">
            Movie<span className="text-yellow-400">Flix</span>
          </h1>
        </div>

        {/* Menu */}
        <nav className="hidden lg:flex items-center gap-10">
          <a
            href="#"
            className="text-yellow-400 font-medium border-b-2 border-yellow-400 pb-1"
          >
            Beranda
          </a>

          <a
            href="#"
            className="text-slate-300 hover:text-white transition"
          >
            Film
          </a>

          <a
            href="#"
            className="text-slate-300 hover:text-white transition"
          >
            Genre
          </a>

          <a
            href="#"
            className="text-slate-300 hover:text-white transition"
          >
            Favorit
          </a>

          <a
            href="#"
            className="text-slate-300 hover:text-white transition"
          >
            Tentang
          </a>
        </nav>

        {/* Search */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Cari film..."
              className="
                w-72
                bg-slate-900
                border
                border-slate-700
                rounded-xl
                py-3
                pl-11
                pr-4
                text-sm
                text-white
                placeholder:text-slate-500
                outline-none
                focus:border-yellow-400
                transition
              "
            />
          </div>

          <button className="text-slate-300 hover:text-white transition">
            <UserCircle2 size={38} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;