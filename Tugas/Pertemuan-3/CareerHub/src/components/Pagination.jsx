import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) {
  if (totalPages <= 1) return null;

  // Bab 11: Array halaman dengan Math.ceil() & .map()
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-200 text-xs">
      {/* Information text */}
      <p className="text-slate-500">
        Menampilkan <span className="font-semibold text-slate-800">{startItem}–{endItem}</span> dari{" "}
        <span className="font-semibold text-slate-800">{totalItems}</span> lowongan
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border font-medium transition-colors ${
            currentPage === 1
              ? "bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
          }`}
          aria-label="Previous page"
        >
          <FaChevronLeft className="text-[10px]" />
          <span>Sebelumnya</span>
        </button>

        {/* Page Numbers (.map) */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                currentPage === page
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border font-medium transition-colors ${
            currentPage === totalPages
              ? "bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
          }`}
          aria-label="Next page"
        >
          <span>Selanjutnya</span>
          <FaChevronRight className="text-[10px]" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
