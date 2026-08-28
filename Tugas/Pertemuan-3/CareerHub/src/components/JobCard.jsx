import { FaMapMarkerAlt, FaMoneyBillWave, FaEdit, FaClock } from "react-icons/fa";

function JobCard({ job, onEdit, onApply }) {
  const isAvailable = job.status === "Aktif" || job.status === "Tersedia";

  // Generate 2-letter monogram for company logo
  const getCompanyInitials = (name) => {
    if (!name) return "CH";
    const parts = name.replace(/^(PT\s+|CV\s+)/i, "").trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top Header: Company Avatar + Status Dot */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center tracking-wider shrink-0">
              {getCompanyInitials(job.company)}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 line-clamp-1">{job.company}</p>
              <h3 className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1">
                {job.title}
              </h3>
            </div>
          </div>

          {/* Status Indicator */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${
              isAvailable
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                : "bg-slate-100 text-slate-500 border border-slate-200"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isAvailable ? "bg-emerald-500" : "bg-slate-400"
              }`}
            />
            {job.status || "Aktif"}
          </span>
        </div>

        {/* Key Metadata: Location & Salary */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600 mb-3.5">
          <span className="inline-flex items-center gap-1">
            <FaMapMarkerAlt className="text-slate-400 text-[11px]" />
            {job.location}
          </span>
          <span className="text-slate-300">•</span>
          <span className="inline-flex items-center gap-1 font-semibold text-slate-900">
            <FaMoneyBillWave className="text-slate-400 text-[11px]" />
            {job.salary}
          </span>
        </div>

        {/* Short Description */}
        {job.description && (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {job.description}
          </p>
        )}

        {/* Tag Pills */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          <span className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-700 rounded-md">
            {job.type}
          </span>
          {job.experience && (
            <span className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-600 rounded-md">
              {job.experience}
            </span>
          )}
        </div>
      </div>

      {/* Footer: Date & Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <FaClock className="text-[10px]" />
          {job.postedDate || "Baru saja"}
        </span>

        <div className="flex items-center gap-1.5">
          {/* Edit Button (Bab 12) */}
          <button
            onClick={() => onEdit(job)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Edit data lowongan"
          >
            <FaEdit className="text-[11px] text-slate-500" />
            <span>Edit</span>
          </button>

          {/* Lamar Button */}
          <button
            onClick={() => onApply && onApply(job)}
            disabled={!isAvailable}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              isAvailable
                ? "bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isAvailable ? "Lamar" : "Tutup"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobCard;