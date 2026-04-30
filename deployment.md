# Local Logic IT Deployment Guide

This file is for AI agents running on this Windows host who need to edit the site and deploy to GitHub + production.

## Canonical paths
- Repo root: `C:\Users\DESKTOP\Desktop\LocalLogic\Local Logic IT\locallogic-it-website`
- Branch to deploy: `main`
- GitHub remote: `git@github.com:chrisfitzwilliam/locallogic-it-website.git`

## Keys and auth locations

### 1) GitHub push key (this Windows host)
- SSH config: `C:\Users\DESKTOP\.ssh\config`
- GitHub host block uses: `IdentityFile ~/.ssh/id_ed25519`
- Private key path: `C:\Users\DESKTOP\.ssh\id_ed25519`
- Public key path: `C:\Users\DESKTOP\.ssh\id_ed25519.pub`
- Fingerprint (current): `SHA256:BRDyGSvqsPveti/hbgiWcTNzzOJw7gv7sKMRGg0phFw`

### 2) VM admin SSH key (for production checks/remediation)
- Private key path: `C:\Users\DESKTOP\.ssh\google_compute_engine`
- VM SSH user: `DESKTOP`
- Current working VM IP: `130.211.118.230`

Note: `Host fitz` in `C:\Users\DESKTOP\.ssh\config` still points to old IP `34.172.117.25` and times out unless updated.

### 3) VM deploy key (stored on server)
- Used by systemd auto-pull service as `deploy` user.
- SSH config on VM: `/home/deploy/.ssh/config`
- GitHub alias there: `github-locallogic`
- Key path on VM: `/home/deploy/.ssh/locallogic_pull_ed25519`

## Edit + push workflow (from this host)

Run from repo root:

```powershell
cd "C:\Users\DESKTOP\Desktop\LocalLogic\Local Logic IT\locallogic-it-website"
```

1. Make edits.
2. Optional quick local preview:
```powershell
python -m http.server 8080
```
3. Stage intended files only:
```powershell
git add <file1> <file2>
```
4. Validate staged patch:
```powershell
git diff --cached --check
```
5. Commit:
```powershell
git commit -m "<clear change summary>"
```
6. Push to production branch:
```powershell
git push origin main
```

## Production deploy model
- Production VM uses systemd timer:
  - Timer: `locallogic-autodeploy.timer` (every 1 minute)
  - Service: `locallogic-autodeploy.service`
- Service runs:
  - `git pull --ff-only origin main`
  - Working directory: `/var/www/locallogic/current`

## Verify deploy after push

```powershell
# Live HTTP check
curl.exe -sSI https://locallogicit.com

# VM timer/service health
ssh -i C:\Users\DESKTOP\.ssh\google_compute_engine DESKTOP@130.211.118.230 "systemctl status locallogic-autodeploy.timer --no-pager -l | sed -n '1,12p'; echo '---'; systemctl status locallogic-autodeploy.service --no-pager -l | sed -n '1,20p'"
```

## Current known issue (must be handled)
As of `2026-04-30 00:39 UTC`, auto-deploy service is failing because `/var/www/locallogic/current` has local modified files, so fast-forward pull is blocked.

Check current state:
```powershell
ssh -i C:\Users\DESKTOP\.ssh\google_compute_engine DESKTOP@130.211.118.230 "sudo -u deploy git -C /var/www/locallogic/current status --short"
```

Safe recovery pattern (preserve before cleaning):
```powershell
ssh -i C:\Users\DESKTOP\.ssh\google_compute_engine DESKTOP@130.211.118.230 "sudo -u deploy git -C /var/www/locallogic/current stash push -u -m 'autodeploy-unblock-2026-04-30'; sudo -u deploy git -C /var/www/locallogic/current pull --ff-only origin main; sudo systemctl start locallogic-autodeploy.service"
```

If stash is not desired, inspect first and use an explicit reset only with operator approval.

## Quick auth checks
```powershell
# GitHub SSH auth from this host
ssh -T git@github.com

# Confirm repo remote + branch
git -C "C:\Users\DESKTOP\Desktop\LocalLogic\Local Logic IT\locallogic-it-website" remote -v
git -C "C:\Users\DESKTOP\Desktop\LocalLogic\Local Logic IT\locallogic-it-website" branch --show-current
```
