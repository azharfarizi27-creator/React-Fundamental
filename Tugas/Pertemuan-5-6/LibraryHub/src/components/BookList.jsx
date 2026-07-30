import BookCard from "./BookCard"

function BookList() {
  const books = [
    {
      id: 1,
      title: "Laskar Pelangi",
      author: "Andrea Hirata",
      category: "Novel",
      year: 2005,
      status: "Tersedia",
    },
    {
      id: 2,
      title: "Bumi",
      author: "Tere Liye",
      category: "Fantasi",
      year: 2014,
      status: "Dipinjam",
    },
    {
      id: 3,
      title: "Negeri 5 Menara",
      author: "Ahmad Fuadi",
      category: "Novel",
      year: 2009,
      status: "Tersedia",
    },
    {
      id: 4,
      title: "Atomic Habits",
      author: "James Clear",
      category: "Self Improvement",
      year: 2018,
      status: "Dipinjam",
    },
    {
      id: 5,
      title: "The Psychology of Money",
      author: "Morgan Housel",
      category: "Keuangan",
      year: 2020,
      status: "Tersedia",
    },
    {
      id: 6,
      title: "Filosofi Teras",
      author: "Henry Manampiring",
      category: "Pengembangan Diri",
      year: 2018,
      status: "Tersedia",
    },
    {
      id: 7,
      title: "Pulang",
      author: "Tere Liye",
      category: "Novel",
      year: 2015,
      status: "Dipinjam",
    },
    {
      id: 8,
      title: "Clean Code",
      author: "Robert C. Martin",
      category: "Programming",
      year: 2008,
      status: "Tersedia",
    },
  ]

  return (
    <section className="px-6 py-12">
      <div className="text-center mb-10">
        <p className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
          Our Collection
        </p>

        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2">
          Koleksi Buku
        </h2>

        <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
          Jelajahi berbagai koleksi buku pilihan yang tersedia
          di LibraryHub.
        </p>
      </div>

      <div className="flex flex-wrap gap-6 justify-center">
        {books.map((book) => (
          <div
            key={book.id}
            className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
          >
            <BookCard
              title={book.title}
              author={book.author}
              category={book.category}
              year={book.year}
              status={book.status}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default BookList