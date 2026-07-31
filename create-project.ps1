# ===========================================
# Family Tree v2
# Create Project Structure
# ===========================================

$folders = @(
    "assets",
    "assets\css",
    "assets\js",
    "assets\js\components",
    "assets\js\features",
    "assets\js\features\tree",
    "assets\js\features\members",
    "assets\js\features\timeline",
    "assets\js\features\statistics",
    "assets\js\features\export",
    "assets\js\utils",
    "assets\images",
    "assets\icons",
    "assets\fonts",
    "data",
    "uploads",
    "uploads\photos",
    "docs"
)

foreach($folder in $folders)
{
    New-Item -ItemType Directory -Force -Path $folder | Out-Null
}

# ===========================================
# CSS Files
# ===========================================

$cssFiles = @(
    "assets\css\00-reset.css",
    "assets\css\01-variables.css",
    "assets\css\02-base.css",
    "assets\css\03-layout.css",
    "assets\css\04-components.css",
    "assets\css\05-tree.css",
    "assets\css\06-animations.css",
    "assets\css\07-dark.css",
    "assets\css\app.css"
)

foreach($file in $cssFiles)
{
    New-Item -ItemType File -Force -Path $file | Out-Null
}

# ===========================================
# JavaScript Files
# ===========================================

$jsFiles = @(

    "assets\js\app.js",
    "assets\js\config.js",
    "assets\js\store.js",
    "assets\js\router.js",
    "assets\js\api.js",

    "assets\js\components\header.js",
    "assets\js\components\sidebar.js",
    "assets\js\components\toolbar.js",
    "assets\js\components\treeCanvas.js",
    "assets\js\components\treeNode.js",
    "assets\js\components\detailPanel.js",
    "assets\js\components\dialog.js",
    "assets\js\components\toast.js",
    "assets\js\components\avatar.js",
    "assets\js\components\searchBox.js",

    "assets\js\utils\dom.js",
    "assets\js\utils\events.js",
    "assets\js\utils\helpers.js",
    "assets\js\utils\formatter.js",
    "assets\js\utils\validator.js"
)

foreach($file in $jsFiles)
{
    New-Item -ItemType File -Force -Path $file | Out-Null
}

# ===========================================
# Root Files
# ===========================================

$rootFiles = @(
    "index.html",
    "README.md",
    "manifest.json",
    "favicon.ico"
)

foreach($file in $rootFiles)
{
    New-Item -ItemType File -Force -Path $file | Out-Null
}

# ===========================================
# Data Files
# ===========================================

New-Item -ItemType File -Force -Path "data\demo.json" | Out-Null
New-Item -ItemType File -Force -Path "data\schema.json" | Out-Null

# ===========================================
# Docs
# ===========================================

New-Item -ItemType File -Force -Path "docs\ui.md" | Out-Null
New-Item -ItemType File -Force -Path "docs\api.md" | Out-Null
New-Item -ItemType File -Force -Path "docs\changelog.md" | Out-Null

Write-Host ""
Write-Host "====================================="
Write-Host " Family Tree v2 Structure Created"
Write-Host "====================================="
Write-Host ""
