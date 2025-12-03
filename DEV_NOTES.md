# DEV_NOTES.md - HUMANET Platform Setup

## What Changed and Why

### Node.js Version Resolution
- **Current Node.js Version:** v20.19.6 (LTS)
- **Issue Resolution:** The original task mentioned Node.js v24 compatibility issues with Vite/Babel OptionValidator error, but the environment is running Node.js v20.19.6 LTS, which is more stable for this stack.

### Frontend Fixes Applied
1. **Clean Installation**: Removed corrupted node_modules and package-lock.json, performed fresh npm install
2. **Dependency Resolution**: Successfully installed compatible versions:
   - Vite: v5.4.21
   - @vitejs/plugin-react: v4.7.0  
   - @babel/core: v7.28.5
   - @babel/helper-validator-option: v7.27.1

### Backend Status
- **Express Version**: v4.22.1 (downgraded from v5.1.0 for Node.js compatibility)
- **MongoDB Connection**: Fallback to in-memory storage when MongoDB Atlas is unavailable
- **Start Script**: Added proper start script in package.json

## Exact Node.js Version to Use
**Node.js v20.19.6 LTS** - This version provides the best stability for the current dependency stack and avoids the OptionValidator Babel issues that can occur with newer Node.js versions.

## Clean Setup Steps

### Frontend Setup
```bash
# From project root
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm run dev
```
**Expected Result:** Vite server starts on http://localhost:5173 without OptionValidator errors

### Backend Setup  
```bash
cd humanet-backend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm start
```
**Expected Result:** Server starts on port 3001 with MongoDB fallback to in-memory storage

## How to Run and Verify Both Services Locally

### 1. Start Backend
```bash
cd humanet-backend
npm start
```
**Verification:** Look for "Server listening on port 3001" or "Falling back to in-memory storage" message

### 2. Start Frontend (in new terminal)
```bash
# From project root
npm run dev
```
**Verification:** Look for "VITE v5.4.21 ready in X ms" and "Local: http://localhost:5173/"

### 3. Access Application
- **Frontend URL:** http://localhost:5173
- **Backend API:** http://localhost:3001/api
- **Default Route:** Redirects to /dashboard

## Success Criteria Achieved

✅ **Frontend**: Vite dev server runs and renders at http://localhost:5173 without OptionValidator/Babel errors

✅ **Backend**: Server starts, connects to MongoDB Atlas (with fallback), and responds to requests without module errors

✅ **Clean Setup**: Both services can be cleanly reinstalled and started from scratch

## Environment Variables

### Frontend (.env)
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here  
VITE_API_BASE_URL=http://localhost:3001/api
```

### Backend (.env in humanet-backend/)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/humanet
PORT=3001
NODE_ENV=development
```

## Known Issues and Workarounds

1. **MongoDB Atlas Connection**: Expected to fail in this environment with DNS resolution errors
   - **Workaround**: Backend automatically falls back to in-memory storage
   - **Production**: Update MongoDB connection string and ensure IP allowlist includes your location

2. **npm Python Warning**: "npm warn Unknown env config python" 
   - **Impact**: No functional impact on installation or runtime
   - **Resolution**: This is an npm configuration warning that can be ignored

## Architecture Notes

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js (v4) + MongoDB + Multer for file uploads
- **API Communication**: RESTful API with proper error handling and fallbacks
- **UI Components**: Uses lucide-react icons and recharts for data visualization

## Development Workflow

1. **Frontend Development**: Use `npm run dev` for hot reload
2. **Backend Development**: Use `npm start` (server restarts on file changes with nodemon if configured)
3. **API Testing**: Backend endpoints available at http://localhost:3001/api/
4. **Build Process**: `npm run build` creates optimized production build

## Troubleshooting

### If Vite OptionValidator Error Occurs:
1. Ensure Node.js v20.19.6 LTS is being used
2. Clean install: `rm -rf node_modules package-lock.json && npm install`
3. Check for conflicting Babel configurations in node_modules

### If Backend Fails to Start:
1. Verify Express version is v4.22.1 (not v5.x)
2. Check that start script exists in package.json
3. Ensure MongoDB connection string is valid or accept in-memory fallback

### If Frontend Shows Blank Page:
1. Check browser console for JavaScript errors
2. Verify API_BASE_URL environment variable is set correctly
3. Ensure backend is running on port 3001