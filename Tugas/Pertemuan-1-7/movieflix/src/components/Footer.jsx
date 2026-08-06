import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaGithub,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid md:grid-cols-3 gap-10">

          {/* Logo */}
          <div>
            <h2 className="text-3xl font-bold text-white">
              🎬 Movie<span className="text-yellow-400">Flix</span>
            </h2>

            <p className="text-slate-400 mt-4 leading-7">
              Temukan berbagai film favoritmu mulai dari Action,
              Adventure, Horror, Comedy hingga Sci-Fi dalam satu tempat.
            </p>
          </div>

          {/* Menu */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Menu
            </h3>

            <ul className="space-y-3 text-slate-400">
              <li className="hover:text-yellow-400 transition cursor-pointer">
                Beranda
              </li>

              <li className="hover:text-yellow-400 transition cursor-pointer">
                Film
              </li>

              <li className="hover:text-yellow-400 transition cursor-pointer">
                Favorit
              </li>

              <li className="hover:text-yellow-400 transition cursor-pointer">
                Tentang
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Ikuti Kami
            </h3>

            <div className="flex gap-4">

              <button
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-slate-900
                  hover:bg-yellow-400
                  hover:text-black
                  transition
                  flex
                  items-center
                  justify-center
                "
              >
                <FaFacebookF size={18} />
              </button>

              <button
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-slate-900
                  hover:bg-yellow-400
                  hover:text-black
                  transition
                  flex
                  items-center
                  justify-center
                "
              >
                <FaInstagram size={18} />
              </button>

              <button
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-slate-900
                  hover:bg-yellow-400
                  hover:text-black
                  transition
                  flex
                  items-center
                  justify-center
                "
              >
                <FaYoutube size={18} />
              </button>

              <button
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-slate-900
                  hover:bg-yellow-400
                  hover:text-black
                  transition
                  flex
                  items-center
                  justify-center
                "
              >
                <FaGithub size={18} />
              </button>

            </div>

            <p className="text-slate-500 text-sm mt-5">
              Ikuti kami untuk mendapatkan update film terbaru.
            </p>

          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">

          <p>© 2026 MovieFlix. All Rights Reserved.</p>

          <p className="mt-3 md:mt-0">
            Built with ❤️ React + Tailwind CSS
          </p>

        </div>

      </div>
    </footer>
  );
}

export default Footer;