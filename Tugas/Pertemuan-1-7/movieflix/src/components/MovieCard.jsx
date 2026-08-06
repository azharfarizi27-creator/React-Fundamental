import { useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaCalendarAlt,
  FaClock,
  FaStar,
  FaPlay,
} from "react-icons/fa";

function MovieCard({ movie }) {
  const [isFavorite, setIsFavorite] = useState(movie.favorite);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div
      className="
        bg-slate-900
        rounded-2xl
        overflow-hidden
        border
        border-slate-800
        hover:border-yellow-400
        hover:-translate-y-2
        hover:shadow-2xl
        transition-all
        duration-300
        group
      "
    >
      {/* Poster */}
      <div className="relative overflow-hidden">

        <img
          src={movie.image}
          alt={movie.title}
          className="
            w-full
            h-80
            object-cover
            group-hover:scale-110
            transition-transform
            duration-500
          "
        />

        {/* Overlay */}
        <div
          className="
            absolute
            inset-0
            bg-black/20
            group-hover:bg-black/40
            transition
          "
        ></div>

        {/* Favorite */}
        <button
          onClick={handleFavorite}
          className="
            absolute
            top-3
            right-3
            w-11
            h-11
            rounded-full
            bg-black/70
            backdrop-blur
            flex
            items-center
            justify-center
            text-white
            hover:bg-red-500
            transition
          "
        >
          {isFavorite ? (
            <FaHeart className="text-red-500 text-lg" />
          ) : (
            <FaRegHeart className="text-lg" />
          )}
        </button>

        {/* Rating */}
        <div
          className="
            absolute
            top-3
            left-3
            bg-yellow-400
            text-black
            px-3
            py-1
            rounded-full
            font-semibold
            flex
            items-center
            gap-2
            text-sm
          "
        >
          <FaStar />
          {movie.rating}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">

        <h2 className="text-white text-xl font-bold truncate">
          {movie.title}
        </h2>

        {/* Genre */}
        <span
          className="
            inline-block
            mt-3
            px-3
            py-1
            rounded-full
            bg-indigo-500/20
            text-indigo-300
            text-sm
          "
        >
          {movie.genre}
        </span>

        {/* Info */}
        <div className="mt-5 space-y-3 text-slate-300">

          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-yellow-400" />
            <span>{movie.year}</span>
          </div>

          <div className="flex items-center gap-3">
            <FaClock className="text-yellow-400" />
            <span>{movie.duration}</span>
          </div>

        </div>

        {/* Status */}
        <div className="mt-5">

          {movie.showing ? (
            <span
              className="
                inline-block
                bg-green-500/20
                text-green-400
                px-3
                py-1
                rounded-full
                text-sm
              "
            >
              🟢 Sedang Tayang
            </span>
          ) : (
            <span
              className="
                inline-block
                bg-red-500/20
                text-red-400
                px-3
                py-1
                rounded-full
                text-sm
              "
            >
              🔴 Tidak Tayang
            </span>
          )}

        </div>

        {/* Button */}
        <button
          onClick={handleFavorite}
          className="
            mt-6
            w-full
            bg-yellow-400
            hover:bg-yellow-300
            text-black
            py-3
            rounded-xl
            font-semibold
            transition
            flex
            justify-center
            items-center
            gap-2
          "
        >
          <FaPlay />

          {isFavorite
            ? "Hapus Favorit"
            : "Tambah Favorit"}
        </button>

      </div>
    </div>
  );
}

export default MovieCard;