import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

function JobForm({ isOpen, onClose, initialData, onSave }) {
  // Bab 12: Form State Management
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "Jakarta",
    salary: "",
    salaryMin: 0,
    salaryMax: 0,
    type: "Full Time",
    status: "Aktif",
    experience: "Mid-Level",
    description: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        title: initialData.title || "",
        company: initialData.company || "",
        location: initialData.location || "Jakarta",
        salary: initialData.salary || "",
        salaryMin: initialData.salaryMin || 0,
        salaryMax: initialData.salaryMax || 0,
        type: initialData.type || "Full Time",
        status: initialData.status || "Aktif",
        experience: initialData.experience || "Mid-Level",
        postedDate: initialData.postedDate || "Baru saja",
        description: initialData.description || "",
      });
    } else {
      setFormData({
        title: "",
        company: "",
        location: "Jakarta",
        salary: "Rp8.000.000 - Rp12.000.000",
        salaryMin: 8000000,
        salaryMax: 12000000,
        type: "Full Time",
        status: "Aktif",
        experience: "Mid-Level",
        postedDate: "Baru saja",
        description: "",
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Nama pekerjaan wajib diisi";
    if (!formData.company.trim()) newErrors.company = "Nama perusahaan wajib diisi";
    if (!formData.salary.trim()) newErrors.salary = "Kisaran gaji wajib diisi";
    if (!formData.location.trim()) newErrors.location = "Lokasi wajib diisi";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    let computedMinSalary = formData.salaryMin;
    if (!computedMinSalary || computedMinSalary === 0) {
      const numbers = formData.salary.replace(/[^0-9]/g, "");
      computedMinSalary = numbers ? parseInt(numbers.slice(0, 8), 10) || 5000000 : 5000000;
    }

    const payload = {
      ...formData,
      salaryMin: Number(computedMinSalary) || Number(formData.salaryMin) || 5000000,
    };

    onSave(payload);
    onClose();
  };

  const isEditMode = Boolean(initialData && initialData.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isEditMode ? "Edit Lowongan Pekerjaan" : "Tambah Lowongan Baru"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditMode
                ? "Perbarui rincian lowongan kerja yang dipilih"
                : "Masukkan detail posisi baru yang ingin dipublikasikan"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Row 1: Title & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Pekerjaan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="misal: Frontend Developer"
                className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg focus:bg-white focus:outline-none focus:border-slate-400 ${
                  errors.title ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                }`}
              />
              {errors.title && <p className="text-[11px] text-rose-500 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Perusahaan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="misal: PT Maju Bersama"
                className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg focus:bg-white focus:outline-none focus:border-slate-400 ${
                  errors.company ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                }`}
              />
              {errors.company && <p className="text-[11px] text-rose-500 mt-1">{errors.company}</p>}
            </div>
          </div>

          {/* Row 2: Location & Salary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lokasi <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="misal: Jakarta / Remote"
                className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg focus:bg-white focus:outline-none focus:border-slate-400 ${
                  errors.location ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                }`}
              />
              {errors.location && <p className="text-[11px] text-rose-500 mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kisaran Gaji <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="misal: Rp8.000.000 - Rp12.000.000"
                className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg focus:bg-white focus:outline-none focus:border-slate-400 ${
                  errors.salary ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                }`}
              />
              {errors.salary && <p className="text-[11px] text-rose-500 mt-1">{errors.salary}</p>}
            </div>
          </div>

          {/* Row 3: Type, Status, Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tipe Kerja
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-slate-400"
              >
                <option value="Full Time">Full Time</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-slate-400"
              >
                <option value="Aktif">Aktif</option>
                <option value="Ditutup">Ditutup</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pengalaman
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-slate-400"
              >
                <option value="Junior">Junior</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Deskripsi Singkat
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Deskripsi singkat mengenai tanggung jawab atau kualifikasi..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-slate-400 resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              {isEditMode ? "Simpan Perubahan" : "Tambah Lowongan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobForm;
