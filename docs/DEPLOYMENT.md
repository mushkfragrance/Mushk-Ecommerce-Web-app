# Deployment guide — Mushk Fragrance

Target topology:

| Service | Host | Example URL |
|---------|------|-------------|
| Storefront | Vercel | `https://www.mushkfragrance.com` |
| Admin | Vercel (separate project) | `https://admin.mushkfragrance.com` |
| API | Railway | `https://api.mushkfragrance.com` |
| Database | MongoDB Atlas | cluster URI |
| DNS | Hostinger | A / CNAME records |

Do **not** deploy until the owner explicitly approves.

---

## 1. MongoDB Atlas

1. Create a cluster and database user.
2. Network Access: allow Railway egress IPs (or `0.0.0.0/0` only if you accept the risk).
3. Create database `mushk_fragrance` (or let the app create collections).
4. Copy the connection string into Railway as `MONGODB_URI`.

### Seed after first connect

From a machine with the production URI (or Railway one-off shell):

```bash
cd server
# set MONGODB_URI and ADMIN_* in env
npm run seed:admin
# optional demo catalog — skip on a clean production launch
npm run seed:demo
```

---

## 2. Railway (API)

1. New project → Deploy from GitHub (root directory: `server`).
2. Set environment variables from `server/.env.example`:

| Variable | Production notes |
|----------|------------------|
| `NODE_ENV` | `production` |
| `PORT` | Railway sets this; app already reads `process.env.PORT` |
| `MONGODB_URI` | Atlas URI |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Long random strings |
| `COOKIE_SECURE` | `true` |
| `CLIENT_URL` | `https://www.mushkfragrance.com` |
| `ADMIN_URL` | `https://admin.mushkfragrance.com` |
| `CLOUDINARY_*` | Optional until image uploads |
| `SMTP_*` | Optional for email |

3. Generate a public domain, then attach custom domain `api.mushkfragrance.com`.
4. Health check path: `/api/health`.
5. Confirm CORS origins match the live storefront and admin URLs exactly (no trailing slash mismatch).

---

## 3. Vercel — Storefront

1. Import repo → Root Directory: `storefront`.
2. Framework: Vite. Build: `npm run build`. Output: `dist`.
3. Environment:

```text
VITE_API_URL=https://api.mushkfragrance.com/api
VITE_STOREFRONT_URL=https://www.mushkfragrance.com
```

4. `vercel.json` already rewrites SPA routes to `index.html`.
5. Attach domain `www.mushkfragrance.com` (and apex if desired).

---

## 4. Vercel — Admin

1. Separate Vercel project → Root Directory: `admin`.
2. Environment:

```text
VITE_API_URL=https://api.mushkfragrance.com/api
VITE_ADMIN_URL=https://admin.mushkfragrance.com
VITE_STOREFRONT_URL=https://www.mushkfragrance.com
```

3. Attach `admin.mushkfragrance.com`.
4. Confirm cookies work cross-subdomain only if you later share a parent domain cookie strategy; today the admin uses API cookies against `api.*` with CORS credentials — keep API and frontends on HTTPS.

---

## 5. Hostinger DNS

Typical records (replace with Railway/Vercel target values from their dashboards):

| Type | Name | Value | Purpose |
|------|------|-------|---------|
| A / ALIAS | `@` | Vercel apex IP / alias | Apex site |
| CNAME | `www` | `cname.vercel-dns.com` | Storefront |
| CNAME | `admin` | `cname.vercel-dns.com` | Admin |
| CNAME | `api` | Railway domain | API |

Wait for DNS propagation, then verify SSL in Vercel and Railway.

---

## 6. Post-deploy

1. Open `/api/health`.
2. Admin login with seeded owner; change password immediately.
3. Create one real product; confirm it on the storefront.
4. Place one test COD order.
5. Walk through [E2E_CHECKLIST.md](./E2E_CHECKLIST.md).

---

## 7. Rollback notes

- Vercel: promote previous deployment.
- Railway: redeploy prior successful build.
- Atlas: restore from backup snapshot (see [BACKUP.md](./BACKUP.md)).
