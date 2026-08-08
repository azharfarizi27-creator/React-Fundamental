import {
  FaHeart,
  FaStar,
  FaTimes,
  FaCheck,
  FaShoppingCart,
} from "react-icons/fa";

function ProductDetail({
  product,
  onClose,
  onToggleFavorite,
  onAddToCart,
}) {
  if (!product) return null;

  // =========================
  // FORMAT PRICE
  // =========================

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };


  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart = () => {
    if (product.stock === 0) return;

    onAddToCart?.(product);
  };


  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-slate-950/60
        p-4
        backdrop-blur-sm
      "
      onClick={onClose}
    >

      {/* ================================= */}
      {/* MODAL */}
      {/* ================================= */}

      <div
        className="
          relative
          max-h-[90vh]
          w-full
          max-w-4xl
          overflow-y-auto
          rounded-3xl
          border
          border-slate-200
          bg-white
          shadow-2xl

          dark:border-slate-800
          dark:bg-slate-900
        "
        onClick={(e) => e.stopPropagation()}
      >

        {/* ================================= */}
        {/* CLOSE BUTTON */}
        {/* ================================= */}

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="
            absolute
            right-5
            top-5
            z-10
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-white
            text-slate-500
            shadow-md
            transition

            hover:bg-slate-100
            hover:text-slate-900

            dark:bg-slate-800
            dark:text-slate-400
            dark:hover:bg-slate-700
            dark:hover:text-white
          "
        >
          <FaTimes />
        </button>


        <div className="grid md:grid-cols-2">


          {/* ================================= */}
          {/* IMAGE */}
          {/* ================================= */}

          <div
            className="
              flex
              items-center
              justify-center
              bg-slate-50
              p-6

              dark:bg-slate-950

              md:p-10
            "
          >

            <div
              className="
                overflow-hidden
                rounded-2xl
                bg-white
                shadow-sm

                dark:bg-slate-900
              "
            >

              <img
                src={product.image}
                alt={product.name}
                className="
                  h-[300px]
                  w-full
                  object-cover
                  sm:h-[400px]
                  md:h-[450px]
                "
              />

            </div>

          </div>


          {/* ================================= */}
          {/* DETAIL */}
          {/* ================================= */}

          <div className="p-7 md:p-10">


            {/* ================================= */}
            {/* STATUS */}
            {/* ================================= */}

            <span
              className={`
                inline-flex
                rounded-lg
                px-3
                py-1.5
                text-xs
                font-semibold

                ${
                  product.stock > 0
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                }
              `}
            >
              {product.stock > 0
                ? "Tersedia"
                : "Stok Habis"}
            </span>


            {/* ================================= */}
            {/* CATEGORY */}
            {/* ================================= */}

            <p className="mt-5 text-sm font-medium text-slate-400 dark:text-slate-500">
              {product.category}
            </p>


            {/* ================================= */}
            {/* NAME */}
            {/* ================================= */}

            <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {product.name}
            </h2>


            {/* ================================= */}
            {/* RATING */}
            {/* ================================= */}

            <div className="mt-4 flex items-center gap-2">

              <div className="flex items-center gap-1">

                <FaStar className="text-yellow-400" />

                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {product.rating}
                </span>

              </div>

              <span className="text-sm text-slate-400 dark:text-slate-500">
                ({product.reviews} ulasan)
              </span>

            </div>


            {/* ================================= */}
            {/* PRICE */}
            {/* ================================= */}

            <p className="mt-6 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {formatPrice(product.price)}
            </p>


            {/* ================================= */}
            {/* STOCK */}
            {/* ================================= */}

            <div className="mt-4">

              {product.stock > 0 ? (

                <p className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">

                  <FaCheck />

                  Stok tersedia: {product.stock}

                </p>

              ) : (

                <p className="flex items-center gap-2 text-sm font-semibold text-red-500 dark:text-red-400">

                  <FaTimes />

                  Stok sedang habis

                </p>

              )}

            </div>


            {/* ================================= */}
            {/* DESCRIPTION */}
            {/* ================================= */}

            <div className="mt-7">

              <h3 className="font-semibold text-slate-900 dark:text-white">
                Deskripsi
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {product.description}
              </p>

            </div>


            {/* ================================= */}
            {/* FEATURES */}
            {/* ================================= */}

            <div className="mt-6">

              <h3 className="font-semibold text-slate-900 dark:text-white">
                Informasi Produk
              </h3>

              <ul className="mt-3 space-y-2">

                <li className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">

                  <FaCheck className="text-emerald-500" />

                  Produk berkualitas

                </li>


                <li className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">

                  <FaCheck className="text-emerald-500" />

                  Rating produk terpercaya

                </li>


                <li className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">

                  <FaCheck className="text-emerald-500" />

                  Informasi stok tersedia

                </li>

              </ul>

            </div>


            {/* ================================= */}
            {/* BUTTONS */}
            {/* ================================= */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">


              {/* ================================= */}
              {/* WISHLIST */}
              {/* ================================= */}

              <button
                type="button"
                onClick={() =>
                  onToggleFavorite(product.id)
                }
                className={`
                  flex
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  transition

                  ${
                    product.favorite
                      ? `
                        border-red-200
                        bg-red-50
                        text-red-500
                        hover:bg-red-100

                        dark:border-red-500/20
                        dark:bg-red-500/10
                        dark:text-red-400
                        dark:hover:bg-red-500/20
                      `
                      : `
                        border-slate-200
                        text-slate-600
                        hover:bg-slate-50

                        dark:border-slate-700
                        dark:text-slate-300
                        dark:hover:bg-slate-800
                      `
                  }
                `}
              >

                <FaHeart />

                {product.favorite
                  ? "Sudah di Wishlist"
                  : "Tambah Wishlist"}

              </button>


              {/* ================================= */}
              {/* ADD CART */}
              {/* ================================= */}

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`
                  flex
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  transition

                  ${
                    product.stock === 0
                      ? `
                        cursor-not-allowed
                        bg-slate-200
                        text-slate-400

                        dark:bg-slate-800
                        dark:text-slate-600
                      `
                      : `
                        bg-indigo-600
                        text-white
                        hover:bg-indigo-700
                        active:scale-[0.98]

                        dark:bg-indigo-600
                        dark:hover:bg-indigo-500
                      `
                  }
                `}
              >

                <FaShoppingCart />

                {product.stock === 0
                  ? "Stok Habis"
                  : "Tambah ke Keranjang"}

              </button>

            </div>


            {/* ================================= */}
            {/* EXTRA INFO */}
            {/* ================================= */}

            {product.stock > 0 && (

              <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
                Produk akan ditambahkan ke keranjang
                dengan jumlah 1.
              </p>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProductDetail;