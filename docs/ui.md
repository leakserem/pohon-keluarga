# Family Tree v2
# User Interface Documentation

Version : 2.0.0

---

# Overview

Family Tree v2 merupakan aplikasi web berbasis HTML, CSS, dan JavaScript ES Modules.

Tujuan utama antarmuka adalah menampilkan pohon keluarga secara sederhana, mudah digunakan, dan responsif.

---

# Layout

```
+---------------------------------------------------------+
| Header                                                  |
+-------------+-----------------------------+-------------+
| Sidebar     |                             | Detail      |
|             |        Tree Canvas          | Panel       |
|             |                             |             |
|             |                             |             |
|             |                             |             |
+-------------+-----------------------------+-------------+
| Toolbar                                              |
+---------------------------------------------------------+
```

---

# Header

Lokasi

```
assets/js/components/header.js
```

Fungsi

- Menampilkan nama aplikasi.
- Navigasi utama.
- Tombol Home.
- Tombol Tambah Anggota.
- Tombol Cetak.

---

# Sidebar

Lokasi

```
assets/js/components/sidebar.js
```

Fungsi

- Daftar anggota keluarga.
- Filter data.
- Navigasi cepat.

---

# Search Box

Lokasi

```
assets/js/components/searchBox.js
```

Fungsi

- Pencarian anggota berdasarkan nama.
- Filter hasil secara langsung.

---

# Toolbar

Lokasi

```
assets/js/components/toolbar.js
```

Fungsi

- Zoom In.
- Zoom Out.
- Reset View.
- Refresh Tree.

---

# Tree Canvas

Lokasi

```
assets/js/components/treeCanvas.js
```

Fungsi

- Area utama untuk menampilkan pohon keluarga.
- Menampilkan seluruh node.
- Menampilkan garis hubungan.

---

# Tree Node

Lokasi

```
assets/js/components/treeNode.js
```

Informasi yang ditampilkan

- Foto.
- Nama.
- Jenis Kelamin.
- Generasi.

---

# Detail Panel

Lokasi

```
assets/js/components/detailPanel.js
```

Menampilkan informasi lengkap anggota.

Data yang ditampilkan

- Nama
- Foto
- Tanggal Lahir
- Tanggal Wafat
- Jenis Kelamin
- Generasi
- Ayah
- Ibu
- Pasangan
- Anak
- Nomor Telepon
- Email
- Alamat
- Catatan

---

# Avatar

Lokasi

```
assets/js/components/avatar.js
```

Fungsi

- Menampilkan foto anggota.
- Menampilkan inisial jika foto belum tersedia.

---

# Dialog

Lokasi

```
assets/js/components/dialog.js
```

Digunakan untuk

- Konfirmasi hapus.
- Tambah anggota.
- Edit anggota.
- Informasi aplikasi.

---

# Toast

Lokasi

```
assets/js/components/toast.js
```

Jenis notifikasi

- Success
- Info
- Warning
- Error

Posisi

```
Sudut kanan atas
```

---

# Responsive Layout

Desktop

```
Header

Sidebar | Tree Canvas | Detail Panel

Toolbar
```

Tablet

```
Header

Tree Canvas

Sidebar (Collapse)

Detail Panel (Drawer)

Toolbar
```

Mobile

```
Header

Tree Canvas

Toolbar

Sidebar (Off Canvas)

Detail Panel (Full Screen)
```

---

# Color System

Primary

```
#2563EB
```

Secondary

```
#64748B
```

Success

```
#16A34A
```

Warning

```
#F59E0B
```

Danger

```
#DC2626
```

Background

```
#F8FAFC
```

Surface

```
#FFFFFF
```

Text

```
#1E293B
```

---

# Typography

Heading

```
700
```

Body

```
400
```

Button

```
600
```

---

# Icons

Menggunakan SVG.

Kategori

- Navigation
- Person
- Family
- Search
- Settings
- Export

---

# Spacing

Base Unit

```
8 px
```

Skala

```
4 px
8 px
12 px
16 px
24 px
32 px
48 px
64 px
```

---

# Border Radius

Small

```
4 px
```

Medium

```
8 px
```

Large

```
12 px
```

Card

```
16 px
```

---

# Animation

Durasi

```
150 ms
250 ms
300 ms
```

Efek

- Fade
- Slide
- Scale

---

# Components

| Component | Status |
|-----------|--------|
| Header | Planned |
| Sidebar | Planned |
| Search Box | Planned |
| Toolbar | Planned |
| Tree Canvas | Planned |
| Tree Node | Planned |
| Detail Panel | Planned |
| Avatar | Planned |
| Dialog | Planned |
| Toast | Planned |

---

# UI Flow

```
Start

↓

Header

↓

Sidebar

↓

Search

↓

Tree Canvas

↓

Klik Node

↓

Detail Panel

↓

Edit / Hapus

↓

Refresh Tree
```

---

# Current Status

| Bagian | Status |
|---------|--------|
| Layout | Draft |
| Components | Development |
| Responsive | Planned |
| Theme | Development |
| Animation | Development |
