# Email Notification Setup Guide

This guide explains how to configure automatic email notifications for shortlisted and rejected candidates in HumaNet.

## Overview

When a candidate's status is changed to "shortlisted" or "rejected" in the HireSmart module, the system will automatically send a professional email notification to the candidate.

## Features

- ✅ Automatic email sending when candidate status changes
- ✅ Professional HTML email templates with company branding
- ✅ Separate templates for shortlisted and rejected candidates
- ✅ Support for Gmail, Outlook, and custom SMTP servers
- ✅ Graceful handling when email service is disabled
- ✅ Email status logging and error handling
- ✅ No disruption to API if email fails

## Configuration

### Step 1: Enable Email Service

Edit your `.env` file in the `humanet-backend` directory and set:

```bash
EMAIL_ENABLED=true
```

### Step 2: Configure Email Credentials

Choose one of the following options:

#### Option 1: Using Gmail (Recommended for development)

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select app: "Mail"
   - Select device: "Other" (enter "HumaNet")
   - Copy the generated 16-character password

3. Update your `.env` file:

```bash
EMAIL_SERVICE=gmail
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
EMAIL_FROM=HumaNet HR <your.email@gmail.com>
```

#### Option 2: Using Outlook/Office365

```bash
EMAIL_SERVICE=outlook
EMAIL_USER=your.email@outlook.com
EMAIL_PASSWORD=your_password
EMAIL_FROM=HumaNet HR <your.email@outlook.com>
```

#### Option 3: Using Custom SMTP Server

```bash
EMAIL_ENABLED=true
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your.email@example.com
EMAIL_PASSWORD=your_password
EMAIL_FROM=HumaNet HR <your.email@example.com>
```

**Note:** When using a custom SMTP server, do not set `EMAIL_SERVICE`.

## Email Templates

### Shortlisted Candidate Email

When a candidate is shortlisted, they receive an email with:
- Congratulations message
- Their application details (position, experience, location, skills)
- Information that HR will contact them soon
- Professional HumaNet branding

**Subject:** "HumaNet Update: You Have Been Shortlisted!"

### Rejected Candidate Email

When a candidate is rejected, they receive a polite email with:
- Thank you for applying message
- Respectful rejection notification
- Encouragement to apply for future opportunities
- Professional HumaNet branding

**Subject:** "HumaNet Application Update"

## Testing the Email Functionality

### 1. Start the Backend Server

```bash
cd humanet-backend
npm start
```

Look for the log message:
```
Email transporter initialized successfully.
```

### 2. Test with the Frontend

1. Go to the HireSmart page
2. Upload a resume or use existing candidates
3. Click on a candidate to view details
4. Change the status to "Shortlisted"
5. Check the console logs for email confirmation
6. Check the candidate's email inbox

### 3. Check Logs

The server will log email activity:

**Success:**
```
Email successfully sent to candidate@example.com. Message ID: <message-id>
```

**Failure:**
```
Failed to send shortlisted email to candidate@example.com: Error message
```

## Troubleshooting

### Email Not Sending

1. **Check EMAIL_ENABLED setting:**
   ```bash
   # In .env file
   EMAIL_ENABLED=true
   ```

2. **Verify credentials are correct:**
   - For Gmail, ensure you're using an App Password, not your regular password
   - Check for typos in EMAIL_USER and EMAIL_PASSWORD

3. **Check server logs:**
   - Look for initialization messages when server starts
   - Check for error messages when status is updated

### Gmail-Specific Issues

**"Less secure app access"** error:
- Gmail no longer supports "less secure apps"
- You MUST use an App Password (see Configuration Step 2)

**"Authentication failed"** error:
- Verify 2FA is enabled on your Google account
- Generate a new App Password
- Remove spaces from the App Password when pasting

### Email Ends Up in Spam

To prevent emails from going to spam:

1. **Use a verified email address:** Use an email from a domain you own
2. **Set up SPF/DKIM records:** Configure your domain's DNS records
3. **Professional sender name:** Use `EMAIL_FROM=HumaNet HR <your.email@domain.com>`
4. **Test with multiple providers:** Check Gmail, Outlook, Yahoo, etc.

## Disabling Email Notifications

To disable email notifications without removing the configuration:

```bash
EMAIL_ENABLED=false
```

The system will continue to work normally, but will log:
```
Email not sent to candidate@example.com. Email service is disabled or not configured.
```

## Security Best Practices

1. **Never commit `.env` file to version control**
   - The `.env` file is already in `.gitignore`
   - Use `.env.example` for documentation

2. **Use App Passwords, not main passwords**
   - This limits access if credentials are compromised
   - You can revoke App Passwords without changing your main password

3. **Use environment-specific configurations**
   - Development: Personal Gmail with App Password
   - Production: Business email with custom SMTP

4. **Rotate credentials regularly**
   - Change App Passwords periodically
   - Monitor for suspicious activity

## API Response

When a candidate's status is updated, the API response includes email metadata:

```json
{
  "success": true,
  "data": {
    "id": "cand-123",
    "name": "John Doe",
    "email": "john@example.com",
    "status": "shortlisted",
    ...
  },
  "meta": {
    "emailAttempted": true,
    "emailSent": true,
    "emailMessageId": "<message-id@gmail.com>"
  }
}
```

If email fails, the API still succeeds (status is updated), but `emailSent` will be `false`:

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "emailAttempted": true,
    "emailSent": false,
    "emailMessage": "Email service is disabled or not configured."
  }
}
```

## Support

For issues or questions:
1. Check server console logs for detailed error messages
2. Verify all configuration in `.env` file
3. Test with a simple email service first (Gmail)
4. Review this guide's troubleshooting section

## Additional Resources

- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [Nodemailer Documentation](https://nodemailer.com/about/)
- [SMTP Settings for Popular Providers](https://www.gmass.co/blog/gmail-smtp/)
