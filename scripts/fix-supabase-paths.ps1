# scripts\fix-supabase-paths.ps1
# Fix wrong relative imports to supabase in (drawer) screens

$files = Get-ChildItem -Path "app" -Recurse -Include *.ts,*.tsx

foreach ($f in $files) {
  $txt = Get-Content -Raw $f.FullName

  # In (drawer)/* screens the correct path is ../../_lib/supabase
  $txt = $txt -replace "from '\.\./_lib/supabase'","from '../../_lib/supabase'"

  Set-Content -NoNewline -Path $f.FullName -Value $txt
}

Write-Host "Done: supabase imports normalized to ../../_lib/supabase"
