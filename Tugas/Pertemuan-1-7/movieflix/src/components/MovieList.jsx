import MovieCard from "./MovieCard";

function MovieList({ movies }) {
  return (
    <section className="max-w-7xl mx-auto px-6 mt-12">

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-5 mb-8">

        <div>
          <h2 className="text-4xl font-bold text-white">
            Semua Film
          </h2>

          <p className="text-slate-400 mt-2">
            Temukan film favoritmu.
          </p>
        </div>

        <select
          className="
            bg-slate-900
            border
            border-slate-700
            rounded-xl
            px-4
            py-3
            text-white
            outline-none
            focus:border-yellow-400
          "
        >
          <option>Terbaru</option>
          <option>Rating Tertinggi</option>
          <option>Terlama</option>
        </select>

      </div>

      {/* Genre */}
      <div className="flex flex-wrap gap-3 mb-8">

        <button className="bg-yellow-400 text-slate-900 px-5 py-2 rounded-full font-medium">
          Semua
        </button>

        <button className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-full transition">
          Action
        </button>

        <button className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-full transition">
          Adventure
        </button>

        <button className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-full transition">
          Sci-Fi
        </button>

        <button className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-full transition">
          Horror
        </button>

        <button className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-full transition">
          Comedy
        </button>

      </div>

      {/* Grid Film */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          gap-8
        "
      >
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
          />
        ))}
      </div>

    </section>
  );
}

export default MovieList;