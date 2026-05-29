# Deployment Guide — Masande / Trips Management

Step-by-step guide to deploy the backend (Spring Boot), frontend (Vue 2), MySQL, and Twilio WhatsApp integration.

For production security settings and env variable reference, see [PRODUCTION.md](PRODUCTION.md).

---

## Architecture

```
┌─────────────┐     HTTPS      ┌──────────────────┐     JDBC      ┌─────────┐
│  Vue.js UI  │ ──────────────►│  Spring Boot API │──────────────►│  MySQL  │
│  (static)   │   REST + JWT   │  (port 8080)     │               │         │
└─────────────┘                └────────┬─────────┘               └─────────┘
                                        │
                                        │ HTTPS webhook
                                        ▼
                               ┌──────────────────┐
                               │  Twilio WhatsApp │
                               └──────────────────┘
```

| Component | Path | Default port |
|-----------|------|--------------|
| Backend | `Back end/` | 8080 |
| Frontend | `Front end/` | 8081 (dev) |
| Webhook | `POST /api/whatsapp/webhook` | same as API |

**Repositories**

| Repo | GitHub (example) |
|------|------------------|
| Monorepo (frontend + submodule pointer) | `pbhaninaa/Masande` |
| Backend (submodule) | `pbhaninaa/TripManagement` |

---

## Prerequisites

- **Java 17+** and Maven (or use `./mvnw` in `Back end/`)
- **Node.js 18+** and npm (for frontend build)
- **MySQL 8.0+** (managed or self-hosted)
- **Twilio account** with WhatsApp Sandbox or approved WhatsApp sender
- **HTTPS** public URL for the API (required for Twilio webhooks)

---

## 1. Database setup

Create database and user (example):

```sql
CREATE DATABASE triploan_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'trips_user'@'%' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON triploan_db.* TO 'trips_user'@'%';
FLUSH PRIVILEGES;
```

**Production:** use `ddl-auto=validate` (set via `prod` profile). Schema must already match JPA entities. Do not use `create` in production.

**First deploy tip:** run once locally with `SPRING_PROFILES_ACTIVE=local` and `DDL_AUTO=update` against a staging DB to create tables, then switch production to `validate`.

---

## 2. Backend deployment

### 2.1 Build JAR

```bash
cd "Back end"
./mvnw clean package -DskipTests
```

Artifact: `target/TripsManagement-0.0.1-SNAPSHOT.jar`

### 2.2 Configure environment

Copy template and fill values:

```bash
cp .env.example .env
# Edit .env — never commit .env
```

**Minimum production variables:**

```bash
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:mysql://YOUR_HOST:3306/triploan_db?useSSL=true&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=trips_user
SPRING_DATASOURCE_PASSWORD=your_strong_password
JWT_SECRET=at_least_32_random_characters_here
CORS_ALLOWED_ORIGINS=https://app.yourdomain.com
TWILIO_ENABLED=true
TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
WEBHOOK_PUBLIC_BASE_URL=https://api.yourdomain.com
SCHEDULING_ENABLED=true
```

Load env when starting (Linux example):

```bash
export $(grep -v '^#' .env | xargs)
java -jar target/TripsManagement-0.0.1-SNAPSHOT.jar
```

Windows PowerShell:

```powershell
Get-Content .env | ForEach-Object {
  if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
    [Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim(), 'Process')
  }
}
java -jar target\TripsManagement-0.0.1-SNAPSHOT.jar
```

### 2.3 Run as a service (Linux systemd example)

`/etc/systemd/system/trips-api.service`:

```ini
[Unit]
Description=Trips Management API
After=network.target mysql.service

[Service]
User=trips
WorkingDirectory=/opt/trips-management/Back end
EnvironmentFile=/opt/trips-management/Back end/.env
ExecStart=/usr/bin/java -jar /opt/trips-management/Back end/target/TripsManagement-0.0.1-SNAPSHOT.jar
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable trips-api
sudo systemctl start trips-api
sudo systemctl status trips-api
```

