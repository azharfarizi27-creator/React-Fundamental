import { useState, useMemo } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";
import JobList from "./components/JobList";
import JobForm from "./components/JobForm";
import Footer from "./components/Footer";
import initialJobs from "./data/jobs";
import { FaCheckCircle, FaInfoCircle } from "react-icons/fa";

const ITEMS_PER_PAGE = 5;

function App() {
  // Bab 12: State Data Lowongan (Array of Objects)
  const [jobs, setJobs] = useState(initialJobs);

  // Bab 9: State Pencarian & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [typeFilter, setTypeFilter] = useState("Semua");

  // Bab 10: State Pengurutan (Sorting)
  const [sortBy, setSortBy] = useState("default");

  // Bab 11: State Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Bab 12: State Modal & Form Editing
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // State Notifikasi Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Mendapatkan daftar lokasi & tipe unik untuk dropdown filter
  const locations = useMemo(() => {
    return Array.from(new Set(jobs.map((j) => j.location))).filter(Boolean);
  }, [jobs]);

  const jobTypes = useMemo(() => {
    return Array.from(new Set(jobs.map((j) => j.type))).filter(Boolean);
  }, [jobs]);

  // Handler Search, Filter, Sort dengan Reset Halaman ke 1
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleLocationChange = (value) => {
    setLocationFilter(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleTypeChange = (value) => {
    setTypeFilter(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setLocationFilter("Semua");
    setStatusFilter("Semua");
    setTypeFilter("Semua");
    setSortBy("default");
    setCurrentPage(1);
    showToast("Filter pencarian telah direset", "info");
  };

  // Bab 9: Filter Logic menggunakan .filter()
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // 1. Pencarian berdasarkan nama pekerjaan atau perusahaan
      const matchSearch =
        searchTerm.trim() === "" ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase().trim());

      // 2. Filter Lokasi
      const matchLocation =
        locationFilter === "Semua" ||
        job.location.toLowerCase() === locationFilter.toLowerCase();

      // 3. Filter Status Lowongan (Aktif / Ditutup)
      const matchStatus =
        statusFilter === "Semua" ||
        job.status.toLowerCase() === statusFilter.toLowerCase();

      // 4. Filter Tipe Pekerjaan (Full Time / Remote / dll)
      const matchType =
        typeFilter === "Semua" ||
        job.type.toLowerCase() === typeFilter.toLowerCase();

      return matchSearch && matchLocation && matchStatus && matchType;
    });
  }, [jobs, searchTerm, locationFilter, statusFilter, typeFilter]);

  // Bab 10: Sorting Logic menggunakan .sort()
  const sortedJobs = useMemo(() => {
    const list = [...filteredJobs];

    return list.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        case "salary-asc":
          return (a.salaryMin || 0) - (b.salaryMin || 0);
        case "salary-desc":
          return (b.salaryMin || 0) - (a.salaryMin || 0);
        case "default":
        default:
          return b.id - a.id;
      }
    });
  }, [filteredJobs, sortBy]);

  // Bab 11: Pagination Logic menggunakan Math.ceil() & Slice
  const totalFilteredJobs = sortedJobs.length;
  const totalPages = Math.ceil(totalFilteredJobs / ITEMS_PER_PAGE) || 1;

  // Pastikan currentPage selalu valid dalam batas totalPages
  const activePage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginatedJobs = useMemo(() => {
    const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
    return sortedJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedJobs, activePage]);

  // Bab 12: Editing & Menambah Lowongan Baru dengan State & .map()
  const handleOpenEdit = (job) => {
    setEditingJob(job);
    setIsFormOpen(true);
  };

  const handleOpenAddNew = () => {
    setEditingJob(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingJob(null);
  };

  const handleSaveJob = (jobData) => {
    if (jobData.id) {
      // Bab 12: Mengubah data secara immutable menggunakan .map()
      setJobs((prevJobs) =>
        prevJobs.map((item) => (item.id === jobData.id ? { ...item, ...jobData } : item))
      );
      showToast(`Lowongan "${jobData.title}" berhasil diperbarui`, "success");
    } else {
      // Tambah lowongan baru
      const nextId = jobs.length > 0 ? Math.max(...jobs.map((j) => j.id)) + 1 : 1;
      const newJobItem = {
        ...jobData,
        id: nextId,
        postedDate: "Baru saja",
      };
      setJobs((prevJobs) => [newJobItem, ...prevJobs]);
      showToast(`Lowongan "${jobData.title}" berhasil ditambahkan`, "success");
    }
  };

  const handleApplyJob = (job) => {
    showToast(`Lamaran untuk ${job.title} di ${job.company} terkirim`, "success");
  };

  const scrollToJobs = () => {
    const section = document.getElementById("jobs");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-slate-200">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-slate-900 text-white rounded-lg shadow-lg border border-slate-700 text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
          {toast.type === "success" ? (
            <FaCheckCircle className="text-emerald-400 shrink-0" />
          ) : (
            <FaInfoCircle className="text-slate-300 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* 1. Header Komponen */}
      <Header
        onAddNewJob={handleOpenAddNew}
        totalJobsCount={jobs.length}
      />

      {/* 2. Hero Komponen */}
      <Hero
        totalJobs={jobs.length}
        onExploreClick={scrollToJobs}
      />

      {/* 3. SearchBar Komponen (Search, Filter, Sort) */}
      <div id="jobs">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          locationFilter={locationFilter}
          onLocationChange={handleLocationChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          typeFilter={typeFilter}
          onTypeChange={handleTypeChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          onResetFilters={handleResetFilters}
          locations={locations}
          jobTypes={jobTypes}
        />
      </div>

      {/* 4. JobList & Pagination Komponen */}
      <main className="flex-1">
        <JobList
          jobs={paginatedJobs}
          totalFilteredJobs={totalFilteredJobs}
          currentPage={activePage}
          totalPages={totalPages}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={(newPage) => setCurrentPage(newPage)}
          onEditJob={handleOpenEdit}
          onResetFilters={handleResetFilters}
          onApplyJob={handleApplyJob}
        />
      </main>

      {/* 5. JobForm Modal Komponen (Editing / Adding) */}
      <JobForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        initialData={editingJob}
        onSave={handleSaveJob}
      />

      {/* 6. Footer Komponen */}
      <Footer />
    </div>
  );
}

export default App;