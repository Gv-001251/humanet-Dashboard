const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB Configuration
// For development, we'll use in-memory data storage since the actual MongoDB cluster URL is not available
// In production, replace with actual MongoDB Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/humanet_hr';
const DB_NAME = process.env.DB_NAME || 'humanet_hr';

// In-memory data storage for development
let employeesData = [];
let candidatesData = [];
let offersData = [];
let documentVerificationData = [];
let jobPostingsData = [];

let db;

// Connect to MongoDB (or use in-memory storage for development)
async function connectToDatabase() {
  try {
    // Try to connect to MongoDB if available
    if (MONGODB_URI.includes('mongodb+srv://') || MONGODB_URI.includes('mongodb://localhost')) {
      const client = new MongoClient(MONGODB_URI);
      await client.connect();
      db = client.db(DB_NAME);
      console.log('Connected to MongoDB successfully');
      
      // Create indexes for better performance
      await createIndexes();
      
      // Insert sample data if collections are empty
      await insertSampleData();
    } else {
      console.log('Using in-memory data storage for development');
      // Initialize with sample data
      await insertSampleData();
    }
  } catch (error) {
    console.error('Database connection error:', error);
    console.log('Falling back to in-memory data storage');
    // Initialize with sample data for development
    await insertSampleData();
  }
}

// Create database indexes
async function createIndexes() {
  try {
    await db.collection('employees').createIndex({ email: 1 }, { unique: true });
    await db.collection('candidates').createIndex({ email: 1 });
    await db.collection('candidates').createIndex({ skills: 1 });
    await db.collection('candidates').createIndex({ experience_years: 1 });
    await db.collection('offers').createIndex({ candidate_id: 1 });
    await db.collection('document_verification').createIndex({ candidate_id: 1 });
    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

// Insert sample employee data
async function insertSampleData() {
  try {
    const sampleEmployees = [
      { 
        _id: 'emp1',
        name: "Gayathri G", 
        email: "gayathri.g@example.com", 
        phone: "+91 9876543210", 
        department: "Engineering", 
        role: "Software Engineer", 
        current_ctc: 800000, 
        expected_ctc: 1000000,
        created_at: new Date(),
        updated_at: new Date()
      },
      { 
        _id: 'emp2',
        name: "Athulya AM", 
        email: "athulya.am@example.com", 
        phone: "+91 9876543211", 
        department: "Engineering", 
        role: "Full Stack Developer", 
        current_ctc: 900000, 
        expected_ctc: 1200000,
        created_at: new Date(),
        updated_at: new Date()
      },
      { 
        _id: 'emp3',
        name: "Jheevashankar M", 
        email: "jheeva.m@example.com", 
        phone: "+91 9876543212", 
        department: "Design", 
        role: "UI/UX Designer", 
        current_ctc: 700000, 
        expected_ctc: 950000,
        created_at: new Date(),
        updated_at: new Date()
      },
      { 
        _id: 'emp4',
        name: "Priya Sharma", 
        email: "priya.s@example.com", 
        phone: "+91 9876543213", 
        department: "HR", 
        role: "HR Manager", 
        current_ctc: 850000, 
        expected_ctc: 1100000,
        created_at: new Date(),
        updated_at: new Date()
      },
      { 
        _id: 'emp5',
        name: "Rahul Kumar", 
        email: "rahul.k@example.com", 
        phone: "+91 9876543214", 
        department: "Engineering", 
        role: "DevOps Engineer", 
        current_ctc: 950000, 
        expected_ctc: 1300000,
        created_at: new Date(),
        updated_at: new Date()
      },
      { 
        _id: 'emp6',
        name: "Sneha Patel", 
        email: "sneha.p@example.com", 
        phone: "+91 9876543215", 
        department: "Marketing", 
        role: "Marketing Lead", 
        current_ctc: 750000, 
        expected_ctc: 1000000,
        created_at: new Date(),
        updated_at: new Date()
      },
      { 
        _id: 'emp7',
        name: "Vikram Singh", 
        email: "vikram.s@example.com", 
        phone: "+91 9876543216", 
        department: "Engineering", 
        role: "Backend Developer", 
        current_ctc: 880000, 
        expected_ctc: 1150000,
        created_at: new Date(),
        updated_at: new Date()
      },
      { 
        _id: 'emp8',
        name: "Anjali Mehta", 
        email: "anjali.m@example.com", 
        phone: "+91 9876543217", 
        department: "Product", 
        role: "Product Manager", 
        current_ctc: 1200000, 
        expected_ctc: 1500000,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    if (db) {
      // Use MongoDB
      const employeesCount = await db.collection('employees').countDocuments();
      if (employeesCount === 0) {
        await db.collection('employees').insertMany(sampleEmployees);
        console.log('Sample employee data inserted successfully');
      }
    } else {
      // Use in-memory storage
      if (employeesData.length === 0) {
        employeesData = [...sampleEmployees];
        console.log('Sample employee data initialized in memory');
      }
    }

    // Sample candidates data
    const sampleCandidates = [
      {
        _id: 'candidate1',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@email.com',
        phone: '+91 98765 43210',
        resume_url: '/uploads/sample-resume-1.pdf',
        resume_text: 'Experienced Full Stack Developer with 4.5 years of experience in React, Node.js, MongoDB, and AWS. Strong background in building scalable web applications and microservices.',
        skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'TypeScript', 'AWS', 'Docker', 'Express.js'],
        experience_years: 4.5,
        current_ctc: 800000,
        expected_ctc: 1200000,
        notice_period: 30,
        education: 'Bachelor of Technology in Computer Science - IIT Bombay, 2019',
        certifications: ['AWS Certified Developer', 'MongoDB Certified Developer'],
        fraud_check: {
          is_verified: true,
          risk_score: 15,
          flags: []
        },
        application_status: 'new',
        applied_date: new Date(),
        created_at: new Date(),
      },
      {
        _id: 'candidate2',
        name: 'Priya Patel',
        email: 'priya.patel@email.com',
        phone: '+91 98765 43211',
        resume_url: '/uploads/sample-resume-2.pdf',
        resume_text: 'UI/UX Designer with 3 years of experience in creating beautiful and intuitive user interfaces. Proficient in Figma, Adobe XD, and user research methodologies.',
        skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'User Research', 'Prototyping', 'Sketch', 'InVision'],
        experience_years: 3,
        current_ctc: 600000,
        expected_ctc: 900000,
        notice_period: 45,
        education: 'Master of Design in User Experience - NID, 2020',
        certifications: ['Google UX Design Certificate', 'Adobe Certified Expert'],
        fraud_check: {
          is_verified: true,
          risk_score: 25,
          flags: []
        },
        application_status: 'shortlisted',
        applied_date: new Date(Date.now() - 86400000 * 5), // 5 days ago
        created_at: new Date(),
      },
      {
        _id: 'candidate3',
        name: 'Arjun Kumar',
        email: 'arjun.kumar@email.com',
        phone: '+91 98765 43212',
        resume_url: '/uploads/sample-resume-3.pdf',
        resume_text: 'DevOps Engineer with 5 years of experience in cloud infrastructure, CI/CD pipelines, and containerization. Expert in AWS, Docker, Kubernetes, and Terraform.',
        skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Python', 'Bash', 'Jenkins', 'GitLab'],
        experience_years: 5,
        current_ctc: 1000000,
        expected_ctc: 1500000,
        notice_period: 60,
        education: 'Bachelor of Engineering in Computer Science - VIT, 2018',
        certifications: ['AWS Certified Solutions Architect', 'Certified Kubernetes Administrator'],
        fraud_check: {
          is_verified: true,
          risk_score: 10,
          flags: []
        },
        application_status: 'interviewed',
        applied_date: new Date(Date.now() - 86400000 * 10), // 10 days ago
        created_at: new Date(),
      },
      {
        _id: 'candidate4',
        name: 'Sneha Reddy',
        email: 'sneha.reddy@email.com',
        phone: '+91 98765 43213',
        resume_url: '/uploads/sample-resume-4.pdf',
        resume_text: 'Frontend Developer specializing in React and Vue.js with 2 years of experience. Strong focus on responsive design and performance optimization.',
        skills: ['React', 'Vue.js', 'JavaScript', 'TypeScript', 'CSS3', 'HTML5', 'Redux', 'Next.js'],
        experience_years: 2,
        current_ctc: 500000,
        expected_ctc: 750000,
        notice_period: 15,
        education: 'Bachelor of Technology in Information Technology - Anna University, 2021',
        certifications: ['React Developer Certificate'],
        fraud_check: {
          is_verified: false,
          risk_score: 35,
          flags: ['Document verification pending']
        },
        application_status: 'new',
        applied_date: new Date(Date.now() - 86400000 * 2), // 2 days ago
        created_at: new Date(),
      },
      {
        _id: 'candidate5',
        name: 'Vikram Singh',
        email: 'vikram.singh@email.com',
        phone: '+91 98765 43214',
        resume_url: '/uploads/sample-resume-5.pdf',
        resume_text: 'Backend Developer with 6 years of experience in Python, Django, and PostgreSQL. Strong background in API development and database optimization.',
        skills: ['Python', 'Django', 'PostgreSQL', 'REST API', 'GraphQL', 'Redis', 'Celery', 'Linux'],
        experience_years: 6,
        current_ctc: 1100000,
        expected_ctc: 1600000,
        notice_period: 90,
        education: 'Master of Technology in Computer Science - IIT Delhi, 2017',
        certifications: ['Python Institute Certification'],
        fraud_check: {
          is_verified: true,
          risk_score: 20,
          flags: []
        },
        application_status: 'offered',
        applied_date: new Date(Date.now() - 86400000 * 15), // 15 days ago
        created_at: new Date(),
      },
      {
        _id: 'candidate6',
        name: 'Anjali Gupta',
        email: 'anjali.gupta@email.com',
        phone: '+91 98765 43215',
        resume_url: '/uploads/sample-resume-6.pdf',
        resume_text: 'Full Stack Developer with 3.5 years of experience in MERN stack. Passionate about building scalable applications and learning new technologies.',
        skills: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'Bootstrap', 'Git', 'Jest'],
        experience_years: 3.5,
        current_ctc: 700000,
        expected_ctc: 1000000,
        notice_period: 30,
        education: 'Bachelor of Technology in Computer Science - BITS Pilani, 2020',
        certifications: ['MongoDB Developer Certificate'],
        fraud_check: {
          is_verified: true,
          risk_score: 30,
          flags: []
        },
        application_status: 'rejected',
        applied_date: new Date(Date.now() - 86400000 * 7), // 7 days ago
        created_at: new Date(),
      }
    ];

    // Sample job postings data
    const sampleJobPostings = [
      {
        _id: 'job1',
        title: 'Senior Full Stack Developer',
        department: 'Engineering',
        description: 'We are looking for a skilled full stack developer to join our team and work on cutting-edge web applications.',
        required_skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'AWS'],
        experience_required: 3,
        budget_min: 800000,
        budget_max: 1200000,
        location: 'Remote',
        employment_type: 'Full-time',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        _id: 'job2',
        title: 'UI/UX Designer',
        department: 'Design',
        description: 'Create beautiful and intuitive user experiences for our digital products.',
        required_skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Prototyping'],
        experience_required: 2,
        budget_min: 600000,
        budget_max: 900000,
        location: 'Hybrid',
        employment_type: 'Full-time',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        _id: 'job3',
        title: 'DevOps Engineer',
        department: 'Engineering',
        description: 'Manage our cloud infrastructure and deployment pipelines.',
        required_skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Python'],
        experience_required: 4,
        budget_min: 1000000,
        budget_max: 1500000,
        location: 'On-site',
        employment_type: 'Full-time',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        _id: 'job4',
        title: 'Product Manager',
        department: 'Product',
        description: 'Lead product development and strategy for our core products.',
        required_skills: ['Product Strategy', 'Agile', 'Analytics', 'User Research', 'Roadmapping'],
        experience_required: 5,
        budget_min: 1200000,
        budget_max: 1800000,
        location: 'Hybrid',
        employment_type: 'Full-time',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    if (db) {
      // Use MongoDB
      const jobPostingsCount = await db.collection('job_postings').countDocuments();
      if (jobPostingsCount === 0) {
        await db.collection('job_postings').insertMany(sampleJobPostings);
        console.log('Sample job postings data inserted successfully');
      }

      const candidatesCount = await db.collection('candidates').countDocuments();
      if (candidatesCount === 0) {
        await db.collection('candidates').insertMany(sampleCandidates);
        console.log('Sample candidates data inserted successfully');
      }
    } else {
      // Use in-memory storage
      if (jobPostingsData.length === 0) {
        jobPostingsData = [...sampleJobPostings];
        console.log('Sample job postings data initialized in memory');
      }

      if (candidatesData.length === 0) {
        candidatesData = [...sampleCandidates];
        console.log('Sample candidates data initialized in memory');
      }
    }
  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads')); // Serve uploaded files

// Initialize database connection
connectToDatabase();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Humanet HR Platform Backend is running!' });
});

// Employee Routes
app.get('/api/employees', async (req, res) => {
  try {
    let employees;
    if (db) {
      employees = await db.collection('employees').find({}).toArray();
    } else {
      employees = employeesData;
    }
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const employee = {
      _id: `emp${Date.now()}`,
      ...req.body,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    if (db) {
      const result = await db.collection('employees').insertOne(employee);
      res.status(201).json({ ...employee, _id: result.insertedId });
    } else {
      employeesData.push(employee);
      res.status(201).json(employee);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

app.get('/api/employees/:id', async (req, res) => {
  try {
    let employee;
    if (db) {
      const { ObjectId } = require('mongodb');
      employee = await db.collection('employees').findOne({ _id: new ObjectId(req.params.id) });
    } else {
      employee = employeesData.find(emp => emp._id === req.params.id);
    }
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

app.put('/api/employees/:id', async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updated_at: new Date()
    };
    
    if (db) {
      const { ObjectId } = require('mongodb');
      const result = await db.collection('employees').updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: updateData }
      );
      
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Employee not found' });
      }
    } else {
      const employeeIndex = employeesData.findIndex(emp => emp._id === req.params.id);
      if (employeeIndex === -1) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      employeesData[employeeIndex] = { ...employeesData[employeeIndex], ...updateData };
    }
    
    res.json({ message: 'Employee updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    if (db) {
      const { ObjectId } = require('mongodb');
      const result = await db.collection('employees').deleteOne({ _id: new ObjectId(req.params.id) });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Employee not found' });
      }
    } else {
      const employeeIndex = employeesData.findIndex(emp => emp._id === req.params.id);
      if (employeeIndex === -1) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      employeesData.splice(employeeIndex, 1);
    }
    
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

// Candidate Routes
app.get('/api/candidates', async (req, res) => {
  try {
    const { skills, minExp, maxExp, minCtc, maxCtc, status } = req.query;
    let candidates;
    
    if (db) {
      let filter = {};
      
      if (skills) {
        filter.skills = { $in: skills.split(',') };
      }
      if (minExp || maxExp) {
        filter.experience_years = {};
        if (minExp) filter.experience_years.$gte = parseInt(minExp);
        if (maxExp) filter.experience_years.$lte = parseInt(maxExp);
      }
      if (minCtc || maxCtc) {
        filter.expected_ctc = {};
        if (minCtc) filter.expected_ctc.$gte = parseInt(minCtc);
        if (maxCtc) filter.expected_ctc.$lte = parseInt(maxCtc);
      }
      if (status) {
        filter.application_status = status;
      }
      
      candidates = await db.collection('candidates').find(filter).toArray();
    } else {
      // Filter in-memory data
      candidates = candidatesData.filter(candidate => {
        if (skills) {
          const skillArray = skills.split(',');
          if (!skillArray.some(skill => candidate.skills.includes(skill))) {
            return false;
          }
        }
        if (minExp && candidate.experience_years < parseInt(minExp)) {
          return false;
        }
        if (maxExp && candidate.experience_years > parseInt(maxExp)) {
          return false;
        }
        if (minCtc && candidate.expected_ctc < parseInt(minCtc)) {
          return false;
        }
        if (maxCtc && candidate.expected_ctc > parseInt(maxCtc)) {
          return false;
        }
        if (status && candidate.application_status !== status) {
          return false;
        }
        return true;
      });
    }
    
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

app.post('/api/candidates/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Parse resume text (basic implementation)
    const resumeText = await parseResumeText(req.file.path, req.file.mimetype);
    
    const candidate = {
      _id: `candidate${Date.now()}`,
      name: req.body.name || 'Unknown',
      email: req.body.email || '',
      phone: req.body.phone || '',
      resume_url: `/uploads/${req.file.filename}`,
      resume_text: resumeText,
      skills: extractSkillsFromText(resumeText),
      experience_years: extractExperienceFromText(resumeText),
      current_ctc: parseInt(req.body.current_ctc) || 0,
      expected_ctc: parseInt(req.body.expected_ctc) || 0,
      notice_period: parseInt(req.body.notice_period) || 0,
      education: extractEducationFromText(resumeText),
      certifications: extractCertificationsFromText(resumeText),
      fraud_check: {
        is_verified: false,
        risk_score: Math.floor(Math.random() * 30) + 10, // Random score for demo
        flags: []
      },
      application_status: 'new',
      applied_date: new Date(),
      created_at: new Date()
    };
    
    if (db) {
      const result = await db.collection('candidates').insertOne(candidate);
      res.status(201).json({ ...candidate, _id: result.insertedId });
    } else {
      candidatesData.push(candidate);
      res.status(201).json(candidate);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to process resume upload' });
  }
});

app.post('/api/candidates', async (req, res) => {
  try {
    const candidate = {
      _id: `candidate${Date.now()}`,
      ...req.body,
      created_at: new Date()
    };
    
    if (db) {
      const result = await db.collection('candidates').insertOne(candidate);
      res.status(201).json({ ...candidate, _id: result.insertedId });
    } else {
      candidatesData.push(candidate);
      res.status(201).json(candidate);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create candidate' });
  }
});

app.get('/api/candidates/:id', async (req, res) => {
  try {
    let candidate;
    if (db) {
      const { ObjectId } = require('mongodb');
      candidate = await db.collection('candidates').findOne({ _id: new ObjectId(req.params.id) });
    } else {
      candidate = candidatesData.find(c => c._id === req.params.id);
    }
    
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch candidate' });
  }
});

app.put('/api/candidates/:id', async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updated_at: new Date()
    };
    
    if (db) {
      const { ObjectId } = require('mongodb');
      const result = await db.collection('candidates').updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: updateData }
      );
      
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Candidate not found' });
      }
    } else {
      const candidateIndex = candidatesData.findIndex(c => c._id === req.params.id);
      if (candidateIndex === -1) {
        return res.status(404).json({ error: 'Candidate not found' });
      }
      candidatesData[candidateIndex] = { ...candidatesData[candidateIndex], ...updateData };
    }
    
    res.json({ message: 'Candidate updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update candidate' });
  }
});

// Offer Routes
app.get('/api/offers', async (req, res) => {
  try {
    let offers;
    if (db) {
      offers = await db.collection('offers').find({}).toArray();
    } else {
      offers = offersData;
    }
    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
});

app.post('/api/offers', async (req, res) => {
  try {
    const offer = {
      _id: `offer${Date.now()}`,
      ...req.body,
      created_at: new Date(),
      sent_date: new Date(),
      status: 'pending'
    };
    
    // Calculate shopping risk
    const riskAssessment = calculateShoppingRisk(offer);
    offer.risk_assessment = riskAssessment;
    
    if (db) {
      const result = await db.collection('offers').insertOne(offer);
      res.status(201).json({ ...offer, _id: result.insertedId });
    } else {
      offersData.push(offer);
      res.status(201).json(offer);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create offer' });
  }
});

app.get('/api/offers/:id', async (req, res) => {
  try {
    let offer;
    if (db) {
      const { ObjectId } = require('mongodb');
      offer = await db.collection('offers').findOne({ _id: new ObjectId(req.params.id) });
    } else {
      offer = offersData.find(o => o._id === req.params.id);
    }
    
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    res.json(offer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch offer' });
  }
});

app.put('/api/offers/:id/status', async (req, res) => {
  try {
    const { status, response_date } = req.body;
    
    const updateData = {
      status,
      response_date: response_date || new Date(),
      updated_at: new Date()
    };
    
    if (db) {
      const { ObjectId } = require('mongodb');
      const result = await db.collection('offers').updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: updateData }
      );
      
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Offer not found' });
      }
    } else {
      const offerIndex = offersData.findIndex(o => o._id === req.params.id);
      if (offerIndex === -1) {
        return res.status(404).json({ error: 'Offer not found' });
      }
      offersData[offerIndex] = { ...offersData[offerIndex], ...updateData };
    }
    
    res.json({ message: 'Offer status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update offer status' });
  }
});

// Fraud Detection Routes
app.post('/api/fraud/verify', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No document uploaded' });
    }
    
    const fraudAnalysis = await analyzeDocumentForFraud(req.file.path);
    
    const verification = {
      _id: `verification${Date.now()}`,
      candidate_id: req.body.candidate_id,
      document_type: req.body.document_type || 'resume',
      document_url: `/uploads/${req.file.filename}`,
      verification_status: fraudAnalysis.risk_score > 70 ? 'fraud_detected' : 'verified',
      fraud_score: fraudAnalysis.risk_score,
      fraud_indicators: fraudAnalysis.indicators,
      verified_by: req.body.verified_by || 'system',
      verified_at: new Date(),
      created_at: new Date()
    };
    
    if (db) {
      const result = await db.collection('document_verification').insertOne(verification);
      res.status(201).json({ ...verification, _id: result.insertedId });
    } else {
      documentVerificationData.push(verification);
      res.status(201).json(verification);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify document' });
  }
});

app.get('/api/fraud/reports', async (req, res) => {
  try {
    let reports;
    if (db) {
      reports = await db.collection('document_verification').find({}).toArray();
    } else {
      reports = documentVerificationData;
    }
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fraud reports' });
  }
});

// Hike Analysis Routes
app.post('/api/hike/analyze', async (req, res) => {
  try {
    const { current_ctc, expected_ctc, experience_years, role, skills } = req.body;
    
    const analysis = {
      current_ctc,
      expected_ctc,
      experience_years,
      role,
      skills,
      hike_percentage: ((expected_ctc - current_ctc) / current_ctc) * 100,
      market_average_ctc: calculateMarketAverage(role, experience_years, skills),
      risk_assessment: assessHikeRisk(current_ctc, expected_ctc, experience_years),
      recommendations: generateHikeRecommendations(current_ctc, expected_ctc, experience_years),
      analyzed_at: new Date()
    };
    
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze hike expectation' });
  }
});

app.get('/api/hike/benchmarks', async (req, res) => {
  try {
    const benchmarks = {
      software_engineer: {
        '0-2': { min: 400000, max: 800000, avg: 600000 },
        '2-5': { min: 600000, max: 1200000, avg: 900000 },
        '5+': { min: 1000000, max: 2000000, avg: 1500000 }
      },
      full_stack_developer: {
        '0-2': { min: 500000, max: 900000, avg: 700000 },
        '2-5': { min: 700000, max: 1400000, avg: 1050000 },
        '5+': { min: 1200000, max: 2500000, avg: 1850000 }
      },
      ui_ux_designer: {
        '0-2': { min: 350000, max: 700000, avg: 525000 },
        '2-5': { min: 550000, max: 1100000, avg: 825000 },
        '5+': { min: 900000, max: 1800000, avg: 1350000 }
      }
    };
    
    res.json(benchmarks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch benchmarks' });
  }
});

// AutoMatch Routes
app.get('/api/jobs', async (req, res) => {
  try {
    // Return sample job postings for demo
    const sampleJobs = [
      {
        _id: 'job1',
        title: 'Senior Software Engineer',
        department: 'Engineering',
        required_skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        min_experience: 3,
        max_experience: 8,
        max_ctc: 1500000,
        max_notice_period: 30,
        created_at: new Date()
      },
      {
        _id: 'job2',
        title: 'Full Stack Developer',
        department: 'Engineering',
        required_skills: ['Python', 'Django', 'React', 'PostgreSQL'],
        min_experience: 2,
        max_experience: 6,
        max_ctc: 1200000,
        max_notice_period: 45,
        created_at: new Date()
      }
    ];
    
    res.json(sampleJobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

app.post('/api/jobs', async (req, res) => {
  try {
    const job = {
      _id: `job${Date.now()}`,
      ...req.body,
      created_at: new Date()
    };
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job posting' });
  }
});

app.get('/api/jobs/:id/match', async (req, res) => {
  try {
    // Sample job for demo
    const job = {
      _id: req.params.id,
      title: 'Senior Software Engineer',
      department: 'Engineering',
      required_skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      min_experience: 3,
      max_experience: 8,
      max_ctc: 1500000,
      max_notice_period: 30
    };
    
    const candidates = candidatesData.length > 0 ? candidatesData : [];
    
    const matches = candidates.map(candidate => {
      const matchScore = calculateMatchScore(candidate, job);
      return {
        ...candidate,
        match_score: matchScore,
        match_reasons: getMatchReasons(candidate, job)
      };
    }).sort((a, b) => b.match_score - a.match_score);
    
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: 'Failed to find matches' });
  }
});

// Job Postings API endpoints
app.get('/api/jobs', async (req, res) => {
  try {
    let jobs;
    if (db) {
      jobs = await db.collection('job_postings').find({}).toArray();
    } else {
      jobs = jobPostingsData;
    }
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job postings' });
  }
});

app.post('/api/jobs', async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      _id: `job${Date.now()}`,
      created_at: new Date(),
      updated_at: new Date()
    };

    if (db) {
      await db.collection('job_postings').insertOne(jobData);
    } else {
      jobPostingsData.push(jobData);
    }

    res.status(201).json(jobData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job posting' });
  }
});

app.get('/api/jobs/:id', async (req, res) => {
  try {
    let job;
    if (db) {
      job = await db.collection('job_postings').findOne({ _id: req.params.id });
    } else {
      job = jobPostingsData.find(j => j._id === req.params.id);
    }

    if (!job) {
      return res.status(404).json({ error: 'Job posting not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job posting' });
  }
});

app.put('/api/jobs/:id', async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updated_at: new Date()
    };

    if (db) {
      const result = await db.collection('job_postings').updateOne(
        { _id: req.params.id },
        { $set: updateData }
      );
      
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Job posting not found' });
      }
    } else {
      const jobIndex = jobPostingsData.findIndex(j => j._id === req.params.id);
      if (jobIndex === -1) {
        return res.status(404).json({ error: 'Job posting not found' });
      }
      jobPostingsData[jobIndex] = { ...jobPostingsData[jobIndex], ...updateData };
    }

    res.json({ message: 'Job posting updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job posting' });
  }
});

