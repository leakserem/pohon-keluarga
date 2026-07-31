# Pohon Keluarga — Google Sheets

Website Bahasa Indonesia untuk pohon keluarga besar. Google Sheets menjadi database gratis, tanpa plugin.

## Kolom data di tab `People`

| Kolom | Isi |
|---|---|
| `id` | ID unik, misalnya `K-001` |
| `generation` | Nomor generasi: `1` sampai `15` |
| `fullName` | Nama lengkap |
| `parentIds` | ID orang tua, dipisah koma |
| `partnerIds` | ID pasangan, dipisah koma |
| `notes` | Catatan tambahan |
| `status` | `public` untuk tampil; `private` untuk sembunyikan |

Contoh: `K-003 | 2 | Nurhayati Rahman | K-001,K-002 | K-004 | | public`

## Hubungkan Google Sheets

1. Buat Google Sheet, lalu pilih **Extensions → Apps Script**.
2. Tempel isi `Code.gs`, ganti `SHEET_ID` dengan ID Google Sheet (bagian URL antara `/d/` dan `/edit`).
3. Jalankan fungsi `setupSheets` sekali dan izinkan akses Google.
4. Pilih **Deploy → New deployment → Web app**. Jalankan sebagai **Me**, akses **Anyone**, lalu salin URL `/exec`.
5. Tempel URL itu ke `const API_URL = ""` dalam `app.js`.

Anggota keluarga mengirim data lewat situs. Data masuk ke tab `Submissions` dengan status `pending`; editor memeriksanya dan menambahkannya ke `People`.

## Hosting gratis: GitHub Pages (disarankan)

1. Buat akun dan repository baru di [GitHub](https://github.com), misalnya `pohon-keluarga`.
2. Unggah `index.html`, `styles.css`, dan `app.js`. Jangan unggah `Code.gs` ke repository publik karena berisi ID Sheet.
3. Buka **Settings → Pages**. Pilih **Deploy from a branch**, pilih `main` dan folder `/(root)`, lalu simpan.
4. Situs gratis Anda akan tersedia di alamat seperti `https://namakamu.github.io/pohon-keluarga/`.

Alternatif drag-and-drop yang sangat mudah: [Netlify Drop](https://app.netlify.com/drop). Tarik folder website dan Anda mendapat alamat situs gratis.

## Privasi

Jangan masukkan alamat rumah, nomor telepon, dokumen identitas, atau catatan privat. Untuk orang yang tidak boleh terlihat, isi kolom `status` dengan `private`.
