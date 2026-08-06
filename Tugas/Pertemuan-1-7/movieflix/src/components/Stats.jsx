import { FaFilm, FaPlayCircle, FaHeart } from "react-icons/fa";

function Stats({
  totalMovies,
  totalShowing,
  totalFavorite,
}) {
  const stats = [
    {
      title: "Total Film",
      value: totalMovies,
      icon: <FaFilm className="text-3xl text-yellow-400" />,
    },
    {
      title: "Sedang Tayang",
      value: totalShowing,
      icon: <FaPlayCircle className="text-3xl text-green-400" />,
    },
    {
      title: "Favorite",
      value: totalFavorite,
      icon: <FaHeart className="text-3xl text-red-400" />,
    },
  ];

  return (
    <section className="mb-12">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {stats.map((item, index) => (
          <div
            key={index}
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-2xl
              p-6
              flex
              items-center
              gap-5
              hover:border-yellow-400
              hover:-translate-y-1
              hover:shadow-xl
              transition-all
            "
          >
            <div
              className="
                w-16
                h-16
                rounded-xl
                bg-slate-800
                flex
                items-center
                justify-center
              "
            >
              {item.icon}
            </div>

            <div>
              <h3 className="text-slate-400 text-sm">
                {item.title}
              </h3>

              <p className="text-3xl font-bold text-white mt-1">
                {item.value}
              </p>
            </div>
          </div>
        ))}

      </div>

    </section>
  );
}

export default Stats;