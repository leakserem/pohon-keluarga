# Family Tree v2 API Documentation

Version: 2.0.0

---

# Overview

Family Tree v2 menggunakan JavaScript ES Modules.

Seluruh komunikasi antar modul dilakukan melalui import/export.

Data utama disimpan dalam:

```
data/demo.json
```

Schema data:

```
data/schema.json
```

---

# Application Flow

```
index.html
        │
        ▼
app.js
        │
        ├─────────────┐
        ▼             ▼
router.js        config.js
        │
        ▼
store.js
        │
        ▼
api.js
        │
        ▼
Components
```

---

# config.js

## Export

```javascript
CONFIG
```

Contoh

```javascript
import { CONFIG } from "./config.js";
```

---

# store.js

## Export

```javascript
getState()

setState()

subscribe()

reset()
```

---

# api.js

## Export

```javascript
loadData()

saveData()

getMembers()

getMember(id)

addMember(person)

updateMember(id, data)

deleteMember(id)
```

---

## loadData()

Memuat data dari demo.json.

Return

```javascript
Promise<Object>
```

---

## saveData()

Menyimpan data.

Saat ini hanya menyimpan ke memory.

Versi berikutnya dapat dihubungkan dengan:

- Local Storage
- Google Apps Script
- Firebase

---

## getMembers()

Mengambil seluruh anggota.

Return

```javascript
Array
```

---

## getMember(id)

Parameter

```javascript
id : String
```

Return

```javascript
Object
```

---

## addMember(person)

Parameter

```javascript
Object
```

Return

```javascript
Boolean
```

---

## updateMember(id,data)

Parameter

```javascript
String

Object
```

Return

```javascript
Boolean
```

---

## deleteMember(id)

Parameter

```javascript
String
```

Return

```javascript
Boolean
```

---

# router.js

## Export

```javascript
startRouter()

navigate(path)
```

Contoh

```javascript
navigate("#/tree");
```

---

# Components

## Header

```
initializeHeader()
```

---

## Sidebar

```
initializeSidebar()
```

---

## Toolbar

```
initializeToolbar()
```

---

## Tree Canvas

```
initializeTreeCanvas()

renderTree()
```

---

## Tree Node

```
createTreeNode(person)
```

---

## Detail Panel

```
showPerson(person)

hidePanel()
```

---

## Dialog

```
openDialog()

closeDialog()
```

---

## Toast

```
showToast(message,type)
```

type

```
success

warning

error

info
```

---

## Avatar

```
createAvatar(person)
```

---

## Search Box

```
initializeSearch()

search(keyword)
```

---

# Utils

## dom.js

```
$

$$

create()

append()

empty()

show()

hide()

toggle()

addClass()

removeClass()

toggleClass()

setText()

setHTML()

setAttr()

getAttr()

removeAttr()

on()

off()

delegate()

escapeHTML()
```

---

## events.js

```
on()

off()

emit()

once()

clear()

clearAll()

debug()
```

---

## helpers.js

```
uuid()

clone()

merge()

unique()

groupBy()

sortBy()

truncate()

slug()

sleep()

debounce()

throttle()

random()

sample()
```

---

## formatter.js

```
titleCase()

upperCase()

lowerCase()

cleanText()

initials()

generation()

formatDate()

formatDateTime()

age()

memberId()

number()

empty()

yesNo()
```

---

## validator.js

```
required()

minLength()

maxLength()

isNumber()

between()

isDate()

isEmail()

isPhone()

isURL()

validName()

validGender()

validGeneration()

validId()

validatePerson()

validatePeople()
```

---

# Data Structure

```
app
└── name
└── version

members[]
        │
        ├── id
        ├── name
        ├── gender
        ├── birthDate
        ├── deathDate
        ├── generation
        ├── father
        ├── mother
        ├── spouse
        ├── children[]
        ├── photo
        ├── phone
        ├── email
        ├── address
        └── notes
```

---

# Future API

Belum diimplementasikan.

```
importJSON()

exportJSON()

exportPNG()

exportPDF()

syncGoogleSheet()

uploadPhoto()

downloadBackup()

restoreBackup()
```

---

# Status

| Module | Status |
|---------|--------|
| Config | ✅ |
| Store | ✅ |
| API | ✅ |
| Router | ✅ |
| Components | 🚧 |
| Utils | ✅ |
| Data | ✅ |
| Documentation | 🚧 |
