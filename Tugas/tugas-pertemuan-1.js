const mahasiswa = {
  nama: "Budi Santoso",
  nim: "23110001",
  prodi: "Teknik Informatika",
  semester: 4,
  nilai: [85, 90, 78, 88],
};

const { nama, nim, prodi, semester, nilai } = mahasiswa;

const hitungRata = (arr) => {
  const total = arr.reduce((acc, n) => acc + n, 0);
  return total / arr.length;
};

const rata = hitungRata(nilai);

console.log(`===== DATA MAHASISWA =====`);
console.log(`Nama     : ${nama}`);
console.log(`NIM      : ${nim}`);
console.log(`Prodi    : ${prodi}`);
console.log(`Semester : ${semester}`);
console.log(`Nilai    : ${nilai.join(", ")}`);
console.log(`Rata-rata: ${rata}`);

const mahasiswaAktif = {
  ...mahasiswa,
  status: "Aktif",
};

console.log(`\n===== DATA + STATUS (tanpa mengubah object asli) =====`);
console.log(mahasiswaAktif);
console.log(`Object asli masih tetap:`, mahasiswa);

const hitungTotal = (...angka) => {
  let total = 0; 
  for (const n of angka) {
    total += n;
  }
  return total;
};

const totalNilai = hitungTotal(...nilai); 

console.log(`\n===== TOTAL NILAI =====`);
console.log(`Total seluruh nilai: ${totalNilai}`);

