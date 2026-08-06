import { useState } from "react";

import movies from "./data/movies";

import Header from "./components/Header";
import Stats from "./components/Stats";
import SearchBar from "./components/SearchBar";
import MovieList from "./components/MovieList";
import Footer from "./components/Footer";

function App() {
  const [search, setSearch] = useState("");

  // Search Film
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  // Statistik Film
  const totalMovies = movies.length;

  const totalShowing = movies.filter(
    (movie) => movie.showing
  ).length;

  const totalFavorite = movies.filter(
    (movie) => movie.favorite
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <Header />

      {/* Hero Banner */}
      <section className="relative h-[550px] overflow-hidden">

        <img
          src="https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vREc0547VKqEv.jpg"
          alt="Dune Part Two"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent"></div>

        <div className="absolute inset-0 flex items-center">

          <div className="max-w-7xl mx-auto px-6">

            <span className="inline-block bg-yellow-400 text-black font-semibold px-4 py-2 rounded-full">
              ⭐ Featured Movie
            </span>

            <h1 className="text-5xl md:text-6xl font-extrabold mt-6">
              Dune: Part Two
            </h1>

            <p className="text-slate-300 text-lg mt-6 max-w-2xl leading-8">
              Paul Atreides bersatu dengan Chani dan kaum Fremen
              untuk membalas dendam kepada mereka yang telah
              menghancurkan keluarganya.
            </p>

            <div className="flex gap-4 mt-8">

              <button className="bg-yellow-400 text-black font-semibold px-8 py-3 rounded-xl hover:bg-yellow-300 transition">
                ▶ Watch Now
              </button>

              <button className="border border-white px-8 py-3 rounded-xl hover:bg-white hover:text-black transition">
                Detail
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-14">

        {/* Judul */}
        <div className="mb-10">

          <h2 className="text-3xl font-bold">
            🎬 Movie Collection
          </h2>

          <p className="text-slate-400 mt-2">
            Temukan film favoritmu dan tambahkan ke daftar favorite.
          </p>

        </div>

        {/* Statistik */}
        <Stats
          totalMovies={totalMovies}
          totalShowing={totalShowing}
          totalFavorite={totalFavorite}
        />

        {/* Search */}
        <SearchBar
          search={search}
          setSearch={setSearch}
        />

        {/* Movie List */}
        {filteredMovies.length > 0 ? (
          <MovieList movies={filteredMovies} />
        ) : (
          <div className="text-center py-24">

            <h2 className="text-5xl">
              😢
            </h2>

            <p className="text-slate-400 text-lg mt-4">
              Film tidak ditemukan.
            </p>

          </div>
        )}

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default App;