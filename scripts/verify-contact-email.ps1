param(
    [string]$ExpectedEmail = 'contact@locallogicIT.com',
    [string]$LegacyEmail = 'chris@fitzwilliam.net'
)

$root = Split-Path -Parent $PSScriptRoot
$paths = @(
    Join-Path $root 'index.html'
    Join-Path $root 'business.html'
    Join-Path $root 'residential.html'
    Join-Path $root 'quick-support.html'
)

$files = @()
foreach ($path in $paths) {
    if (Test-Path -LiteralPath $path) {
        $files += Get-Item -LiteralPath $path
    }
}

$folders = @(
    Join-Path $root 'services'
    Join-Path $root 'components'
)

foreach ($folder in $folders) {
    if (Test-Path -LiteralPath $folder) {
        $files += Get-ChildItem -LiteralPath $folder -Recurse -Filter '*.html' -File
    }
}

$files = $files | Sort-Object FullName -Unique

$mailPattern = 'mailto:([^\"]+)'
$badMailLinks = @()
$legacyHits = @()
$expectedHits = @()

foreach ($file in $files) {
    foreach ($match in Select-String -Path $file.FullName -Pattern $mailPattern -AllMatches) {
        foreach ($group in $match.Matches) {
            $mailTarget = $group.Groups[1].Value
            if ($mailTarget -ne $ExpectedEmail) {
                $badMailLinks += "$($file.FullName):$($match.LineNumber) -> $mailTarget"
            }
            if ($mailTarget -eq $ExpectedEmail) {
                $expectedHits += "$($file.FullName):$($match.LineNumber)"
            }
        }
    }

    foreach ($legacyMatch in Select-String -Path $file.FullName -Pattern ([regex]::Escape($LegacyEmail))) {
        $legacyHits += "$($file.FullName):$($legacyMatch.LineNumber)"
    }
}

if ($badMailLinks.Count -gt 0) {
    Write-Host 'Unexpected mailto targets found:'
    $badMailLinks | ForEach-Object { Write-Host "  $_" }
    exit 1
}

if ($legacyHits.Count -gt 0) {
    Write-Host 'Legacy email still present:'
    $legacyHits | ForEach-Object { Write-Host "  $_" }
    exit 1
}

if ($expectedHits.Count -eq 0) {
    Write-Host "Expected email $ExpectedEmail was not found in public HTML."
    exit 1
}

Write-Host "Verified $($expectedHits.Count) mailto links use $ExpectedEmail."
