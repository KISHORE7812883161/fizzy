# SIMPLE RAILWAY DEPLOYMENT GUIDE

## Step 1: Push Your Code to GitHub
Make sure your code is pushed to a GitHub repository.

---

## Step 2: Create Railway Project

1. Go to **railway.app** and login
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Select your repository

---

## Step 3: Add MySQL Database

1. In your Railway project, click **"New"** (top right)
2. Click **"Database"**
3. Click **"MySQL"**
4. Wait for it to create

---

## Step 4: Deploy Backend (API)

1. Click **"New"** → **"Service"** → **"GitHub Repo"**
2. Select your repository
3. Click the **"Settings"** icon (gear) for this service
4. Under **"Root Directory"**, type: `backend`
5. Go to **"Variables"** tab
6. Add these variables:
   - `MYSQL_USER` = `root`
   - `MYSQL_PASSWORD` = (copy from MySQL service - click "Connect" → "Variables")
   - `MYSQL_HOST` = (copy from MySQL service)
   - `MYSQL_PORT` = `3306`
   - `MYSQL_DB` = `railway`
7. Click **"Deploy"**

---

## Step 5: Deploy Frontend (Website)

1. Click **"New"** → **"Service"** → **"GitHub Repo"**
2. Select your repository
3. Go to **"Variables"** tab
4. Add this variable:
   - `VITE_API_URL` = `https://YOUR-BACKEND-SERVICE-NAME.up.railway.app/api`
   
   (Replace YOUR-BACKEND-SERVICE-NAME with your backend service name from Step 4)
5. Click **"Deploy"**

---

## Step 6: Open Your Website

After deployment completes:
- Click on the frontend service
- Click the **"View"** button (top right)
- Your website is now live!

---

## Troubleshooting

**Problem:** Website shows no data
**Solution:** Make sure `VITE_API_URL` points to your backend URL correctly

**Problem:** Backend won't start
**Solution:** Check MySQL variables are correct

---

## Need Help Finding MySQL Variables?

1. Click on the MySQL service in Railway
2. Click **"Connect"** (top right)
3. Click **"Variables"**
4. Copy the values for `MYSQL_HOST`, `MYSQL_PASSWORD`, etc.
