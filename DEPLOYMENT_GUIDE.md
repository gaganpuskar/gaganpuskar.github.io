# Deployment Guide - Revolt Bike Price Search

Complete step-by-step guide to deploy your application.

## Overview

This application uses:
- **Frontend:** GitHub Pages + GitHub Actions (Auto-deploy)
- **Backend:** Render.com (Free tier)
- **Domain:** gaganpuskar.me (Custom domain)

## Frontend Deployment (GitHub Pages)

### ✅ Already Configured

GitHub Actions workflow automatically builds and deploys your React app to GitHub Pages:

**File:** `.github/workflows/deploy.yml`

**How it works:**
1. Push code to `main` branch
2. GitHub Actions automatically triggers
3. Builds React app (`npm run build`)
4. Deploys to GitHub Pages
5. CNAME record updates to `gaganpuskar.me`

### Manual Trigger (if needed)

Go to GitHub repo → Actions → Deploy to GitHub Pages → Run workflow

### Verify Deployment

1. Check workflow status in GitHub: 
   - Go to: https://github.com/gaganpuskar/gaganpuskar.github.io/actions
   - Look for green checkmark ✅

2. Visit your site:
   - https://gaganpuskar.me

---

## Backend Deployment (Render.com)

### Step 1: Create Free Account

1. Go to [render.com](https://render.com)
2. Click "Get Started"
3. Sign up with GitHub account
4. Authorize Render to access your repositories

### Step 2: Create New Web Service

1. Dashboard → "New +"  → "Web Service"
2. Select repository: `gaganpuskar.github.io`
3. Click "Connect"

### Step 3: Configure Service

Fill in the following:

| Field | Value |
|-------|-------|
| **Name** | `revolt-backend` |
| **Environment** | `Node` |
| **Build Command** | `cd server && npm install` |
| **Start Command** | `cd server && npm start` |
| **Plan** | `Free` (recommended) |

### Step 4: Environment Variables (Optional)

Click "Advanced" → "Add Environment Variable"

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |

### Step 5: Deploy

Click "Create Web Service"

Render will:
- Build your app (2-5 minutes)
- Deploy to production
- Give you a URL like: `https://revolt-backend.onrender.com`

### Monitor Deployment

- Go to service dashboard
- Scroll down to see live logs
- Once deployed, status shows "Live"

---

## Update Frontend with Backend URL

After backend is deployed:

### Option 1: Update Environment Variable

1. Edit `client/.env.production`:
   ```
   REACT_APP_API_URL=https://revolt-backend.onrender.com
   ```

2. Commit and push:
   ```bash
   git add client/.env.production
   git commit -m "Update backend API URL"
   git push origin main
   ```

3. GitHub Actions will rebuild and deploy automatically

### Option 2: Verify Automatic Update

The URL is already set in `.env.production`:
```
REACT_APP_API_URL=https://revolt-backend.onrender.com
```

If you used a different Render service name, update the URL above.

---

## Testing Your Deployment

### Terminal 1: Start Local Backend (or use Render)

```bash
cd server
npm start
```

### Terminal 2: Test Frontend

```bash
cd client
npm start
```

Or visit: https://gaganpuskar.me (if deployed)

### Test Search

1. Search for a hub name like "Revolt Hub Anna Nagar"
2. Should get results with all pricing details
3. If error, check:
   - Backend URL in `.env.production`
   - CORS enabled in backend (`server/index.js`)
   - Excel file exists at `data/bikes.xlsx`

---

## Troubleshooting

### Frontend Shows 404

**Solution:**
1. Check GitHub Pages settings in repository
2. Go to: Settings → Pages → Source
3. Should be set to deploy from `gh-pages` branch
4. Delete `.nojekyll` file if git history is corrupted

### Search Returns Error

**Check:**
1. Is backend running? 
   - Visit: `https://revolt-backend.onrender.com/api/hubs`
   - Should return list of hubs as JSON

2. Check browser console (F12) for API URL

3. Verify CORS is enabled in `server/index.js`:
   ```js
   app.use(cors()); // Should be present
   ```

### Excel File Not Found

**Check:**
1. File exists: `data/bikes.xlsx`
2. File format: `.xlsx` (not `.xls` or `.csv`)
3. Check server logs for exact error path

---

## Daily Operations

### Update Bike Prices

1. Edit `data/bikes.xlsx`
2. Save and close
3. Commit changes:
   ```bash
   git add data/bikes.xlsx
   git commit -m "Update bike prices"
   git push origin main
   ```

4. Wait for GitHub Actions to deploy (2-3 minutes)
5. Backend will automatically reload the new data

### Monitor Deployment

- **Frontend:** https://github.com/gaganpuskar/gaganpuskar.github.io/actions
- **Backend:** Render.com dashboard

### View Logs

**Frontend:**
- GitHub Actions → Workflow run

**Backend:**
- Render dashboard → Service → Logs

---

## Performance Tips

### Frontend
- Cache is automatically managed by GitHub Pages
- Clear browser cache (Ctrl+Shift+Delete) if needed

### Backend
- Free tier on Render: Spins down after 15 min of inactivity
- First request may take 30 seconds
- To avoid spindown, upgrade to paid plan (~$7/month)

---

## Advanced: Custom Domain Setup

Your domain `gaganpuskar.me` is already connected!

**Verification:**
1. GitHub Settings → Pages
2. Check "Custom domain" field shows: `gaganpuskar.me`
3. Nameservers should point to GitHub's servers

If issues, verify DNS:
```bash
nslookup gaganpuskar.me
# Should resolve to GitHub Pages IP
```

---

## Security Notes

- ✅ CORS is enabled for all origins (development setting)
- ⚠️  For production: Restrict CORS to your domain only
  
  Edit `server/index.js`:
  ```js
  const corsOptions = {
    origin: ['https://gaganpuskar.me', 'https://revolt-backend.onrender.com']
  };
  app.use(cors(corsOptions));
  ```

---

## Support & Resources

- **GitHub:** https://github.com/gaganpuskar/gaganpuskar.github.io
- **Render Docs:** https://render.com/docs
- **React Docs:** https://react.dev
- **Express Docs:** https://expressjs.com

---

Last Updated: March 2026
