import {
  FaHeart,
  FaStar,
  FaEye,
  FaShoppingCart,
} from "react-icons/fa";

function ProductCard({
  product,
  onToggleFavorite,
  onDetail,
  onAddToCart,
}) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Ready Stock":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";

      case "Produk Baru":
        return "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400";

      case "Best Seller":
        return "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";

      case "Diskon":
        return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";

      case "Stok Terbatas":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400";

      case "Stok Habis":
        return "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400";

      default:
        return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  const getStockStyle = () => {
    if (product.stock === 0) {
      return "text-red-500 dark:text-red-400";
    }

    if (product.stock <= 5) {
      return "text-orange-500 dark:text-orange-400";
    }

    return "text-emerald-600 dark:text-emerald-400";
  };

  return (
    <div
      className="
        group
        overflow-hidden
        rounded-2xl
        border border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg

        dark:border-slate-800
        dark:bg-slate-900
        dark:shadow-none
        dark:hover:border-slate-700
        dark:hover:shadow-xl
        dark:hover:shadow-black/20
      "
    >

      {/* ================================= */}
      {/* IMAGE */}
      {/* ================================= */}

      <div
        className="
          relative
          m-3
          overflow-hidden
          rounded-xl
          bg-slate-100

          dark:bg-slate-800
        "
      >

        <img
          src={product.image}
          alt={product.name}
          className="
            h-52
            w-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-[1.03]
          "
        />

        {/* IMAGE OVERLAY */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-black/10
            to-transparent
            opacity-0
            transition
            duration-300
            group-hover:opacity-100
          "
        />


        {/* ================================= */}
        {/* STATUS */}
        {/* ================================= */}

        <span
          className={`
            absolute
            left-3
            top-3
            rounded-lg
            px-2.5
            py-1
            text-[11px]
            font-semibold
            shadow-sm
            ${getStatusStyle(product.status)}
          `}
        >
          {product.status}
        </span>


        {/* ================================= */}
        {/* WISHLIST */}
        {/* ================================= */}

        <button
          type="button"
          onClick={() =>
            onToggleFavorite(product.id)
          }
          title={
            product.favorite
              ? "Hapus dari wishlist"
              : "Tambah ke wishlist"
          }
          className={`
            absolute
            right-3
            top-3
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-white
            shadow-md
            transition-all
            duration-200
            hover:scale-110

            dark:bg-slate-900
            dark:shadow-black/30

            ${
              product.favorite
                ? "text-red-500"
                : "text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400"
            }
          `}
        >
          <FaHeart />
        </button>

      </div>


      {/* ================================= */}
      {/* CONTENT */}
      {/* ================================= */}

      <div className="p-4 pt-1">

        {/* CATEGORY */}

        <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
          {product.category}
        </p>


        {/* NAME */}

        <h3 className="mt-1 truncate font-semibold text-slate-900 dark:text-white">
          {product.name}
        </h3>


        {/* ================================= */}
        {/* RATING */}
        {/* ================================= */}

        <div className="mt-2 flex items-center gap-1 text-sm">

          <FaStar className="text-yellow-400" />

          <span className="font-medium text-slate-700 dark:text-slate-300">
            {product.rating}
          </span>

          <span className="text-xs text-slate-400 dark:text-slate-500">
            ({product.reviews})
          </span>

        </div>


        {/* ================================= */}
        {/* PRICE */}
        {/* ================================= */}

        <div className="mt-3">

          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            {formatPrice(product.price)}
          </span>

        </div>


        {/* ================================= */}
        {/* STOCK */}
        {/* ================================= */}

        <div className="mt-2">

          <span
            className={`text-xs font-medium ${getStockStyle()}`}
          >
            {product.stock === 0
              ? "Stok habis"
              : product.stock <= 5
              ? `Stok terbatas: ${product.stock}`
              : `Stok: ${product.stock}`}
          </span>

        </div>


        {/* ================================= */}
        {/* ACTION */}
        {/* ================================= */}

        <div className="mt-4 flex gap-2">

          {/* DETAIL */}

          <button
            type="button"
            onClick={() => onDetail(product)}
            title="Lihat detail"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              text-slate-500
              transition

              hover:border-indigo-200
              hover:bg-indigo-50
              hover:text-indigo-600

              dark:border-slate-700
              dark:text-slate-400
              dark:hover:border-indigo-500/30
              dark:hover:bg-indigo-500/10
              dark:hover:text-indigo-400
            "
          >
            <FaEye className="text-sm" />
          </button>


          {/* ADD TO CART */}

          <button
            type="button"
            disabled={product.stock === 0}
            onClick={() => onAddToCart?.(product)}
            className={`
              flex
              h-10
              flex-1
              items-center
              justify-center
              gap-2
              rounded-xl
              px-4
              text-xs
              font-semibold
              transition

              ${
                product.stock === 0
                  ? `
                    cursor-not-allowed
                    bg-slate-100
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

            <FaShoppingCart className="text-xs" />

            {product.stock === 0
              ? "Stok Habis"
              : "Tambah ke Cart"}

          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;

