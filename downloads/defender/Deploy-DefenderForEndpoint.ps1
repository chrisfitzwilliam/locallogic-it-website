# Defender for Endpoint Auto-Deployment Script
# For use with Action1 RMM
# Downloads and installs Defender for Endpoint

param(
    [string]$DownloadUrl = "https://raw.githubusercontent.com/chrisfitzwilliam/locallogic-it-website/main/downloads/defender/DefenderDeploymentTool_Onboard_EltekAug.exe",
    [string]$TempPath = "$env:TEMP\DefenderDeploy"
)

$ErrorActionPreference = "Stop"
$ScriptVersion = "1.0"

# Logging function
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $logMessage = "[$timestamp] [$Level] $Message"
    Write-Output $logMessage
    Add-Content -Path "$TempPath\deployment.log" -Value $logMessage -ErrorAction SilentlyContinue
}

try {
    Write-Log "Starting Defender for Endpoint deployment (v$ScriptVersion)"
    Write-Log "Running as: $env:USERNAME on $env:COMPUTERNAME"

    # Create temp directory
    if (-not (Test-Path $TempPath)) {
        New-Item -ItemType Directory -Path $TempPath -Force | Out-Null
        Write-Log "Created temp directory: $TempPath"
    }

    # Check if Defender for Endpoint is already installed
    $defenderInstalled = Get-WmiObject -Class Win32_Product | Where-Object { $_.Name -like "*Windows Defender*" -or $_.Name -like "*Defender*" } | Select-Object -First 1

    if ($defenderInstalled) {
        Write-Log "Defender for Endpoint already detected: $($defenderInstalled.Name)"
    } else {
        Write-Log "Defender for Endpoint not found. Proceeding with installation."
    }

    # Download installer
    Write-Log "Downloading Defender deployment tool from: $DownloadUrl"
    $installerPath = "$TempPath\DefenderDeploymentTool_Onboard_EltekAug.exe"

    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri $DownloadUrl -OutFile $installerPath -ErrorAction Stop

    if (Test-Path $installerPath) {
        $fileSize = (Get-Item $installerPath).Length / 1MB
        Write-Log "Downloaded successfully. Size: $([Math]::Round($fileSize, 2)) MB"
    } else {
        throw "Failed to download installer"
    }

    # Run installer silently
    Write-Log "Running Defender deployment tool..."
    $process = Start-Process -FilePath $installerPath -NoNewWindow -PassThru -Wait

    if ($process.ExitCode -eq 0) {
        Write-Log "Installer completed successfully (Exit Code: 0)"
    } else {
        Write-Log "Installer completed with exit code: $($process.ExitCode)" -Level "WARN"
    }

    # Wait for service to start
    Write-Log "Waiting for Defender services to initialize..."
    Start-Sleep -Seconds 10

    # Verify Defender for Endpoint enrollment
    Write-Log "Verifying Defender for Endpoint enrollment..."

    $maxAttempts = 5
    $attempt = 0
    $enrolled = $false

    while ($attempt -lt $maxAttempts -and -not $enrolled) {
        $attempt++
        $senseService = Get-Service -Name "Sense" -ErrorAction SilentlyContinue

        if ($senseService -and $senseService.Status -eq "Running") {
            Write-Log "Defender for Endpoint service (Sense) is running - ENROLLMENT SUCCESSFUL"
            $enrolled = $true
        } else {
            Write-Log "Attempt $attempt/$maxAttempts - Service not yet running, waiting..."
            Start-Sleep -Seconds 5
        }
    }

    if (-not $enrolled) {
        Write-Log "WARNING: Sense service not detected after $maxAttempts attempts" -Level "WARN"
        Write-Log "This may be normal on first boot - service may take time to initialize"
    }

    # Check for onboarding status
    $onboardingStatus = Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows Advanced Threat Protection" -Name "OnboardingInfo" -ErrorAction SilentlyContinue
    if ($onboardingStatus) {
        Write-Log "Device appears to be onboarded (registry key detected)"
    }

    # Cleanup
    Write-Log "Cleaning up temporary files..."
    Remove-Item -Path $installerPath -Force -ErrorAction SilentlyContinue

    Write-Log "DEPLOYMENT COMPLETED SUCCESSFULLY"
    exit 0

} catch {
    $errorMessage = $_.Exception.Message
    Write-Log "ERROR: $errorMessage" -Level "ERROR"
    Write-Log "Stack Trace: $($_.ScriptStackTrace)" -Level "ERROR"
    exit 1
}
