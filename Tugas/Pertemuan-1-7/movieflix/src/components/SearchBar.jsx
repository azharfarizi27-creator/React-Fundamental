import { Search, SlidersHorizontal } from "lucide-react";

function SearchBar({ search, setSearch }) {
  return (
    <div className="max-w-7xl mx-auto px-6 mt-8 mb-10">

      <div className="flex flex-col md:flex-row gap-4">

        {/* Search */}
        <div className="relative flex-1">

          <Search
            size={20}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            placeholder="Cari judul film..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              py-3
              pl-12
              pr-4
              text-white
              placeholder:text-slate-500
              outline-none
              focus:border-yellow-400
              transition
            "
          />

        </div>

        {/* Filter Button */}
        <button
          className="
            flex
            items-center
            justify-center
            gap-2
            px-6
            py-3
            rounded-xl
            bg-yellow-400
            text-slate-900
            font-semibold
            hover:bg-yellow-300
            transition
          "
        >
          <SlidersHorizontal size={18} />
          Filter
        </button>

      </div>

    </div>
  );
}

export default SearchBar;