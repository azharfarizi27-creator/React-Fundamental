import {
  FaThLarge,
  FaBoxOpen,
  FaArrowRight,
} from "react-icons/fa";


function CategoryPage({
  products,
  categories,
  onSelectCategory,
}) {

  return (
    <section>

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Kategori Produk
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Pilih kategori untuk melihat produk yang tersedia
        </p>

      </div>


      {/* ================================= */}
      {/* CATEGORY COUNT */}
      {/* ================================= */}

      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <FaThLarge />
        </div>

        <div>

          <p className="text-sm font-medium text-indigo-900">
            Total Kategori
          </p>

          <p className="text-lg font-bold text-indigo-600">
            {categories.length} kategori
          </p>

        </div>

      </div>


      {/* ================================= */}
      {/* CATEGORY GRID */}
      {/* ================================= */}

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">


        {/* SEMUA PRODUK */}

        <button
          onClick={() => onSelectCategory("Semua")}
          className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
        >

          <div className="flex items-start justify-between">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <FaBoxOpen />
            </div>

            <FaArrowRight className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-500" />

          </div>


          <h2 className="mt-5 text-lg font-bold text-slate-900">
            Semua Produk
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Lihat semua produk
          </p>

          <div className="mt-5 border-t border-slate-100 pt-4">

            <span className="text-sm font-semibold text-indigo-600">
              {products.length} produk
            </span>

          </div>

        </button>


        {/* CATEGORY */}

        {categories.map((category) => {

          const categoryProducts = products.filter(
            (product) =>
              product.category === category
          );

          return (

            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-indigo-100 group-hover:text-indigo-600">
                  <FaThLarge />
                </div>

                <FaArrowRight className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-500" />

              </div>


              <h2 className="mt-5 text-lg font-bold text-slate-900">
                {category}
              </h2>


              <p className="mt-1 text-sm text-slate-500">
                Produk kategori {category}
              </p>


              <div className="mt-5 border-t border-slate-100 pt-4">

                <span className="text-sm font-semibold text-indigo-600">
                  {categoryProducts.length} produk
                </span>

              </div>

            </button>

          );

        })}

      </div>

    </section>
  );
}


export default CategoryPage;