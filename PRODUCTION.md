# Production deployment guide

> **Step-by-step deploy:** see [DEPLOYMENT.md](DEPLOYMENT.md) for build commands, Nginx, Railway, Twilio webhook, and troubleshooting.

## 1. Profiles

| Profile | Use |
|---------|-----|
| `local` | Development (schema update, Swagger on, webhook signature off) |
| `prod` | Production (schema validate, Swagger off, webhook signature on) |

Set on the server:

```bash
SPRING_PROFILES_ACTIVE=prod
```

## 2. Required environment variables (backend)

| Variable | Description |
|----------|-------------|
| `SPRING_DATASOURCE_URL` | MySQL JDBC URL (use SSL in prod) |
| `SPRING_DATASOURCE_USERNAME` | DB user |
| `SPRING_DATASOURCE_PASSWORD` | DB password |
| `JWT_SECRET` | Min 32 characters; used for API auth tokens |
| `CORS_ALLOWED_ORIGINS` | Comma-separated frontend URL(s) |

### WhatsApp (Twilio)

| Variable | Description |
|----------|-------------|
| `TWILIO_ENABLED` | `true` to send/receive WhatsApp |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token |
| `TWILIO_WHATSAPP_NUMBER` | e.g. `whatsapp:+14155238886` (sandbox) or approved sender |
| `WEBHOOK_PUBLIC_BASE_URL` | Public API base URL, no trailing slash (e.g. `https://api.yourdomain.com`) |
| `TWILIO_VALIDATE_WEBHOOK_SIGNATURE` | `true` in prod (enforced by `prod` profile) |

**Twilio Sandbox webhook:**  
`POST {WEBHOOK_PUBLIC_BASE_URL}/api/whatsapp/webhook`

Use a stable HTTPS URL (deployed API or tunnel). LocalTunnel/ngrok URLs change when restarted.

## 3. Database

- Production uses `spring.jpa.hibernate.ddl-auto=validate` (no auto drop/create).
- Run migrations or ensure schema matches entities before first deploy.
- **Never** use `ddl-auto=create` in production.

## 4. First admin user

Production does **not** auto-create users with hardcoded passwords.

Create the platform admin via:

1. One-time local bootstrap with `BOOTSTRAP_ADMIN_ENABLED=true` and `PLATFORM_ADMIN_EMAIL` / `PLATFORM_ADMIN_PASSWORD`, or  
2. Direct DB seed / internal script, or  
3. Register flow if exposed.

## 5. Tenant onboarding checklist

After deploy, for each tenant:

1. Create tenant (platform admin).
2. Enable **tenant settings**: `offers_loans`, `offers_lifts` as needed.
3. Create at least one **active route** (morning/afternoon times, active days).
4. Register **clients** with E.164 phone numbers (`+27...`).
5. Configure **loan limits** if using loans.
6. Set **invoice day of month** in tenant settings for automated invoices.

## 6. Scheduled jobs

Enabled when `SCHEDULING_ENABLED=true` (default):

| Job | Default cron | Purpose |
|-----|----------------|---------|
| Morning lift | `0 30 6 * * MON-FRI` | WhatsApp morning confirmation |
| Afternoon lift | `0 30 16 * * MON-FRI` | WhatsApp afternoon reminder |
| Invoices | `0 0 1 * * *` | Monthly invoice generation per tenant settings |

Override with `MORNING_LIFT_CRON`, `AFTERNOON_LIFT_CRON`, `INVOICE_CRON`.

## 7. Frontend

Build with API URL pointing to production backend:

```bash
cd "Front end"
VUE_APP_API_URL=https://api.yourdomain.com npm run build
```

Serve `dist/` behind HTTPS (Nginx, S3+CloudFront, etc.).

## 8. Health check

```bash
curl https://api.yourdomain.com/actuator/health
```

## 9. Security checklist

- [ ] All secrets in environment variables (not in git)
- [ ] `SPRING_PROFILES_ACTIVE=prod`
- [ ] `JWT_SECRET` rotated and strong
- [ ] Twilio webhook signature validation enabled
- [ ] CORS limited to your frontend domain(s)
- [ ] Swagger disabled in prod
- [ ] MySQL not publicly exposed without firewall
- [ ] HTTPS everywhere (API + frontend + Twilio webhook)

## 10. Smoke test after deploy

1. Login as platform admin.
2. Create tenant + tenant admin.
3. Login as tenant admin → create route + client.
4. Send test WhatsApp from client → verify menu reply.
5. Trigger or wait for invoice job / verify invoice API.

See `Back end/.env.example` and `Front end/.env.example` for variable templates.
