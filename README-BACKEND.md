# Pohon Keluarga Backend v3.1

Baseline file ini berasal dari `pohon-keluarga-backend-v3-members-submissions-drive.zip`.
Perubahan dibatasi pada penyelarasan schema dan kompatibilitas payload foto; fungsi Members, Submissions, Drive, `setupProperties()` dan `testBackend()` tetap dipertahankan.

## Members — schema canonical

Urutan kolom yang dipakai aplikasi:

`id | fullName | childOrder | generation | fatherId | fatherName | motherId | motherName | spouseId | spouseName | birthDate | deathDate | photo | Gender | CreatedAt | UpdatedAt | Source | notes`

Backend tidak menghapus kolom lama secara otomatis. Bila sheet masih memakai header lama, kolom canonical yang belum ada akan ditambahkan dan data lama tetap dipertahankan.

## Submissions

`Timestamp | Action | id | fullName | childOrder | generation | fatherId | fatherName | motherId | motherName | spouseId | spouseName | birthDate | deathDate | photo | Gender | CreatedAt | UpdatedAt | Source | notes | Status`

## Aturan penulisan

- `fullName` disimpan uppercase.
- `Gender` disimpan uppercase.
- `fatherName`, `motherName`, `spouseName` disimpan uppercase.
- `fatherId`, `motherId`, `spouseId` tetap sebagai ID.
- `childOrder` integer >= 0.
- `generation` integer >= 1.
- `notes` mempertahankan penulisan pengguna dan tidak di-uppercase.
- `CreatedAt`, `UpdatedAt`, `Source` diisi backend.

## Foto

Backend v3.1 menerima dua bentuk agar kompatibel:

1. Payload lama: `photoData: { mimeType, base64 }`
2. Payload frontend baru: `person.photoDataUrl` berupa data URL.

Foto <= 20 KiB setelah decode disimpan ke folder Google Drive dari `PHOTO_FOLDER_ID` dan URL file disimpan ke `photo`.

## Konfigurasi

`setupProperties()` pada ZIP ini tetap menggunakan Spreadsheet ID dan Drive Folder ID dari backend v3.0 yang Anda kirim.

Setelah menyalin `Code.gs`:

1. Save.
2. Jalankan `setupProperties()` satu kali bila Script Properties belum terset.
3. Jalankan `testBackend()` satu kali.
4. Pastikan Spreadsheet dan folder Drive dapat dibuka.
5. Deploy → Manage deployments → Edit → New version → Deploy.

## POST

```json
{ "action":"create", "person":{...} }
{ "action":"update", "person":{...} }
{ "action":"delete", "id":"M-..." }
{ "action":"ping" }
```
