import JobCard from "./JobCard";
import Pagination from "./Pagination";
import { FaSearch, FaRedo } from "react-icons/fa";

function JobList({
  jobs = [],
  totalFilteredJobs = 0,
  currentPage = 1,
  totalPages = 1,
  itemsPerPage = 5,
  onPageChange,
  onEditJob,
  onResetFilters,
  onApplyJob,
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Daftar Lowongan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ditemukan <span className="font-semibold text-slate-800">{totalFilteredJobs}</span> posisi sesuai kriteria
          </p>
        </div>
      </div>

      {/* Conditional Rendering: Bab 9 - Jika data tidak ditemukan */}
      {jobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-8">
          <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-3 text-lg">
            <FaSearch />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Tidak ada lowongan ditemukan
          </h3>
          <p className="text-xs text-slate-500 mb-5 max-w-sm mx-auto leading-relaxed">
            Tidak ada posisi yang cocok dengan kata kunci atau filter saat ini. Coba gunakan kata kunci lain atau reset filter.
          </p>
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <FaRedo className="text-[10px]" />
            <span>Reset Semua Filter</span>
          </button>
        </div>
      ) : (
        <>
          {/* Grid Lowongan */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={onEditJob}
                onApply={onApplyJob}
              />
            ))}
          </div>

          {/* Pagination (Bab 11) */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalFilteredJobs}
            itemsPerPage={itemsPerPage}
            onPageChange={onPageChange}
          />
        </>
      )}
    </section>
  );
}

export default JobList;