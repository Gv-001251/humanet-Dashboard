const express = require('express');
const cors = require('cors');
const compression = require('compression');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
require('dotenv').config();
const { connectDB } = require('./src/config/mongodb');
const {
  predictSalary,
  getMarketComparison,
  checkSalaryFit,
  formatSalary,
  getExperienceFromSalary
} = require('./src/services/salaryPredictionEngine');

// Configure allowed MIME types
const ALLOWED_MIME_TYPES = {
  'application/pdf': true,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': true,
  'text/csv': true
};

const uploadsDir = path.join(__dirname, 'uploads');

const ensureUploadsDirExists = () => {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
};

ensureUploadsDirExists();

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadsDirExists();
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

let candidates = [
  {
    id: 'cand-1',
    name: 'Amit Kumar',
    email: 'amit.kumar@example.com',
    phone: '+91 9876543210',
    skills: ['React', 'TypeScript', 'JavaScript', 'Node.js'],
    experience: 5,
    ctc: 1200000,
    location: 'Bangalore',
    domain: 'Frontend',
    status: 'pending',
    education: 'B.Tech Computer Science',
    resumeUrl: '/uploads/resume-amit-kumar.pdf',
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'cand-2',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@example.com',
    phone: '+91 9876543211',
    skills: ['Python', 'Machine Learning', 'AI', 'TensorFlow'],
    experience: 4,
    ctc: 1500000,
    location: 'Hyderabad',
    domain: 'Data Science',
    status: 'pending',
    education: 'M.Tech Data Science',
    resumeUrl: '/uploads/resume-sneha-reddy.pdf',
    createdAt: new Date('2024-01-16')
  },
  {
    id: 'cand-3',
    name: 'Vikram Patel',
    email: 'vikram.patel@example.com',
    phone: '+91 9876543212',
    skills: ['Node.js', 'React', 'MongoDB', 'AWS', 'Docker'],
    experience: 6,
    ctc: 1800000,
    location: 'Mumbai',
    domain: 'Full Stack',
    status: 'pending',
    education: 'B.E. Software Engineering',
    resumeUrl: '/uploads/resume-vikram-patel.pdf',
    createdAt: new Date('2024-01-17')
  }
];

let candidateCollection = null;

const normalizeCandidate = (candidate) => {
  if (!candidate) {
    return null;
  }

  const normalized = { ...candidate };
  normalized.createdAt = candidate?.createdAt ? new Date(candidate.createdAt) : new Date();
  return normalized;
};

const mapCandidateDocument = (doc) => {
  if (!doc) {
    return null;
  }

  const { _id, ...rest } = doc;
  return normalizeCandidate(rest);
};

const refreshCandidatesFromDB = async () => {
  if (!candidateCollection) {
    return candidates;
  }

  try {
    const docs = await candidateCollection.find({}, { projection: { _id: 0 } }).toArray();
    candidates = docs.map(mapCandidateDocument).filter(Boolean);
  } catch (error) {
    console.error('Failed to refresh candidates from MongoDB:', error);
  }

  return candidates;
};

const initializeDatabase = async () => {
  try {
    const db = await connectDB();

    if (!db) {
      return;
    }

    candidateCollection = db.collection('candidates');
    await candidateCollection.createIndex({ id: 1 }, { unique: true });

    const existingCandidates = await candidateCollection.find({}, { projection: { _id: 0 } }).toArray();

    if (existingCandidates.length > 0) {
      candidates = existingCandidates.map(mapCandidateDocument).filter(Boolean);
    } else if (candidates.length > 0) {
      const documents = candidates.map(candidate => normalizeCandidate(candidate)).filter(Boolean);
      if (documents.length > 0) {
        await candidateCollection.insertMany(documents, { ordered: false });
        candidates = documents.map(candidate => ({ ...candidate }));
      }
    }

    console.log(`Candidate collection initialized with ${candidates.length} records.`);
  } catch (error) {
    console.error('Failed to initialize database:', error);
    candidateCollection = null;
  }
};

initializeDatabase();