app.delete('/api/jobs/:id', async (req, res) => {
  try {
    if (db) {
      const result = await db.collection('job_postings').deleteOne({ _id: req.params.id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Job posting not found' });
      }
    } else {
      const jobIndex = jobPostingsData.findIndex(j => j._id === req.params.id);
      if (jobIndex === -1) {
        return res.status(404).json({ error: 'Job posting not found' });
      }
      jobPostingsData.splice(jobIndex, 1);
    }

    res.json({ message: 'Job posting deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete job posting' });
  }
});

app.get('/api/jobs/:id/matches', async (req, res) => {
  try {
    let job;
    if (db) {
      job = await db.collection('job_postings').findOne({ _id: req.params.id });
    } else {
      job = jobPostingsData.find(j => j._id === req.params.id);
    }

    if (!job) {
      return res.status(404).json({ error: 'Job posting not found' });
    }

    let candidates;
    if (db) {
      candidates = await db.collection('candidates').find({}).toArray();
    } else {
      candidates = candidatesData;
    }

    const matches = candidates.map(candidate => {
      const matchScore = calculateMatchScore(candidate, job);
      return {
        ...candidate,
        match_score: matchScore,
        match_reasons: getMatchReasons(candidate, job)
      };
    }).sort((a, b) => b.match_score - a.match_score);

    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: 'Failed to find matches' });
  }
});

