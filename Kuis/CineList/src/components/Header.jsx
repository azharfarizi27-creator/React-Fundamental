function Header() {
  return (
    <header className="bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        
        <h1 className="text-2xl font-bold">
           Cine<span className="text-red-500">List</span>
        </h1>

        <span className="text-sm text-gray-400">
          Movie Collection
        </span>

      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-red-500 font-semibold uppercase tracking-widest text-sm">
          Welcome to CineList
        </p>

        <h2 className="text-4xl md:text-5xl font-bold mt-3">
          Temukan Film Favoritmu 
        </h2>

        <p className="text-gray-400 mt-4 max-w-xl">
          Jelajahi berbagai film pilihan lengkap dengan genre,
          rating, tahun rilis, dan status tayangnya.
        </p>
      </div>
    </header>
  )
}

export default Header