let employees = [
  {
    id: 'emp-1',
    name: 'Anjali Sharma',
    email: 'anjali@humanet.com',
    role: 'Senior Frontend Engineer',
    skills: ['React', 'TypeScript', 'GraphQL', 'UI/UX'],
    experience: 7,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-2',
    name: 'Rahul Verma',
    email: 'rahul@humanet.com',
    role: 'Full Stack Developer',
    skills: ['Node.js', 'React', 'MongoDB', 'AWS'],
    experience: 6,
    availability: 'Partially Available',
    department: 'Engineering'
  },
  {
    id: 'emp-3',
    name: 'Priya Singh',
    email: 'priya@humanet.com',
    role: 'Data Scientist',
    skills: ['Python', 'TensorFlow', 'Data Analysis', 'Machine Learning'],
    experience: 5,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-4',
    name: 'Arjun Nair',
    email: 'arjun@humanet.com',
    role: 'Backend Engineer',
    skills: ['Node.js', 'Python', 'PostgreSQL', 'Docker'],
    experience: 4,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-5',
    name: 'Meera Patel',
    email: 'meera@humanet.com',
    role: 'DevOps Engineer',
    skills: ['AWS', 'Kubernetes', 'CI/CD', 'Terraform'],
    experience: 5,
    availability: 'Partially Available',
    department: 'Engineering'
  },
  {
    id: 'emp-6',
    name: 'Vikram Desai',
    email: 'vikram@humanet.com',
    role: 'Frontend Developer',
    skills: ['React', 'JavaScript', 'CSS', 'HTML'],
    experience: 3,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-7',
    name: 'Sneha Rao',
    email: 'sneha@humanet.com',
    role: 'QA Engineer',
    skills: ['Testing', 'Automation', 'Selenium', 'JIRA'],
    experience: 4,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-8',
    name: 'Karthik Kumar',
    email: 'karthik@humanet.com',
    role: 'UI/UX Designer',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
    experience: 5,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-9',
    name: 'Divya Menon',
    email: 'divya@humanet.com',
    role: 'Product Manager',
    skills: ['Product Strategy', 'Agile', 'Market Research', 'Analytics'],
    experience: 6,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-10',
    name: 'Ravi Iyer',
    email: 'ravi@humanet.com',
    role: 'Tech Lead',
    skills: ['System Design', 'Architecture', 'Leadership', 'Microservices'],
    experience: 8,
    availability: 'Partially Available',
    department: 'Engineering'
  },
  {
    id: 'emp-11',
    name: 'Lakshmi Reddy',
    email: 'lakshmi@humanet.com',
    role: 'Machine Learning Engineer',
    skills: ['Python', 'PyTorch', 'Deep Learning', 'NLP'],
    experience: 4,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-12',
    name: 'Sanjay Pillai',
    email: 'sanjay@humanet.com',
    role: 'Data Engineer',
    skills: ['Spark', 'Hadoop', 'Kafka', 'Python'],
    experience: 5,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-13',
    name: 'Pooja Gupta',
    email: 'pooja@humanet.com',
    role: 'Frontend Engineer',
    skills: ['Vue.js', 'TypeScript', 'Tailwind CSS', 'Testing'],
    experience: 3,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-15',
    name: 'Kavya Krishnan',
    email: 'kavya@humanet.com',
    role: 'Mobile Developer',
    skills: ['React Native', 'iOS', 'Android', 'Swift'],
    experience: 4,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-16',
    name: 'Manish Joshi',
    email: 'manish@humanet.com',
    role: 'Cloud Architect',
    skills: ['AWS', 'Azure', 'GCP', 'Cloud Migration'],
    experience: 7,
    availability: 'Partially Available',
    department: 'Engineering'
  },
  {
    id: 'emp-17',
    name: 'Nisha Malhotra',
    email: 'nisha@humanet.com',
    role: 'Backend Developer',
    skills: ['Java', 'Spring Boot', 'MySQL', 'Redis'],
    experience: 4,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-18',
    name: 'Rohan Agarwal',
    email: 'rohan@humanet.com',
    role: 'Site Reliability Engineer',
    skills: ['Monitoring', 'Logging', 'Incident Management', 'Automation'],
    experience: 5,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-19',
    name: 'Shreya Bhat',
    email: 'shreya@humanet.com',
    role: 'Business Analyst',
    skills: ['Requirements Gathering', 'Documentation', 'Stakeholder Management', 'SQL'],
    experience: 4,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-20',
    name: 'Tarun Mehta',
    email: 'tarun@humanet.com',
    role: 'Database Administrator',
    skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Database Optimization'],
    experience: 6,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-21',
    name: 'Usha Venkat',
    email: 'usha@humanet.com',
    role: 'Scrum Master',
    skills: ['Agile', 'Scrum', 'Team Facilitation', 'Project Management'],
    experience: 5,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-22',
    name: 'Vinay Subramanian',
    email: 'vinay@humanet.com',
    role: 'Full Stack Developer',
    skills: ['MEAN Stack', 'Angular', 'Node.js', 'MongoDB'],
    experience: 4,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-23',
    name: 'Yamini Rao',
    email: 'yamini@humanet.com',
    role: 'Data Analyst',
    skills: ['SQL', 'Power BI', 'Excel', 'Python'],
    experience: 3,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-24',
    name: 'Zara Khan',
    email: 'zara@humanet.com',
    role: 'Technical Writer',
    skills: ['Documentation', 'API Documentation', 'Technical Writing', 'Markdown'],
    experience: 3,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-25',
    name: 'Amit Verma',
    email: 'amit.verma@humanet.com',
    role: 'Engineering Manager',
    skills: ['Team Leadership', 'Hiring', 'Mentoring', 'Agile'],
    experience: 9,
    availability: 'Partially Available',
    department: 'Engineering'
  },
  {
    id: 'emp-26',
    name: 'Bhavana Nair',
    email: 'bhavana@humanet.com',
    role: 'Test Automation Engineer',
    skills: ['Cypress', 'Jest', 'Playwright', 'CI/CD'],
    experience: 4,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-27',
    name: 'Chetan Deshmukh',
    email: 'chetan@humanet.com',
    role: 'Solutions Architect',
    skills: ['System Design', 'Enterprise Architecture', 'Consulting', 'AWS'],
    experience: 8,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-28',
    name: 'Deepak Choudhury',
    email: 'deepak@humanet.com',
    role: 'Infrastructure Engineer',
    skills: ['Linux', 'Networking', 'Infrastructure as Code', 'Ansible'],
    experience: 6,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-29',
    name: 'Esha Malhotra',
    email: 'esha@humanet.com',
    role: 'Release Manager',
    skills: ['Release Management', 'Deployment', 'Version Control', 'Git'],
    experience: 5,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-30',
    name: 'Faisal Ahmed',
    email: 'faisal@humanet.com',
    role: 'Blockchain Developer',
    skills: ['Solidity', 'Ethereum', 'Smart Contracts', 'Web3'],
    experience: 3,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-31',
    name: 'Gitanjali Singh',
    email: 'gitanjali@humanet.com',
    role: 'Performance Engineer',
    skills: ['Performance Testing', 'JMeter', 'Load Testing', 'Optimization'],
    experience: 4,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-32',
    name: 'Harish Reddy',
    email: 'harish@humanet.com',
    role: 'AI/ML Researcher',
    skills: ['Research', 'Deep Learning', 'Computer Vision', 'Papers'],
    experience: 5,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-33',
    name: 'Isha Kapoor',
    email: 'isha@humanet.com',
    role: 'API Developer',
    skills: ['REST APIs', 'GraphQL', 'API Design', 'Microservices'],
    experience: 4,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-34',
    name: 'Jayesh Patel',
    email: 'jayesh@humanet.com',
    role: 'Game Developer',
    skills: ['Unity', 'C#', 'Game Design', '3D Graphics'],
    experience: 3,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-35',
    name: 'Kirti Jain',
    email: 'kirti@humanet.com',
    role: 'Embedded Systems Engineer',
    skills: ['C', 'C++', 'IoT', 'Embedded Systems'],
    experience: 5,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-36',
    name: 'Lokesh Yadav',
    email: 'lokesh@humanet.com',
    role: 'Network Engineer',
    skills: ['Networking', 'Cisco', 'Routers', 'Switches'],
    experience: 4,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-37',
    name: 'Madhuri Kulkarni',
    email: 'madhuri@humanet.com',
    role: 'ETL Developer',
    skills: ['ETL', 'Data Warehousing', 'SQL', 'Informatica'],
    experience: 5,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-38',
    name: 'Naveen Kumar',
    email: 'naveen@humanet.com',
    role: 'Salesforce Developer',
    skills: ['Salesforce', 'Apex', 'Lightning', 'CRM'],
    experience: 4,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-39',
    name: 'Omkar Shinde',
    email: 'omkar@humanet.com',
    role: 'Graphics Developer',
    skills: ['OpenGL', 'WebGL', 'Three.js', 'Graphics Programming'],
    experience: 3,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-40',
    name: 'Pradeep Mishra',
    email: 'pradeep@humanet.com',
    role: 'Integration Engineer',
    skills: ['API Integration', 'Middleware', 'SOA', 'ESB'],
    experience: 6,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-41',
    name: 'Qamar Ali',
    email: 'qamar@humanet.com',
    role: 'ERP Developer',
    skills: ['SAP', 'ERP', 'ABAP', 'Business Process'],
    experience: 5,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-42',
    name: 'Rajiv Sharma',
    email: 'rajiv@humanet.com',
    role: 'Support Engineer',
    skills: ['Technical Support', 'Troubleshooting', 'Customer Service', 'Linux'],
    experience: 3,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-43',
    name: 'Sapna Desai',
    email: 'sapna@humanet.com',
    role: 'Compliance Engineer',
    skills: ['Compliance', 'Security Standards', 'Auditing', 'GDPR'],
    experience: 4,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-44',
    name: 'Tanvi Saxena',
    email: 'tanvi@humanet.com',
    role: 'Accessibility Engineer',
    skills: ['Accessibility', 'WCAG', 'Screen Readers', 'Inclusive Design'],
    experience: 3,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-45',
    name: 'Umesh Rao',
    email: 'umesh@humanet.com',
    role: 'Platform Engineer',
    skills: ['Platform Engineering', 'Kubernetes', 'Service Mesh', 'Infrastructure'],
    experience: 6,
    availability: 'Available',
    department: 'Engineering'
  },
  {
    id: 'emp-46',
    name: 'Gayathri G',
    email: 'gayathri@humanet.com',
    role: 'HR Manager',
    skills: ['Recruitment', 'HR Operations', 'Employee Relations', 'HRIS'],
    experience: 7,
    availability: 'Available',
    department: 'HR'
  },
  {
    id: 'emp-47',
    name: 'Varun Kapoor',
    email: 'varun@humanet.com',
    role: 'Talent Acquisition Specialist',
    skills: ['Hiring', 'Interviewing', 'Sourcing', 'ATS'],
    experience: 4,
    availability: 'Available',
    department: 'HR'
  },
  {
    id: 'emp-48',
    name: 'Wasim Khan',
    email: 'wasim@humanet.com',
    role: 'HR Business Partner',
    skills: ['HR Strategy', 'Change Management', 'People Analytics', 'Leadership'],
    experience: 6,
    availability: 'Available',
    department: 'HR'
  },
  {
    id: 'emp-49',
    name: 'Xena Dsouza',
    email: 'xena@humanet.com',
    role: 'L&D Specialist',
    skills: ['Training', 'Learning Management', 'Employee Development', 'Coaching'],
    experience: 5,
    availability: 'Available',
    department: 'HR'
  },
  {
    id: 'emp-50',
    name: 'Yash Patil',
    email: 'yash@humanet.com',
    role: 'Compensation Analyst',
    skills: ['Compensation Planning', 'Benefits', 'Market Research', 'Excel'],
    experience: 4,
    availability: 'Available',
    department: 'HR'
  },
  {
    id: 'emp-51',
    name: 'Zoya Mirza',
    email: 'zoya@humanet.com',
    role: 'Recruiter',
    skills: ['Recruitment', 'LinkedIn', 'Job Postings', 'Candidate Screening'],
    experience: 3,
    availability: 'Available',
    department: 'HR'
  },
  {
    id: 'emp-52',
    name: 'Aarav Mehta',
    email: 'aarav@humanet.com',
    role: 'Employee Relations Manager',
    skills: ['Conflict Resolution', 'Employee Engagement', 'Policy', 'Communication'],
    experience: 6,
    availability: 'Available',
    department: 'HR'
  },
  {
    id: 'emp-53',
    name: 'Bella Fernandes',
    email: 'bella@humanet.com',
    role: 'HRIS Analyst',
    skills: ['HRIS Systems', 'Workday', 'Data Management', 'Reporting'],
    experience: 4,
    availability: 'Available',
    department: 'HR'
  },
  {
    id: 'emp-54',
    name: 'Chirag Gupta',
    email: 'chirag.g@humanet.com',
    role: 'Sales Manager',
    skills: ['Sales Strategy', 'Client Relations', 'Negotiation', 'CRM'],
    experience: 7,
    availability: 'Available',
    department: 'Sales'
  },
  {
    id: 'emp-55',
    name: 'Diya Sharma',
    email: 'diya@humanet.com',
    role: 'Business Development Executive',
    skills: ['Lead Generation', 'Prospecting', 'Sales', 'Communication'],
    experience: 3,
    availability: 'Available',
    department: 'Sales'
  },
  {
    id: 'emp-56',
    name: 'Ekta Rao',
    email: 'ekta@humanet.com',
    role: 'Account Manager',
    skills: ['Account Management', 'Customer Success', 'Relationship Building', 'Sales'],
    experience: 5,
    availability: 'Available',
    department: 'Sales'
  },
  {
    id: 'emp-57',
    name: 'Farhan Siddiqui',
    email: 'farhan@humanet.com',
    role: 'Sales Executive',
    skills: ['Sales', 'Product Demo', 'Closing', 'Presentations'],
    experience: 4,
    availability: 'Available',
    department: 'Sales'
  },
  {
    id: 'emp-58',
    name: 'Garima Joshi',
    email: 'garima@humanet.com',
    role: 'Inside Sales Representative',
    skills: ['Inside Sales', 'Cold Calling', 'Email Campaigns', 'CRM'],
    experience: 2,
    availability: 'Available',
    department: 'Sales'
  },
  {
    id: 'emp-59',
    name: 'Himanshu Verma',
    email: 'himanshu@humanet.com',
    role: 'Regional Sales Manager',
    skills: ['Territory Management', 'Sales Leadership', 'B2B Sales', 'Forecasting'],
    experience: 8,
    availability: 'Available',
    department: 'Sales'
  },
  {
    id: 'emp-60',
    name: 'Ishani Kulkarni',
    email: 'ishani@humanet.com',
    role: 'Customer Success Manager',
    skills: ['Customer Success', 'Onboarding', 'Retention', 'Product Knowledge'],
    experience: 5,
    availability: 'Available',
    department: 'Sales'
  },
  {
    id: 'emp-61',
    name: 'Jai Prakash',
    email: 'jai@humanet.com',
    role: 'Sales Operations Analyst',
    skills: ['Sales Analytics', 'Reporting', 'Process Optimization', 'CRM Administration'],
    experience: 4,
    availability: 'Available',
    department: 'Sales'
  },
  {
    id: 'emp-62',
    name: 'Kiran Bhat',
    email: 'kiran@humanet.com',
    role: 'Sales Coordinator',
    skills: ['Sales Support', 'Coordination', 'Documentation', 'CRM'],
    experience: 3,
    availability: 'Available',
    department: 'Sales'
  },
  {
    id: 'emp-63',
    name: 'Lavanya Reddy',
    email: 'lavanya@humanet.com',
    role: 'Enterprise Sales Director',
    skills: ['Enterprise Sales', 'Strategic Accounts', 'Sales Leadership', 'Partnerships'],
    experience: 10,
    availability: 'Available',
    department: 'Sales'
  },
  {
    id: 'emp-64',
    name: 'Mohit Agarwal',
    email: 'mohit@humanet.com',
    role: 'Channel Sales Manager',
    skills: ['Channel Management', 'Partner Relations', 'Sales Strategy', 'Negotiation'],
    experience: 6,
    availability: 'Available',
    department: 'Sales'
  },
  {
    id: 'emp-65',
    name: 'Neha Iyer',
    email: 'neha.iyer@humanet.com',
    role: 'Pre-Sales Engineer',
    skills: ['Pre-Sales', 'Technical Demos', 'Solution Design', 'Presentations'],
    experience: 5,
    availability: 'Available',
    department: 'Sales'
  },
  {
    id: 'emp-66',
    name: 'Omar Sheikh',
    email: 'omar@humanet.com',
    role: 'Marketing Manager',
    skills: ['Marketing Strategy', 'Campaign Management', 'Digital Marketing', 'Analytics'],
    experience: 6,
    availability: 'Available',
    department: 'Marketing'
  },
  {
    id: 'emp-67',
    name: 'Palak Singh',
    email: 'palak@humanet.com',
    role: 'Content Marketing Specialist',
    skills: ['Content Creation', 'SEO', 'Copywriting', 'Social Media'],
    experience: 4,
    availability: 'Available',
    department: 'Marketing'
  },
  {
    id: 'emp-68',
    name: 'Qasim Ali',
    email: 'qasim@humanet.com',
    role: 'Digital Marketing Executive',
    skills: ['Google Ads', 'Facebook Ads', 'PPC', 'Analytics'],
    experience: 3,
    availability: 'Available',
    department: 'Marketing'
  },
  {
    id: 'emp-69',
    name: 'Ritu Desai',
    email: 'ritu@humanet.com',
    role: 'Brand Manager',
    skills: ['Brand Strategy', 'Brand Identity', 'Marketing', 'Creative Direction'],
    experience: 5,
    availability: 'Available',
    department: 'Marketing'
  },
  {
    id: 'emp-70',
    name: 'Sahil Khanna',
    email: 'sahil@humanet.com',
    role: 'Social Media Manager',
    skills: ['Social Media', 'Community Management', 'Content Strategy', 'Analytics'],
    experience: 4,
    availability: 'Available',
    department: 'Marketing'
  },
  {
    id: 'emp-71',
    name: 'Tanuja Menon',
    email: 'tanuja@humanet.com',
    role: 'Marketing Analytics Manager',
    skills: ['Marketing Analytics', 'Data Visualization', 'Google Analytics', 'SQL'],
    experience: 5,
    availability: 'Available',
    department: 'Marketing'
  },
  {
    id: 'emp-72',
    name: 'Udit Sharma',
    email: 'udit@humanet.com',
    role: 'SEO Specialist',
    skills: ['SEO', 'Keyword Research', 'Link Building', 'Content Optimization'],
    experience: 4,
    availability: 'Available',
    department: 'Marketing'
  },
  {
    id: 'emp-73',
    name: 'Vidya Pillai',
    email: 'vidya@humanet.com',
    role: 'Email Marketing Manager',
    skills: ['Email Marketing', 'Campaign Automation', 'A/B Testing', 'Mailchimp'],
    experience: 5,
    availability: 'Available',
    department: 'Marketing'
  },
  {
    id: 'emp-74',
    name: 'Wahid Rahman',
    email: 'wahid@humanet.com',
    role: 'Growth Marketing Manager',
    skills: ['Growth Hacking', 'Experimentation', 'Funnel Optimization', 'Analytics'],
    experience: 6,
    availability: 'Available',
    department: 'Marketing'
  },
  {
    id: 'emp-75',
    name: 'Xavier D\'Souza',
    email: 'xavier@humanet.com',
    role: 'Product Marketing Manager',
    skills: ['Product Marketing', 'Go-to-Market', 'Positioning', 'Product Launches'],
    experience: 5,
    availability: 'Available',
    department: 'Marketing'
  },
  {
    id: 'emp-76',
    name: 'Yashika Malhotra',
    email: 'yashika@humanet.com',
    role: 'Finance Manager',
    skills: ['Financial Planning', 'Budgeting', 'Forecasting', 'Financial Analysis'],
    experience: 7,
    availability: 'Available',
    department: 'Finance'
  },
  {
    id: 'emp-77',
    name: 'Zaheer Khan',
    email: 'zaheer@humanet.com',
    role: 'Accountant',
    skills: ['Accounting', 'Bookkeeping', 'Financial Reporting', 'Tally'],
    experience: 4,
    availability: 'Available',
    department: 'Finance'
  },
  {
    id: 'emp-78',
    name: 'Aditi Menon',
    email: 'aditi.menon@humanet.com',
    role: 'Financial Analyst',
    skills: ['Financial Modeling', 'Excel', 'Analysis', 'Reporting'],
    experience: 3,
    availability: 'Available',
    department: 'Finance'
  },
  {
    id: 'emp-79',
    name: 'Brijesh Patel',
    email: 'brijesh@humanet.com',
    role: 'Tax Consultant',
    skills: ['Tax Planning', 'GST', 'Income Tax', 'Compliance'],
    experience: 6,
    availability: 'Available',
    department: 'Finance'
  },
  {
    id: 'emp-80',
    name: 'Chandni Rao',
    email: 'chandni@humanet.com',
    role: 'Payroll Specialist',
    skills: ['Payroll Processing', 'Benefits Administration', 'Compliance', 'Excel'],
    experience: 4,
    availability: 'Available',
    department: 'Finance'
  },
  {
    id: 'emp-81',
    name: 'Danish Shaikh',
    email: 'danish@humanet.com',
    role: 'Treasury Analyst',
    skills: ['Cash Management', 'Treasury Operations', 'Risk Management', 'Financial Analysis'],
    experience: 5,
    availability: 'Available',
    department: 'Finance'
  }
];

