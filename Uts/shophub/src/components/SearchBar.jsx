import {
  FaSearch,
  FaTimes,
} from "react-icons/fa";

function SearchBar({
  search,
  setSearch,
}) {
  const handleClear = () => {
    setSearch("");
  };

  return (
    <div className="w-full">

      {/* Search Wrapper */}
      <div
        className="
          relative
          flex
          items-center
          rounded-xl
          border
          border-slate-200
          bg-slate-50
          transition-all
          duration-200

          focus-within:border-indigo-400
          focus-within:bg-white
          focus-within:ring-4
          focus-within:ring-indigo-500/10

          dark:border-slate-700
          dark:bg-slate-900
          dark:focus-within:border-indigo-500
          dark:focus-within:bg-slate-900
          dark:focus-within:ring-indigo-500/10
        "
      >

        {/* Search Icon */}

        <div
          className="
            pointer-events-none
            absolute
            left-4
            flex
            items-center
            justify-center
            text-slate-400

            dark:text-slate-500
          "
        >
          <FaSearch className="text-sm" />
        </div>


        {/* Input */}

        <input
          type="text"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Cari produk..."
          className="
            h-11
            w-full
            bg-transparent
            pl-11
            pr-11
            text-sm
            text-slate-800
            outline-none

            placeholder:text-slate-400

            dark:text-slate-200
            dark:placeholder:text-slate-500
          "
        />


        {/* Clear Button */}

        {search && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Hapus pencarian"
            className="
              absolute
              right-3
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-lg
              text-slate-400
              transition

              hover:bg-slate-200
              hover:text-slate-700

              dark:hover:bg-slate-800
              dark:hover:text-slate-200
            "
          >
            <FaTimes className="text-xs" />
          </button>
        )}

      </div>


      {/* Search Result Info */}

      {search && (
        <p className="mt-2 px-1 text-xs text-slate-400 dark:text-slate-500">
          Menampilkan hasil untuk{" "}
          <span className="font-medium text-slate-600 dark:text-slate-300">
            "{search}"
          </span>
        </p>
      )}

    </div>
  );
}

export default SearchBar;