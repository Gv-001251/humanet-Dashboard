const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
require('dotenv').config();

const uploadsDir = path.join(__dirname, 'uploads');

const ensureUploadsDirExists = () => {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
};

ensureUploadsDirExists();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
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

let users = [
  { id: 'user1', email: 'hr@humanet.com', password: 'hr123', name: 'Gayathri G', role: 'hr' },
  { id: 'user2', email: 'admin@humanet.com', password: 'admin123', name: 'Alex Doe', role: 'admin' },
  { id: 'user3', email: 'lead@humanet.com', password: 'lead123', name: 'Priya Singh', role: 'team_lead' },
  { id: 'user4', email: 'ceo@humanet.com', password: 'ceo123', name: 'Vikram Rao', role: 'ceo' },
  { id: 'user5', email: 'investor@humanet.com', password: 'investor123', name: 'Nisha Patel', role: 'investor' }
];

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
    atsScore: 85,
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
    atsScore: 92,
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
    atsScore: 88,
    status: 'pending',
    education: 'B.E. Software Engineering',
    resumeUrl: '/uploads/resume-vikram-patel.pdf',
    createdAt: new Date('2024-01-17')
  }
];

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
    department: 'Data Science'
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

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Missing authorization header' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  const user = users.find(u => token.includes(u.id));
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  req.user = { id: user.id, role: user.role, name: user.name, email: user.email };
  next();
};

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const { password: _password, ...userWithoutPassword } = user;
  res.json({
    success: true,
    token: `token-${user.id}-${Date.now()}`,
    user: userWithoutPassword
  });
});

