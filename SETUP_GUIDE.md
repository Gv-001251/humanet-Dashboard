# Humanet HR Platform - Setup Guide

## Quick Start Guide

### Prerequisites
- Node.js v18 or higher
- MongoDB Atlas account (or local MongoDB instance)
- npm or yarn package manager

### Step 1: Install Dependencies

#### Install Backend Dependencies
```bash
cd humanet-backend
npm install
```

#### Install Frontend Dependencies
```bash
cd ..
npm install
```

### Step 2: Configure Environment Variables

#### Backend Configuration
Create or update `/humanet-backend/.env`:
```env
MONGODB_URI=mongodb+srv://navageevithang_db_user:BdvFg2iBkcz750gt@humanet-cluster.h99gras.mongodb.net/humanet_hr?retryWrites=true&w=majority&appName=humanet-Cluster
DB_NAME=humanet_hr
PORT=3001
NODE_ENV=development
```

#### Frontend Configuration
Create or update `/.env`:
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### Step 3: Start the Application

#### Terminal 1 - Start Backend Server
```bash
cd humanet-backend
node server.js
```

You should see:
```
Server is running on port 3001
```

#### Terminal 2 - Start Frontend Development Server
```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 4: Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Database Setup

### MongoDB Atlas Configuration

1. **Database Name:** `humanet_hr`
2. **Connection String:** Already configured in `.env`
3. **Collections:** Will be automatically created on first run

### Sample Data

The application will automatically seed sample data on first run:
- 8 sample employees
- 6 sample candidates
- 4 sample job postings

## Troubleshooting

### Backend Issues

#### Issue: "Cannot find module 'express'"
**Solution:**
```bash
cd humanet-backend
npm install
```

#### Issue: "Database connection error"
**Solution:**
- Check MongoDB URI in `/humanet-backend/.env`
- Verify internet connection
- Ensure MongoDB Atlas IP whitelist includes your IP
- Application will fall back to in-memory storage if connection fails

#### Issue: "Port 3001 already in use"
**Solution:**
```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>
```

### Frontend Issues

#### Issue: "Module not found"
**Solution:**
```bash
npm install
```

#### Issue: "Port 5173 already in use"
**Solution:**
Edit `vite.config.ts` and change the port:
```typescript
export default defineConfig({
  server: {
    port: 5174 // Change to any available port
  }
})
```

#### Issue: "API calls failing"
**Solution:**
- Ensure backend is running on port 3001
- Check CORS configuration in backend
- Verify API_BASE_URL in frontend `.env`

## Development Workflow

### Adding New Features

1. **Backend API Endpoint:**
   - Add route in `/humanet-backend/server.js`
   - Follow existing pattern for error handling
   - Test with curl or Postman

2. **Frontend Service:**
   - Create service file in `/src/services/api/`
   - Define TypeScript interfaces
   - Export service class with static methods

3. **Frontend Component:**
   - Create React component in `/src/pages/` or `/src/components/`
   - Use existing hooks and patterns
   - Add route in `/src/App.tsx` if needed

### Code Quality

#### TypeScript
- Always define interfaces for data types
- Use `type` for simple types, `interface` for objects
- Enable strict mode

#### React
- Use functional components with hooks
- Implement error boundaries
- Add loading states
- Handle empty states

#### Styling
- Use TailwindCSS utility classes
- Follow existing color scheme
- Ensure responsive design (mobile-first)
- Use `lucide-react` for icons

## Testing

### Manual Testing
1. Test all CRUD operations
2. Verify file uploads work
3. Check filtering and search
4. Test on different screen sizes
5. Verify MongoDB connection

### API Testing
```bash
# Get all employees
curl http://localhost:3001/api/employees

# Get dashboard stats
curl http://localhost:3001/api/dashboard/stats

# Create employee
curl -X POST http://localhost:3001/api/employees \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"+91 9876543210","department":"Engineering","role":"Developer","current_ctc":800000,"expected_ctc":1000000}'
```

## Production Deployment

### Backend Deployment

1. **Build:**
   - No build step needed for Node.js

2. **Environment:**
   - Set `NODE_ENV=production`
   - Use production MongoDB URI
   - Configure proper CORS origins

3. **Start:**
```bash
cd humanet-backend
node server.js
```

### Frontend Deployment

1. **Build:**
```bash
npm run build
```

2. **Output:**
   - Build artifacts in `/dist` folder

3. **Deploy:**
   - Upload `/dist` folder to hosting service
   - Configure environment variables
   - Set correct API_BASE_URL

### Recommended Hosting

- **Backend:** Heroku, AWS EC2, DigitalOcean, Railway
- **Frontend:** Vercel, Netlify, AWS S3 + CloudFront
- **Database:** MongoDB Atlas (already configured)

## Maintenance

### Database Backups
```bash
# Export MongoDB data
mongodump --uri="<MONGODB_URI>"

# Import MongoDB data
mongorestore --uri="<MONGODB_URI>" dump/
```

### Logs
- Backend logs: Console output
- Frontend logs: Browser console
- Production: Use logging service (e.g., LogRocket, Sentry)

### Updates
```bash
# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

## Security Checklist

- [ ] Environment variables not committed to Git
- [ ] MongoDB connection string secure
- [ ] File upload size limits enforced
- [ ] Input validation on all forms
- [ ] CORS properly configured
- [ ] No sensitive data in client-side code
- [ ] Error messages don't expose internals

## Support

For issues or questions:
1. Check this guide first
2. Review error messages
3. Check browser console (F12)
4. Review backend logs
5. Create an issue in the repository

## Next Steps

After setup, explore these features:
1. **Dashboard** - View employee statistics
2. **HireSmart** - Upload and parse resumes
3. **AutoMatch** - Match candidates to jobs
4. **Salary Prediction** - AI-powered salary estimates
5. **HR Assistance** - AI chatbot for HR queries

Happy coding! 🚀