// Utility functions
async function parseResumeText(filePath, mimeType) {
  // Basic text extraction - in production, use proper PDF/DOCX parsing libraries
  try {
    if (mimeType === 'application/pdf') {
      // For PDF files, you would use pdf-parse library
      return 'PDF content extracted - implement proper PDF parsing';
    } else if (mimeType.includes('wordprocessingml') || mimeType.includes('msword')) {
      // For DOCX/DOC files, you would use mammoth library
      return 'DOC content extracted - implement proper DOC parsing';
    }
    return 'Text content extracted';
  } catch (error) {
    console.error('Error parsing resume:', error);
    return '';
  }
}

function extractSkillsFromText(text) {
  const commonSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'AWS', 'Git'];
  const foundSkills = commonSkills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
  return foundSkills;
}

function extractExperienceFromText(text) {
  const expMatch = text.match(/(\d+)\s*(?:year|yr)s?\s*(?:of\s*)?experience/i);
  return expMatch ? parseInt(expMatch[1]) : 0;
}

function extractEducationFromText(text) {
  if (text.toLowerCase().includes('bachelor') || text.toLowerCase().includes('btech')) {
    return 'Bachelor\'s Degree';
  }
  if (text.toLowerCase().includes('master') || text.toLowerCase().includes('mtech')) {
    return 'Master\'s Degree';
  }
  return 'Education details not specified';
}

