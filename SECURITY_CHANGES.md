# SECURITY_CHANGES.md

## Purpose
This is the authoritative change ledger for security and security-adjacent hardening work performed during the `locallogicit.com` audit.
Use this file to troubleshoot regressions by comparing:
1. Origin (pre-remediation) state,
2. Audit-close target state (`R001` through `R020`),
3. Current live snapshot.

## Scope and Definitions
- Audit root: `C:\Users\DESKTOP\audits\locallogic-2026-04-28-1851`
- Origin baseline window: phase 0-3 reconnaissance artifacts (pre-remediation)
- Remediation window: `R001` through `R020`
- Audit close state: `phase10_finalized_r020_owner_exception_accepted`
- Current live recheck used in this file: `2026-04-29 22:00:43 -05:00`

## High-Level Outcome
- Total initial findings: 16
- Audit-close status: 13 closed/mitigated, 3 accepted exceptions, 0 open
- Post-audit drift detected: yes (sudo scope widened again via `google-sudoers` group membership)

## Change Ledger (Origin -> Audit Close -> Current Live)

### R001 - Nginx Security Header Baseline
- Area: Nginx site header hardening
- Origin:
  - No shared security header snippet included in active TLS vhosts.
- Audit-close target:
  - Added `/etc/nginx/snippets/security-headers.conf`.
  - Included in `/etc/nginx/sites-enabled/locallogicit.com` TLS server blocks.
  - Added headers: HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy.
- Current live:
  - Still present and active.
- Evidence:
  - `remediation/R001-web-headers/locallogicit.com.diff`
  - `recon/headers-post-r019.txt`
  - Live recheck: `ssh fitz "sudo cat /etc/nginx/snippets/security-headers.conf"`

### R002 - GCP SSH Firewall Restriction
- Area: GCP firewall rule `default-allow-ssh`
- Origin:
  - `sourceRanges: ["0.0.0.0/0"]`
  - description: `Allow SSH from anywhere`
- Audit-close target:
  - `sourceRanges: ["47.233.57.189/32"]`
  - description: `Allow SSH from current admin IP only`
- Current live:
  - Matches audit-close target.
- Evidence:
  - `gcp/firewall-default-allow-ssh.current.json` (origin)
  - `gcp/firewall-default-allow-ssh.after-r002.json` (target)
  - Live recheck via `gcloud compute firewall-rules describe default-allow-ssh ...`

### R003 - Mail DNS Authentication Revalidation
- Area: DNS mail auth posture
- Origin:
  - Provider transition period; DNS state uncertain during earlier scan.
- Audit-close target:
  - Confirmed Zoho MX + SPF + DMARC present.
- Current live:
  - Not revalidated in this pass (audit records remain source of truth).
- Evidence:
  - `report/remediation-log.md` (`R003` row)
  - `recon/dns-*-refresh-20260429-135213.txt`

### R004 - SSH MAC Hardening
- Area: SSH daemon MAC algorithms
- Origin:
  - Included SHA1 MAC variants (`hmac-sha1`, `hmac-sha1-etm@openssh.com`).
- Audit-close target:
  - Added `/etc/ssh/sshd_config.d/10-hardening-macs.conf`
  - Effective `macs` list excludes SHA1 variants.
- Current live:
  - Matches audit-close target.
- Evidence:
  - `remediation/R004-ssh-macs/sshd-macs.current.txt` (origin)
  - `recon/sshd-macs-post-r004.txt` (target)
  - Live recheck: `ssh fitz "sudo sshd -T | grep '^macs '"`

### R005 + R019 - CSP Progression (Report-Only -> Enforced)
- Area: Browser content security policy
- Origin:
  - No CSP header in enforcement mode.
- Intermediate (`R005`):
  - Added `Content-Security-Policy-Report-Only`.
- Audit-close target (`R019`):
  - Replaced report-only with enforced `Content-Security-Policy`.
- Current live:
  - Enforced CSP still present.
- Enforced value (current):
  - `default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://unpkg.com https://cdn.lordicon.com https://embed.tawk.to; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https: wss: https://*.tawk.to wss://*.tawk.to; frame-src 'self' https://challenges.cloudflare.com https://*.tawk.to; worker-src 'self' blob:; object-src 'none'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'`
- Evidence:
  - `recon/headers-post-r005.txt`
  - `recon/headers-post-r019.txt`
  - `recon/r019-page-headers-sample.txt`
  - Live recheck: `curl -I https://locallogicit.com/`

### R006 + R010 - Sudo Scope Reduction (and Drift)
- Area: Linux privilege model
- Origin:
  - `/etc/sudoers.d/deployer` existed with `deployer ALL=(ALL) NOPASSWD:ALL`.
  - `google-sudoers` group was broad: `Battlestation,runner,deployer,intelligent-happy-lovelace,deploy,DESKTOP`.
- Intermediate (`R006`):
  - Removed `/etc/sudoers.d/deployer`.
  - Reduced `google-sudoers` to `deploy,DESKTOP`.
