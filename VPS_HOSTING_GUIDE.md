# Minaret Next.js Web Application - VPS Hosting & Security Hardening Guide

This document details step-by-step instructions for deploying the hardened Next.js web application to a Ubuntu Linux VPS. It covers host-level settings, firewalls, permissions, systemd configuration, Nginx setup, TLS, and automatic backups.

---

## 1. System Users & Directory Permissions

To prevent security compromises from propagating, the Node.js process MUST run as a dedicated, low-privilege service user (`minaret`) instead of `root`.

### Create the Service User & Group
```bash
# Create a system group
sudo groupadd -r minaret

# Create a system user with shell access disabled
sudo useradd -r -g minaret -d /srv/minaret -s /sbin/nologin minaret
```

### Setup Directory Structure & Ownership
Store the application releases in `/srv/minaret`. Shared folders (for uploaded files and dynamic JSON content) should be kept outside the active release directory to allow atomic releases.
```bash
# Create directory structure
sudo mkdir -p /srv/minaret/releases
sudo mkdir -p /srv/minaret/shared/data
sudo mkdir -p /srv/minaret/shared/uploads

# Ensure permissions on shared directories
sudo chown -R minaret:minaret /srv/minaret/shared
sudo chmod 750 /srv/minaret/shared
sudo chmod 700 /srv/minaret/shared/data
sudo chmod 750 /srv/minaret/shared/uploads
```

---

## 2. Environment Variables & Secrets Management

Secrets must be kept outside the application repository. Store them in a secure root-owned environment file.

1. Create the configuration directory:
   ```bash
   sudo mkdir -p /etc/minaret
   sudo touch /etc/minaret/minaret.env
   ```
2. Populate `/etc/minaret/minaret.env` with your production variables:
   ```env
   NODE_ENV=production
   ADMIN_USERNAME=minaret_admin
   ADMIN_PASSWORD_HASH=scrypt:your-salt:your-hash
   ADMIN_SESSION_SECRET=your-secure-random-bytes-hex
   ADMIN_COOKIE_SECURE=true
   ```
3. Lock down file access:
   ```bash
   # Restrict read/write permissions to root only, allowing group read to minaret
   sudo chown root:minaret /etc/minaret/minaret.env
   sudo chmod 640 /etc/minaret/minaret.env
   ```

---

## 3. systemd Service Configuration

Create a systemd unit file at `/etc/systemd/system/minaret.service` to manage the process, auto-restart on failures, and restrict system capabilities.

### Unit File Definition (`/etc/systemd/system/minaret.service`)
```ini
[Unit]
Description=Minaret Next.js Web Application
After=network.target network-online.target
Wants=network-online.target

[Service]
Type=simple
User=minaret
Group=minaret
WorkingDirectory=/srv/minaret/current
Environment=NODE_ENV=production
EnvironmentFile=/etc/minaret/minaret.env
ExecStart=/usr/bin/npm run start -- --hostname 127.0.0.1 --port 3000

# Auto-restart on crashes
Restart=on-failure
RestartSec=5
TimeoutStartSec=60
TimeoutStopSec=30
KillSignal=SIGTERM

# Hardening System Isolation
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true
RestrictSUIDSGID=true
LockPersonality=true
CapabilityBoundingSet=
UMask=0077

# Grant access only to specific writable paths
ReadWritePaths=/srv/minaret/shared/data
ReadWritePaths=/srv/minaret/shared/uploads

[Install]
WantedBy=multi-user.target
```

### Enable & Start Service
```bash
sudo systemctl daemon-reload
sudo systemctl enable minaret
sudo systemctl start minaret

# Check status
sudo systemctl status minaret
```

---

## 4. Firewall Settings (UFW)

Lock down ports using the Uncomplicated Firewall (UFW). Node.js (port 3000) should ONLY listen on `127.0.0.1` and never be publicly exposed.

```bash
# Block all incoming traffic by default, allow outgoing
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow necessary public services
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Verify status
sudo ufw status verbose
```

---

## 5. SSH Configuration Hardening

Update `/etc/ssh/sshd_config` to mitigate SSH brute force and login attacks.

1. Open SSH configuration:
   ```bash
   sudo nano /etc/ssh/sshd_config
   ```
2. Apply the following options:
   ```text
   # Disable root login
   PermitRootLogin no

   # Disable password authentication (use SSH keys instead)
   PasswordAuthentication no
   PubkeyAuthentication yes

   # Limit max authentication attempts
   MaxAuthTries 3

   # Enable SSH Protocol 2
   Protocol 2
   ```
