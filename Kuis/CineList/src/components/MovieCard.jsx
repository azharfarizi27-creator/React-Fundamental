function MovieCard({ title, genre, year, rating, statusTayang }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6
                    hover:-translate-y-2 hover:border-red-500
                    transition duration-300 shadow-lg">

      {/* Header Card */}
      <div className="flex items-start justify-between gap-4">

        <h2 className="text-xl font-bold text-white">
          {title}
        </h2>

        <span className="bg-yellow-500/10 text-yellow-400
                         px-2 py-1 rounded-lg text-sm font-semibold
                         whitespace-nowrap">
           {rating}
        </span>

      </div>


      {/* Genre & Tahun */}
      <div className="flex items-center gap-3 mt-4">

        <span className="bg-red-500/10 text-red-400
                         px-3 py-1 rounded-full text-sm">
          {genre}
        </span>

        <span className="text-gray-400 text-sm">
           {year}
        </span>

      </div>


      {/* Divider */}
      <div className="border-t border-gray-700 my-5"></div>


      {/* Status */}
      <div className="flex items-center justify-between">

        <span className="text-gray-400 text-sm">
          Status Tayang
        </span>

        {statusTayang ? (
          <span className="bg-green-500/10 text-green-400
                           px-3 py-1 rounded-full text-sm font-medium">
             Sedang Tayang
          </span>
        ) : (
          <span className="bg-red-500/10 text-red-400
                           px-3 py-1 rounded-full text-sm font-medium">
             Tidak Tayang
          </span>
        )}

      </div>

    </div>
  )
}

export default MovieCard;