- Audit-close target (`R010`):
  - Reduced `google-sudoers` further to `DESKTOP` only.
  - `deploy` retained only narrow fdotnet sudoers commands via `/etc/sudoers.d/deploy-fdotnet`.
- Current live (DRIFT DETECTED):
  - `/etc/sudoers.d/deployer` is still absent (good).
  - `google-sudoers` now broad again: `DESKTOP,intelligent-happy-lovelace,deploy,Battlestation,runner,deployer` (drift).
  - `/etc/sudoers.d/google_sudoers` still grants group-wide `NOPASSWD:ALL`, so `deploy` currently has broad sudo again via group membership.
- Evidence:
  - `remediation/R004-sudo-scope/google-sudoers-group.current`
  - `remediation/R010-sudo-principal-reduction/google-sudoers-group.proposed`
  - `recon/r010-group-post.txt`
  - Live recheck:
    - `ssh fitz "getent group google-sudoers"`
    - `ssh fitz "sudo -l -U deploy"`

### R007 - SSH AllowGroups Enforcement
- Area: SSH login allow-list
- Origin:
  - `AllowGroups` not explicitly enforced in effective sshd output.
- Audit-close target:
  - Added `/etc/ssh/sshd_config.d/20-allowgroups.conf` with `AllowGroups google-sudoers`.
- Current live:
  - Still enforced.
- Evidence:
  - `remediation/R007-ssh-allowgroups/20-allowgroups.conf.proposed`
  - `recon/sshd-allow-post-r007.txt`
  - Live recheck: `ssh fitz "sudo sshd -T | grep '^allowgroups '"`

### R008 - WordPress Fingerprint Suppression
- Area: Nginx path hardening
- Origin:
  - No explicit `wp-config` deny return rule in vhost blocks.
- Audit-close target:
  - Added `location ~* ^/wp-config(?:\.php)?(?:\..*)?$ { return 404; }` to relevant blocks.
- Current live:
  - Rule still present in 3 locations.
- Evidence:
  - `remediation/R008-wp-fingerprint/locallogicit.com.diff`
  - `recon/r008-config-grep.txt`
  - Live recheck: `ssh fitz "sudo grep -n 'wp-config' /etc/nginx/sites-enabled/locallogicit.com"`

### R009 - TLS Protocol Floor
- Area: TLS protocol support
- Origin:
  - `ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;`
- Audit-close target:
  - `ssl_protocols TLSv1.2 TLSv1.3;`
- Current live:
  - Matches audit-close target in both `/etc/nginx/nginx.conf` and Let's Encrypt options file.
- Evidence:
  - `remediation/R009-tls-protocols/nginx.conf.current`
  - `remediation/R009-tls-protocols/nginx.conf.proposed`
  - `recon/r009-ssl-protocols-post.txt`
  - Live recheck: `ssh fitz "grep -n ssl_protocols /etc/nginx/nginx.conf /etc/letsencrypt/options-ssl-nginx.conf"`

### R011 + R012 + R018 - Service Account Key Hardening and WIF Migration
- Area: GCP deploy identity model (`github-deployer` SA)
- Origin:
  - User-managed keys existed (`a10c20...`, `7e6e22...`) plus system-managed key.
- R011:
  - Disabled user-managed key `a10c20...`.
- R012:
  - Deleted disabled key `a10c20...`.
- R018 (audit-close target):
  - Deleted remaining user-managed key `7e6e22...`.
  - Enabled GitHub OIDC Workload Identity Federation:
    - Pool: `github-actions` ACTIVE
    - Provider: `github-oidc` ACTIVE with repo attribute condition
    - SA binding: `roles/iam.workloadIdentityUser` for repo principal set
- Current live:
  - Matches audit-close target: only system-managed key remains.
- Evidence:
  - `gcp/sa-keys-r011-pre.json`
  - `gcp/sa-keys-r011-post-table.txt`
  - `gcp/sa-keys-r018-post-table.txt`
  - `gcp/wif-pool-list-r018.txt`
  - `gcp/wif-provider-r018.json`
  - `gcp/sa-policy-github-deployer-r018.json`
  - Live rechecks via `gcloud iam ...`

### R013 + R020 - Owner Role Disposition
- Area: IAM governance
- Origin:
  - Human principal had `roles/owner`.
- Audit-close target:
  - No IAM mutation by owner decision.
  - Finding disposition moved from Open to Accepted Exception.
- Current live:
  - Treated as accepted governance exception.
- Evidence:
  - `report/remediation-log.md` (`R013`, `R020`)
  - `report/report.md`

### R014 + R015 - VM Scope Reduction and Static Origin IP
- Area: GCP VM service-account scopes and external address lifecycle
- Origin:
  - VM SA scopes included `https://www.googleapis.com/auth/cloud-platform`.
  - External IP was ephemeral (`34.172.117.25`).