app.post('/api/auth/logout', authenticate, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

app.post('/api/candidates/upload', authenticate, upload.array('resumes', 10), async (req, res) => {
  try {
    const files = req.files || [];
    const parsedCandidates = [];

    for (const file of files) {
      let extractedText = '';

      if (file.mimetype === 'application/pdf') {
        const buffer = fs.readFileSync(file.path);
        const data = await pdfParse(buffer);
        extractedText = data.text;
      } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ path: file.path });
        extractedText = result.value;
      }

      const emailMatch = extractedText.match(/[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}/);
      const phoneMatch = extractedText.match(/[+]?\d[\d\s-]{8,}/);
      const skillsMatch = extractedText.match(/(React|Node\.js|Python|Java|AWS|MongoDB|TypeScript|JavaScript|Docker|CI\/CD|AI|ML)/gi) || [];

      const candidate = {
        id: `cand-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.originalname.replace(/\.(pdf|docx)$/i, '').replace(/[-_]/g, ' '),
        email: emailMatch ? emailMatch[0] : `candidate${Date.now()}@example.com`,
        phone: phoneMatch ? phoneMatch[0] : '+91 9876543210',
        skills: [...new Set(skillsMatch.map(skill => skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase()))],
        experience: Math.floor(Math.random() * 8) + 2,
        ctc: Math.floor(Math.random() * 1000000) + 500000,
        location: ['Bangalore', 'Chennai', 'Hyderabad', 'Mumbai'][Math.floor(Math.random() * 4)],
        domain: ['Frontend', 'Backend', 'Full Stack', 'Data Science'][Math.floor(Math.random() * 4)],
        atsScore: Math.floor(Math.random() * 40) + 60,
        status: 'pending',
        education: 'B.Tech Computer Science',
        resumeUrl: `/uploads/${file.filename}`,
        createdAt: new Date()
      };

      candidates.push(candidate);
      parsedCandidates.push(candidate);
    }

    res.json({ success: true, data: parsedCandidates });
  } catch (error) {
    console.error('Resume parsing error:', error);
    res.status(500).json({ success: false, message: 'Failed to process resumes' });
  }
});

app.get('/api/candidates', authenticate, (req, res) => {
  res.json({ success: true, data: candidates });
});

app.get('/api/candidates/:id', authenticate, (req, res) => {
  const candidate = candidates.find(c => c.id === req.params.id);
  if (!candidate) {
    return res.status(404).json({ success: false, message: 'Candidate not found' });
  }
  res.json({ success: true, data: candidate });
});

app.put('/api/candidates/:id/status', authenticate, (req, res) => {
  const candidate = candidates.find(c => c.id === req.params.id);
  if (!candidate) {
    return res.status(404).json({ success: false, message: 'Candidate not found' });
  }

  const { status } = req.body;
  candidate.status = status;

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
});

app.delete('/api/candidates/:id', authenticate, (req, res) => {
  const index = candidates.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Candidate not found' });
  }
  
  const candidate = candidates[index];
  deleteResumeFile(candidate?.resumeUrl);
  
  candidates.splice(index, 1);
  res.json({ success: true, message: 'Candidate removed' });
});

app.post('/api/projects', authenticate, (req, res) => {
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

app.get('/api/projects', authenticate, (req, res) => {
  res.json({ success: true, data: projects });
});

app.get('/api/projects/:id', authenticate, (req, res) => {
  const project = projects.find(p => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }
  res.json({ success: true, data: project });
});

app.post('/api/projects/:id/match', authenticate, (req, res) => {
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

app.post('/api/projects/:id/assign', authenticate, (req, res) => {
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

app.put('/api/projects/:id/progress', authenticate, (req, res) => {
  const project = projects.find(p => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  project.progress = Math.max(0, Math.min(100, req.body.progress || 0));
  res.json({ success: true, data: project });
});

app.post('/api/salary/predict', authenticate, (req, res) => {
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

app.post('/api/salary/save', authenticate, (req, res) => {
  const prediction = {
    id: `pred-${Date.now()}`,
    ...req.body,
    savedAt: new Date()
  };
  salaryPredictions.unshift(prediction);
  res.json({ success: true, data: prediction });
});

app.get('/api/salary/history', authenticate, (req, res) => {
  res.json({ success: true, data: salaryPredictions });
});

app.delete('/api/salary/:id', authenticate, (req, res) => {
  const index = salaryPredictions.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Prediction not found' });
  }
  salaryPredictions.splice(index, 1);
  res.json({ success: true, message: 'Prediction removed' });
});

app.get('/api/analytics/overview', authenticate, (req, res) => {
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

app.get('/api/analytics/hiring-funnel', authenticate, (req, res) => {
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

app.get('/api/analytics/projects', authenticate, (req, res) => {
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

app.get('/api/analytics/employees', authenticate, (req, res) => {
  const departmentCounts = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});

  res.json({ success: true, data: departmentCounts });
});

app.get('/api/analytics/activities', authenticate, (req, res) => {
  res.json({ success: true, data: analyticsActivities });
});

app.post('/api/messages/send-email', authenticate, (req, res) => {
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

app.get('/api/messages/notifications', authenticate, (req, res) => {
  res.json({ success: true, data: notifications });
});

app.put('/api/messages/:id/read', authenticate, (req, res) => {
  const notification = notifications.find(n => n.id === req.params.id);
  if (notification) {
    notification.read = true;
  }
  res.json({ success: true });
});

app.get('/api/settings/profile', authenticate, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  const { password, ...userWithoutPassword } = user;
  res.json({ success: true, data: userWithoutPassword });
});

app.put('/api/settings/profile', authenticate, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  user.name = req.body.name || user.name;
  res.json({ success: true, data: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.put('/api/settings/password', authenticate, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  user.password = req.body.password;
  res.json({ success: true, message: 'Password updated successfully' });
});

app.get('/api/settings/users', authenticate, (req, res) => {
  res.json({
    success: true,
    data: users.map(({ password, ...user }) => user)
  });
});

app.post('/api/settings/users', authenticate, (req, res) => {
  const newUser = {
    id: `user-${Date.now()}`,
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password || 'password123'
  };
  users.push(newUser);
  const { password, ...userWithoutPassword } = newUser;
  res.json({ success: true, data: userWithoutPassword });
});

app.put('/api/settings/users/:id', authenticate, (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  Object.assign(user, req.body);
  const { password, ...userWithoutPassword } = user;
  res.json({ success: true, data: userWithoutPassword });
});

app.delete('/api/settings/users/:id', authenticate, (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  users.splice(index, 1);
  res.json({ success: true, message: 'User removed' });
});

app.get('/api/settings/company', authenticate, (req, res) => {
  res.json({ success: true, data: companySettings });
});

app.put('/api/settings/company', authenticate, (req, res) => {
  companySettings.name = req.body.name || companySettings.name;
  companySettings.logoUrl = req.body.logoUrl || companySettings.logoUrl;
  companySettings.locations = req.body.locations || companySettings.locations;
  res.json({ success: true, data: companySettings });
});

app.get('/api/settings/ats', authenticate, (req, res) => {
  res.json({
    success: true,
    data: {
      atsThreshold: companySettings.atsThreshold,
      skillsKeywords: companySettings.skillsKeywords
    }
  });
});

app.put('/api/settings/ats', authenticate, (req, res) => {
  if (typeof req.body.atsThreshold === 'number') {
    companySettings.atsThreshold = req.body.atsThreshold;
  }
  if (Array.isArray(req.body.skillsKeywords)) {
    companySettings.skillsKeywords = req.body.skillsKeywords;
  }
  res.json({ success: true, data: { atsThreshold: companySettings.atsThreshold, skillsKeywords: companySettings.skillsKeywords } });
});

let externalCandidates = [];

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
  
  return Math.min(Math.round(score), 100);
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
    
    const candidate = {
      id: `ext-linkedin-${Date.now()}-${i}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@linkedin.com`,
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      profileUrl: `https://linkedin.com/in/${name.toLowerCase().replace(/\s+/g, '-')}`,
      skills: candidateSkills,
      experience,
      currentCompany: companies[Math.floor(Math.random() * companies.length)],
      currentRole: roles[Math.floor(Math.random() * roles.length)],
      location: filters.location || locations[Math.floor(Math.random() * locations.length)],
      education: educations[Math.floor(Math.random() * educations.length)],
      bio: `Experienced ${roles[Math.floor(Math.random() * roles.length)]} with ${experience} years in software development. Passionate about building scalable applications.`,
      source: 'linkedin',
      atsScore: Math.floor(Math.random() * 30) + 70,
      availability: ['Immediate', '15 Days', '1 Month', 'Not Specified'][Math.floor(Math.random() * 4)],
      expectedCtc: Math.floor(Math.random() * 2000000) + 1000000,
      status: 'discovered'
    };
    
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
    
    const candidate = {
      id: `ext-naukri-${Date.now()}-${i}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@naukri.com`,
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      profileUrl: `https://naukri.com/profile/${name.toLowerCase().replace(/\s+/g, '-')}`,
      skills: candidateSkills,
      experience,
      currentCompany: companies[Math.floor(Math.random() * companies.length)],
      currentRole: roles[Math.floor(Math.random() * roles.length)],
      location: filters.location || locations[Math.floor(Math.random() * locations.length)],
      education: educations[Math.floor(Math.random() * educations.length)],
      bio: `Results-driven professional with ${experience} years of expertise in software development and team leadership.`,
      source: 'naukri',
      atsScore: Math.floor(Math.random() * 30) + 70,
      availability: ['Immediate', '15 Days', '1 Month', 'Not Specified'][Math.floor(Math.random() * 4)],
      expectedCtc: Math.floor(Math.random() * 2000000) + 800000,
      status: 'discovered'
    };
    
    candidate.matchScore = calculateMatchScore(candidate, filters);
    results.push(candidate);
  }
  
  return results;
};

