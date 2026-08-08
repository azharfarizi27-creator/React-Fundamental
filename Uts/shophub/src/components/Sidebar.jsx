import {
  FaHome,
  FaBoxOpen,
  FaHeart,
  FaShoppingCart,
  FaCog,
  FaTimes,
  FaStore,
  FaSun,
  FaMoon,
  FaChevronRight,
  FaCircle,
} from "react-icons/fa";

function Sidebar({
  activeMenu,
  setActiveMenu,
  mobileMenu = false,
  setMobileMenu,
  favoriteCount = 0,
  cartCount = 0,
  theme = "light",
  onToggleTheme,
}) {
  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaHome />,
    },
    {
      name: "Produk",
      icon: <FaBoxOpen />,
    },
    {
      name: "Wishlist",
      icon: <FaHeart />,
      badge: favoriteCount,
    },
    {
      name: "Cart",
      icon: <FaShoppingCart />,
      badge: cartCount,
    },
  ];

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);

    if (setMobileMenu) {
      setMobileMenu(false);
    }
  };

  return (
    <>
      {/* ============================= */}
      {/* MOBILE OVERLAY */}
      {/* ============================= */}

      {mobileMenu && (
        <div
          onClick={() => setMobileMenu(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm md:hidden"
        />
      )}

      {/* ============================= */}
      {/* SIDEBAR */}
      {/* ============================= */}

      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-[270px] flex-col
          border-r border-slate-200
          bg-white
          transition-transform duration-300

          dark:border-slate-800
          dark:bg-slate-950

          md:sticky
          md:top-0
          md:z-20
          md:translate-x-0

          ${
            mobileMenu
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* ============================= */}
        {/* BRAND */}
        {/* ============================= */}

        <div className="flex h-[70px] shrink-0 items-center justify-between border-b border-slate-100 px-5 dark:border-slate-800">

          <button
            onClick={() => handleMenuClick("Dashboard")}
            className="group flex items-center gap-3"
          >

            {/* LOGO */}

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm transition duration-200 group-hover:scale-105">
              <FaStore className="text-sm" />
            </div>

            {/* BRAND */}

            <div className="text-left">

              <h1 className="text-lg font-bold leading-none tracking-tight text-slate-900 dark:text-white">
                Shop<span className="text-indigo-600">Hub</span>
              </h1>

              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Product Manager
              </p>

            </div>

          </button>


          {/* MOBILE CLOSE */}

          <button
            onClick={() => setMobileMenu(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 md:hidden"
          >
            <FaTimes className="text-sm" />
          </button>

        </div>


        {/* ============================= */}
        {/* MAIN CONTENT */}
        {/* ============================= */}

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">

          <div className="px-4 pt-5">

            {/* ========================= */}
            {/* PROFILE */}
            {/* ========================= */}

            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">

              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">

                AF

                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-50 bg-emerald-500 dark:border-slate-900" />

              </div>


              <div className="min-w-0">

                <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Azhar Farizi
                </p>

                <div className="mt-0.5 flex items-center gap-1.5">

                  <FaCircle className="text-[5px] text-emerald-500" />

                  <span className="text-[11px] text-slate-400">
                    Online
                  </span>

                </div>

              </div>

            </div>


            {/* ========================= */}
            {/* MENU */}
            {/* ========================= */}

            <div className="mt-6">

              <p className="mb-2.5 px-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Menu Utama
              </p>


              <nav className="space-y-1">

                {menuItems.map((item) => {

                  const isActive =
                    activeMenu === item.name;

                  return (
                    <button
                      key={item.name}
                      onClick={() =>
                        handleMenuClick(item.name)
                      }
                      className={`
                        group relative flex w-full
                        items-center gap-3
                        rounded-xl px-3 py-2
                        text-sm font-medium
                        transition-all duration-200

                        ${
                          isActive
                            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                        }
                      `}
                    >

                      {/* ACTIVE INDICATOR */}

                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-indigo-500" />
                      )}


                      {/* ICON */}

                      <span
                        className={`
                          flex h-9 w-9 shrink-0
                          items-center justify-center
                          rounded-lg
                          transition

                          ${
                            isActive
                              ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                              : "bg-slate-100 text-slate-400 group-hover:text-slate-600 dark:bg-slate-900 dark:text-slate-500 dark:group-hover:text-slate-300"
                          }
                        `}
                      >
                        {item.icon}
                      </span>


                      {/* NAME */}

                      <span className="flex-1 text-left">
                        {item.name}
                      </span>


                      {/* BADGE */}

                      {item.badge > 0 && (
                        <span
                          className={`
                            min-w-5 rounded-full
                            px-1.5 py-0.5
                            text-center text-[10px]
                            font-bold

                            ${
                              item.name === "Wishlist"
                                ? "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                                : "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                            }
                          `}
                        >
                          {item.badge}
                        </span>
                      )}


                      {/* ARROW */}

                      <FaChevronRight
                        className={`
                          text-[8px]
                          transition-all

                          ${
                            isActive
                              ? "translate-x-0 opacity-60"
                              : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-40"
                          }
                        `}
                      />

                    </button>
                  );
                })}

              </nav>

            </div>





            {/* ========================= */}
            {/* SYSTEM */}
            {/* ========================= */}

            <div className="mt-5">

              <p className="mb-2.5 px-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Sistem
              </p>


              <button
                onClick={() =>
                  handleMenuClick("Pengaturan")
                }
                className={`
                  group flex w-full
                  items-center gap-3
                  rounded-xl px-3 py-2
                  text-sm font-medium
                  transition

                  ${
                    activeMenu === "Pengaturan"
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                  }
                `}
              >

                <span
                  className={`
                    flex h-9 w-9
                    items-center justify-center
                    rounded-lg

                    ${
                      activeMenu === "Pengaturan"
                        ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                        : "bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-500"
                    }
                  `}
                >
                  <FaCog />
                </span>


                <span className="flex-1 text-left">
                  Pengaturan
                </span>


                <FaChevronRight className="text-[8px] opacity-40" />

              </button>

            </div>

          </div>

        </div>


        {/* ============================= */}
        {/* BOTTOM */}
        {/* ============================= */}

        <div className="shrink-0 border-t border-slate-100 p-3.5 dark:border-slate-800">

          {/* THEME */}

          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2 dark:bg-slate-900">

            <div className="flex items-center gap-2 px-2">

              {theme === "light" ? (
                <FaSun className="text-orange-500" />
              ) : (
                <FaMoon className="text-indigo-400" />
              )}

              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {theme === "light"
                  ? "Mode Siang"
                  : "Mode Malam"}
              </span>

            </div>


            <button
              onClick={onToggleTheme}
              title="Ganti tema"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm transition hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-indigo-400"
            >

              {theme === "light" ? (
                <FaMoon className="text-xs" />
              ) : (
                <FaSun className="text-xs" />
              )}

            </button>

          </div>


          {/* VERSION */}

          <p className="mt-2 text-center text-[9px] text-slate-400">
            ShopHub v1.0.0
          </p>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;