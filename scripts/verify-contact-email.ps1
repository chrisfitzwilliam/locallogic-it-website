param(
    [string]$ExpectedEmail = 'contact@locallogicIT.com',
    [string]$LegacyEmail = 'chris@fitzwilliam.net',
    [string]$ExpectedPhoneDisplay = '636-352-6572',
    [string]$ExpectedPhoneHref = '6363526572',
    [string]$LegacyPhoneDisplay = '(555) 000-0000',
    [string]$LegacyPhoneHref = '5550000000'
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
$telPattern = 'tel:([0-9+]+)'
$badMailLinks = @()
$legacyHits = @()
$expectedHits = @()
$badPhoneLinks = @()
$legacyPhoneHits = @()
$expectedPhoneHits = @()

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

    foreach ($match in Select-String -Path $file.FullName -Pattern $telPattern -AllMatches) {
        foreach ($group in $match.Matches) {
            $telTarget = $group.Groups[1].Value
            if ($telTarget -ne $ExpectedPhoneHref) {
                $badPhoneLinks += "$($file.FullName):$($match.LineNumber) -> $telTarget"
            }
        }
    }

    foreach ($expectedPhoneMatch in Select-String -Path $file.FullName -Pattern ([regex]::Escape($ExpectedPhoneDisplay))) {
        $expectedPhoneHits += "$($file.FullName):$($expectedPhoneMatch.LineNumber)"
    }

    foreach ($legacyPhoneMatch in Select-String -Path $file.FullName -Pattern ([regex]::Escape($LegacyPhoneDisplay))) {
        $legacyPhoneHits += "$($file.FullName):$($legacyPhoneMatch.LineNumber)"
    }

    foreach ($legacyPhoneTargetMatch in Select-String -Path $file.FullName -Pattern ([regex]::Escape($LegacyPhoneHref))) {
        $legacyPhoneHits += "$($file.FullName):$($legacyPhoneTargetMatch.LineNumber)"
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

if ($badPhoneLinks.Count -gt 0) {
    Write-Host 'Unexpected tel targets found:'
    $badPhoneLinks | ForEach-Object { Write-Host "  $_" }
    exit 1
}

if ($legacyPhoneHits.Count -gt 0) {
    Write-Host 'Legacy phone values still present:'
    $legacyPhoneHits | Sort-Object -Unique | ForEach-Object { Write-Host "  $_" }
    exit 1
}

if ($expectedPhoneHits.Count -eq 0) {
    Write-Host "Expected phone display $ExpectedPhoneDisplay was not found in public HTML."
    exit 1
}

Write-Host "Verified $($expectedHits.Count) mailto links use $ExpectedEmail and $($expectedPhoneHits.Count) phone displays use $ExpectedPhoneDisplay."
