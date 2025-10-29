# Humanet HR Platform - Login Credentials

## Default Login Credentials

### HR Manager Account
```
Email: hr@humanet.com
Password: hr123
Role: HR Manager
```

**Access to:**
- HR Dashboard
- HireSmart (Recruitment)
- AutoMatch (Job Matching)
- Document Fraud Detection
- Offer Management
- Hike Expectation Analyzer
- Salary Prediction
- HR Assistance (AI Chatbot)
- All HR management features

### Employee Account
```
Email: employee@humanet.com
Password: emp123
Role: Employee
```

**Access to:**
- Employee Dashboard
- Skill Enhancer
- My Projects
- My Tasks
- Progress Tracking
- Employee self-service features

## MongoDB Atlas Credentials

```
URI: mongodb+srv://navageevithang_db_user:<db_password>@humanet-cluster.h99gras.mongodb.net/
Database: humanet_hr
```

**Note**: Replace `<db_password>` with your actual MongoDB Atlas password. The application is configured to use the MongoDB Atlas connection provided above. If the connection fails, the application will automatically fall back to in-memory storage for development purposes. See `MONGODB_ATLAS_SETUP.md` for detailed information about the MongoDB connection.

## Sample Data

The application comes pre-loaded with sample data:

### Sample Employees (8 total)
1. Gayathri G - Software Engineer
2. Athulya AM - Full Stack Developer
3. Jheevashankar M - UI/UX Designer
4. Priya Sharma - HR Manager
5. Rahul Kumar - DevOps Engineer
6. Sneha Patel - Marketing Lead
7. Vikram Singh - Backend Developer
8. Anjali Mehta - Product Manager

### Sample Candidates (6 total)
1. Rahul Sharma - Full Stack Developer (4.5 years exp)
2. Priya Patel - UI/UX Designer (3 years exp)
3. Arjun Kumar - DevOps Engineer (5 years exp)
4. Sneha Reddy - Frontend Developer (2 years exp)
5. Vikram Singh - Backend Developer (6 years exp)
6. Anjali Gupta - Full Stack Developer (3.5 years exp)

### Sample Job Postings (4 total)
1. Senior Full Stack Developer
2. UI/UX Designer
3. DevOps Engineer
4. Product Manager

## API Testing

You can use these credentials with tools like Postman or curl:

```bash
# Test MongoDB connection
curl http://localhost:3001/api/dashboard/stats

# Get all employees
curl http://localhost:3001/api/employees

# Get all candidates
curl http://localhost:3001/api/candidates
```

## Security Notes

⚠️ **Important:**
- These are development credentials only
- Change all passwords before production deployment
- Never commit credentials to Git
- Use environment variables for sensitive data
- Enable MongoDB IP whitelist in production
- Implement proper authentication in production

## Changing Credentials

### Update Login Credentials
Edit `/src/services/api/authService.ts`:
```typescript
if (credentials.email === 'your-email@company.com' && credentials.password === 'your-password') {
  // ... update logic
}
```

### Update MongoDB Credentials
Edit `/humanet-backend/.env`:
```env
MONGODB_URI=your-new-mongodb-uri
```

## Password Policy (Recommended for Production)

- Minimum 8 characters
- Mix of uppercase and lowercase
- At least one number
- At least one special character
- No common words
- Expire passwords every 90 days
- Enable two-factor authentication

## Session Management

- Tokens stored in localStorage
- Sessions expire on browser close
- Manual logout available
- Token refresh not implemented (add in production)

## Admin Account (Future Enhancement)

Consider adding a super admin account with:
- User management
- System configuration
- Audit logs
- Backup/restore capabilities

---

**Remember:** Always keep credentials secure and never share them publicly!
