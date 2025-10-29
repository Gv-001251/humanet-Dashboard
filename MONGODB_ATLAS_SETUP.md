# MongoDB Atlas Connection Setup

## Current Configuration

The webapp is configured to connect to MongoDB Atlas using the following connection string:

```
mongodb+srv://navageevithang_db_user:<db_password>@humanet-cluster.h99gras.mongodb.net/
```

This connection string is stored in `/humanet-backend/.env` as:

```env
MONGODB_URI=mongodb+srv://navageevithang_db_user:<db_password>@humanet-cluster.h99gras.mongodb.net/
DB_NAME=humanet_hr
PORT=3001
NODE_ENV=development
```

**Note**: Replace `<db_password>` with your actual MongoDB Atlas password.

## Connection String Format

The application now uses the **MongoDB+srv connection string** format, which is the standard and recommended way to connect to MongoDB Atlas:

- **mongodb+srv://** - Uses SRV records for automatic replica set discovery
- Automatically handles connection string options
- More secure and reliable than the legacy connection format

### If Connection Issues Occur

If you experience connection issues, you have two options:

#### Option 1: Update Your Password

Make sure you've replaced `<db_password>` in your `.env` file with your actual MongoDB Atlas password:

1. Get your password from MongoDB Atlas credentials
2. Update `/humanet-backend/.env` with your actual password
3. Restart the server

Example:
```env
MONGODB_URI=mongodb+srv://navageevithang_db_user:yourActualPassword@humanet-cluster.h99gras.mongodb.net/
DB_NAME=humanet_hr
```

#### Option 2: Continue with In-Memory Storage

The application is configured to fall back to in-memory storage if the MongoDB connection fails. This is suitable for development and testing but data will not persist between server restarts.

## Testing the Connection

To test if MongoDB is connected:

```bash
cd humanet-backend
npm start
```

Look for these messages in the console:
- ✅ Success: `MongoDB connected successfully to database: humanet_hr`
- ⚠️ Fallback: `Falling back to in-memory storage`

## Verifying Data Persistence

### With MongoDB Connected:
- Data persists across server restarts
- Candidates are stored in the `candidates` collection
- Other collections can be added as needed

### With In-Memory Storage:
- Data is stored in memory arrays
- Data is lost when server restarts
- Sample data is reloaded on each startup

## Troubleshooting

### Connection Timeout
If you see connection timeout errors:
1. Check your IP is whitelisted in Atlas (Network Access)
2. Verify the connection string is correct
3. Ensure your network allows outbound connections to MongoDB Atlas

### Authentication Errors
If you see authentication errors:
1. Verify username and password in the connection string
2. Check the database user exists in Atlas (Database Access)
3. Ensure the user has appropriate permissions

### Network Errors
If you see network errors:
1. Check your internet connection
2. Try using a different network
3. Verify Atlas cluster is running (not paused)

## Database Structure

The application uses the following database structure:

- **Database Name**: `humanet_hr`
- **Collections**:
  - `candidates`: Stores candidate information
  - (Future: `employees`, `jobs`, `offers`, etc.)

## Environment Variables

All MongoDB-related configuration is in `/humanet-backend/.env`:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://navageevithang_db_user:<db_password>@humanet-cluster.h99gras.mongodb.net/

# Database Name
DB_NAME=humanet_hr

# Server Configuration
PORT=3001
NODE_ENV=development
```

Remember to replace `<db_password>` with your actual MongoDB Atlas password.

## Security Best Practices

1. **Never commit `.env` files** to version control (already in `.gitignore`)
2. **Use strong passwords** for MongoDB users
3. **Limit IP whitelist** in Atlas to specific IPs in production
4. **Rotate credentials** regularly
5. **Use environment-specific** credentials (dev/staging/prod)

## Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Node.js Driver Documentation](https://docs.mongodb.com/drivers/node/)
- [Atlas SQL Documentation](https://www.mongodb.com/docs/atlas/data-federation/query/sql/)
