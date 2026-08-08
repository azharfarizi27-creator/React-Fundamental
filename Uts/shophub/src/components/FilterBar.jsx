import {
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaTimes,
} from "react-icons/fa";

function FilterBar({
  search,
  setSearch,
  category,
  setCategory,
  categories,
  sortBy,
  setSortBy,
}) {
  const handleReset = () => {
    setSearch("");
    setCategory("Semua");
    setSortBy("default");
  };

  const hasFilter =
    search !== "" ||
    category !== "Semua" ||
    sortBy !== "default";

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-slate-500" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama produk..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:bg-slate-800 dark:focus:ring-indigo-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <FaFilter className="hidden text-sm text-slate-400 dark:text-slate-500 sm:block" />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full min-w-[170px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-indigo-400 dark:focus:ring-indigo-900"
          >
            <option value="Semua">Semua Kategori</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <FaSortAmountDown className="hidden text-sm text-slate-400 dark:text-slate-500 sm:block" />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full min-w-[190px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-indigo-400 dark:focus:ring-indigo-900"
          >
            <option value="default">Urutan Default</option>
            <option value="price-low">Harga Terendah</option>
            <option value="price-high">Harga Tertinggi</option>
            <option value="rating">Rating Tertinggi</option>
            <option value="name">Nama A-Z</option>
          </select>
        </div>

        {hasFilter && (
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-slate-700 dark:text-slate-400 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-400"
          >
            <FaTimes />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

export default FilterBar;