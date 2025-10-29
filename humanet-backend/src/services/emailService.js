const nodemailer = require('nodemailer');

let transporter = null;
let transporterInitialized = false;

const initializeTransporter = () => {
  if (transporterInitialized) {
    return transporter;
  }

  transporterInitialized = true;

  if (process.env.EMAIL_ENABLED !== 'true') {
    console.info('Email service is disabled. Set EMAIL_ENABLED=true to enable email notifications.');
    return null;
  }

  const {
    EMAIL_USER,
    EMAIL_PASSWORD,
    EMAIL_SERVICE,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_SECURE
  } = process.env;

  if (!EMAIL_USER || !EMAIL_PASSWORD) {
    console.warn('Email credentials not configured. Please set EMAIL_USER and EMAIL_PASSWORD in the environment.');
    return null;
  }

  const transporterConfig = EMAIL_HOST
    ? {
        host: EMAIL_HOST,
        port: EMAIL_PORT ? Number(EMAIL_PORT) : 587,
        secure: EMAIL_SECURE === 'true',
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASSWORD
        }
      }
    : {
        service: EMAIL_SERVICE || 'gmail',
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASSWORD
        }
      };

  try {
    transporter = nodemailer.createTransport(transporterConfig);
    console.log('Email transporter initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize email transporter:', error);
    transporter = null;
  }

  return transporter;
};

const sendEmail = async ({ to, subject, html, text }) => {
  if (!to) {
    return {
      success: false,
      message: 'Recipient email address is required.'
    };
  }

  const activeTransporter = initializeTransporter();

  if (!activeTransporter) {
    console.info(`Email not sent to ${to}. Email service is disabled or not configured.`);
    return {
      success: false,
      message: 'Email service is disabled or not configured.'
    };
  }

  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  try {
    const info = await activeTransporter.sendMail({
      from,
      to,
      subject,
      html,
      text
    });

    console.log(`Email successfully sent to ${to}. Message ID: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    return {
      success: false,
      message: error?.message || 'Failed to send email',
      error
    };
  }
};

const buildShortlistEmailContent = (candidate) => {
  const skills = Array.isArray(candidate?.skills) && candidate.skills.length > 0
    ? candidate.skills.join(', ')
    : 'Not specified';
  const location = candidate?.location || 'Not specified';
  const experience = Number.isFinite(Number(candidate?.experience)) ? `${candidate.experience} year(s)` : 'Not specified';
  const position = candidate?.domain || 'Not specified';
  const currentYear = new Date().getFullYear();

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #1f2933;
            background-color: #f9fbfd;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 24px;
          }
          .card {
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 12px 30px rgba(15, 23, 42, 0.1);
          }
          .header {
            background: linear-gradient(120deg, #4f46e5, #7c3aed);
            color: #ffffff;
            padding: 32px 24px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 26px;
          }
          .content {
            padding: 32px 24px;
          }
          .content h2 {
            color: #1f2937;
          }
          .details {
            margin: 24px 0;
            padding: 20px;
            background: #f3f4f6;
            border-radius: 8px;
          }
          .footer {
            font-size: 12px;
            color: #6b7280;
            text-align: center;
            padding: 20px 0 0;
            border-top: 1px solid #e5e7eb;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h1>Congratulations, ${candidate?.name || 'Candidate'}!</h1>
              <p>You have been shortlisted</p>
            </div>
            <div class="content">
              <h2>Dear ${candidate?.name || 'Candidate'},</h2>
              <p>
                We are pleased to inform you that you have been <strong>shortlisted</strong> for the next
                stage of our hiring process at HumaNet.
              </p>
              <div class="details">
                <p><strong>Position:</strong> ${position}</p>
                <p><strong>Experience:</strong> ${experience}</p>
                <p><strong>Location:</strong> ${location}</p>
                <p><strong>Skills:</strong> ${skills}</p>
              </div>
              <p>
                Our talent team will contact you shortly with the details of the next steps. If you have
                any questions in the meantime, feel free to reach out to us.
              </p>
              <p>
                Best regards,<br />
                <strong>The HumaNet HR Team</strong>
              </p>
              <div class="footer">
                <p>This is an automated email. Please do not reply to this message.</p>
                <p>© ${currentYear} HumaNet. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `Dear ${candidate?.name || 'Candidate'},\n\n` +
    'We are pleased to inform you that you have been shortlisted for the next stage of our hiring process at HumaNet.\n\n' +
    `Position: ${position}\n` +
    `Experience: ${experience}\n` +
    `Location: ${location}\n` +
    `Skills: ${skills}\n\n` +
    'Our talent team will contact you shortly with the details of the next steps.\n\n' +
    'Best regards,\n' +
    'The HumaNet HR Team\n\n' +
    '---\nThis is an automated email. Please do not reply to this message.\n' +
    `© ${currentYear} HumaNet. All rights reserved.`;

  return { html, text };
};

const buildRejectionEmailContent = (candidate) => {
  const currentYear = new Date().getFullYear();

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #1f2933;
            background-color: #f9fbfd;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 24px;
          }
          .card {
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 12px 30px rgba(15, 23, 42, 0.1);
          }
          .header {
            background: linear-gradient(120deg, #6d28d9, #4c1d95);
            color: #ffffff;
            padding: 28px 24px;
            text-align: center;
          }
          .content {
            padding: 32px 24px;
          }
          .footer {
            font-size: 12px;
            color: #6b7280;
            text-align: center;
            padding: 20px 0 0;
            border-top: 1px solid #e5e7eb;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h1>Application Update</h1>
            </div>
            <div class="content">
              <h2>Dear ${candidate?.name || 'Candidate'},</h2>
              <p>
                Thank you for taking the time to apply and interview with us. We appreciate your interest in joining
                HumaNet.
              </p>
              <p>
                After careful consideration, we regret to inform you that we will not be moving forward with your
                application at this time. This decision was not easy and reflects the competitive nature of the
                selection process.
              </p>
              <p>
                We encourage you to stay connected and apply for future opportunities that align with your skills and
                experience. We wish you every success in your career journey.
              </p>
              <p>
                Best regards,<br />
                <strong>The HumaNet HR Team</strong>
              </p>
              <div class="footer">
                <p>This is an automated email. Please do not reply to this message.</p>
                <p>© ${currentYear} HumaNet. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `Dear ${candidate?.name || 'Candidate'},\n\n` +
    'Thank you for taking the time to apply and interview with us. We appreciate your interest in joining HumaNet.\n\n' +
    'After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.\n\n' +
    'We encourage you to stay connected and apply for future opportunities that align with your skills and experience.\n\n' +
    'Best regards,\n' +
    'The HumaNet HR Team\n\n' +
    '---\nThis is an automated email. Please do not reply to this message.\n' +
    `© ${currentYear} HumaNet. All rights reserved.`;

  return { html, text };
};

const sendShortlistEmail = async (candidate) => {
  if (!candidate) {
    return {
      success: false,
      message: 'Candidate details are required to send shortlist email.'
    };
  }

  const { html, text } = buildShortlistEmailContent(candidate);

  return sendEmail({
    to: candidate.email,
    subject: 'HumaNet Update: You Have Been Shortlisted!',
    html,
    text
  });
};

const sendRejectionEmail = async (candidate) => {
  if (!candidate) {
    return {
      success: false,
      message: 'Candidate details are required to send rejection email.'
    };
  }

  const { html, text } = buildRejectionEmailContent(candidate);

  return sendEmail({
    to: candidate.email,
    subject: 'HumaNet Application Update',
    html,
    text
  });
};

module.exports = {
  sendShortlistEmail,
  sendRejectionEmail
};
