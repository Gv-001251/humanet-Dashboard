# LinkedIn Integration for Talent Scout

## Overview

The Talent Scout feature now includes LinkedIn integration, allowing HR to search for candidate profiles directly from LinkedIn using keywords. This integration provides a powerful way to discover external talent based on job titles, skills, and other criteria specified by HR.

## Features

- **Keyword-Based Search**: HR can enter keywords (job titles, skills, roles) to search LinkedIn profiles
- **Platform Selection**: Choose to search LinkedIn only, Naukri only, or both platforms
- **Filtering Options**: Filter results by location, experience range, and required skills
- **Match Scoring**: Candidates are automatically scored based on how well they match the search criteria
- **Integration Status Visibility**: UI shows whether LinkedIn integration is running in demo mode or connected to live API

## Configuration

### Demo Mode (Default)

By default, the system runs in demo mode using sample LinkedIn profiles. This allows you to test the functionality without requiring LinkedIn API credentials.

### Production Mode (Live LinkedIn API)

To enable live LinkedIn searches:

1. **Obtain LinkedIn API Credentials**:
   - Register your application at [LinkedIn Developers](https://www.linkedin.com/developers/)
   - Create a new app and obtain:
     - Client ID
     - Client Secret
     - API Key (OAuth 2.0 access token)

2. **Configure Environment Variables**:
   Edit `humanet-backend/.env` and add:
   ```env
   LINKEDIN_INTEGRATION_ENABLED=true
   LINKEDIN_API_KEY=your_api_key_here
   LINKEDIN_CLIENT_ID=your_client_id_here
   LINKEDIN_CLIENT_SECRET=your_client_secret_here
   ```

3. **Restart the Backend Server**:
   ```bash
   cd humanet-backend
   npm restart
   ```

## API Endpoints

### Search Candidates
`POST /api/talent-scout/search`

Search for candidates using HR-provided keywords.

**Request Body**:
```json
{
  "keywords": "React Developer",
  "platform": "linkedin",
  "location": "Bangalore",
  "experience": {
    "min": 3,
    "max": 7
  },
  "skills": ["React", "TypeScript", "Node.js"]
}
```

**Response**:
```json
{
  "success": true,
  "data": [...candidates...],
  "meta": {
    "searchKeywords": "React Developer",
    "platform": "linkedin",
    "totalResults": 10,
    "linkedinIntegration": {
      "enabled": true,
      "configured": true,
      "mode": "production"
    }
  }
}
```

### Get LinkedIn Status
`GET /api/talent-scout/linkedin-status`

Check the current LinkedIn integration status.

**Response**:
```json
{
  "success": true,
  "data": {
    "enabled": true,
    "configured": true,
    "apiKeySet": true,
    "clientIdSet": true,
    "mode": "production"
  },
  "message": "LinkedIn integration is configured and active"
}
```

## Usage Guide for HR

1. **Navigate to Talent Scout**: Access the Talent Scout module from the sidebar
2. **Enter Search Keywords**: Type in job titles, roles, or skills you're looking for (e.g., "Senior Frontend Developer", "Machine Learning Engineer")
3. **Select Platform**: Choose "LinkedIn" to specifically search LinkedIn profiles
4. **Add Filters** (Optional):
   - Location: Specify the desired location
   - Experience Range: Set minimum and maximum years of experience
   - Required Skills: Add specific technical skills required
5. **Click Search**: The system will search LinkedIn using your keywords and display matching profiles
6. **Review Results**: Profiles are sorted by match score showing how well they match your criteria
7. **Invite Candidates**: Send invitations to promising candidates directly from the interface

## Technical Architecture

### Backend Service (`linkedinIntegrationService.js`)

The LinkedIn integration is implemented as a modular service that:
- Handles API authentication
- Performs keyword-based searches
- Processes and normalizes LinkedIn profile data
- Provides fallback to demo data when API is not configured

### Search Flow

```
HR enters keywords
    ↓
Frontend sends search request with keywords & platform filter
    ↓
Backend checks LinkedIn integration status
    ↓
If enabled: Call LinkedIn API with keywords
If disabled: Use mock LinkedIn profiles
    ↓
Filter and score results based on criteria
    ↓
Return sorted results to frontend
```

### Key Functions

- `searchLinkedInProfiles(filters)`: Main search function that accepts keywords and filters
- `getConfigurationStatus()`: Returns current integration status
- `calculateMatchScore(candidate, filters)`: Scores candidates based on keyword matches

## LinkedIn API Considerations

### Rate Limits
- LinkedIn API has rate limits that vary by subscription tier
- Implement caching strategies for frequently searched keywords
- Consider batching requests when possible

### OAuth Flow
- The current implementation expects a valid access token in environment variables
- For production, implement proper OAuth 2.0 flow with token refresh

### Data Privacy
- Ensure compliance with LinkedIn's API Terms of Service
- Only collect and store necessary candidate information
- Implement proper data retention policies

## Future Enhancements

1. **Advanced Filters**: Add filters for company size, education, certifications
2. **Saved Searches**: Allow HR to save frequently used search queries
3. **Automatic Refresh**: Periodically refresh search results for active searches
4. **LinkedIn OAuth Flow**: Implement full OAuth authentication workflow
5. **Profile Enrichment**: Fetch additional profile details on-demand
6. **Real-time Notifications**: Alert HR when new profiles match saved searches
7. **Analytics**: Track search patterns and successful hire sources

## Troubleshooting

### Issue: "LinkedIn integration running in mock mode"
**Solution**: Configure LinkedIn API credentials in `.env` file and set `LINKEDIN_INTEGRATION_ENABLED=true`

### Issue: No results returned
**Possible causes**:
- Keywords too specific - try broader search terms
- Filters too restrictive - adjust experience range or remove some skill requirements
- API rate limit exceeded - wait before retrying
- API credentials expired - refresh OAuth token

### Issue: "Failed to search candidates"
**Solution**: Check backend logs for specific error messages. Verify:
- Backend server is running
- Environment variables are correctly set
- Network connectivity to LinkedIn API (if in production mode)

## Support

For issues or questions about LinkedIn integration:
1. Check backend logs: `humanet-backend/logs/`
2. Verify environment configuration
3. Review LinkedIn API documentation
4. Contact system administrator

## References

- [LinkedIn Marketing Developer Platform](https://developer.linkedin.com/)
- [LinkedIn People Search API](https://learn.microsoft.com/en-us/linkedin/)
- [OAuth 2.0 Authorization Framework](https://oauth.net/2/)
