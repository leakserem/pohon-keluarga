# Pohon Keluarga — update v3.2

Perubahan sengaja dibatasi pada jalur data anggota.

## Form Tambah/Ubah

Urutan:
1. ID
2. NAMA LENGKAP
3. GENDER
4. URUTAN ANAK
5. GENERASI
6. fatherId
7. AYAH
8. motherId
9. IBU
10. spouseId
11. PASANGAN
12. TANGGAL LAHIR
13. TANGGAL WAFAT
14. FOTO
15. CATATAN

AYAH, IBU, dan PASANGAN tetap berupa pilihan dari anggota yang sudah ada.
Nama yang ditampilkan otomatis huruf besar. ID relasi disimpan terpisah.

## Sheets

Members canonical tab: `Members`
Submissions canonical tab: `Submissions`

Members headers:
`id | fullName | childOrder | generation | fatherId | fatherName | motherId | motherName | spouseId | spouseName | birthDate | deathDate | photo | Gender | CreatedAt | UpdatedAt | Source | notes`

Submissions headers:
`Timestamp | Action | id | fullName | childOrder | generation | fatherId | fatherName | motherId | motherName | spouseId | spouseName | birthDate | deathDate | photo | Gender | CreatedAt | UpdatedAt | Source | notes | Status`

## Penting

Backend sekarang selalu memakai nama tab canonical `Members` dan `Submissions` untuk penulisan baru. Tab alias lama seperti `Member`/`Submission` tidak dihapus.

Backend juga menerima `person.photoDataUrl` dari frontend sehingga upload Drive tidak putus.
