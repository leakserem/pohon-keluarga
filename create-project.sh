#!/bin/bash

mkdir -p assets/css
mkdir -p assets/js/components
mkdir -p assets/js/features/{tree,members,timeline,statistics,export}
mkdir -p assets/js/utils
mkdir -p assets/images
mkdir -p assets/icons
mkdir -p assets/fonts
mkdir -p uploads/photos
mkdir -p data
mkdir -p docs

touch index.html
touch README.md
touch manifest.json
touch favicon.ico

touch assets/css/00-reset.css
touch assets/css/01-variables.css
touch assets/css/02-base.css
touch assets/css/03-layout.css
touch assets/css/04-components.css
touch assets/css/05-tree.css
touch assets/css/06-animations.css
touch assets/css/07-dark.css
touch assets/css/app.css

touch assets/js/app.js
touch assets/js/config.js
touch assets/js/store.js
touch assets/js/router.js
touch assets/js/api.js

touch assets/js/components/header.js
touch assets/js/components/sidebar.js
touch assets/js/components/toolbar.js
touch assets/js/components/treeCanvas.js
touch assets/js/components/treeNode.js
touch assets/js/components/detailPanel.js
touch assets/js/components/dialog.js
touch assets/js/components/toast.js
touch assets/js/components/avatar.js
touch assets/js/components/searchBox.js

touch assets/js/utils/dom.js
touch assets/js/utils/events.js
touch assets/js/utils/helpers.js
touch assets/js/utils/formatter.js
touch assets/js/utils/validator.js

touch data/demo.json
touch data/schema.json

touch docs/ui.md
touch docs/api.md
touch docs/changelog.md

echo "Family Tree v2 project structure created."