app.post('/api/talent-scout/search', authenticate, (req, res) => {
  try {
    const { platform, keywords, location, experience, skills } = req.body;
    
    if (!keywords || !keywords.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Keywords are required' 
      });
    }
    
    const filters = {
      platform: platform || 'both',
      keywords: keywords.trim(),
      location: location || '',
      experience: experience || { min: 0, max: 15 },
      skills: skills || []
    };
    
    let results = [];
    
    if (filters.platform === 'both' || filters.platform === 'linkedin') {
      const linkedinResults = generateMockLinkedInCandidates(filters, 5);
      results = results.concat(linkedinResults);
    }
    
    if (filters.platform === 'both' || filters.platform === 'naukri') {
      const naukriResults = generateMockNaukriCandidates(filters, 5);
      results = results.concat(naukriResults);
    }
    
    results.sort((a, b) => b.matchScore - a.matchScore);
    
    results.forEach(candidate => {
      const existing = externalCandidates.find(c => c.id === candidate.id);
      if (!existing) {
        externalCandidates.push(candidate);
      }
    });
    
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Talent scout search error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to search candidates' 
    });
  }
});

app.get('/api/talent-scout/candidates', authenticate, (req, res) => {
  const invitedCandidates = externalCandidates.filter(c => c.status === 'invited' || c.status === 'applied');
  res.json({ success: true, data: invitedCandidates });
});

app.post('/api/talent-scout/invite', authenticate, (req, res) => {
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

app.listen(PORT, () => {
  console.log(`HumaNet backend listening on port ${PORT}`);
});
