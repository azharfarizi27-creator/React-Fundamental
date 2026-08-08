import ProductCard from "./ProductCard";

function Wishlist({
  products,
  onToggleFavorite,
  onDetail,
}) {
  const favoriteProducts = products.filter(
    (product) => product.favorite
  );

  return (
    <section>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Wishlist
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Produk yang Anda simpan
        </p>
      </div>

      {/* Empty */}
      {favoriteProducts.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-400">
            ♥
          </div>

          <h2 className="mt-4 font-semibold text-slate-800">
            Wishlist masih kosong
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Klik ikon hati pada produk untuk menambahkannya.
          </p>

        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {favoriteProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onToggleFavorite={onToggleFavorite}
              onDetail={onDetail}
            />
          ))}

        </div>
      )}

    </section>
  );
}

export default Wishlist;