# Preview Not Showing - Troubleshooting Guide

**Issue:** Preview/Development server not showing in browser

---

## ✅ Quick Fix

### Step 1: Start Development Server

Open a terminal in the project directory and run:

```bash
npm run dev
```

**Expected Output:**
```
▲ Next.js 16.0.8
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in X seconds
```

### Step 2: Open Browser

Once you see "Ready", open your browser and go to:
```
http://localhost:3000
```

---

## 🔍 Common Issues & Solutions

### Issue 1: "Port 3000 already in use"

**Solution:**
- Next.js will automatically use the next available port (3001, 3002, etc.)
- Check the terminal output for the actual port number
- Or kill the process using port 3000:
  ```bash
  # Find the process
  netstat -ano | findstr :3000
  
  # Kill it (replace <PID> with the number from netstat)
  taskkill /PID <PID> /F
  ```

### Issue 2: Blank/White Screen

**Check:**
1. **Browser Console** (Press F12):
   - Look for red error messages
   - Check if JavaScript is loading

2. **Terminal Output**:
   - Look for compilation errors
   - Should see "✓ Compiled successfully"

3. **Hard Refresh**:
   - Press `Ctrl + Shift + R` (Windows)
   - Or `Ctrl + F5`

### Issue 3: "Cannot GET /" or 404 Error

**Solution:**
- Make sure you're using `http://localhost:3000` (not just `localhost`)
- Try `http://127.0.0.1:3000`
- Check terminal for the actual port number

### Issue 4: Server Starts But Page Doesn't Load

**Check:**
1. **Firewall/Antivirus**:
   - Windows Firewall might be blocking localhost
   - Add exception for port 3000

2. **Browser Cache**:
   - Clear browser cache
   - Try incognito/private mode

3. **Different Browser**:
   - Test in Chrome, Firefox, or Edge

---

## 🚀 Alternative Commands

### Start with Turbo (Faster)
```bash
npm run dev:turbo
```

### Start with Watch Mode
```bash
npm run dev:watch
```

### Production Preview
```bash
npm run preview
```
(This builds and runs production version locally)

---

## 📋 Verification Steps

1. **Check Server Status:**
   ```bash
   netstat -ano | findstr :3000
   ```
   Should show a process listening on port 3000

2. **Test Preview Page:**
   Visit: `http://localhost:3000/test-preview`
   Should show "✅ Preview is Working!"

3. **Check Homepage:**
   Visit: `http://localhost:3000`
   Should show InvestingPro homepage

---

## 🔧 Advanced Troubleshooting

### Clear Next.js Cache
```bash
# Delete .next folder
rm -rf .next

# Restart server
npm run dev
```

### Check for Build Errors
```bash
# Try building first
npm run build

# If build fails, fix errors first
# Then start dev server
npm run dev
```

### Check Environment Variables
```bash
# Make sure .env.local exists
# Check if required variables are set
```

---

## 🆘 Still Not Working?

### Check These:

1. **Node.js Version:**
   ```bash
   node --version
   ```
   Should be Node.js 18+ or 20+

2. **Dependencies Installed:**
   ```bash
   npm install
   ```

3. **No Port Conflicts:**
   ```bash
   # Check what's using port 3000
   netstat -ano | findstr :3000
   ```

4. **Windows Firewall:**
   - Go to Windows Defender Firewall
   - Allow Node.js through firewall

5. **Antivirus:**
   - Temporarily disable to test
   - Add project folder to exceptions

---

## ✅ Success Indicators

When preview is working, you should see:

1. **Terminal:**
   ```
   ✓ Ready in X seconds
   ○ Compiling / ...
   ✓ Compiled / in X ms
   ```

2. **Browser:**
   - Homepage loads
   - No console errors (F12)
   - Fast Refresh works (edit a file, see changes)

3. **Test Page:**
   - Visit `/test-preview`
   - Should show "✅ Preview is Working!"

---

## 📞 Quick Commands Reference

```bash
# Start dev server
npm run dev

# Check if running
netstat -ano | findstr :3000

# Kill process on port 3000
taskkill /PID <PID> /F

# Clear cache and restart
rm -rf .next && npm run dev

# Build and preview production
npm run preview
```

---

**Current Status:** Check if dev server is running  
**Next Step:** Run `npm run dev` and wait for "Ready" message