function extractCertificationsFromText(text) {
  const certs = [];
  if (text.toLowerCase().includes('aws')) certs.push('AWS Certified');
  if (text.toLowerCase().includes('google')) certs.push('Google Certified');
  return certs;
}

function calculateShoppingRisk(offer) {
  const hikePercentage = ((offer.offered_ctc - offer.current_ctc) / offer.current_ctc) * 100;
  
  let riskFactors = [];
  let shoppingRisk = false;
  
  if (hikePercentage > 40) {
    riskFactors.push('High hike percentage (>40%)');
    shoppingRisk = true;
  }
  
  if (offer.offered_ctc > offer.current_ctc * 1.5) {
    riskFactors.push('Significant CTC increase');
    shoppingRisk = true;
  }
  
  let recommendation = 'Proceed with offer';
  if (shoppingRisk) {
    recommendation = 'High shopping risk - consider negotiation';
  }
  
  return {
    shopping_risk: shoppingRisk,
    risk_factors: riskFactors,
    recommendation: recommendation
  };
}

async function analyzeDocumentForFraud(filePath) {
  // Basic fraud detection - in production, implement more sophisticated analysis
  const indicators = [];
  let riskScore = Math.floor(Math.random() * 30) + 10; // Random score between 10-40 for demo
  
  // Add some mock indicators
  if (Math.random() > 0.7) {
    indicators.push('Font inconsistency detected');
    riskScore += 20;
  }
  if (Math.random() > 0.8) {
    indicators.push('Date format mismatch');
    riskScore += 15;
  }
  
  return {
    risk_score: Math.min(riskScore, 100),
    indicators
  };
}

