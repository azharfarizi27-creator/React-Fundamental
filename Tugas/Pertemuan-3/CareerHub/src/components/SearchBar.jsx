import { FaSearch, FaTimes, FaUndo, FaSlidersH } from "react-icons/fa";

function SearchBar({
  searchTerm,
  onSearchChange,
  locationFilter,
  onLocationChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  sortBy,
  onSortChange,
  onResetFilters,
  locations = [],
  jobTypes = [],
}) {
  const isFiltered =
    searchTerm !== "" ||
    locationFilter !== "Semua" ||
    statusFilter !== "Semua" ||
    typeFilter !== "Semua" ||
    sortBy !== "default";

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
        {/* Main Search Input */}
        <div className="relative flex items-center">
          <FaSearch className="absolute left-3.5 text-slate-400 text-sm pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari berdasarkan judul posisi, teknologi, atau perusahaan..."
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
              title="Hapus pencarian"
            >
              <FaTimes className="text-xs" />
            </button>
          )}
        </div>

        {/* Filter & Sort Controls Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Lokasi Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Lokasi
            </label>
            <select
              value={locationFilter}
              onChange={(e) => onLocationChange(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-50 hover:bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:bg-white focus:outline-none focus:border-slate-400 transition-all"
            >
              <option value="Semua">Semua Lokasi</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Tipe Pekerjaan Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Tipe Kerja
            </label>
            <select
              value={typeFilter}
              onChange={(e) => onTypeChange(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-50 hover:bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:bg-white focus:outline-none focus:border-slate-400 transition-all"
            >
              <option value="Semua">Semua Tipe</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Status Lowongan Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-50 hover:bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:bg-white focus:outline-none focus:border-slate-400 transition-all"
            >
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Ditutup">Ditutup</option>
            </select>
          </div>

          {/* Urutkan / Sorting */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Urutkan
            </label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-50 hover:bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:bg-white focus:outline-none focus:border-slate-400 transition-all"
            >
              <option value="default">Terbaru</option>
              <option value="name-asc">Nama (A - Z)</option>
              <option value="name-desc">Nama (Z - A)</option>
              <option value="salary-asc">Gaji Terendah</option>
              <option value="salary-desc">Gaji Tertinggi</option>
            </select>
          </div>
        </div>

        {/* Active Filter Indicators & Reset Link */}
        {isFiltered && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap text-slate-500">
              <span className="font-semibold text-slate-700">Filter:</span>
              {searchTerm && (
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  &ldquo;{searchTerm}&rdquo;
                </span>
              )}
              {locationFilter !== "Semua" && (
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {locationFilter}
                </span>
              )}
              {typeFilter !== "Semua" && (
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {typeFilter}
                </span>
              )}
              {statusFilter !== "Semua" && (
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  Status: {statusFilter}
                </span>
              )}
              {sortBy !== "default" && (
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  Urutan: {sortBy}
                </span>
              )}
            </div>

            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium hover:underline cursor-pointer ml-auto"
            >
              <FaUndo className="text-[10px]" />
              <span>Reset filter</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default SearchBar;