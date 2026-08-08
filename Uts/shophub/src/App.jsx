import { useEffect, useMemo, useState } from "react";

import {
  FaBoxOpen,
  FaCheckCircle,
  FaTimesCircle,
  FaHeart,
  FaThLarge,
} from "react-icons/fa";

import productsData from "./data/products";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatCard from "./components/StatCard";
import FilterBar from "./components/FilterBar";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import Wishlist from "./components/Wishlist";
import Cart from "./components/Cart";
import Settings from "./components/Settings";

function App() {
  // ==========================================
  // PRODUCTS
  // ==========================================

  const [products, setProducts] = useState(productsData);

  // ==========================================
  // SEARCH & FILTER
  // ==========================================

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("Semua");

  // ==========================================
  // NAVIGATION
  // ==========================================

  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  // ==========================================
  // MOBILE SIDEBAR
  // ==========================================

  const [mobileMenu, setMobileMenu] = useState(false);

  // ==========================================
  // CART
  // ==========================================

  const [cart, setCart] = useState([]);

  // ==========================================
  // THEME
  // ==========================================

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(
      "shophub-theme"
    );

    return savedTheme || "light";
  });

  // ==========================================
  // APPLY THEME
  // ==========================================

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem(
      "shophub-theme",
      theme
    );
  }, [theme]);

  // ==========================================
  // TOGGLE THEME
  // ==========================================

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "light"
        ? "dark"
        : "light"
    );
  };

  // ==========================================
  // CATEGORIES
  // ==========================================

  const categories = useMemo(() => {
    return [
      ...new Set(
        products.map(
          (product) => product.category
        )
      ),
    ];
  }, [products]);

  // ==========================================
  // FILTER PRODUCTS
  // ==========================================

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        category === "Semua" ||
        product.category === category;

      return (
        matchSearch &&
        matchCategory
      );
    });
  }, [
    products,
    search,
    category,
  ]);

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalProducts = products.length;

  const availableProducts =
    products.filter(
      (product) => product.stock > 0
    ).length;

  const outOfStock =
    products.filter(
      (product) => product.stock === 0
    ).length;

  const favoriteProducts =
    products.filter(
      (product) => product.favorite
    ).length;

  const totalCategories =
    categories.length;

  // ==========================================
  // CART TOTAL
  // ==========================================

  const cartCount = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  // ==========================================
  // TOGGLE FAVORITE
  // ==========================================

  const toggleFavorite = (id) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === id
          ? {
            ...product,
            favorite:
              !product.favorite,
          }
          : product
      )
    );
  };

  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = (product) => {
    if (product.stock <= 0) {
      return;
    }

    setCart((currentCart) => {
      const existingItem =
        currentCart.find(
          (item) =>
            item.id === product.id
        );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
              ...item,
              quantity:
                Math.min(
                  item.quantity + 1,
                  product.stock
                ),
            }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    setSelectedProduct(null);
  };

  // ==========================================
  // INCREASE CART
  // ==========================================

  const increaseCartItem = (id) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item.id !== id) {
          return item;
        }

        return {
          ...item,
          quantity: Math.min(
            item.quantity + 1,
            item.stock
          ),
        };
      })
    );
  };

  // ==========================================
  // DECREASE CART
  // ==========================================

  const decreaseCartItem = (id) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (item.id !== id) {
            return item;
          }

          return {
            ...item,
            quantity:
              item.quantity - 1,
          };
        })
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  // ==========================================
  // REMOVE CART ITEM
  // ==========================================

  const removeCartItem = (id) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== id
      )
    );
  };

  // ==========================================
  // CLEAR CART
  // ==========================================

  const clearCart = () => {
    setCart([]);
  };

  // ==========================================
  // CHANGE MENU
  // ==========================================

  const handleMenuChange = (menu) => {
    setActiveMenu(menu);

    setMobileMenu(false);

    setSelectedProduct(null);

    // Reset search/filter ketika pindah halaman
    if (menu !== "Produk") {
      setSearch("");
      setCategory("Semua");
    }
  };

  // ==========================================
  // PRODUCT DETAIL
  // ==========================================

  const handleProductDetail = (
    product
  ) => {
    setSelectedProduct(product);
  };

  // ==========================================
  // CLOSE DETAIL
  // ==========================================

  const handleCloseDetail = () => {
    setSelectedProduct(null);
  };

  return (
    <div
      className="
        flex
        min-h-screen
        bg-slate-50
        text-slate-900
        transition-colors
        duration-300

        dark:bg-slate-950
        dark:text-slate-100
      "
    >

      {/* ====================================== */}
      {/* SIDEBAR */}
      {/* ====================================== */}

      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
        favoriteCount={favoriteProducts}
        cartCount={cartCount}
        theme={theme}
      />

      {/* ====================================== */}
      {/* MAIN */}
      {/* ====================================== */}

      <div className="flex min-w-0 flex-1 flex-col">


        {/* ==================================== */}
        {/* HEADER */}
        {/* ==================================== */}

        <Header
          search={search}
          setSearch={setSearch}
          setMobileMenu={setMobileMenu}
          favoriteCount={favoriteProducts}
          cartCount={cartCount}
          theme={theme}
          onToggleTheme={toggleTheme}
          onWishlist={() =>
            handleMenuChange(
              "Wishlist"
            )
          }
          onCart={() =>
            handleMenuChange("Cart")
          }
        />


        {/* ==================================== */}
        {/* CONTENT */}
        {/* ==================================== */}

        <main className="flex-1 px-4 py-6 sm:px-6 md:px-8 lg:py-8">

          <div className="mx-auto max-w-7xl">


            {/* ================================= */}
            {/* WISHLIST */}
            {/* ================================= */}

            {activeMenu ===
              "Wishlist" ? (

              <Wishlist
                products={products}
                onToggleFavorite={
                  toggleFavorite
                }
                onDetail={
                  handleProductDetail
                }
              />

            ) : activeMenu ===
              "Cart" ? (

              /* =============================== */
              /* CART */
              /* =============================== */

              <Cart
                cart={cart}
                onIncrease={
                  increaseCartItem
                }
                onDecrease={
                  decreaseCartItem
                }
                onRemove={
                  removeCartItem
                }
                onClear={clearCart}
                onBack={() =>
                  handleMenuChange(
                    "Produk"
                  )
                }
              />

            ) : activeMenu ===
              "Pengaturan" ? (

              /* =============================== */
              /* SETTINGS */
              /* =============================== */

              <Settings
                theme={theme}
                onThemeChange={
                  setTheme
                }
              />

            ) : (

              /* =============================== */
              /* DASHBOARD / PRODUK */
              /* =============================== */

              <>

                {/* TITLE */}

                <div>

                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {activeMenu ===
                      "Produk"
                      ? "Daftar Produk"
                      : "Dashboard"}
                  </h1>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {activeMenu ===
                      "Produk"
                      ? "Kelola dan lihat semua produk Anda"
                      : "Ringkasan informasi produk"}
                  </p>

                </div>


                {/* ================================= */}
                {/* STATISTICS */}
                {/* ================================= */}

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

                  <StatCard
                    title="Total Produk"
                    value={totalProducts}
                    description="Semua produk"
                    icon={<FaBoxOpen />}
                    iconStyle="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                  />

                  <StatCard
                    title="Produk Tersedia"
                    value={availableProducts}
                    description="Stok lebih dari 0"
                    icon={
                      <FaCheckCircle />
                    }
                    iconStyle="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                  />

                  <StatCard
                    title="Produk Habis"
                    value={outOfStock}
                    description="Stok sama dengan 0"
                    icon={
                      <FaTimesCircle />
                    }
                    iconStyle="bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                  />

                  <StatCard
                    title="Produk Favorit"
                    value={favoriteProducts}
                    description="Di wishlist"
                    icon={<FaHeart />}
                    iconStyle="bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                  />

                  <StatCard
                    title="Jumlah Kategori"
                    value={totalCategories}
                    description="Kategori berbeda"
                    icon={<FaThLarge />}
                    iconStyle="bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400"
                  />

                </div>


                {/* ================================= */}
                {/* PRODUCT SECTION */}
                {/* ================================= */}

                <section className="mt-10">

                  <div>

                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Daftar Produk
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Temukan dan kelola produk
                      yang tersedia
                    </p>

                  </div>


                  {/* FILTER */}

                  <FilterBar
                    search={search}
                    setSearch={setSearch}
                    category={category}
                    setCategory={
                      setCategory
                    }
                    categories={
                      categories
                    }
                  />


                  {/* PRODUCT COUNT */}

                  <div className="mt-5">

                    <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">

                      Menampilkan{" "}

                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {
                          filteredProducts.length
                        }
                      </span>{" "}

                      produk

                    </p>


                    {/* PRODUCT LIST */}

                    <ProductList
                      products={
                        filteredProducts
                      }
                      onToggleFavorite={
                        toggleFavorite
                      }
                      onDetail={
                        handleProductDetail
                      }
                    />

                  </div>

                </section>

              </>

            )}

          </div>

        </main>


        {/* ==================================== */}
        {/* FOOTER */}
        {/* ==================================== */}

        <footer className="border-t border-slate-200 bg-white px-6 py-6 dark:border-slate-800 dark:bg-slate-900">

          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">

            <p className="text-xs text-slate-400">
              © 2026 ShopHub. All rights reserved.
            </p>

            <p className="text-xs text-slate-400">
              Product Management System
            </p>

          </div>

        </footer>

      </div>


      {/* ====================================== */}
      {/* PRODUCT DETAIL MODAL */}
      {/* ====================================== */}

      <ProductDetail
        product={selectedProduct}
        onClose={
          handleCloseDetail
        }
        onToggleFavorite={
          toggleFavorite
        }
        onAddToCart={addToCart}
      />

    </div>
  );
}

export default App;