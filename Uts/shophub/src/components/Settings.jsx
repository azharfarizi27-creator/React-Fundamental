import { useState } from "react";

import {
  FaUser,
  FaStore,
  FaBell,
  FaPalette,
  FaSave,
  FaUndo,
  FaCheckCircle,
  FaSun,
  FaMoon,
} from "react-icons/fa";

function Settings({
  theme,
  onThemeChange,
}) {
  // ==========================================
  // PROFILE
  // ==========================================

  const [name, setName] = useState("Azhar Farizi");

  const [email, setEmail] =
    useState("azhar@example.com");


  // ==========================================
  // SHOP
  // ==========================================

  const [storeName, setStoreName] =
    useState("ShopHub");

  const [description, setDescription] =
    useState(
      "Platform manajemen produk sederhana untuk mengelola katalog dan wishlist."
    );


  // ==========================================
  // PREFERENCES
  // ==========================================

  const [notifications, setNotifications] =
    useState(true);

  const [emailNotification, setEmailNotification] =
    useState(false);

  const [compactMode, setCompactMode] =
    useState(false);


  // ==========================================
  // SAVE STATUS
  // ==========================================

  const [saved, setSaved] =
    useState(false);


  // ==========================================
  // SAVE
  // ==========================================

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };


  // ==========================================
  // RESET
  // ==========================================

  const handleReset = () => {
    setName("Azhar Farizi");

    setEmail("azhar@example.com");

    setStoreName("ShopHub");

    setDescription(
      "Platform manajemen produk sederhana untuk mengelola katalog dan wishlist."
    );

    setNotifications(true);

    setEmailNotification(false);

    setCompactMode(false);

    onThemeChange("light");

    setSaved(false);
  };


  return (
    <section>

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Pengaturan
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Kelola profil, informasi toko, dan
          preferensi aplikasi.
        </p>

      </div>


      {/* ===================================== */}
      {/* SUCCESS */}
      {/* ===================================== */}

      {saved && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400">

          <FaCheckCircle />

          Pengaturan berhasil disimpan.

        </div>
      )}


      <div className="mt-8 space-y-6">


        {/* ===================================== */}
        {/* PROFILE */}
        {/* ===================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <div className="border-b border-slate-100 p-6 dark:border-slate-800">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <FaUser />
              </div>

              <div>

                <h2 className="font-bold text-slate-900 dark:text-white">
                  Profil Pengguna
                </h2>

                <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                  Informasi pengguna aplikasi
                </p>

              </div>

            </div>

          </div>


          <div className="grid gap-5 p-6 md:grid-cols-2">

            {/* NAME */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Nama
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  py-3
                  text-sm
                  text-slate-700
                  outline-none
                  transition

                  focus:border-indigo-500
                  focus:bg-white
                  focus:ring-2
                  focus:ring-indigo-100

                  dark:border-slate-700
                  dark:bg-slate-800
                  dark:text-slate-200
                  dark:focus:bg-slate-800
                  dark:focus:ring-indigo-500/10
                "
              />

            </div>


            {/* EMAIL */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  py-3
                  text-sm
                  text-slate-700
                  outline-none
                  transition

                  focus:border-indigo-500
                  focus:bg-white
                  focus:ring-2
                  focus:ring-indigo-100

                  dark:border-slate-700
                  dark:bg-slate-800
                  dark:text-slate-200
                  dark:focus:bg-slate-800
                  dark:focus:ring-indigo-500/10
                "
              />

            </div>

          </div>

        </div>


        {/* ===================================== */}
        {/* SHOP INFO */}
        {/* ===================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <div className="border-b border-slate-100 p-6 dark:border-slate-800">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                <FaStore />
              </div>

              <div>

                <h2 className="font-bold text-slate-900 dark:text-white">
                  Informasi ShopHub
                </h2>

                <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                  Informasi dasar aplikasi
                </p>

              </div>

            </div>

          </div>


          <div className="space-y-5 p-6">

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Nama Aplikasi
              </label>

              <input
                type="text"
                value={storeName}
                onChange={(e) =>
                  setStoreName(e.target.value)
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  py-3
                  text-sm
                  text-slate-700
                  outline-none
                  transition

                  focus:border-indigo-500
                  focus:bg-white
                  focus:ring-2
                  focus:ring-indigo-100

                  dark:border-slate-700
                  dark:bg-slate-800
                  dark:text-slate-200
                  dark:focus:bg-slate-800
                  dark:focus:ring-indigo-500/10
                "
              />

            </div>


            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Deskripsi
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                rows="4"
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  py-3
                  text-sm
                  leading-6
                  text-slate-700
                  outline-none
                  transition

                  focus:border-indigo-500
                  focus:bg-white
                  focus:ring-2
                  focus:ring-indigo-100

                  dark:border-slate-700
                  dark:bg-slate-800
                  dark:text-slate-200
                  dark:focus:bg-slate-800
                  dark:focus:ring-indigo-500/10
                "
              />

            </div>

          </div>

        </div>


        {/* ===================================== */}
        {/* APPEARANCE */}
        {/* ===================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

          {/* HEADER */}

          <div className="border-b border-slate-100 p-6 dark:border-slate-800">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                <FaPalette />
              </div>

              <div>

                <h2 className="font-bold text-slate-900 dark:text-white">
                  Tampilan
                </h2>

                <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                  Atur tampilan ShopHub
                </p>

              </div>

            </div>

          </div>


          <div className="p-6">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Mode Tampilan
                </h3>

                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  {theme === "dark"
                    ? "Mode Malam sedang aktif."
                    : "Mode Siang sedang aktif."}
                </p>

              </div>

              {/* CURRENT MODE */}

              <div
                className={`
                  hidden
                  items-center
                  gap-2
                  rounded-full
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  sm:flex

                  ${
                    theme === "dark"
                      ? "bg-indigo-500/10 text-indigo-400"
                      : "bg-orange-100 text-orange-600"
                  }
                `}
              >

                {theme === "dark" ? (
                  <>
                    <FaMoon />
                    Malam
                  </>
                ) : (
                  <>
                    <FaSun />
                    Siang
                  </>
                )}

              </div>

            </div>


            {/* THEME BUTTONS */}

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">


              {/* ================================= */}
              {/* LIGHT */}
              {/* ================================= */}

              <button
                type="button"
                onClick={() =>
                  onThemeChange("light")
                }
                className={`
                  relative
                  flex
                  items-center
                  gap-4
                  rounded-xl
                  border
                  p-4
                  text-left
                  transition

                  ${
                    theme === "light"
                      ? `
                        border-indigo-500
                        bg-indigo-50
                        text-indigo-700
                        ring-2
                        ring-indigo-100

                        dark:border-indigo-400
                        dark:bg-indigo-500/10
                        dark:text-indigo-400
                        dark:ring-indigo-900/50
                      `
                      : `
                        border-slate-200
                        bg-white
                        text-slate-600
                        hover:bg-slate-50

                        dark:border-slate-700
                        dark:bg-slate-800
                        dark:text-slate-300
                        dark:hover:bg-slate-700
                      `
                  }
                `}
              >

                {/* ICON */}

                <div
                  className={`
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl

                    ${
                      theme === "light"
                        ? "bg-orange-100 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                    }
                  `}
                >
                  <FaSun />
                </div>


                <div className="min-w-0">

                  <div className="flex items-center gap-2">

                    <p className="text-sm font-semibold">
                      Mode Siang
                    </p>

                    {/* ACTIVE */}

                    {theme === "light" && (
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                        Aktif
                      </span>
                    )}

                  </div>

                  <p className="mt-1 text-xs opacity-70">
                    Tampilan terang
                  </p>

                </div>

              </button>


              {/* ================================= */}
              {/* DARK */}
              {/* ================================= */}

              <button
                type="button"
                onClick={() =>
                  onThemeChange("dark")
                }
                className={`
                  relative
                  flex
                  items-center
                  gap-4
                  rounded-xl
                  border
                  p-4
                  text-left
                  transition

                  ${
                    theme === "dark"
                      ? `
                        border-indigo-500
                        bg-indigo-50
                        text-indigo-700
                        ring-2
                        ring-indigo-100

                        dark:border-indigo-400
                        dark:bg-indigo-500/10
                        dark:text-indigo-400
                        dark:ring-indigo-900/50
                      `
                      : `
                        border-slate-200
                        bg-white
                        text-slate-600
                        hover:bg-slate-50

                        dark:border-slate-700
                        dark:bg-slate-800
                        dark:text-slate-300
                        dark:hover:bg-slate-700
                      `
                  }
                `}
              >

                {/* ICON */}

                <div
                  className={`
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl

                    ${
                      theme === "dark"
                        ? "bg-indigo-500/10 text-indigo-400"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    }
                  `}
                >
                  <FaMoon />
                </div>


                <div className="min-w-0">

                  <div className="flex items-center gap-2">

                    <p className="text-sm font-semibold">
                      Mode Malam
                    </p>

                    {/* ACTIVE */}

                    {theme === "dark" && (
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                        Aktif
                      </span>
                    )}

                  </div>

                  <p className="mt-1 text-xs opacity-70">
                    Tampilan gelap
                  </p>

                </div>

              </button>

            </div>

          </div>

        </div>


        {/* ===================================== */}
        {/* NOTIFICATION */}
        {/* ===================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <div className="border-b border-slate-100 p-6 dark:border-slate-800">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <FaBell />
              </div>

              <div>

                <h2 className="font-bold text-slate-900 dark:text-white">
                  Preferensi
                </h2>

                <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                  Atur perilaku aplikasi
                </p>

              </div>

            </div>

          </div>


          <div className="divide-y divide-slate-100 dark:divide-slate-800">

            <SettingToggle
              title="Notifikasi"
              description="Aktifkan notifikasi informasi produk."
              enabled={notifications}
              onChange={() =>
                setNotifications(!notifications)
              }
            />


            <SettingToggle
              title="Notifikasi Email"
              description="Terima informasi melalui email."
              enabled={emailNotification}
              onChange={() =>
                setEmailNotification(
                  !emailNotification
                )
              }
            />


            <SettingToggle
              title="Mode Ringkas"
              description="Gunakan tampilan yang lebih padat."
              enabled={compactMode}
              onChange={() =>
                setCompactMode(!compactMode)
              }
            />

          </div>

        </div>


        {/* ===================================== */}
        {/* ACTION */}
        {/* ===================================== */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={handleReset}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-5
              py-3
              text-sm
              font-semibold
              text-slate-600
              transition
              hover:bg-slate-50

              dark:border-slate-700
              dark:bg-slate-900
              dark:text-slate-300
              dark:hover:bg-slate-800
            "
          >
            <FaUndo />

            Reset
          </button>


          <button
            type="button"
            onClick={handleSave}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-indigo-600
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-indigo-700
              dark:hover:bg-indigo-500
            "
          >
            <FaSave />

            Simpan Pengaturan
          </button>

        </div>

      </div>

    </section>
  );
}


// ==========================================
// TOGGLE COMPONENT
// ==========================================

function SettingToggle({
  title,
  description,
  enabled,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-5 p-6">

      <div>

        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-400 dark:text-slate-500">
          {description}
        </p>

      </div>


      <button
        type="button"
        onClick={onChange}
        aria-label={`Toggle ${title}`}
        className={`
          relative
          h-6
          w-11
          shrink-0
          rounded-full
          transition

          ${
            enabled
              ? "bg-indigo-600"
              : "bg-slate-300 dark:bg-slate-700"
          }
        `}
      >

        <span
          className={`
            absolute
            top-1
            h-4
            w-4
            rounded-full
            bg-white
            shadow-sm
            transition

            ${
              enabled
                ? "left-6"
                : "left-1"
            }
          `}
        />

      </button>

    </div>
  );
}

export default Settings;