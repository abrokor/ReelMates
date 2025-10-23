# scripts\fix-ui-imports.ps1
# Normalize imports so all tokens come from app/_lib/ui.ts

$files = Get-ChildItem -Path "app" -Recurse -Include *.ts,*.tsx

foreach ($f in $files) {
  $txt = Get-Content -Raw $f.FullName

  # Replace any old token imports with the single source of truth
  $txt = $txt -replace "from '\.\./_lib/screen'","from '../../_lib/ui'"
  $txt = $txt -replace "from '\.\./_lib/colors'","from '../../_lib/ui'"
  $txt = $txt -replace "from '\.\./_lib/ui'","from '../../_lib/ui'"

  # Double-dot variants some files had
  $txt = $txt -replace "from '\.\./\._lib/screen'","from '../../_lib/ui'"
  $txt = $txt -replace "from '\.\./\._lib/colors'","from '../../_lib/ui'"
  $txt = $txt -replace "from '\.\./\._lib/ui'","from '../../_lib/ui'"

  Set-Content -NoNewline -Path $f.FullName -Value $txt
}

Write-Host "Done: imports now point to ../../_lib/ui"
