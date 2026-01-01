# Preview Guide - Always Available Development Server

## Quick Start

The development server is configured to always be available for preview. Here's how to use it:

### Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000` and automatically reload when you make changes.

### Alternative Commands

- **Standard dev server**: `npm run dev`
- **Turbo mode** (faster): `npm run dev:turbo`
- **Watch mode** (better file watching): `npm run dev:watch`

## Features

✅ **Hot Module Replacement (HMR)** - Changes appear instantly  
✅ **Fast Refresh** - React components update without losing state  
✅ **Error Overlay** - Errors shown directly in browser  
✅ **Auto-reload** - Server restarts on config changes  

## Troubleshooting

### Preview Not Loading?

1. **Check if server is running**:
   ```bash
   # Look for process on port 3000
   netstat -ano | findstr :3000
   ```

2. **Restart the dev server**:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

3. **Clear Next.js cache**:
   ```bash
   rm -rf .next
   npm run dev
   ```

4. **Check for port conflicts**:
   - If port 3000 is busy, Next.js will use 3001, 3002, etc.
   - Check terminal output for actual port

### Common Issues

**Issue**: "Port already in use"
- **Solution**: Kill the process using the port or use a different port:
  ```bash
  npm run dev -- -p 3001
  ```

**Issue**: Changes not reflecting
- **Solution**: Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

**Issue**: Build errors
- **Solution**: Check terminal for TypeScript/ESLint errors and fix them

## New Pages Created

The following pages are now available for preview:

- `/advanced-tools/broker-comparison` - Explainer page for BestStockBrokers
- `/advanced-tools/active-trading` - Explainer page for SwingTrader

## Development Tips

1. **Keep terminal open** - The dev server runs in the terminal
2. **Watch for errors** - Terminal shows compilation errors
3. **Browser console** - Check for runtime errors
4. **Network tab** - Verify API calls and assets loading

## Production Preview

To preview the production build:

```bash
npm run preview
```

This builds and starts the production server locally.

---

**Note**: The dev server must be running for preview to work. It's configured to stay running in the background when started.


























