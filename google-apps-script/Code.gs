/**
 * Pohon Keluarga - Google Apps Script backend v2.9
 *
 * Required sheets:
 *   - Members (or Member/member)
 *   - Submissions (or Submission/submission)
 *
 * Spreadsheet ID and Drive folder ID can be supplied through Script Properties:
 *   SPREADSHEET_ID
 *   PHOTO_FOLDER_ID (optional; if empty a folder is created automatically)
 *
 * Deploy as Web App:
 *   Execute as: Me
 *   Who has access: Anyone
 */

const CFG = Object.freeze({
  SPREADSHEET_ID: PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || '',
  PHOTO_FOLDER_ID: PropertiesService.getScriptProperties().getProperty('PHOTO_FOLDER_ID') || '',
  MEMBERS_NAMES: ['Members', 'Member', 'members', 'member'],
  SUBMISSION_NAMES: ['Submissions', 'Submission', 'submissions', 'submission'],
  MAX_PHOTO_BYTES: 20 * 1024,
  PHOTO_FOLDER_NAME: 'Pohon Keluarga Photos'
});

const SUBMISSION_HEADERS = [
  'Timestamp', 'Action',
  'ID', 'Full Name', 'Generation', 'Father ID', 'Mother ID', 'Mother Name',
  'Spouse ID', 'Spouse Name', 'Photo URL', 'Birth Date', 'Death Date',
  'Gender', 'Notes', 'Status'
];

const HEADERS = [
  'ID',
  'Full Name',
  'Generation',
  'Father ID',
  'Mother ID',
  'Mother Name',
  'Spouse ID',
  'Spouse Name',
  'Photo URL',
  'Birth Date',
  'Death Date',
  'Gender',
  'Notes',
  'Created At',
  'Updated At',
  'Source'
];

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function db_() {
  if (CFG.SPREADSHEET_ID) return SpreadsheetApp.openById(CFG.SPREADSHEET_ID);
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (!active) throw new Error('SPREADSHEET_ID belum disetel di Script Properties.');
  return active;
}

function findSheet_(names) {
  const ss = db_();
  const wanted = names.map(String);
  for (const name of wanted) {
    const sheet = ss.getSheetByName(name);
    if (sheet) return sheet;
  }
  const sheet = ss.insertSheet(names[0]);
  ensureHeaders_(sheet);
  return sheet;
}

function ensureHeaders_(sheet) {
  if (sheet.getLastColumn() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    return;
  }
  const current = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    .map(v => String(v || '').trim());
  const missing = HEADERS.filter(h => !current.some(c => c.toLowerCase() === h.toLowerCase()));
  if (missing.length) {
    sheet.getRange(1, current.length + 1, 1, missing.length).setValues([missing]);
  }
}

function headerMap_(sheet) {
  ensureHeaders_(sheet);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    .map(v => String(v || '').trim());
  const map = {};
  headers.forEach((h, i) => {
    if (h) map[h.toLowerCase()] = i + 1;
  });
  return map;
}

function setIfHeader_(row, map, names, value) {
  for (const name of names) {
    const col = map[String(name).toLowerCase()];
    if (col) {
      row[col - 1] = value == null ? '' : value;
      return;
    }
  }
}

function sheetRows_(sheet) {
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < 2 || lastCol < 1) return [];
  return sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
}

function findRowById_(sheet, id) {
  const map = headerMap_(sheet);
  const idCol = map['id'];
  if (!idCol) throw new Error(`Sheet ${sheet.getName()} tidak mempunyai kolom ID.`);
  const values = sheet.getRange(2, idCol, Math.max(sheet.getLastRow() - 1, 1), 1).getValues();
  const target = String(id).trim();
  for (let i = 0; i < values.length; i++) {
    if (String(values[i][0]).trim() === target) return i + 2;
  }
  return 0;
}

function photoFolder_() {
  if (CFG.PHOTO_FOLDER_ID) return DriveApp.getFolderById(CFG.PHOTO_FOLDER_ID);
  const folders = DriveApp.getFoldersByName(CFG.PHOTO_FOLDER_NAME);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(CFG.PHOTO_FOLDER_NAME);
}

function uploadPhoto_(dataUrl, memberId, fullName) {
  if (!dataUrl) return '';
  const match = String(dataUrl).match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error('Format foto base64 tidak valid.');

  const bytes = Utilities.base64Decode(match[2]);
  if (bytes.length > CFG.MAX_PHOTO_BYTES) {
    throw new Error(`Foto lebih besar dari ${CFG.MAX_PHOTO_BYTES / 1024} KB.`);
  }

  const ext = match[1].indexOf('png') >= 0 ? 'png' : 'jpg';
  const safeName = String(fullName || memberId).replace(/[^a-zA-Z0-9_-]+/g, '_').slice(0, 60);
  const file = photoFolder_().createFile(
    Utilities.newBlob(bytes, match[1], `${memberId}_${safeName}.${ext}`)
  );

  try {
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (err) {
    // Workspace/domain policies may forbid public links. File still remains in Drive.
  }

  return `https://drive.google.com/thumbnail?id=${encodeURIComponent(file.getId())}&sz=w512`;
}

function personRow_(sheet, person, now) {
  const map = headerMap_(sheet);
  const row = new Array(sheet.getLastColumn()).fill('');
  setIfHeader_(row, map, ['ID'], person.id);
  setIfHeader_(row, map, ['Full Name', 'Name', 'Nama'], person.fullName);
  setIfHeader_(row, map, ['Generation', 'Generasi'], person.generation);
  setIfHeader_(row, map, ['Father ID', 'FatherId', 'Ayah'], person.fatherId);
  setIfHeader_(row, map, ['Mother ID', 'MotherId', 'Ibu'], person.motherId);
  setIfHeader_(row, map, ['Mother Name', 'Nama Ibu'], person.motherName);
  setIfHeader_(row, map, ['Spouse ID', 'SpouseId', 'Pasangan'], person.spouseId);
  setIfHeader_(row, map, ['Spouse Name', 'Nama Pasangan'], person.spouseName);
  setIfHeader_(row, map, ['Photo URL', 'Photo', 'Foto'], person.photo);
  setIfHeader_(row, map, ['Birth Date', 'BirthDate', 'Tanggal Lahir'], person.birthDate);
  setIfHeader_(row, map, ['Death Date', 'DeathDate', 'Tanggal Wafat'], person.deathDate);
  setIfHeader_(row, map, ['Gender', 'Jenis Kelamin'], person.gender);
  setIfHeader_(row, map, ['Notes', 'Catatan'], person.notes);
  setIfHeader_(row, map, ['Created At', 'Created'], now);
  setIfHeader_(row, map, ['Updated At', 'Updated'], now);
  setIfHeader_(row, map, ['Source'], 'family-tree-web');
  return row;
}

function upsertMember_(person) {
  const sheet = findSheet_(CFG.MEMBERS_NAMES);
  const now = new Date();
  const existingRow = findRowById_(sheet, person.id);
  const row = personRow_(sheet, person, now);

  if (existingRow) {
    const map = headerMap_(sheet);
    const createdCol = map['created at'] || map['created'];
    if (createdCol) row[createdCol - 1] = sheet.getRange(existingRow, createdCol).getValue();
    sheet.getRange(existingRow, 1, 1, row.length).setValues([row]);
    return existingRow;
  }

  sheet.appendRow(row);
  return sheet.getLastRow();
}

function appendSubmission_(person, action, result) {
  const sheet = findSheet_(CFG.SUBMISSION_NAMES);
  if (sheet.getLastColumn() === 0) {
    sheet.getRange(1, 1, 1, SUBMISSION_HEADERS.length).setValues([SUBMISSION_HEADERS]);
  } else {
    const current = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(v => String(v || '').trim());
    const missing = SUBMISSION_HEADERS.filter(h => !current.some(c => c.toLowerCase() === h.toLowerCase()));
    if (missing.length) sheet.getRange(1, current.length + 1, 1, missing.length).setValues([missing]);
  }
  const now = new Date();
  const map = headerMap_(sheet);
  const row = new Array(sheet.getLastColumn()).fill('');
  setIfHeader_(row, map, ['Timestamp', 'Submitted At', 'Created At'], now);
  setIfHeader_(row, map, ['Action'], action);
  setIfHeader_(row, map, ['ID'], person.id);
  setIfHeader_(row, map, ['Full Name', 'Name', 'Nama'], person.fullName);
  setIfHeader_(row, map, ['Generation', 'Generasi'], person.generation);
  setIfHeader_(row, map, ['Father ID'], person.fatherId);
  setIfHeader_(row, map, ['Mother ID'], person.motherId);
  setIfHeader_(row, map, ['Mother Name', 'Nama Ibu'], person.motherName);
  setIfHeader_(row, map, ['Spouse ID'], person.spouseId);
  setIfHeader_(row, map, ['Spouse Name', 'Nama Pasangan'], person.spouseName);
  setIfHeader_(row, map, ['Photo URL', 'Photo'], person.photo);
  setIfHeader_(row, map, ['Birth Date'], person.birthDate);
  setIfHeader_(row, map, ['Death Date'], person.deathDate);
  setIfHeader_(row, map, ['Gender'], person.gender);
  setIfHeader_(row, map, ['Notes'], person.notes);
  setIfHeader_(row, map, ['Status'], result || 'OK');
  sheet.appendRow(row);
}

function readPeople_() {
  const sheet = findSheet_(CFG.MEMBERS_NAMES);
  const map = headerMap_(sheet);
  const rows = sheetRows_(sheet);
  return rows.map(r => ({
    id: String(read_(r, map, ['id'])).trim(),
    fullName: String(read_(r, map, ['full name', 'name', 'nama'])).trim(),
    generation: Number(read_(r, map, ['generation', 'generasi'])) || 1,
    fatherId: String(read_(r, map, ['father id', 'fatherid', 'ayah'])).trim(),
    motherId: String(read_(r, map, ['mother id', 'motherid', 'ibu'])).trim(),
    motherName: String(read_(r, map, ['mother name', 'nama ibu'])).trim(),
    spouseId: String(read_(r, map, ['spouse id', 'spouseid', 'pasangan'])).trim(),
    spouseName: String(read_(r, map, ['spouse name', 'nama pasangan'])).trim(),
    photo: String(read_(r, map, ['photo url', 'photo', 'foto'])).trim(),
    birthDate: valueString_(read_(r, map, ['birth date', 'birthdate', 'tanggal lahir'])),
    deathDate: valueString_(read_(r, map, ['death date', 'deathdate', 'tanggal wafat'])),
    gender: String(read_(r, map, ['gender', 'jenis kelamin'])).trim(),
    notes: String(read_(r, map, ['notes', 'catatan'])).trim()
  })).filter(p => p.id && p.fullName);
}

function read_(row, map, names) {
  for (const name of names) {
    const col = map[String(name).toLowerCase()];
    if (col) return row[col - 1];
  }
  return '';
}

function valueString_(value) {
  if (value instanceof Date) return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  return String(value || '').trim();
}

function normalizePerson_(person) {
  const p = person || {};
  return {
    id: String(p.id || '').trim(),
    fullName: String(p.fullName || p.name || '').trim(),
    generation: Number(p.generation) || 1,
    fatherId: String(p.fatherId || '').trim(),
    motherId: String(p.motherId || '').trim(),
    motherName: String(p.motherName || '').trim(),
    spouseId: String(p.spouseId || '').trim(),
    spouseName: String(p.spouseName || '').trim(),
    photo: String(p.photo || '').trim(),
    photoDataUrl: String(p.photoDataUrl || ''),
    birthDate: String(p.birthDate || '').trim(),
    deathDate: String(p.deathDate || '').trim(),
    gender: String(p.gender || '').trim(),
    notes: String(p.notes || '').trim()
  };
}

function doGet(e) {
  try {
    return json_({ ok: true, data: readPeople_() });
  } catch (error) {
    return json_({ ok: false, error: error.message, data: [] });
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const action = String(payload.action || '').toLowerCase();

    if (action === 'create') {
      const person = normalizePerson_(payload.person);
      if (!person.id || !person.fullName) throw new Error('ID dan nama wajib diisi.');
      if (person.photoDataUrl) person.photo = uploadPhoto_(person.photoDataUrl, person.id, person.fullName);
      delete person.photoDataUrl;
      upsertMember_(person);
      appendSubmission_(person, 'create', 'OK');
      return json_({ ok: true, data: { person, sheets: ['Members', 'Submissions'] } });
    }

    if (action === 'update') {
      const person = normalizePerson_(payload.person);
      if (!person.id || !person.fullName) throw new Error('ID dan nama wajib diisi.');
      if (person.photoDataUrl) person.photo = uploadPhoto_(person.photoDataUrl, person.id, person.fullName);
      delete person.photoDataUrl;
      upsertMember_(person);
      appendSubmission_(person, 'update', 'OK');
      return json_({ ok: true, data: { person } });
    }

    if (action === 'delete') {
      const id = String(payload.id || '').trim();
      if (!id) throw new Error('ID wajib diisi.');
      const sheet = findSheet_(CFG.MEMBERS_NAMES);
      const row = findRowById_(sheet, id);
      if (!row) throw new Error('Anggota tidak ditemukan.');
      const map = headerMap_(sheet);
      const snapshot = { id, fullName: String(sheet.getRange(row, map['full name'] || map['name'] || 2).getValue()) };
      sheet.deleteRow(row);
      appendSubmission_(snapshot, 'delete', 'OK');
      return json_({ ok: true, data: { id } });
    }

    throw new Error(`Action tidak dikenali: ${action}`);
  } catch (error) {
    console.error(error);
    return json_({ ok: false, error: error.message });
  }
}