3. Restart SSH daemon:
   ```bash
   sudo systemctl restart sshd
   ```

---

## 6. Nginx Reverse Proxy Configuration

Install Nginx to act as the web server, proxy requests to Next.js on port 3000, enforce TLS, add HTTP security headers, and throttle login/contact API paths.

### Install Nginx
```bash
sudo apt update
sudo apt install nginx -y
```

### Server Configuration File (`/etc/nginx/sites-available/minaret`)
Create the configuration file:
```nginx
# Rate limiting zones
limit_req_zone $binary_remote_addr zone=admin_login:10m rate=5r/m;
limit_req_zone $binary_remote_addr zone=contact_submit:10m rate=3r/m;

# HTTP Redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name minaretrealstate.com www.minaretrealstate.com;

    return 301 https://minaretrealstate.com$request_uri;
}

# HTTPS Server Block
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name minaretrealstate.com;

    # SSL parameters (will be managed by Certbot, baseline recommendations below)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';

    # Dynamic Upload size limits
    client_max_body_size 10m;

    # Security Headers
    server_tokens off;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    
    # CSP Baseline Report-Only Mode (Adjust script/style nonces as necessary)
    add_header Content-Security-Policy-Report-Only "default-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; upgrade-insecure-requests" always;

    # Static uploads security configuration
    location ^~ /uploads/ {
        add_header X-Content-Type-Options "nosniff" always;
        add_header Content-Security-Policy "default-src 'none'; img-src 'self'" always;
        alias /srv/minaret/shared/uploads/;
        try_files $uri =404;
    }

    # Throttled Admin Login API
    location = /api/admin/login {
        limit_req zone=admin_login burst=5 nodelay;
        proxy_pass http://127.0.0.1:3000;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Throttled Contact Submission API
    location = /api/contact {
        limit_req zone=contact_submit burst=3 nodelay;
        proxy_pass http://127.0.0.1:3000;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Default Next.js App Proxy
    location / {
        proxy_pass http://127.0.0.1:3000;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the configuration link and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/minaret /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 7. Let's Encrypt TLS Certificate Setup

Generate free, automatically renewing certificates using Certbot.

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Generate and configure SSL inside Nginx automatically
sudo certbot --nginx -d minaretrealstate.com
```

Confirm automatic renewal is enabled:
```bash
sudo systemctl status certbot.timer
```

---

## 8. Backup & Logging Strategy

### Automatic Backups
Dynamic contents (`/srv/minaret/shared/data/content.json` and contact submissions `/srv/minaret/shared/data/messages.json`) as well as uploads should be backed up nightly.

Create a root script `/usr/local/bin/minaret-backup.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/minaret"
DATE=$(date +\%F)

mkdir -p "$BACKUP_DIR"
tar -czf "$BACKUP_DIR/minaret-shared-backup-$DATE.tar.gz" -C /srv/minaret/shared .

# Keep only the last 30 backups
find "$BACKUP_DIR" -name "minaret-shared-backup-*" -mtime +30 -exec rm {} \;
```
Make it executable and assign a daily cron entry:
```bash
sudo chmod 700 /usr/local/bin/minaret-backup.sh
# Add to crontab via: sudo crontab -e
# 0 2 * * * /usr/local/bin/minaret-backup.sh
```

---

## 9. Deployment Script Baseline

An automated git-based deployment script reduces errors during updates. Ensure your active build commands are executed safely:

```bash
#!/bin/bash
set -e

# Target directory definitions
RELEASE_DIR="/srv/minaret/releases/$(date +%Y%m%d%H%M%S)"
SHARED_DIR="/srv/minaret/shared"
CURRENT_LINK="/srv/minaret/current"

# 1. Clone/checkout code into release directory
git clone git@github.com:your-user/minaret-website.git "$RELEASE_DIR"

# 2. Install dependencies & build
cd "$RELEASE_DIR"
npm install --omit=dev
npm run build

# 3. Symlink shared directories (data & uploads)
rm -rf "$RELEASE_DIR/data"
ln -s "$SHARED_DIR/data" "$RELEASE_DIR/data"

rm -rf "$RELEASE_DIR/public/uploads"
ln -s "$SHARED_DIR/uploads" "$RELEASE_DIR/public/uploads"

# 4. Atomic symlink replacement to deploy
ln -sfn "$RELEASE_DIR" "$CURRENT_LINK"

# 5. Restart application daemon
sudo systemctl restart minaret
```