- Audit-close target:
  - Scopes reduced to:
    - `https://www.googleapis.com/auth/logging.write`
    - `https://www.googleapis.com/auth/monitoring.write`
  - External IP changed to `130.211.118.230` during restart.
  - IP reserved static as `fitzwilliam-web-1-origin-ip` (`IN_USE`).
- Current live:
  - Matches audit-close target.
- Evidence:
  - `gcp/instance-r014-pre-full.json`
  - `gcp/instance-r014-post.json`
  - `gcp/address-r015-post.json`
  - Live rechecks via `gcloud compute instances describe` and `gcloud compute addresses describe`

### R016 - Cloudflare Edge Ports Exception
- Area: External attack-surface interpretation
- Origin:
  - Cloudflare edge showed alternate HTTP(S) edge ports; concern raised.
- Audit-close target:
  - Marked as accepted exception (provider-edge behavior, not origin listener exposure).
- Current live:
  - Exception remains valid unless Cloudflare architecture/proxy mode changes.
- Evidence:
  - `nmap/r016-origin-selected-ports.nmap`
  - `nmap/r016-cloudflare-edge-selected-ports.nmap`

### R017 - Third-Party Script SRI and URL Pinning
- Area: Supply-chain integrity controls in HTML
- Origin:
  - External scripts without final pinned/SRI rollout across all public pages.
- Audit-close target:
  - Added SRI + `crossorigin` and pinned URLs for:
    - `https://unpkg.com/@phosphor-icons/web@2.1.2/src/index.js`
    - `https://cdn.lordicon.com/lordicon.js`
  - 21 pages with pinned phosphor reference; 2 pages with lordicon script.
- Current live:
  - Still present on sampled live page (`business.html`).
- Evidence:
  - `remediation/R017-sri-external-scripts/sri-external-scripts.diff`
  - `recon/r017-origin-phosphor-count.txt`
  - `recon/r017-origin-lordicon-count.txt`
  - `recon/r017-business-live.html`
  - Live recheck with `curl ... | rg 'integrity='`

## Post-Audit Drift Summary (Important)
- Drift item: `google-sudoers` membership widened again after audit close.
- Impact:
  - Because `/etc/sudoers.d/google_sudoers` grants `%google-sudoers ALL=(ALL:ALL) NOPASSWD:ALL`, any account re-added to that group gets broad sudo.
  - `deploy` currently inherits full sudo again, overriding the intended least-privilege outcome from `R010`.
- Drift status:
  - `google-sudoers` currently: `DESKTOP,intelligent-happy-lovelace,deploy,Battlestation,runner,deployer`
  - `deployer` sudoers file remains deleted (`/etc/sudoers.d/deployer` absent)

## Fast Break/Fix Verification Commands
Run from this host:

```powershell
# Live web headers
curl.exe -sSI https://locallogicit.com/

# Nginx controls
ssh fitz "sudo cat /etc/nginx/snippets/security-headers.conf"
ssh fitz "sudo grep -n 'include /etc/nginx/snippets/security-headers.conf' /etc/nginx/sites-enabled/locallogicit.com"
ssh fitz "sudo grep -n 'wp-config' /etc/nginx/sites-enabled/locallogicit.com"
ssh fitz "sudo grep -n 'ssl_protocols' /etc/nginx/nginx.conf /etc/letsencrypt/options-ssl-nginx.conf"

# SSH daemon controls
ssh fitz "sudo sshd -T | grep -E '^(macs|allowgroups) '"

# Sudo scope (drift-sensitive)
ssh fitz "getent group google-sudoers"
ssh fitz "sudo -l -U deploy"
ssh fitz "[ -f /etc/sudoers.d/deployer ] && echo present || echo absent"

# GCP controls
gcloud compute firewall-rules describe default-allow-ssh --project project-4438e317-49ec-470e-9bd --format=json
gcloud compute instances describe fitzwilliam-web-1 --zone us-central1-a --project project-4438e317-49ec-470e-9bd --format="json(networkInterfaces[0].accessConfigs[0].natIP,serviceAccounts,status)"
gcloud compute addresses describe fitzwilliam-web-1-origin-ip --region us-central1 --project project-4438e317-49ec-470e-9bd --format=json
gcloud iam service-accounts keys list --iam-account github-deployer@project-4438e317-49ec-470e-9bd.iam.gserviceaccount.com --project project-4438e317-49ec-470e-9bd --format="table(name.basename(),keyType,disabled,validAfterTime,validBeforeTime)"
```

## Source-of-Truth Artifacts
- Timeline: `report/remediation-log.md`
- Final disposition: `report/report.md` and `report/master-report.md`
- Snapshot checkpoint: `state.json`
- Remediation diffs: `remediation/R*/`
- Revalidation evidence: `recon/`, `gcp/`, `nmap/`

## Notes for Future Agents
- Treat this file as an operational ledger, not policy intent.
- If live state diverges from audit-close target, append a new drift entry with timestamp and evidence rather than rewriting history.

