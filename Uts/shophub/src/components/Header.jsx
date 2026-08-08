import {
  FaBars,
  FaHeart,
  FaShoppingCart,
  FaSearch,
  FaSun,
  FaMoon,
} from "react-icons/fa";

function Header({
  search,
  setSearch,
  setMobileMenu,
  favoriteCount = 0,
  cartCount = 0,
  theme,
  onToggleTheme,
  onWishlist,
  onCart,
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-900/95">

      {/* ====================================== */}
      {/* MAIN HEADER */}
      {/* ====================================== */}

      <div className="flex h-20 items-center justify-between px-4 md:px-8">

        {/* LEFT */}

        <div className="flex items-center gap-4">

          {/* MOBILE MENU */}

          <button
            onClick={() =>
              setMobileMenu(true)
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl text-xl text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
            aria-label="Buka menu"
          >
            <FaBars />
          </button>


          {/* GREETING */}

          <div className="hidden md:block">

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Selamat datang kembali 👋
            </p>

            <h1 className="font-semibold text-slate-900 dark:text-white">
              ShopHub
            </h1>

          </div>

        </div>


        {/* DESKTOP SEARCH */}

        <div className="mx-4 hidden max-w-md flex-1 md:block">

          <div className="relative">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Cari produk..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:bg-slate-800 dark:focus:ring-indigo-500/10"
            />

          </div>

        </div>


        {/* RIGHT */}

        <div className="flex items-center gap-1 sm:gap-2">

          {/* THEME */}

          <button
            onClick={onToggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            title={
              theme === "light"
                ? "Aktifkan mode malam"
                : "Aktifkan mode siang"
            }
          >

            {theme === "light" ? (
              <FaMoon />
            ) : (
              <FaSun className="text-yellow-400" />
            )}

          </button>


          {/* WISHLIST */}

          <button
            onClick={onWishlist}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            title="Wishlist"
          >

            <FaHeart />

            {favoriteCount > 0 && (

              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {favoriteCount}
              </span>

            )}

          </button>


          {/* CART */}

          <button
            onClick={onCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            title="Keranjang"
          >

            <FaShoppingCart />

            {cartCount > 0 && (

              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>

            )}

          </button>


          {/* AVATAR */}

          <div className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
            AF
          </div>

        </div>

      </div>


      {/* ====================================== */}
      {/* MOBILE SEARCH */}
      {/* ====================================== */}

      <div className="px-4 pb-4 md:hidden">

        <div className="relative">

          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Cari produk..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:bg-slate-800"
          />

        </div>

      </div>

    </header>
  );
}

export default Header;