let projects = [
  {
    id: 'proj-1',
    title: 'E-commerce Platform Revamp',
    description: 'Modernize the existing e-commerce platform with React and microservices',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'AWS'],
    experience: { min: 3, max: 7 },
    teamSize: 5,
    timeline: '6 months',
    progress: 65,
    assignedEmployees: ['emp-1', 'emp-2'],
    createdAt: new Date('2024-01-10')
  },
  {
    id: 'proj-2',
    title: 'AI-Powered Analytics Dashboard',
    description: 'Build an AI-powered analytics dashboard for real-time data insights',
    requiredSkills: ['Python', 'TensorFlow', 'React', 'Data Analysis'],
    experience: { min: 4, max: 8 },
    teamSize: 4,
    timeline: '8 months',
    progress: 100,
    assignedEmployees: ['emp-3'],
    createdAt: new Date('2023-10-15')
  },
  {
    id: 'proj-3',
    title: 'Mobile App Development',
    description: 'Native mobile application for iOS and Android',
    requiredSkills: ['React Native', 'TypeScript', 'Mobile Development'],
    experience: { min: 3, max: 6 },
    teamSize: 3,
    timeline: '5 months',
    progress: 0,
    assignedEmployees: [],
    createdAt: new Date('2024-02-01')
  },
  {
    id: 'proj-4',
    title: 'Customer Portal Enhancement',
    description: 'Enhance customer portal with new features and improved UX',
    requiredSkills: ['React', 'TypeScript', 'UI/UX', 'GraphQL'],
    experience: { min: 2, max: 5 },
    teamSize: 3,
    timeline: '4 months',
    progress: 35,
    assignedEmployees: ['emp-1'],
    createdAt: new Date('2024-01-20')
  },
  {
    id: 'proj-5',
    title: 'Microservices Migration',
    description: 'Migrate monolithic application to microservices architecture',
    requiredSkills: ['Node.js', 'Docker', 'Kubernetes', 'AWS'],
    experience: { min: 5, max: 10 },
    teamSize: 6,
    timeline: '12 months',
    progress: 0,
    assignedEmployees: [],
    createdAt: new Date('2024-02-05')
  },
  {
    id: 'proj-6',
    title: 'Security Audit and Enhancement',
    description: 'Comprehensive security audit and implementation of best practices',
    requiredSkills: ['Security', 'DevOps', 'Networking'],
    experience: { min: 4, max: 8 },
    teamSize: 2,
    timeline: '3 months',
    progress: 100,
    assignedEmployees: [],
    createdAt: new Date('2023-11-01')
  },
  {
    id: 'proj-7',
    title: 'Data Warehouse Implementation',
    description: 'Build and deploy a scalable data warehouse solution',
    requiredSkills: ['SQL', 'Data Engineering', 'ETL', 'Python'],
    experience: { min: 4, max: 7 },
    teamSize: 4,
    timeline: '7 months',
    progress: 80,
    assignedEmployees: ['emp-3'],
    createdAt: new Date('2023-12-01')
  },
  {
    id: 'proj-8',
    title: 'Marketing Website Redesign',
    description: 'Complete redesign of the marketing website with modern stack',
    requiredSkills: ['React', 'Next.js', 'Tailwind CSS', 'SEO'],
    experience: { min: 2, max: 5 },
    teamSize: 3,
    timeline: '3 months',
    progress: 50,
    assignedEmployees: ['emp-1'],
    createdAt: new Date('2024-01-05')
  }
];
let projectAssignments = [];
let salaryPredictions = [];
let notifications = [];
let analyticsActivities = [
  { id: 'act-1', text: 'New candidate shortlisted: John Doe', time: '10 mins ago', type: 'candidate' },
  { id: 'act-2', text: 'Project "AI Dashboard" moved to execution', time: '1 hour ago', type: 'project' },
  { id: 'act-3', text: 'Offer sent to Sarah Johnson', time: '2 hours ago', type: 'offer' },
  { id: 'act-4', text: 'Salary prediction saved for Data Analyst role', time: '1 day ago', type: 'salary' }
];