function calculateMarketAverage(role, experience, skills) {
  const baseSalary = {
    'Software Engineer': 800000,
    'Full Stack Developer': 900000,
    'UI/UX Designer': 700000,
    'DevOps Engineer': 950000,
    'Product Manager': 1200000
  };
  
  const experienceMultiplier = {
    '0-2': 1.0,
    '2-5': 1.5,
    '5+': 2.0
  };
  
  const expRange = experience < 2 ? '0-2' : experience < 5 ? '2-5' : '5+';
  return Math.round(baseSalary[role] * experienceMultiplier[expRange]);
}

function assessHikeRisk(currentCtc, expectedCtc, experience) {
  const hikePercentage = ((expectedCtc - currentCtc) / currentCtc) * 100;
  
  if (hikePercentage > 50) return 'High Risk';
  if (hikePercentage > 30) return 'Medium Risk';
  return 'Low Risk';
}

function generateHikeRecommendations(currentCtc, expectedCtc, experience) {
  const hikePercentage = ((expectedCtc - currentCtc) / currentCtc) * 100;
  const recommendations = [];
  
  if (hikePercentage > 40) {
    recommendations.push('Consider negotiating a lower hike percentage');
    recommendations.push('Offer additional benefits instead of high salary');
  } else {
    recommendations.push('Hike percentage is within acceptable range');
    recommendations.push('Proceed with the offer');
  }
  
  return recommendations;
}

