function BookCard({ title, author, category, year, status }) {
  const isAvailable = status === "Tersedia"

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2">
      
      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white">
        <div className="text-4xl mb-3">
          📚
        </div>

        <h2 className="text-xl font-bold leading-tight">
          {title}
        </h2>

        <p className="text-blue-100 mt-1">
          {author}
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            {category}
          </span>

          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
            📅 {year}
          </span>
        </div>

        {/* Status */}
        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-500 mb-2">
            Status Buku
          </p>

          {isAvailable ? (
            <span className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
              🟢 Tersedia
            </span>
          ) : (
            <span className="inline-flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
              🔴 Dipinjam
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookCard