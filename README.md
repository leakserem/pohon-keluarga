# Family Tree v2.9 — Members + Submissions + Google Drive Photo

## What this patch fixes

- Create-member now sends the complete member object to the Google Apps Script backend.
- Backend writes a new member into **Members** and logs the same operation in **Submissions**.
- Mother and spouse are selected by **name** while the relationship is saved by ID.
- Photo upload button accepts an image, crops it to a square, compresses it to **<= 20 KB**, previews it as a circle, and sends it to Apps Script for storage in **Google Drive**.
- Members can still be edited/deleted through the same API.

## Frontend files to replace

Copy these files into the existing v2.8/v2.7 project:

- `assets/js/api.js`
- `assets/js/components/dialog.js`
- `assets/js/components/photoUpload.js`
- `assets/js/utils/constants.js`
- `assets/js/app.js`
- `assets/js/components/searchBox.js`

## Backend

Copy `google-apps-script/Code.gs` into the Google Apps Script project used by your current `/exec` API.

### Script Properties

Set:

- `SPREADSHEET_ID` = the Google Spreadsheet ID. Leave empty only when the Apps Script is spreadsheet-bound and `getActiveSpreadsheet()` works.
- `PHOTO_FOLDER_ID` = optional Google Drive folder ID. Leave empty to auto-create/use a folder called `Pohon Keluarga Photos`.

### Sheets

The script uses these names automatically:

- Members / Member / members / member
- Submissions / Submission / submissions / submission

If the sheets do not exist, the script creates them with the required headers.

### Deploy

Deploy the Apps Script as a Web App:

- Execute as: **Me**
- Who has access: **Anyone**

Then keep the same `/exec` URL in `assets/js/config.js`.

## Important

The frontend alone cannot write to Google Sheets or Google Drive. The Apps Script backend must be deployed with the permissions above and must point to the correct spreadsheet. The existing GitHub repository currently contains the frontend API caller but not the Apps Script source, so this v2.9 patch supplies the backend implementation as a separate `Code.gs` file.