let companySettings = {
  name: 'HumaNet Pvt Ltd',
  logoUrl: '',
  locations: ['Bangalore', 'Chennai', 'Hyderabad'],
  atsThreshold: 75,
  skillsKeywords: ['React', 'Node.js', 'Python', 'Data Science', 'Leadership']
};

const resolveResumeFilePath = resumeUrl => {
  if (!resumeUrl) {
    return null;
  }

  const relativePath = resumeUrl.replace(/^\/+/, '');
  if (!relativePath.startsWith('uploads')) {
    return null;
  }

  const filePath = path.normalize(path.join(__dirname, relativePath));
  if (!filePath.startsWith(uploadsDir)) {
    return null;
  }

  return filePath;
};

const deleteResumeFile = resumeUrl => {
  const filePath = resolveResumeFilePath(resumeUrl);
  if (!filePath) {
    return;
  }

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.warn(`Failed to delete resume file at ${filePath}:`, err.message);
  }
};

app.post('/api/candidates/upload', upload.array('resumes', 10), async (req, res) => {
  try {
    const files = req.files || [];
    const parsedCandidates = [];

    for (const file of files) {
      let extractedText = '';
      let csvCandidatesCreated = 0;

      if (file.mimetype === 'application/pdf') {
        try {
          const buffer = fs.readFileSync(file.path);
          const data = await pdf(buffer);
          extractedText = data.text;
        } catch (error) {
          console.error('Error parsing PDF:', error);
          continue;
        }
      } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ path: file.path });
        extractedText = result.value;
      } else if (file.mimetype === 'text/csv' || file.originalname.toLowerCase().endsWith('.csv')) {
        const csvContent = fs.readFileSync(file.path, 'utf-8');
        const lines = csvContent.split(/\r?\n/).filter(line => line.trim());

        if (lines.length > 0) {
          const parseCSVLine = (line) => {
            const values = [];
            let current = '';
            let inQuotes = false;

            for (let i = 0; i < line.length; i++) {
              const char = line[i];
              if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                  current += '"';
                  i++;
                } else {
                  inQuotes = !inQuotes;
                }
              } else if (char === ',' && !inQuotes) {
                values.push(current);
                current = '';
              } else {
                current += char;
              }
            }
            values.push(current);
            return values;
          };

          const headers = parseCSVLine(lines[0]).map(h => (h ?? '').trim().toLowerCase());

          for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            const row = {};
            headers.forEach((header, index) => {
              if (!header) {
                return;
              }
              const rawValue = values[index] ?? '';
              const cleanedValue = rawValue.replace(/^"|"$/g, '').trim();
              if (cleanedValue) {
                row[header] = cleanedValue;
              }
            });

            const getRowValue = (...keys) => {
              for (const key of keys) {
                if (key && row[key]) {
                  return row[key];
                }
              }
              return '';
            };

            const nameValue = getRowValue('name', 'full name', 'full_name', 'candidate name');
            const emailValue = getRowValue('email', 'email address', 'mail');
            const phoneValue = getRowValue('phone', 'phone number', 'mobile', 'contact');
            const skillsField = getRowValue('skills', 'skillset', 'key skills', 'skills set');
            const experienceValue = getRowValue('experience', 'experience_years', 'years of experience', 'experience (years)');
            const ctcValue = getRowValue('ctc', 'expected ctc', 'current ctc', 'salary');
            const locationValue = getRowValue('location', 'city', 'base location');
            const domainValue = getRowValue('domain', 'role', 'position', 'job title');
            const educationValue = getRowValue('education', 'qualification', 'degree');

            const skillsArray = skillsField
              ? Array.from(new Set(skillsField.split(/[,;|]/).map(skill => skill.trim()).filter(Boolean)))
              : [];

            const experienceNumber = parseFloat(experienceValue);
            const ctcNumber = parseFloat(ctcValue);

            const candidate = {
              id: `cand-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              name: nameValue || `CSV Candidate ${csvCandidatesCreated + 1}`,
              email: emailValue || `candidate${Date.now()}@example.com`,
              phone: phoneValue || '+91 9876543210',
              skills: skillsArray,
              experience: Number.isFinite(experienceNumber) ? Math.max(0, Math.round(experienceNumber)) : Math.floor(Math.random() * 8) + 2,
              ctc: Number.isFinite(ctcNumber) ? Math.max(0, Math.round(ctcNumber)) : Math.floor(Math.random() * 1000000) + 500000,
              location: locationValue || ['Bangalore', 'Chennai', 'Hyderabad', 'Mumbai'][Math.floor(Math.random() * 4)],
              domain: domainValue || ['Frontend', 'Backend', 'Full Stack', 'Data Science'][Math.floor(Math.random() * 4)],
              status: 'pending',
              education: educationValue || 'B.Tech Computer Science',
              resumeUrl: `/uploads/${file.filename}`,
              createdAt: new Date()
            };

            const normalizedCandidate = normalizeCandidate(candidate);

            if (candidateCollection && normalizedCandidate) {
              try {
                await candidateCollection.insertOne({ ...normalizedCandidate });
              } catch (error) {
                console.error('Failed to save candidate to MongoDB:', error);
              }
            }

            candidates.push(normalizedCandidate);
            parsedCandidates.push(normalizedCandidate);
            csvCandidatesCreated++;
          }
        }
      }

      if (csvCandidatesCreated === 0) {
        const emailMatch = extractedText.match(/[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}/);
        const phoneMatch = extractedText.match(/[+]?\d[\d\s-]{8,}/);
        const skillsMatch = extractedText.match(/(React|Node\.js|Python|Java|AWS|MongoDB|TypeScript|JavaScript|Docker|CI\/CD|AI|ML)/gi) || [];

        const candidate = {
          id: `cand-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: file.originalname.replace(/\.(pdf|docx|csv)$/i, '').replace(/[-_]/g, ' '),
          email: emailMatch ? emailMatch[0] : `candidate${Date.now()}@example.com`,
          phone: phoneMatch ? phoneMatch[0] : '+91 9876543210',
          skills: [...new Set(skillsMatch.map(skill => skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase()))],
          experience: Math.floor(Math.random() * 8) + 2,
          ctc: Math.floor(Math.random() * 1000000) + 500000,
          location: ['Bangalore', 'Chennai', 'Hyderabad', 'Mumbai'][Math.floor(Math.random() * 4)],
          domain: ['Frontend', 'Backend', 'Full Stack', 'Data Science'][Math.floor(Math.random() * 4)],
          status: 'pending',
          education: 'B.Tech Computer Science',
          resumeUrl: `/uploads/${file.filename}`,
          createdAt: new Date()
        };

        const normalizedCandidate = normalizeCandidate(candidate);

        if (candidateCollection && normalizedCandidate) {
          try {
            await candidateCollection.insertOne({ ...normalizedCandidate });
          } catch (error) {
            console.error('Failed to save candidate to MongoDB:', error);
          }
        }

        candidates.push(normalizedCandidate);
        parsedCandidates.push(normalizedCandidate);
      }
    }

    if (candidateCollection && parsedCandidates.length > 0) {
      await refreshCandidatesFromDB();
    }

    res.json({ success: true, data: parsedCandidates });
  } catch (error) {
    console.error('Resume parsing error:', error);
    res.status(500).json({ success: false, message: 'Failed to process resumes' });
  }
});

