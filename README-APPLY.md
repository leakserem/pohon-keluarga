# Mobile UI patch for pohon-keluarga

This patch intentionally changes only:
  assets/js/components/toolbar.js

It keeps api.js, config.js, the Google Apps Script backend, store.js,
treeBuilder.js, autoLayout.js, connector.js, and treeNode.js unchanged.

What it adds:
- Mobile bottom navigation: Pohon / Anggota / Cari / Tambah / Lainnya
- Member sidebar becomes an off-canvas drawer
- Member detail becomes a bottom sheet
- Compact mobile header actions
- Mobile controls for zoom/fit/center/theme/print
- 44px+ touch targets
- Safe-area handling for notched phones
- One-finger tree pan and two-finger pinch zoom on touch devices
- Escape/backdrop closing of mobile panels
- Mobile-specific dialog sizing

Apply:
1. Replace `assets/js/components/toolbar.js` with the provided file.
2. Commit and push to GitHub Pages.
3. Test at 360x800, 390x844, and 430x932.
4. Hard-refresh the site after deployment.

Note:
The GitHub connector in this session can read the repository but rejects write
operations with HTTP 403, so the replacement is provided as a ready-to-copy file
instead of pretending it was committed remotely.
