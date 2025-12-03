# Development Setup Notes

## What Changed and Why

### Fixed Vite/Babel OptionValidator Error
- **Issue**: Frontend dev server was failing with `_helperValidatorOption.OptionValidator is not a constructor` error
- **Root Cause**: Missing Rollup native module `@rollup/rollup-linux-x64-gnu` due to npm optional dependency bug
- **Solution**: Explicitly installed the missing native module and performed clean reinstall
- **Result**: Frontend dev server now starts successfully without Babel errors

### Clean Reinstall Process
- Removed `node_modules` and `package-lock.json`
- Cleared npm cache with `npm cache clean --force`
- Reinstalled dependencies with `npm install`
- Added missing `@rollup/rollup-linux-x64-gnu` package explicitly

## Node.js Version Requirements

**Required Node.js Version**: v20.19.6 (LTS)
- The project is confirmed to work on Node.js v20.19.6
- This LTS version provides better compatibility with the current dependency stack
- Avoid using Node.js v24.x for now due to potential compatibility issues

## Clean Setup Steps

### Frontend Setup
```bash
# From project root
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm install @rollup/rollup-linux-x64-gnu --save-dev
npm run dev
```
**Expected Result**: Dev server starts on http://localhost:5173 (or 5174 if 5173 is in use) without errors

### Backend Setup
```bash
# From humanet-backend directory
cd humanet-backend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm start
```
**Expected Result**: Server starts on port 3001 with in-memory storage fallback

## How to Run and Verify Both Services Locally

### Start Frontend
```bash
# From project root
npm run dev
```
- Access at: http://localhost:5173
- Success criteria: Page loads without OptionValidator/Babel errors

### Start Backend
```bash
# From humanet-backend directory
cd humanet-backend
npm start
```
- Access at: http://localhost:3001
- Success criteria: Server boots cleanly and responds to requests
- MongoDB connection falls back to in-memory storage if Atlas is unavailable

### Verification Commands
```bash
# Frontend health check
curl http://localhost:5173

# Backend health check  
curl http://localhost:3001/api/employees
```

## Current Working Configuration

### Frontend Dependencies (Key versions)
- Vite: 5.4.21
- @vitejs/plugin-react: 4.7.0
- React: 18.3.1
- TypeScript: 5.5.3
- Rollup: 4.53.3 + @rollup/rollup-linux-x64-gnu

### Backend Dependencies (Key versions)
- Express: 4.22.1
- MongoDB: 6.20.0
- Node.js: 20.19.6 (runtime)

## Troubleshooting Notes

### If Rollup Error Persists
```bash
npm install @rollup/rollup-linux-x64-gnu --save-dev
```

### If MongoDB Connection Fails
- Backend automatically falls back to in-memory storage
- This is expected behavior in development environments
- For production, ensure MongoDB Atlas IP allowlist includes your IP

### Port Conflicts
- Frontend: Automatically tries next port if 5173 is in use
- Backend: Fixed on port 3001 (configure in server.js if needed)

## Environment Variables

### Frontend (.env)
- No critical environment variables required for basic operation

### Backend (humanet-backend/.env)
- MongoDB connection string (optional - falls back to in-memory)
- Email configuration (optional)
- Other service credentials as documented in CREDENTIALS.md

Both services are now fully operational with clean setup procedures and proper error handling.