app.get('/api/candidates', async (req, res) => {
  try {
    await refreshCandidatesFromDB();
    res.json({ success: true, data: candidates });
  } catch (error) {
    console.error('Failed to get candidates:', error);
    res.json({ success: true, data: candidates });
  }
});

app.get('/api/candidates/:id', async (req, res) => {
  const candidateId = req.params.id;

  try {
    let candidate = candidates.find(c => c.id === candidateId);

    if (candidateCollection) {
      const document = await candidateCollection.findOne({ id: candidateId }, { projection: { _id: 0 } });
      if (document) {
        candidate = mapCandidateDocument(document);
        const existingIndex = candidates.findIndex(c => c.id === candidateId);
        if (existingIndex !== -1) {
          candidates[existingIndex] = candidate;
        } else if (candidate) {
          candidates.push(candidate);
        }
      }
    }

    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    res.json({ success: true, data: candidate });
  } catch (error) {
    console.error('Failed to get candidate:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch candidate' });
  }
});

app.put('/api/candidates/:id/status', async (req, res) => {
  const candidateId = req.params.id;

  try {
    const { status } = req.body;
    let candidate = candidates.find(c => c.id === candidateId);

    if (!candidate && candidateCollection) {
      const existing = await candidateCollection.findOne({ id: candidateId }, { projection: { _id: 0 } });
      if (existing) {
        candidate = mapCandidateDocument(existing);
        candidates.push(candidate);
      }
    }

    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    candidate.status = status;

    if (candidateCollection) {
      try {
        await candidateCollection.updateOne(
          { id: candidateId },
          { $set: { status } }
        );
        await refreshCandidatesFromDB();
        const refreshedCandidate = candidates.find(c => c.id === candidateId);
        if (refreshedCandidate) {
          candidate = refreshedCandidate;
        }
      } catch (error) {
        console.error('Failed to update candidate status in MongoDB:', error);
      }
    }

    if (status === 'shortlisted') {
      notifications.unshift({
        id: `notif-${Date.now()}`,
        message: `Candidate ${candidate.name} shortlisted`,
        type: 'candidate',
        read: false,
        timestamp: new Date()
      });
    }

    res.json({ success: true, data: candidate });
  } catch (error) {
    console.error('Failed to update candidate status:', error);
    res.status(500).json({ success: false, message: 'Failed to update candidate status' });
  }
});

app.delete('/api/candidates/:id', async (req, res) => {
  const candidateId = req.params.id;

  try {
    let candidateIndex = candidates.findIndex(c => c.id === candidateId);
    let candidate = candidateIndex !== -1 ? candidates[candidateIndex] : null;

    if (candidateCollection) {
      try {
        const deletion = await candidateCollection.findOneAndDelete({ id: candidateId }, { projection: { _id: 0 } });
        if (deletion.value) {
          candidate = mapCandidateDocument(deletion.value);
        } else if (!candidate) {
          return res.status(404).json({ success: false, message: 'Candidate not found' });
        }
      } catch (error) {
        console.error('Failed to delete candidate from MongoDB:', error);
        return res.status(500).json({ success: false, message: 'Failed to delete candidate' });
      }
    } else if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    if (candidateIndex !== -1) {
      candidates.splice(candidateIndex, 1);
    }

    deleteResumeFile(candidate?.resumeUrl);

    if (candidateCollection) {
      await refreshCandidatesFromDB();
    }

    res.json({ success: true, message: 'Candidate removed' });
  } catch (error) {
    console.error('Failed to delete candidate:', error);
    res.status(500).json({ success: false, message: 'Failed to delete candidate' });
  }
});

app.post('/api/projects', (req, res) => {
  const project = {
    id: `proj-${Date.now()}`,
    ...req.body,
    createdAt: new Date(),
    progress: 0,
    assignedEmployees: []
  };
  projects.unshift(project);
  res.json({ success: true, data: project });
});

app.get('/api/projects', (req, res) => {
  res.json({ success: true, data: projects });
});

app.get('/api/projects/:id', (req, res) => {
  const project = projects.find(p => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }
  res.json({ success: true, data: project });
});

app.post('/api/projects/:id/match', (req, res) => {
  const project = projects.find(p => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  const requiredSkills = (project.requiredSkills || []).map(skill => skill.toLowerCase());

  const matches = employees.map(employee => {
    const overlap = employee.skills.filter(skill => requiredSkills.includes(skill.toLowerCase())).length;
    const skillOverlapPercent = requiredSkills.length > 0 ? Math.round((overlap / requiredSkills.length) * 100) : 70;
    const matchScore = Math.min(95, Math.round(70 + overlap * 5 + employee.experience));
    const availability = employee.availability;

    return {
      ...employee,
      matchScore,
      skillOverlap: skillOverlapPercent,
      experienceFit: employee.experience >= (project.experience?.min || 3) ? 'Excellent' : 'Good',
      availability
    };
  }).sort((a, b) => b.matchScore - a.matchScore);

  res.json({ success: true, data: matches.slice(0, project.teamSize || 3) });
});

app.post('/api/projects/:id/assign', (req, res) => {
  const { employeeIds } = req.body;
  const project = projects.find(p => p.id === req.params.id);

  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  project.assignedEmployees = employeeIds;
  projectAssignments.push({
    id: `assign-${Date.now()}`,
    projectId: project.id,
    employeeIds,
    assignedAt: new Date()
  });

  notifications.unshift({
    id: `notif-${Date.now()}`,
    message: `Project ${project.title} assigned to ${employeeIds.length} employees`,
    type: 'project',
    read: false,
    timestamp: new Date()
  });

  res.json({ success: true, data: project });
});

app.put('/api/projects/:id/progress', (req, res) => {
  const project = projects.find(p => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  project.progress = Math.max(0, Math.min(100, req.body.progress || 0));
  res.json({ success: true, data: project });
});

app.post('/api/salary/predict', (req, res) => {
  const { role, skills = '', experience = 0, location = 'Bangalore', industry = 'IT', companySize = 'Medium', education = 'Bachelor' } = req.body;

  const expYears = parseInt(experience, 10) || 0;
  const skillCount = skills.split(',').map(s => s.trim()).filter(Boolean).length;
  const base = 400000 + expYears * 150000;
  const skillsPremium = skillCount * 50000;
  const locationMultiplier = { Bangalore: 1.2, Chennai: 1.05, Hyderabad: 1.1, Mumbai: 1.18, Coimbatore: 0.92 }[location] || 1.0;
  const industryPremium = industry === 'IT' ? 60000 : 30000;
  const educationPremium = education === 'Master' ? 50000 : education === 'PhD' ? 80000 : 0;
  const companyFactor = { Startup: 0.9, Small: 0.95, Medium: 1, Large: 1.1, Enterprise: 1.2 }[companySize] || 1;

  const ideal = (base + skillsPremium + industryPremium + educationPremium) * locationMultiplier * companyFactor;
  const min = ideal * 0.85;
  const max = ideal * 1.25;

  res.json({
    success: true,
    data: {
      role,
      min: Math.round(min),
      ideal: Math.round(ideal),
      max: Math.round(max),
      confidence: Math.min(95, 75 + skillCount * 2),
      breakdown: {
        base: Math.round(base),
        skillsPremium: Math.round(skillsPremium),
        locationFactor: Math.round(ideal - (base + skillsPremium + industryPremium + educationPremium)),
        industryPremium: Math.round(industryPremium + educationPremium)
      }
    }
  });
});

app.post('/api/salary/save', (req, res) => {
  const prediction = {
    id: `pred-${Date.now()}`,
    ...req.body,
    savedAt: new Date()
  };
  salaryPredictions.unshift(prediction);
  res.json({ success: true, data: prediction });
});

app.get('/api/salary/history', (req, res) => {
  res.json({ success: true, data: salaryPredictions });
});

app.delete('/api/salary/:id', (req, res) => {
  const index = salaryPredictions.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Prediction not found' });
  }
  salaryPredictions.splice(index, 1);
  res.json({ success: true, message: 'Prediction removed' });
});

app.get('/api/analytics/overview', (req, res) => {
  const now = new Date();
  const activeProjectsCount = projects.filter(project => project.progress > 0 && project.progress < 100).length;

  res.json({
    success: true,
    data: {
      totalEmployees: employees.length,
      activeProjects: activeProjectsCount,
      hiringThisMonth: candidates.filter(c => {
        if (!c.createdAt) return false;
        const createdAt = new Date(c.createdAt);
        return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
      }).length,
      avgTimeToHire: 18
    }
  });
});

app.get('/api/analytics/hiring-funnel', (req, res) => {
  const total = candidates.length;
  res.json({
    success: true,
    data: [
      { stage: 'Applied', count: total },
      { stage: 'Screened', count: Math.round(total * 0.7) },
      { stage: 'Interviewed', count: Math.round(total * 0.4) },
      { stage: 'Offered', count: candidates.filter(c => c.status === 'shortlisted').length },
      { stage: 'Hired', count: Math.round(candidates.filter(c => c.status === 'shortlisted').length * 0.6) }
    ]
  });
});

app.get('/api/analytics/projects', (req, res) => {
  res.json({
    success: true,
    data: projects.map(project => ({
      id: project.id,
      title: project.title,
      progress: project.progress,
      teamSize: project.teamSize,
      assignedEmployees: project.assignedEmployees?.length || 0
    }))
  });
});

app.get('/api/analytics/employees', (req, res) => {
  const departmentCounts = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});

  res.json({ success: true, data: departmentCounts });
});

