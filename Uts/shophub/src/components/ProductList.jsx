import ProductCard from "./ProductCard";

function ProductList({
  products,
  onToggleFavorite,
  onDetail,
  onAddToCart,
}) {
  // =========================
  // EMPTY STATE
  // =========================

  if (products.length === 0) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-dashed
          border-slate-300
          bg-white
          py-16
          text-center

          dark:border-slate-700
          dark:bg-slate-900
        "
      >
        <div className="mx-auto max-w-sm px-6">

          <div
            className="
              mx-auto
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-slate-100
              text-slate-400

              dark:bg-slate-800
              dark:text-slate-500
            "
          >
            🔍
          </div>

          <p className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-200">
            Produk tidak ditemukan
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-400 dark:text-slate-500">
            Coba gunakan kata pencarian atau kategori lain.
          </p>

        </div>
      </div>
    );
  }


  // =========================
  // PRODUCT LIST
  // =========================

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-5
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      "
    >

      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onToggleFavorite={onToggleFavorite}
          onDetail={onDetail}
          onAddToCart={onAddToCart}
        />
      ))}

    </div>
  );
}

export default ProductList;