# VPS Hosting Guide & Service Inventory

**Server IP**: `62.171.182.92`  
**Host Name**: `vmi3192470`  
**SSH Access**: `ssh root@62.171.182.92`  
**Base Project Directory**: `/opt/`  
**Primary Reverse Proxy**: Nginx (`systemd` service: `nginx.service`)  

---

## 1. Master Service & Port Inventory

Before adding any new service, check this table to ensure you do not collide with existing host ports.

| Project Name | Path on VPS | Domain / Host URL | Host Ports (Bound) | Internal Ports | Technology / Compose |
|---|---|---|---|---|---|
| **Property Management (PMS)** | `/opt/property-management` | `property.minaretrealstate.com` | `127.0.0.1:3456` (Web)<br>`127.0.0.1:8090` (Gateway API) | `auth:5001`<br>`billing:5004`<br>`admin:5005`<br>`notify:5006`<br>`prop:5011` | Docker Compose (Next.js 16 + .NET 8 Microservices + 4x Postgres + Redis) |
| **Pharmacy Web App** | `/opt/pharmacy-webapp` | Configured in Nginx | `127.0.0.1:3000` (Web)<br>`127.0.0.1:8080` (API) | `5432` (DB)<br>`6379` (Redis)<br>`6432` (PgBouncer) | Docker Compose |
| **Pharmacy Capacity Test** | `/opt/pharmacy-webapp/load-tests` | Internal test | `127.0.0.1:18081` (API) | `5432` (DB)<br>`6379` (Redis) | Docker Compose (`compose.capacity.yml`) |
| **Seafile Cloud Storage** | `/opt/seafile` | Configured in Nginx | `127.0.0.1:8088` (Web) | `3306` (MySQL)<br>`6379` (Redis) | Docker Compose (`seafile-server.yml`) |
| **EnjazAssist** | `/opt/EnjazAssist` | Port 89 direct | `0.0.0.0:89` (Web) | `8080` (API)<br>`5432` (DB) | Docker Compose |
| **Minaret Website** | `/opt/minaret-website` | `minaretrealstate.com` | `127.0.0.1:3460` (Web) | `3000` | Docker Compose (Next.js 15) |
| **System Services** | OS Level | All interfaces | `22` (SSH)<br>`80` (HTTP)<br>`443` (HTTPS)<br>`8443` (Alt HTTPS)<br>`53` (DNS resolver) | — | OpenSSH, Nginx, systemd-resolved |

---

## 2. The 3 VPS Checks (Run Before Hosting ANY New Project)

Whenever you are about to host a new project on this VPS, run these 3 checks:

### Check 1: Find Active & Free Host Ports
Run this command to check every port currently listening on the server:
```bash
sudo ss -tulpn | grep LISTEN
```
* **What to look for**: Check the `Local Address:Port` column (e.g., `127.0.0.1:8080`, `0.0.0.0:89`).
* **Rule**: Pick a port number not listed in this output (e.g., in the `3000–3999` range for frontends or `8000–8999` for APIs).

---

### Check 2: Audit Running Docker Stacks & Containers
Run these two commands to inspect all active Docker projects and their published ports:
```bash
# List all active Docker Compose project stacks
docker compose ls

# List every running container with its mapped ports
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```
* **What to look for**:
  1. The `CONFIG FILES` column shows the directory where the project's compose file lives (under `/opt/`).
  2. The `PORTS` column shows if a container is binding `127.0.0.1:<PORT>` or `0.0.0.0:<PORT>`.
* **Rule**: Never use a container name or host port that already exists.

---

### Check 3: Check Nginx Reverse Proxy Configs & Domains
Check which domains are already configured and where they are forwarding traffic:
```bash
# Print all configured server names and their proxy targets
sudo nginx -T 2>/dev/null | grep -E "server_name|listen|proxy_pass"
```
Or list existing Nginx site configuration files:
```bash
ls -la /etc/nginx/sites-enabled/
```
* **What to look for**:
  1. Make sure your new domain/subdomain isn't already used in another `.conf` file.
  2. Confirm which internal port (`127.0.0.1:XXXX`) each existing site routes to.

---

## 3. All-in-One 1-Second Audit Script

You can copy and paste this single command block into your VPS SSH terminal anytime to get an instant audit report:

```bash
echo "==================== [1] ACTIVE LISTENING PORTS ===================="
sudo ss -tulpn | grep LISTEN | awk '{print $1, $5, $7}' | column -t

echo -e "\n==================== [2] ACTIVE DOCKER STACKS ======================"
docker compose ls 2>/dev/null || echo "No compose stacks found."

echo -e "\n==================== [3] DOCKER CONTAINERS & PORTS ================="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo -e "\n==================== [4] NGINX DOMAINS & PROXIES ==================="
sudo nginx -T 2>/dev/null | grep -E "server_name|proxy_pass" | grep -v "#" | sed 's/^[ \t]*//' | sort -u
echo "===================================================================="
```

---

## 4. Standard 6-Step Workflow to Deploy Any New Project

Follow this exact process to deploy future projects cleanly:

### Step 1: Run the 3 Checks & Choose Free Ports
Run the audit script above. Pick free host ports (e.g., `WEB_PORT=3460`, `API_PORT=8095`).

### Step 2: Set Up Directory Under `/opt/`
```bash
cd /opt
git clone <YOUR_REPO_URL> <project-name>
cd /opt/<project-name>
```

### Step 3: Configure `.env`
Set the chosen free ports and production secrets in `.env`:
```bash
nano .env
```
*(Ensure all database passwords, JWT keys, and host port bindings use your chosen values)*.

### Step 4: Add DNS `A` Record
At your domain registrar / Cloudflare:
* **Type**: `A`
* **Name**: `<subdomain>`
* **Points to**: `62.171.182.92`
* **TTL**: Auto / 5 min

Verify resolution from your VPS:
```bash
ping <subdomain>.yourdomain.com
```

### Step 5: Create Nginx Site Configuration
Create `/etc/nginx/sites-available/<subdomain>.yourdomain.com.conf`:
```nginx
server {
    listen 80;
    server_name <subdomain>.yourdomain.com;
    client_max_body_size 30M;

    location / {
        proxy_pass http://127.0.0.1:<CHOSEN_PORT>;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site, test Nginx, and issue SSL:
```bash
sudo ln -s /etc/nginx/sites-available/<subdomain>.yourdomain.com.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d <subdomain>.yourdomain.com
```

### Step 6: Start Containers & Update This Registry
```bash
docker compose up -d --build
docker compose ps
```
Finally, add the new project's name and ports to the **Master Service & Port Inventory** table at the top of this document!
