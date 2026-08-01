import MovieCard from "./MovieCard"

function MovieList() {

    const movies = [
        {
            title: "Avengers: Endgame",
            genre: "Action",
            year: 2019,
            rating: 8.4,
            statusTayang: true
        },
        {
            title: "Interstellar",
            genre: "Sci-Fi",
            year: 2014,
            rating: 8.7,
            statusTayang: false
        },
        {
            title: "The Batman",
            genre: "Action",
            year: 2022,
            rating: 7.8,
            statusTayang: true
        },
        {
            title: "Inception",
            genre: "Sci-Fi",
            year: 2010,
            rating: 8.8,
            statusTayang: false
        },
        {
            title: "Spider-Man: No Way Home",
            genre: "Action",
            year: 2021,
            rating: 8.2,
            statusTayang: true
        },
        {
            title: "Joker",
            genre: "Drama",
            year: 2019,
            rating: 8.3,
            statusTayang: false
        }
    ]

    return (
        <main className="bg-gray-900 min-h-screen px-6 py-12">

            <div className="max-w-6xl mx-auto">

                <div className="mb-8">
                    <p className="text-red-500 font-semibold uppercase tracking-widest text-sm">
                        Our Collection
                    </p>

                    <h2 className="text-3xl font-bold text-white mt-2">
                        Daftar Film
                    </h2>

                    <p className="text-gray-400 mt-2">
                        Pilihan film yang tersedia di CineList.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {movies.map((movie, index) => (
                        <MovieCard
                            key={index}
                            title={movie.title}
                            genre={movie.genre}
                            year={movie.year}
                            rating={movie.rating}
                            statusTayang={movie.statusTayang}
                        />
                    ))}

                </div>

            </div>

        </main>
    )
}

export default MovieList