### 2.4 Reverse proxy (Nginx)

Expose HTTPS and forward to Spring Boot:

```nginx
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Health check:

```bash
curl https://api.yourdomain.com/actuator/health
```

### 2.5 Deploy to Railway / Render / similar

1. Connect repo `TripManagement` (backend).
2. Set **build command:** `./mvnw -DskipTests package`
3. Set **start command:** `java -jar target/TripsManagement-0.0.1-SNAPSHOT.jar`
4. Add all env vars from `Back end/.env.example`.
5. Attach **MySQL** plugin or external database URL.
6. Set `SPRING_PROFILES_ACTIVE=prod`.
7. Note public URL → set `WEBHOOK_PUBLIC_BASE_URL` to that URL (no trailing slash).

---

## 3. Frontend deployment

### 3.1 Build for production

```bash
cd "Front end"
npm ci
```

Create `.env.production` (or set in CI):

```bash
VUE_APP_API_URL=https://api.yourdomain.com
```

Build:

```bash
# Linux / macOS
VUE_APP_API_URL=https://api.yourdomain.com npm run build

# Windows PowerShell
$env:VUE_APP_API_URL="https://api.yourdomain.com"; npm run build
```

Output: `Front end/dist/`

### 3.2 Host static files

**Option A — Nginx**

```nginx
server {
    listen 443 ssl http2;
    server_name app.yourdomain.com;

    root /var/www/trips-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Option B — Netlify / Vercel / Azure Static Web Apps**

- Build command: `npm run build`
- Publish directory: `dist`
- Environment: `VUE_APP_API_URL=https://api.yourdomain.com`

Ensure `CORS_ALLOWED_ORIGINS` on the backend includes your frontend URL exactly (scheme + host + port if non-default).

---

## 4. Twilio WhatsApp setup

### 4.1 Sandbox (testing)

1. Twilio Console → **Messaging** → **Try it out** → **Send a WhatsApp message**.
2. Join sandbox from the client phone (send join code to sandbox number).
3. **Sandbox settings** → **When a message comes in**:

   ```
   https://api.yourdomain.com/api/whatsapp/webhook
   ```

   Method: **POST**

4. Set backend env:
   - `TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886` (sandbox number)
   - `WEBHOOK_PUBLIC_BASE_URL=https://api.yourdomain.com`

### 4.2 Production WhatsApp

Use an approved WhatsApp Business sender (not sandbox). Update `TWILIO_WHATSAPP_NUMBER` to the approved sender.

Webhook URL stays: `{WEBHOOK_PUBLIC_BASE_URL}/api/whatsapp/webhook`

With `SPRING_PROFILES_ACTIVE=prod`, Twilio request signatures are validated — `WEBHOOK_PUBLIC_BASE_URL` must match the URL configured in Twilio exactly.

### 4.3 Local development with tunnel

Twilio cannot reach `localhost`. Use a tunnel:

```bash
npx localtunnel --port 8080
```

Set Twilio webhook to: `https://<tunnel-host>/api/whatsapp/webhook`

Use profile `local` so signature validation is off:

```bash
SPRING_PROFILES_ACTIVE=local
```

---

## 5. First platform admin (production)

Production does **not** create a default admin with a known password.

**Option A — one-time bootstrap (staging only, then disable)**

```bash
BOOTSTRAP_ADMIN_ENABLED=true
PLATFORM_ADMIN_EMAIL=admin@yourdomain.com
PLATFORM_ADMIN_PASSWORD=generate_a_strong_password
SPRING_PROFILES_ACTIVE=local
```

Start app once, verify login, then disable bootstrap and deploy to prod without these vars.

**Option B — create tenant via API** after seeding a platform admin through a secure internal process.

---

## 6. Post-deployment checklist

### Platform

- [ ] `GET /actuator/health` returns `UP`
- [ ] Login as platform admin works
- [ ] Swagger is **not** exposed in prod (`/swagger-ui.html` should be disabled)

### Per tenant

- [ ] Create tenant + tenant admin user
- [ ] Tenant settings: enable `offers_lifts` / `offers_loans` as needed
- [ ] Create at least one **active route** (pickup times, active days)
- [ ] Register clients with E.164 phones (`+27...`)
- [ ] Set loan limits if using loans
- [ ] Set **invoice day of month** for automated invoices

### WhatsApp

- [ ] Outbound test message (notification API or scheduled job)
- [ ] Client replies `HI` → receives main menu
- [ ] Test `LOAN`, lift options (`1`–`4`), `INVOICE`
- [ ] Webhook logs show `Received WhatsApp message` on the server

### Scheduled jobs

Confirm `SCHEDULING_ENABLED=true` and server timezone is correct (SAST = `Africa/Johannesburg`):

| Job | Default schedule |
|-----|------------------|
| Morning lift | Mon–Fri 06:30 |
| Afternoon lift | Mon–Fri 16:30 |
| Invoices | Daily 01:00 (runs for tenants whose invoice day matches) |

---

## 7. CI/CD (optional)

### Backend

```yaml
# Example GitHub Actions snippet
- name: Build backend
  run: cd "Back end" && ./mvnw -B test package
- name: Deploy JAR
  # Upload artifact or deploy to your host
```

### Frontend

```yaml
- name: Build frontend
  env:
    VUE_APP_API_URL: https://api.yourdomain.com
  run: |
    cd "Front end"
    npm ci
    npm run build
```

---

## 8. Troubleshooting

| Issue | Likely cause | Fix |
|-------|----------------|-----|
| API starts then exits in prod | Missing `JWT_SECRET` or DB password | Check logs; set required env vars |
| `Access denied` for MySQL | Wrong credentials / host | Verify `SPRING_DATASOURCE_*`, firewall, user grants |
| Frontend 401 on all calls | Wrong API URL or expired token | Set `VUE_APP_API_URL`; clear `localStorage` |
| CORS errors | Frontend origin not allowed | Add exact URL to `CORS_ALLOWED_ORIGINS` |
| WhatsApp sends but no reply | Webhook URL wrong or tunnel offline | Fix Twilio webhook; keep tunnel/API public |
| `Invalid signature` on webhook | `WEBHOOK_PUBLIC_BASE_URL` mismatch | Must match Twilio URL exactly (https, no trailing slash) |
| `No active lift route` | No route for tenant | Create active route in admin UI |
| `Tenant does not offer loan services` | Loans disabled in tenant settings | Enable loans in tenant settings |
| Scheduled messages not sent | Scheduling disabled or no routes/clients | `SCHEDULING_ENABLED=true`; add routes + active clients |

### Logs

```bash
# systemd
journalctl -u trips-api -f

# direct run
java -jar target/TripsManagement-0.0.1-SNAPSHOT.jar --debug
```

---

## 9. Related docs

| Document | Purpose |
|----------|---------|
| [PRODUCTION.md](PRODUCTION.md) | Security, profiles, env reference |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Local dev setup |
| [Back end/.env.example](Back%20end/.env.example) | Backend env template |
| [Front end/.env.example](Front%20end/.env.example) | Frontend env template |
| [MULTI_TENANT_GUIDE.md](MULTI_TENANT_GUIDE.md) | Multi-tenant concepts |

---

## 10. Quick deploy summary

```bash
# 1. Database ready (MySQL)
# 2. Backend
cd "Back end"
cp .env.example .env   # fill in values
./mvnw clean package -DskipTests
# set SPRING_PROFILES_ACTIVE=prod and run JAR behind HTTPS

# 3. Frontend
cd "Front end"
VUE_APP_API_URL=https://api.yourdomain.com npm run build
# serve dist/ on https://app.yourdomain.com

# 4. Twilio
# Webhook → https://api.yourdomain.com/api/whatsapp/webhook

# 5. Smoke test
curl https://api.yourdomain.com/actuator/health
```