app.get('/api/analytics/activities', (req, res) => {
  const recentActivities = [];
  
  const now = new Date();
  const thisMonth = candidates.filter(c => {
    if (!c.createdAt) return false;
    const createdAt = new Date(c.createdAt);
    return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
  });
  
  if (thisMonth.length > 0) {
    const latest = thisMonth.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    recentActivities.push({
      id: `act-cand-${latest.id}`,
      text: `New candidate shortlisted: ${latest.name}`,
      time: '10 mins ago',
      type: 'candidate'
    });
  }
  
  const recentProjects = projects.filter(p => p.progress > 0 && p.progress < 100).slice(0, 2);
  if (recentProjects.length > 0) {
    recentActivities.push({
      id: `act-proj-${recentProjects[0].id}`,
      text: `Project "${recentProjects[0].title}" in progress at ${recentProjects[0].progress}%`,
      time: '1 hour ago',
      type: 'project'
    });
  }
  
  const shortlistedCandidates = candidates.filter(c => c.status === 'shortlisted');
  if (shortlistedCandidates.length > 0) {
    recentActivities.push({
      id: `act-offer-${shortlistedCandidates[0].id}`,
      text: `Offer sent to ${shortlistedCandidates[0].name}`,
      time: '2 hours ago',
      type: 'offer'
    });
  }
  
  if (employees.length > 0) {
    const recentEmployee = employees[Math.floor(Math.random() * Math.min(5, employees.length))];
    recentActivities.push({
      id: `act-emp-${recentEmployee.id}`,
      text: `New employee onboarded: ${recentEmployee.name}`,
      time: '5 hours ago',
      type: 'employee'
    });
  }
  
  if (salaryPredictions.length > 0) {
    recentActivities.push({
      id: `act-sal-${salaryPredictions[0].id}`,
      text: `Salary prediction saved for ${salaryPredictions[0].role || 'Data Analyst role'}`,
      time: '1 day ago',
      type: 'salary'
    });
  } else {
    recentActivities.push({
      id: 'act-sal-default',
      text: 'Salary prediction saved for Data Analyst role',
      time: '1 day ago',
      type: 'salary'
    });
  }
  
  res.json({ success: true, data: recentActivities.slice(0, 5) });
});

app.get('/api/analytics/salary-expenses', (req, res) => {
  const avgSalaryPerEmployee = 520000;
  const totalEmployees = employees.length;
  const now = new Date();
  const currentMonth = now.getMonth();
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const salaryData = [];
  
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    const baseAmount = totalEmployees * avgSalaryPerEmployee;
    const growthFactor = 1 + (5 - i) * 0.025;
    const randomVariation = 0.98 + Math.random() * 0.04;
    const amount = Math.round(baseAmount * growthFactor * randomVariation);
    
    salaryData.push({
      month: monthNames[monthIndex],
      amount
    });
  }
  
  res.json({ success: true, data: salaryData });
});

app.post('/api/messages/send-email', (req, res) => {
  const { recipient, subject } = req.body;

  notifications.unshift({
    id: `notif-${Date.now()}`,
    message: `Email sent to ${recipient}: ${subject}`,
    type: 'general',
    read: false,
    timestamp: new Date()
  });

  res.json({ success: true, message: 'Email sent successfully' });
});

app.get('/api/messages/notifications', (req, res) => {
  res.json({ success: true, data: notifications });
});

app.put('/api/messages/:id/read', (req, res) => {
  const notification = notifications.find(n => n.id === req.params.id);
  if (notification) {
    notification.read = true;
  }
  res.json({ success: true });
});

app.get('/api/settings/company', (req, res) => {
  res.json({ success: true, data: companySettings });
});

app.put('/api/settings/company', (req, res) => {
  companySettings.name = req.body.name || companySettings.name;
  companySettings.logoUrl = req.body.logoUrl || companySettings.logoUrl;
  companySettings.locations = req.body.locations || companySettings.locations;
  res.json({ success: true, data: companySettings });
});

app.get('/api/settings/ats', (req, res) => {
  res.json({
    success: true,
    data: {
      atsThreshold: companySettings.atsThreshold,
      skillsKeywords: companySettings.skillsKeywords
    }
  });
});

app.put('/api/settings/ats', (req, res) => {
  if (typeof req.body.atsThreshold === 'number') {
    companySettings.atsThreshold = req.body.atsThreshold;
  }
  if (Array.isArray(req.body.skillsKeywords)) {
    companySettings.skillsKeywords = req.body.skillsKeywords;
  }
  res.json({ success: true, data: { atsThreshold: companySettings.atsThreshold, skillsKeywords: companySettings.skillsKeywords } });
});

let externalCandidates = [];

const AVAILABLE_AVAILABILITY_VALUES = ['Immediate', '15 Days', '1 Month'];
const AVAILABLE_AVAILABILITY_STATUSES = new Set(AVAILABLE_AVAILABILITY_VALUES);

const calculateMatchScore = (candidate, searchFilters) => {
  let score = 0;
  const candidateSkills = candidate.skills.map(s => s.toLowerCase());
  const requiredSkills = searchFilters.skills.map(s => s.toLowerCase());
  
  if (requiredSkills.length > 0) {
    const matchedSkills = requiredSkills.filter(skill => 
      candidateSkills.some(cs => cs.includes(skill) || skill.includes(cs))
    );
    score += (matchedSkills.length / requiredSkills.length) * 60;
  } else {
    score += 50;
  }
  
  const expMin = searchFilters.experience.min;
  const expMax = searchFilters.experience.max;
  if (candidate.experience >= expMin && candidate.experience <= expMax) {
    score += 30;
  } else if (candidate.experience >= expMin - 1 && candidate.experience <= expMax + 1) {
    score += 15;
  }
  
  if (searchFilters.location && candidate.location.toLowerCase().includes(searchFilters.location.toLowerCase())) {
    score += 10;
  }

  if (
    searchFilters.salaryBudget &&
    candidate.salaryInsights &&
    candidate.salaryInsights.salaryFit
  ) {
    const { status, fitPercentage } = candidate.salaryInsights.salaryFit;
    const normalizedFit = Math.max(0, Math.min(120, fitPercentage));

    if (status === 'perfect-match') {
      score += 20;
    } else if (status === 'below-budget') {
      score += 15;
    } else if (status === 'negotiable') {
      score += 12;
    }

    score += Math.min(10, normalizedFit / 10);
  }
  
  return Math.min(Math.round(score), 100);
};

/**
 * Build salary insights for a candidate using the salary prediction engine
 */