function calculateMatchScore(candidate, job) {
  let score = 0;
  
  // Skills match (40% weight)
  const skillMatches = candidate.skills.filter(skill => 
    job.required_skills.includes(skill)
  ).length;
  score += (skillMatches / job.required_skills.length) * 40;
  
  // Experience match (30% weight)
  if (candidate.experience_years >= job.min_experience && 
      candidate.experience_years <= job.max_experience) {
    score += 30;
  } else {
    score += 20 - Math.abs(candidate.experience_years - job.min_experience) * 2;
  }
  
  // CTC match (20% weight)
  if (candidate.expected_ctc <= job.max_ctc) {
    score += 20;
  } else {
    score += Math.max(0, 20 - (candidate.expected_ctc - job.max_ctc) / 100000);
  }
  
  // Notice period match (10% weight)
  if (candidate.notice_period <= job.max_notice_period) {
    score += 10;
  }
  
  return Math.min(Math.max(score, 0), 100);
}

function getMatchReasons(candidate, job) {
  const reasons = [];
  
  const skillMatches = candidate.skills.filter(skill => 
    job.required_skills.includes(skill)
  );
  if (skillMatches.length > 0) {
    reasons.push(`Matches ${skillMatches.length} required skills: ${skillMatches.join(', ')}`);
  }
  
  if (candidate.experience_years >= job.min_experience) {
    reasons.push(`Has ${candidate.experience_years} years of experience`);
  }
  
  if (candidate.expected_ctc <= job.max_ctc) {
    reasons.push(`CTC expectation within budget`);
  }
  
  return reasons;
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});