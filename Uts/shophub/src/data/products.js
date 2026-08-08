const products = [
  {
    id: 1,
    name: "Wireless Headphone",
    category: "Elektronik",
    price: 499000,
    rating: 4.6,
    reviews: 120,
    stock: 25,
    status: "Ready Stock",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    description:
      "Headphone wireless dengan kualitas suara jernih dan nyaman digunakan sehari-hari.",
    favorite: false,
  },

  {
    id: 2,
    name: "Smart Watch Series 6",
    category: "Elektronik",
    price: 1299000,
    rating: 4.8,
    reviews: 85,
    stock: 8,
    status: "Produk Baru",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    description:
      "Smartwatch modern dengan berbagai fitur kesehatan dan olahraga.",
    favorite: true,
  },

  {
    id: 3,
    name: "Sneakers Casual",
    category: "Fashion",
    price: 299000,
    rating: 4.5,
    reviews: 96,
    stock: 15,
    status: "Best Seller",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    description:
      "Sneakers casual yang cocok digunakan untuk aktivitas sehari-hari.",
    favorite: false,
  },

  {
    id: 4,
    name: "Kaos Polos Premium",
    category: "Fashion",
    price: 79000,
    rating: 4.4,
    reviews: 64,
    stock: 30,
    status: "Diskon",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    description:
      "Kaos polos berbahan cotton premium yang nyaman digunakan.",
    favorite: false,
  },

  {
    id: 5,
    name: "Backpack Laptop",
    category: "Tas",
    price: 250000,
    rating: 4.7,
    reviews: 70,
    stock: 3,
    status: "Stok Terbatas",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    description:
      "Tas laptop dengan banyak kompartemen dan desain minimalis.",
    favorite: false,
  },

  {
    id: 6,
    name: "Mug Keramik",
    category: "Home & Living",
    price: 45000,
    rating: 4.2,
    reviews: 40,
    stock: 40,
    status: "Ready Stock",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d",
    description:
      "Mug keramik minimalis untuk menemani aktivitas sehari-hari.",
    favorite: true,
  },

  {
    id: 7,
    name: "Parfum Original",
    category: "Kecantikan",
    price: 350000,
    rating: 4.6,
    reviews: 110,
    stock: 12,
    status: "Produk Baru",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601",
    description:
      "Parfum dengan aroma elegan yang cocok digunakan sehari-hari.",
    favorite: false,
  },

  {
    id: 8,
    name: "Gamepad Wireless",
    category: "Elektronik",
    price: 180000,
    rating: 4.0,
    reviews: 34,
    stock: 0,
    status: "Stok Habis",
    image: "https://images.unsplash.com/photo-1592840496694-26c035b52b7f",
    description:
      "Gamepad wireless untuk pengalaman bermain game yang lebih nyaman.",
    favorite: false,
  },

  {
    id: 9,
    name: "Mechanical Keyboard",
    category: "Elektronik",
    price: 650000,
    rating: 4.8,
    reviews: 150,
    stock: 10,
    status: "Best Seller",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
    description:
      "Keyboard mechanical dengan switch responsif dan desain compact.",
    favorite: true,
  },

  {
    id: 10,
    name: "Mouse Gaming",
    category: "Elektronik",
    price: 275000,
    rating: 4.5,
    reviews: 89,
    stock: 20,
    status: "Ready Stock",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db",
    description:
      "Mouse gaming ergonomis dengan sensor presisi tinggi.",
    favorite: false,
  },

  {
    id: 11,
    name: "Hoodie Oversize",
    category: "Fashion",
    price: 220000,
    rating: 4.4,
    reviews: 76,
    stock: 18,
    status: "Produk Baru",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
    description:
      "Hoodie oversize dengan bahan lembut dan nyaman.",
    favorite: false,
  },

  {
    id: 12,
    name: "Dompet Kulit",
    category: "Fashion",
    price: 175000,
    rating: 4.6,
    reviews: 55,
    stock: 7,
    status: "Stok Terbatas",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93",
    description:
      "Dompet kulit dengan desain elegan dan compact.",
    favorite: false,
  },

  {
    id: 13,
    name: "Lampu Meja LED",
    category: "Home & Living",
    price: 150000,
    rating: 4.3,
    reviews: 43,
    stock: 14,
    status: "Diskon",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
    description:
      "Lampu meja LED dengan desain modern untuk ruang kerja.",
    favorite: true,
  },

  {
    id: 14,
    name: "Botol Minum",
    category: "Home & Living",
    price: 85000,
    rating: 4.5,
    reviews: 61,
    stock: 25,
    status: "Ready Stock",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8",
    description:
      "Botol minum praktis yang cocok digunakan saat bepergian.",
    favorite: false,
  },

  {
    id: 15,
    name: "Kacamata Fashion",
    category: "Fashion",
    price: 125000,
    rating: 4.1,
    reviews: 38,
    stock: 9,
    status: "Produk Baru",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
    description:
      "Kacamata fashion dengan desain modern dan ringan.",
    favorite: false,
  },
];

export default products;