const buildSalaryInsights = (candidate, searchFilters) => {
  const targetRole =
    searchFilters.jobTitle ||
    candidate.currentRole ||
    searchFilters.keywords ||
    'Software Engineer';
  const targetIndustry = searchFilters.industry || 'IT/Tech';
  const targetLocation = candidate.location || searchFilters.location || 'Bangalore';
  const targetCompanySize = searchFilters.companySize || 'SME';

  const prediction = predictSalary({
    experience: candidate.experience,
    role: targetRole,
    location: targetLocation,
    industry: targetIndustry,
    skills: candidate.skills,
    companySize: targetCompanySize
  });

  const baseAmount = prediction.salaryRange.average;
  const variation = Math.random() * 0.25 - 0.1; // -10% to +15%
  const expectedCtc = Math.max(
    Math.round(baseAmount * (1 + variation)),
    prediction.salaryRange.min
  );

  let salaryFit = null;
  if (
    searchFilters.salaryBudget &&
    typeof searchFilters.salaryBudget.min === 'number' &&
    typeof searchFilters.salaryBudget.max === 'number'
  ) {
    salaryFit = checkSalaryFit(expectedCtc, searchFilters.salaryBudget);
  }

  const marketComparisons = getMarketComparison({
    experience: candidate.experience,
    role: targetRole,
    location: searchFilters.location || candidate.location || targetLocation,
    industry: targetIndustry,
    skills: candidate.skills,
    companySize: targetCompanySize
  }).map(entry => ({
    label: entry.companySize || entry.location,
    type: entry.companySize ? 'companySize' : 'location',
    salaryRange: entry.salaryRange,
    multiplier: entry.multiplier
  }));

  candidate.expectedCtc = expectedCtc;
  candidate.salaryInsights = {
    predictedRange: prediction.salaryRange,
    breakdown: prediction.breakdown,
    salaryFit,
    marketComparisons,
    formatted: {
      predictedMin: formatSalary(prediction.salaryRange.min),
      predictedMax: formatSalary(prediction.salaryRange.max),
      predictedAverage: formatSalary(prediction.salaryRange.average),
      expectedCtc: formatSalary(expectedCtc),
      budgetMin: salaryFit?.budgetRange?.min ? formatSalary(salaryFit.budgetRange.min) : null,
      budgetMax: salaryFit?.budgetRange?.max ? formatSalary(salaryFit.budgetRange.max) : null
    },
    summary: salaryFit ? salaryFit.message : 'No budget provided for salary matching',
    recommendation: salaryFit
      ? salaryFit.fits
        ? 'Candidate expectation is within your budget range.'
        : salaryFit.status === 'below-budget'
          ? 'Candidate expects below your budget—consider increasing offer for retention.'
          : salaryFit.status === 'negotiable'
            ? 'Candidate slightly exceeds budget; consider negotiation or perks.'
            : 'Candidate exceeds budget—requires approval to proceed.'
      : 'Provide a salary budget to unlock fit analysis.'
  };

  if (salaryFit) {
    candidate.salaryFitStatus = salaryFit.status;
    candidate.salaryFitPercentage = salaryFit.fitPercentage;
  }

  return candidate;
};

const generateMockLinkedInCandidates = (filters, count = 5) => {
  const names = [
    'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Neha Singh', 'Vikram Reddy',
    'Anjali Verma', 'Rahul Gupta', 'Sneha Desai', 'Karthik Iyer', 'Pooja Mehta',
    'Arjun Nair', 'Divya Rao', 'Sanjay Joshi', 'Kavita Menon', 'Ravi Kumar'
  ];
  
  const companies = ['Google', 'Amazon', 'Microsoft', 'TCS', 'Infosys', 'Wipro', 'Accenture', 'IBM', 'Oracle', 'SAP'];
  const roles = ['Software Engineer', 'Senior Developer', 'Tech Lead', 'Full Stack Developer', 'Frontend Engineer', 'Backend Developer', 'DevOps Engineer'];
  const locations = ['Bangalore', 'Mumbai', 'Hyderabad', 'Pune', 'Delhi', 'Chennai', 'Gurgaon', 'Noida'];
  const educations = ['B.Tech Computer Science', 'M.Tech Software Engineering', 'B.E. Information Technology', 'MCA', 'B.Sc. Computer Science'];
  
  const allSkills = ['React', 'Node.js', 'Python', 'Java', 'AWS', 'Docker', 'Kubernetes', 'TypeScript', 'JavaScript', 'MongoDB', 'PostgreSQL', 'GraphQL', 'Redis', 'Microservices', 'CI/CD'];
  
  const results = [];
  for (let i = 0; i < count; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const experience = Math.floor(Math.random() * (filters.experience.max - filters.experience.min + 1)) + filters.experience.min;
    
    let candidateSkills = [...(filters.skills || [])];
    const additionalSkills = allSkills.filter(s => !candidateSkills.includes(s));
    const numAdditionalSkills = Math.floor(Math.random() * 5) + 2;
    for (let j = 0; j < numAdditionalSkills; j++) {
      const randomSkill = additionalSkills[Math.floor(Math.random() * additionalSkills.length)];
      if (!candidateSkills.includes(randomSkill)) {
        candidateSkills.push(randomSkill);
      }
    }
    
    const selectedRole =
      filters.jobTitle || roles[Math.floor(Math.random() * roles.length)];
    const selectedLocation =
      filters.location || locations[Math.floor(Math.random() * locations.length)];

    const candidate = {
      id: `ext-linkedin-${Date.now()}-${i}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@linkedin.com`,
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      profileUrl: `https://linkedin.com/in/${name.toLowerCase().replace(/\s+/g, '-')}`,
      externalViewAvailable: true,
      externalViewMessage: 'Opens the candidate\'s LinkedIn profile in a new tab.',
      skills: candidateSkills,
      experience,
      currentCompany: companies[Math.floor(Math.random() * companies.length)],
      currentRole: selectedRole,
      location: selectedLocation,
      education: educations[Math.floor(Math.random() * educations.length)],
      bio: `Experienced ${selectedRole} with ${experience} years in software development. Passionate about building scalable applications.`,
      source: 'linkedin',
      atsScore: Math.floor(Math.random() * 30) + 70,
      availability: AVAILABLE_AVAILABILITY_VALUES[Math.floor(Math.random() * AVAILABLE_AVAILABILITY_VALUES.length)],
      status: 'discovered'
    };

    buildSalaryInsights(candidate, filters);
    candidate.matchScore = calculateMatchScore(candidate, filters);
    results.push(candidate);
  }
  
  return results;
};

