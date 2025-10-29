# MongoDB Atlas Connection Setup

## Current Configuration

The webapp is configured to connect to MongoDB Atlas using the following connection string:

```
mongodb://atlas-sql-68efb1431fe8371b9a3f376f-kjuaj8.a.query.mongodb.net/humanet_hr?ssl=true&authSource=admin
```

This connection string is stored in `/humanet-backend/.env` as:

```env
MONGODB_URI=mongodb://atlas-sql-68efb1431fe8371b9a3f376f-kjuaj8.a.query.mongodb.net/humanet_hr?ssl=true&authSource=admin
DB_NAME=humanet_hr
PORT=3001
NODE_ENV=development
```

## Important Note About Atlas SQL Interface

⚠️ **Important**: The provided URI appears to be for **MongoDB Atlas SQL interface**, which is designed for SQL queries on MongoDB data. This interface may not be fully compatible with the standard MongoDB Node.js driver used in this application.

### Atlas SQL vs Standard MongoDB Connection

- **Atlas SQL** (`atlas-sql-*.a.query.mongodb.net`): Used for SQL-based queries on MongoDB data
- **Standard MongoDB** (`*.mongodb.net` or `mongodb+srv://`): Used for native MongoDB operations

### If Connection Issues Occur

If you experience connection issues with the Atlas SQL endpoint, you have two options:

#### Option 1: Use Standard MongoDB Atlas Connection String (Recommended)

Get your standard MongoDB Atlas connection string from your Atlas dashboard:

1. Log into [MongoDB Atlas](https://cloud.mongodb.com)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
5. Update `/humanet-backend/.env` with the new URI

Example:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/humanet_hr?retryWrites=true&w=majority
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
MONGODB_URI=mongodb://atlas-sql-68efb1431fe8371b9a3f376f-kjuaj8.a.query.mongodb.net/humanet_hr?ssl=true&authSource=admin

# Database Name
DB_NAME=humanet_hr

# Server Configuration
PORT=3001
NODE_ENV=development
```

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
