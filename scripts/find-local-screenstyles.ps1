# scripts\find-local-screenstyles.ps1
Get-ChildItem -Path "app" -Recurse -Include *.tsx |
  Select-String -Pattern "const\s+screenStyles\s*=\s*StyleSheet\.create\(" |
  Select-Object Path, LineNumber, Line