const generateMockNaukriCandidates = (filters, count = 5) => {
  const names = [
    'Suresh Kumar', 'Lakshmi Iyer', 'Arun Kumar', 'Deepa Pillai', 'Manoj Singh',
    'Geetha Krishnan', 'Prakash Reddy', 'Sangeetha Nair', 'Vinod Kumar', 'Radha Menon',
    'Ramesh Patel', 'Sowmya Rao', 'Kiran Kumar', 'Meena Joshi', 'Sunil Verma'
  ];
  
  const companies = ['Tech Mahindra', 'HCL Technologies', 'L&T Infotech', 'Capgemini', 'Cognizant', 'Mphasis', 'Hexaware', 'Mindtree'];
  const roles = ['Senior Software Engineer', 'Technical Lead', 'Project Lead', 'Development Manager', 'Architect', 'Principal Engineer'];
  const locations = ['Bangalore', 'Mumbai', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Kochi', 'Ahmedabad'];
  const educations = ['B.Tech Computer Science', 'B.E. Electronics', 'M.Tech Information Technology', 'MCA', 'B.Sc. IT'];
  
  const allSkills = ['Java', 'Spring Boot', 'Hibernate', 'React', 'Angular', 'Vue.js', 'Node.js', 'Python', 'Django', 'Flask', 'MySQL', 'Oracle', 'AWS', 'Azure', 'GCP'];
  
  const results = [];
  for (let i = 0; i < count; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const experience = Math.floor(Math.random() * (filters.experience.max - filters.experience.min + 1)) + filters.experience.min;
    
    let candidateSkills = [...(filters.skills || [])];
    const additionalSkills = allSkills.filter(s => !candidateSkills.includes(s));
    const numAdditionalSkills = Math.floor(Math.random() * 6) + 3;
    for (let j = 0; j < numAdditionalSkills; j++) {
      const randomSkill = additionalSkills[Math.floor(Math.random() * additionalSkills.length)];
      if (!candidateSkills.includes(randomSkill)) {
        candidateSkills.push(randomSkill);
      }
    }
    
    const selectedRole =
      filters.jobTitle || roles[Math.floor(Math.random() * roles.length)];
    const selectedLocation =
      filters.location || locations[Math.floor(Math.random() * locations.length)];

    const candidate = {
      id: `ext-naukri-${Date.now()}-${i}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@naukri.com`,
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      profileUrl: null,
      externalViewAvailable: false,
      externalViewMessage: 'Direct profile viewing is not available for Naukri candidates due to platform restrictions. Contact details and full information are shown in the detail view.',
      skills: candidateSkills,
      experience,
      currentCompany: companies[Math.floor(Math.random() * companies.length)],
      currentRole: selectedRole,
      location: selectedLocation,
      education: educations[Math.floor(Math.random() * educations.length)],
      bio: `Results-driven professional with ${experience} years of expertise in software development and team leadership.`,
      source: 'naukri',
      atsScore: Math.floor(Math.random() * 30) + 70,
      availability: AVAILABLE_AVAILABILITY_VALUES[Math.floor(Math.random() * AVAILABLE_AVAILABILITY_VALUES.length)],
      status: 'discovered'
    };

    buildSalaryInsights(candidate, filters);
    candidate.matchScore = calculateMatchScore(candidate, filters);
    results.push(candidate);
  }
  
  return results;
};

app.post('/api/talent-scout/search', (req, res) => {
  try {
    const {
      platform,
      keywords,
      location,
      experience,
      skills = [],
      salaryBudget,
      jobTitle,
      industry,
      companySize
    } = req.body;
    
    if (!keywords || !keywords.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Keywords are required' 
      });
    }
    
    const normalizeBudgetValue = (value) => {
      if (value === null || value === undefined) {
        return null;
      }
      const numeric = Number(value);
      if (Number.isNaN(numeric)) {
        return null;
      }
      return numeric <= 1000 ? Math.round(numeric * 100000) : Math.round(numeric);
    };
    
    let parsedBudget = null;
    let derivedExperienceRange = null;
    
    if (salaryBudget && typeof salaryBudget === 'object') {
      const minBudget = normalizeBudgetValue(salaryBudget.min);
      const maxBudget = normalizeBudgetValue(salaryBudget.max);
      
      if (minBudget !== null && maxBudget !== null && maxBudget > 0) {
        parsedBudget = {
          min: Math.min(minBudget, maxBudget),
          max: Math.max(minBudget, maxBudget),
          includeNegotiable: salaryBudget.includeNegotiable !== false
        };
        
        derivedExperienceRange = getExperienceFromSalary(parsedBudget);
      }
    }
    
    const experienceRange = derivedExperienceRange 
      ? {
          min: derivedExperienceRange.min,
          max: derivedExperienceRange.max
        }
      : (experience && typeof experience === 'object'
          ? {
              min: typeof experience.min === 'number' ? experience.min : 0,
              max: typeof experience.max === 'number' ? experience.max : 15
            }
          : { min: 0, max: 15 });
    
    const filters = {
      platform: platform || 'both',
      keywords: keywords.trim(),
      location: location || '',
      experience: experienceRange,
      skills: Array.isArray(skills) ? skills : [],
      salaryBudget: parsedBudget,
      jobTitle: jobTitle || keywords.trim(),
      industry: industry || 'IT/Tech',
      companySize: companySize || 'SME',
      experienceFromSalary: derivedExperienceRange
    };
    
    let results = [];
    const resultsPerPlatform = req.body.resultsPerPlatform || 20;
    
    if (filters.platform === 'both' || filters.platform === 'linkedin') {
      results = results.concat(generateMockLinkedInCandidates(filters, resultsPerPlatform));
    }
    
    if (filters.platform === 'both' || filters.platform === 'naukri') {
      results = results.concat(generateMockNaukriCandidates(filters, resultsPerPlatform));
    }
    
    let filteredResults = results.filter(candidate => 
      AVAILABLE_AVAILABILITY_STATUSES.has(candidate.availability)
    );

    if (derivedExperienceRange && Array.isArray(derivedExperienceRange.probabilities)) {
      filteredResults = filteredResults.map(candidate => {
        const probabilityMatch = derivedExperienceRange.probabilities.find(entry => {
          const minYears = entry.experience.min;
          const maxYears = entry.experience.max;
          return candidate.experience >= minYears && candidate.experience <= maxYears;
        });

        if (probabilityMatch) {
          candidate.experienceProbability = probabilityMatch.probability;
          candidate.experienceRangeMatch = probabilityMatch.experience;
        } else {
          candidate.experienceProbability = null;
          candidate.experienceRangeMatch = null;
        }

        return candidate;
      });
    }
    
    filteredResults.sort((a, b) => b.matchScore - a.matchScore);
    
    filteredResults.forEach(candidate => {
      const existing = externalCandidates.find(c => c.id === candidate.id);
      if (!existing) {
        externalCandidates.push(candidate);
      }
    });
    
    const expectedValues = filteredResults
      .map(candidate => candidate.expectedCtc)
      .filter(value => typeof value === 'number');
    
    const averageExpectedCtc = expectedValues.length
      ? Math.round(expectedValues.reduce((sum, value) => sum + value, 0) / expectedValues.length)
      : null;
    
    const medianExpectedCtc = expectedValues.length
      ? (() => {
          const sorted = [...expectedValues].sort((a, b) => a - b);
          const mid = Math.floor(sorted.length / 2);
          if (sorted.length % 2 === 0) {
            return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
          }
          return sorted[mid];
        })()
      : null;
    
    const representativeExperience = Math.round((filters.experience.min + filters.experience.max) / 2);
    const representativeLocation = filters.location || (filteredResults[0]?.location ?? 'Bangalore');
    const representativeSkills = filters.skills.length
      ? filters.skills
      : (filteredResults[0]?.skills?.slice(0, 6) || []);
    
    const summaryPrediction = predictSalary({
      experience: representativeExperience,
      role: filters.jobTitle,
      location: representativeLocation,
      industry: filters.industry,
      skills: representativeSkills,
      companySize: filters.companySize
    });
    
    const summaryComparisons = getMarketComparison({
      experience: representativeExperience,
      role: filters.jobTitle,
      location: representativeLocation,
      industry: filters.industry,
      skills: representativeSkills,
      companySize: filters.companySize
    }).map(entry => ({
      label: entry.companySize || entry.location,
      type: entry.companySize ? 'companySize' : 'location',
      salaryRange: entry.salaryRange,
      multiplier: entry.multiplier
    }));
    
    const salarySummary = {
      budgetRange: parsedBudget,
      predictedRange: summaryPrediction.salaryRange,
      breakdown: summaryPrediction.breakdown,
      averageExpectedCtc,
      medianExpectedCtc,
      candidateCount: filteredResults.length,
      totalGenerated: results.length,
      marketComparisons: summaryComparisons,
      experienceMapping: derivedExperienceRange,
      formatted: {
        averageExpectedCtc: averageExpectedCtc ? formatSalary(averageExpectedCtc) : null,
        medianExpectedCtc: medianExpectedCtc ? formatSalary(medianExpectedCtc) : null,
        budgetMin: parsedBudget ? formatSalary(parsedBudget.min) : null,
        budgetMax: parsedBudget ? formatSalary(parsedBudget.max) : null,
        predictedMin: formatSalary(summaryPrediction.salaryRange.min),
        predictedMax: formatSalary(summaryPrediction.salaryRange.max)
      }
    };
    
    res.json({ success: true, data: filteredResults, salarySummary });
  } catch (error) {
    console.error('Talent scout search error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to search candidates' 
    });
  }
});

app.get('/api/talent-scout/candidates', (req, res) => {
  const invitedCandidates = externalCandidates.filter(c => 
    (c.status === 'invited' || c.status === 'applied') && 
    AVAILABLE_AVAILABILITY_STATUSES.has(c.availability)
  );
  res.json({ success: true, data: invitedCandidates });
});

app.post('/api/talent-scout/invite', (req, res) => {
  try {
    const { candidateId, jobId, message } = req.body;
    
    const candidate = externalCandidates.find(c => c.id === candidateId);
    
    if (!candidate) {
      return res.status(404).json({ 
        success: false, 
        message: 'Candidate not found' 
      });
    }
    
    candidate.status = 'invited';
    candidate.invitedAt = new Date();
    
    notifications.unshift({
      id: `notif-${Date.now()}`,
      message: `Invitation sent to ${candidate.name} from ${candidate.source}`,
      type: 'talent-scout',
      read: false,
      timestamp: new Date()
    });
    
    res.json({ 
      success: true, 
      message: `Invitation sent successfully to ${candidate.name}`,
      data: candidate
    });
  } catch (error) {
    console.error('Talent scout invite error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send invitation' 
    });
  }
});

app.post('/api/salary/predict', (req, res) => {
  try {
    const { experience, role, location, industry, skills, companySize } = req.body;

    if (typeof experience !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Experience (in years) is required'
      });
    }

    const prediction = predictSalary({
      experience,
      role: role || 'Software Engineer',
      location: location || 'Bangalore',
      industry: industry || 'IT/Tech',
      skills: skills || [],
      companySize: companySize || 'SME'
    });

    res.json({
      success: true,
      data: prediction
    });
  } catch (error) {
    console.error('Salary prediction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to predict salary'
    });
  }
});

app.post('/api/salary/market-comparison', (req, res) => {
  try {
    const { experience, role, location, industry, skills, companySize } = req.body;

    if (typeof experience !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Experience (in years) is required'
      });
    }

    const comparisons = getMarketComparison({
      experience,
      role: role || 'Software Engineer',
      location,
      industry: industry || 'IT/Tech',
      skills: skills || [],
      companySize: companySize || 'SME'
    });

    res.json({
      success: true,
      data: comparisons
    });
  } catch (error) {
    console.error('Market comparison error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get market comparison'
    });
  }
});

app.post('/api/salary/check-fit', (req, res) => {
  try {
    const { expectedSalary, budgetRange } = req.body;

    if (typeof expectedSalary !== 'number' || !budgetRange) {
      return res.status(400).json({
        success: false,
        message: 'Expected salary and budget range are required'
      });
    }

    const fitAnalysis = checkSalaryFit(expectedSalary, budgetRange);

    res.json({
      success: true,
      data: fitAnalysis
    });
  } catch (error) {
    console.error('Salary fit check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check salary fit'
    });
  }
});

app.listen(PORT, () => {
  console.log(`HumaNet backend listening on port ${PORT}`);
});
