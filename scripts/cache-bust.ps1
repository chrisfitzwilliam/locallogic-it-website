$files = Get-ChildItem -Path (Split-Path $PSScriptRoot -Parent) -Recurse -Filter '*.html'
foreach ($f in $files) {
    $c = [IO.File]::ReadAllText($f.FullName)
    # Normalize any existing version params first
    $c = $c.Replace('pill-nav.css?v=2"', 'pill-nav.css"')
    $c = $c.Replace('pill-nav.js?v=2"', 'pill-nav.js"')
    # Now add fresh cache-bust to all
    $c = $c.Replace('pill-nav.css"', 'pill-nav.css?v=20260501_4"')
    $c = $c.Replace('pill-nav.js"', 'pill-nav.js?v=20260501_4"')
    [IO.File]::WriteAllText($f.FullName, $c)
    Write-Host "Updated: $($f.Name)"
}
