function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-10 text-center">
        <div className="text-5xl mb-4">
          📚
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold">
          LibraryHub
        </h1>

        <p className="mt-3 text-blue-100 text-lg">
          Temukan buku favoritmu dan perluas wawasanmu
        </p>

        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
            📖 Koleksi Buku
          </span>

          <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
            🚀 Belajar
          </span>

          <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
            💡 Inspirasi
          </span>
        </div>
      </div>
    </header>
  )
}

export default Header