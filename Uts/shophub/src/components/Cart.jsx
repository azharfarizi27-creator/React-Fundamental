import {
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaTrash,
  FaArrowLeft,
} from "react-icons/fa";

function Cart({
  cart,
  onIncrease,
  onDecrease,
  onRemove,
  onClear,
  onBack,
}) {
  // ==========================================
  // TOTAL ITEM
  // ==========================================

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // ==========================================
  // TOTAL PRICE
  // ==========================================

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // ==========================================
  // FORMAT PRICE
  // ==========================================

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (cart.length === 0) {
    return (
      <section>
        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Keranjang
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Produk yang ingin Anda beli
          </p>
        </div>

        {/* EMPTY STATE */}

        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-3xl text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            <FaShoppingCart />
          </div>

          <h2 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
            Keranjang masih kosong
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
            Belum ada produk yang ditambahkan ke keranjang.
            Yuk pilih produk yang ingin kamu beli.
          </p>

          <button
            onClick={onBack}
            className="mt-6 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <FaArrowLeft />
            Lihat Produk
          </button>
        </div>
      </section>
    );
  }

  return (
    <section>
      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Keranjang
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {totalItems} item dalam keranjang
          </p>
        </div>

        {/* CLEAR CART */}

        <button
          onClick={onClear}
          className="flex items-center gap-2 self-start rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30 sm:self-auto"
        >
          <FaTrash />
          Kosongkan
        </button>
      </div>

      {/* ========================================= */}
      {/* CONTENT */}
      {/* ========================================= */}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ========================================= */}
        {/* CART ITEMS */}
        {/* ========================================= */}

        <div className="space-y-4 lg:col-span-2">
          {cart.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <div className="flex gap-4">
                {/* PRODUCT IMAGE */}

                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* PRODUCT INFO */}

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                        {item.category}
                      </p>

                      <h3 className="mt-1 truncate text-base font-bold text-slate-900 dark:text-white">
                        {item.name}
                      </h3>
                    </div>

                    {/* DELETE */}

                    <button
                      onClick={() => onRemove(item.id)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                      title="Hapus"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  {/* PRICE */}

                  <p className="mt-2 font-semibold text-slate-900 dark:text-slate-200">
                    {formatPrice(item.price)}
                  </p>

                  {/* QUANTITY */}

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => onDecrease(item.id)}
                        className="flex h-9 w-9 items-center justify-center text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                      >
                        <FaMinus className="text-xs" />
                      </button>

                      <span className="flex h-9 min-w-10 items-center justify-center border-x border-slate-200 px-3 text-sm font-semibold text-slate-800 dark:border-slate-700 dark:text-slate-200">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => onIncrease(item.id)}
                        disabled={item.quantity >= item.stock}
                        className="flex h-9 w-9 items-center justify-center text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>

                    {/* SUBTOTAL */}

                    <p className="font-bold text-indigo-600 dark:text-indigo-400">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ========================================= */}
        {/* SUMMARY */}
        {/* ========================================= */}

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Ringkasan Pesanan
            </h2>

            <div className="mt-6 space-y-4">
              {/* TOTAL ITEM */}

              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  Total item
                </span>

                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {totalItems}
                </span>
              </div>

              {/* SUBTOTAL */}

              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  Subtotal
                </span>

                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              {/* SHIPPING */}

              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  Pengiriman
                </span>

                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  Gratis
                </span>
              </div>
            </div>

            {/* DIVIDER */}

            <div className="my-6 border-t border-slate-200 dark:border-slate-800" />

            {/* TOTAL */}

            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Total
              </span>

              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                {formatPrice(totalPrice)}
              </span>
            </div>

            {/* CHECKOUT */}

            <button className="mt-6 w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cart;