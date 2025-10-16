# Humanet HR Platform - API Documentation

Base URL: `http://localhost:3001/api`

## Table of Contents
1. [Dashboard APIs](#dashboard-apis)
2. [Employee APIs](#employee-apis)
3. [Candidate APIs](#candidate-apis)
4. [Offer APIs](#offer-apis)
5. [Job Posting APIs](#job-posting-apis)
6. [Fraud Detection APIs](#fraud-detection-apis)
7. [Hike Analysis APIs](#hike-analysis-apis)
8. [Salary Prediction APIs](#salary-prediction-apis)
9. [HR Assistance APIs](#hr-assistance-apis)

---

## Dashboard APIs

### Get Dashboard Statistics
Retrieves overall statistics for the HR dashboard.

**Endpoint:** `GET /dashboard/stats`

**Response:**
```json
{
  "totalEmployees": 8,
  "totalCandidates": 6,
  "pendingOffers": 2,
  "acceptedOffers": 1,
  "rejectedOffers": 0,
  "newCandidates": 3,
  "shortlistedCandidates": 1,
  "highRiskCandidates": 0
}
```

---

## Employee APIs

### Get All Employees
Retrieves a list of all employees.

**Endpoint:** `GET /employees`

**Response:**
```json
[
  {
    "_id": "emp1",
    "name": "Gayathri G",
    "email": "gayathri.g@example.com",
    "phone": "+91 9876543210",
    "department": "Engineering",
    "role": "Software Engineer",
    "current_ctc": 800000,
    "expected_ctc": 1000000,
    "created_at": "2024-10-16T10:00:00.000Z",
    "updated_at": "2024-10-16T10:00:00.000Z"
  }
]
```

### Get Employee by ID
Retrieves a specific employee by ID.

**Endpoint:** `GET /employees/:id`

**Response:**
```json
{
  "_id": "emp1",
  "name": "Gayathri G",
  "email": "gayathri.g@example.com",
  "phone": "+91 9876543210",
  "department": "Engineering",
  "role": "Software Engineer",
  "current_ctc": 800000,
  "expected_ctc": 1000000,
  "created_at": "2024-10-16T10:00:00.000Z",
  "updated_at": "2024-10-16T10:00:00.000Z"
}
```

### Create Employee
Creates a new employee record.

**Endpoint:** `POST /employees`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+91 9876543210",
  "department": "Engineering",
  "role": "Software Engineer",
  "current_ctc": 800000,
  "expected_ctc": 1000000
}
```

**Response:**
```json
{
  "_id": "emp123",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+91 9876543210",
  "department": "Engineering",
  "role": "Software Engineer",
  "current_ctc": 800000,
  "expected_ctc": 1000000,
  "created_at": "2024-10-16T10:00:00.000Z",
  "updated_at": "2024-10-16T10:00:00.000Z"
}
```

### Update Employee
Updates an existing employee.

**Endpoint:** `PUT /employees/:id`

**Request Body:**
```json
{
  "department": "Product",
  "role": "Senior Software Engineer",
  "current_ctc": 1200000
}
```

**Response:**
```json
{
  "message": "Employee updated successfully"
}
```

### Delete Employee
Deletes an employee by ID.

**Endpoint:** `DELETE /employees/:id`

**Response:**
```json
{
  "message": "Employee deleted successfully"
}
```

---

## Candidate APIs

### Get All Candidates
Retrieves candidates with optional filters.

**Endpoint:** `GET /candidates`

**Query Parameters:**
- `skills` (optional): Comma-separated list of skills
- `minExp` (optional): Minimum experience in years
- `maxExp` (optional): Maximum experience in years
- `minCtc` (optional): Minimum expected CTC
- `maxCtc` (optional): Maximum expected CTC
- `status` (optional): Application status (new, shortlisted, interviewed, offered, rejected)

**Example:** `GET /candidates?skills=React,Node.js&minExp=3&status=shortlisted`

**Response:**
```json
[
  {
    "_id": "candidate1",
    "name": "Rahul Sharma",
    "email": "rahul.sharma@email.com",
    "phone": "+91 98765 43210",
    "resume_url": "/uploads/sample-resume-1.pdf",
    "resume_text": "Experienced Full Stack Developer...",
    "skills": ["React", "Node.js", "MongoDB", "JavaScript", "TypeScript"],
    "experience_years": 4.5,
    "current_ctc": 800000,
    "expected_ctc": 1200000,
    "notice_period": 30,
    "education": "Bachelor of Technology in Computer Science - IIT Bombay",
    "certifications": ["AWS Certified Developer"],
    "fraud_check": {
      "is_verified": true,
      "risk_score": 15,
      "flags": []
    },
    "application_status": "new",
    "applied_date": "2024-10-16T10:00:00.000Z",
    "created_at": "2024-10-16T10:00:00.000Z"
  }
]
```

### Upload Resume
Uploads and parses a resume file.

**Endpoint:** `POST /candidates/upload`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `resume` (file): Resume file (PDF, DOC, DOCX)
- `name` (optional): Candidate name
- `email` (optional): Candidate email
- `phone` (optional): Candidate phone
- `current_ctc` (optional): Current CTC
- `expected_ctc` (optional): Expected CTC
- `notice_period` (optional): Notice period in days

**Response:**
```json
{
  "_id": "candidate123",
  "name": "John Doe",
  "email": "john@example.com",
  "resume_url": "/uploads/resume-123.pdf",
  "resume_text": "Parsed resume text...",
  "skills": ["JavaScript", "React", "Node.js"],
  "experience_years": 4,
  "application_status": "new",
  "fraud_check": {
    "is_verified": false,
    "risk_score": 20,
    "flags": []
  },
  "created_at": "2024-10-16T10:00:00.000Z"
}
```

### Get Candidate by ID
Retrieves a specific candidate.

**Endpoint:** `GET /candidates/:id`

**Response:** Same as candidate object in Get All Candidates

### Update Candidate
Updates a candidate's information.

**Endpoint:** `PUT /candidates/:id`

**Request Body:**
```json
{
  "application_status": "shortlisted",
  "notice_period": 15
}
```

**Response:**
```json
{
  "message": "Candidate updated successfully"
}
```

### Update Candidate Status
Updates only the application status.

**Endpoint:** `PUT /candidates/:id/status`

**Request Body:**
```json
{
  "status": "shortlisted"
}
```

**Response:**
```json
{
  "message": "Candidate status updated successfully"
}
```

### Bulk Candidate Operations
Performs bulk operations on multiple candidates.

**Endpoint:** `POST /candidates/bulk-action`

**Request Body:**
```json
{
  "candidate_ids": ["candidate1", "candidate2", "candidate3"],
  "action": "update_status",
  "new_status": "shortlisted"
}
```

**Actions:**
- `update_status`: Update application status
- `delete`: Delete candidates

**Response:**
```json
{
  "message": "Bulk action completed successfully",
  "updated_count": 3
}
```

---

## Offer APIs

### Get All Offers
Retrieves all job offers.

**Endpoint:** `GET /offers`

**Response:**
```json
[
  {
    "_id": "offer1",
    "candidate_id": "candidate1",
    "candidate_name": "Rahul Sharma",
    "candidate_email": "rahul@example.com",
    "position": "Senior Software Engineer",
    "department": "Engineering",
    "offered_ctc": 1200000,
    "current_ctc": 800000,
    "hike_percentage": 50,
    "joining_date": "2024-11-01T00:00:00.000Z",
    "status": "pending",
    "risk_assessment": {
      "shopping_risk": true,
      "risk_factors": ["High hike percentage (>40%)"],
      "recommendation": "High shopping risk - consider negotiation"
    },
    "created_at": "2024-10-16T10:00:00.000Z",
    "sent_date": "2024-10-16T10:00:00.000Z"
  }
]
```

### Create Offer
Creates a new job offer.

**Endpoint:** `POST /offers`

**Request Body:**
```json
{
  "candidate_id": "candidate1",
  "candidate_name": "John Doe",
  "candidate_email": "john@example.com",
  "position": "Senior Developer",
  "department": "Engineering",
  "offered_ctc": 1200000,
  "current_ctc": 900000,
  "joining_date": "2024-11-01",
  "terms": "Standard employment terms"
}
```

**Response:**
```json
{
  "_id": "offer123",
  "candidate_id": "candidate1",
  "offered_ctc": 1200000,
  "current_ctc": 900000,
  "hike_percentage": 33.33,
  "status": "pending",
  "risk_assessment": {
    "shopping_risk": false,
    "risk_factors": [],
    "recommendation": "Proceed with offer"
  },
  "created_at": "2024-10-16T10:00:00.000Z"
}
```

### Get Offer by ID
Retrieves a specific offer.

**Endpoint:** `GET /offers/:id`

**Response:** Same as offer object in Get All Offers

### Update Offer Status
Updates the status of an offer.

**Endpoint:** `PUT /offers/:id/status`

**Request Body:**
```json
{
  "status": "accepted",
  "response_date": "2024-10-17T10:00:00.000Z"
}
```

**Response:**
```json
{
  "message": "Offer status updated successfully"
}
```

---

## Job Posting APIs

### Get All Jobs
Retrieves all job postings.

**Endpoint:** `GET /jobs`

**Response:**
```json
[
  {
    "_id": "job1",
    "title": "Senior Full Stack Developer",
    "department": "Engineering",
    "description": "We are looking for a skilled developer...",
    "required_skills": ["JavaScript", "React", "Node.js", "MongoDB", "AWS"],
    "experience_required": 3,
    "budget_min": 800000,
    "budget_max": 1200000,
    "location": "Remote",
    "employment_type": "Full-time",
    "status": "active",
    "created_at": "2024-10-16T10:00:00.000Z"
  }
]
```

### Create Job Posting
Creates a new job posting.

**Endpoint:** `POST /jobs`

**Request Body:**
```json
{
  "title": "Frontend Developer",
  "department": "Engineering",
  "description": "Looking for a React specialist...",
  "required_skills": ["React", "TypeScript", "CSS"],
  "experience_required": 2,
  "budget_min": 600000,
  "budget_max": 900000,
  "location": "Bangalore",
  "employment_type": "Full-time",
  "status": "active"
}
```

**Response:**
```json
{
  "_id": "job123",
  "title": "Frontend Developer",
  "department": "Engineering",
  "status": "active",
  "created_at": "2024-10-16T10:00:00.000Z"
}
```

### Get Job by ID
Retrieves a specific job posting.

**Endpoint:** `GET /jobs/:id`

**Response:** Same as job object in Get All Jobs

### Update Job Posting
Updates a job posting.

**Endpoint:** `PUT /jobs/:id`

**Request Body:**
```json
{
  "status": "closed",
  "budget_max": 950000
}
```

**Response:**
```json
{
  "message": "Job posting updated successfully"
}
```

### Delete Job Posting
Deletes a job posting.

**Endpoint:** `DELETE /jobs/:id`

**Response:**
```json
{
  "message": "Job posting deleted successfully"
}
```

### Get Matched Candidates
Retrieves candidates matched to a specific job.

**Endpoint:** `GET /jobs/:id/matches`

**Response:**
```json
[
  {
    "_id": "candidate1",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "skills": ["React", "Node.js", "MongoDB"],
    "experience_years": 4.5,
    "expected_ctc": 1200000,
    "match_score": 85,
    "match_reasons": [
      "Matches 4 required skills: React, Node.js, MongoDB, JavaScript",
      "Has 4.5 years of experience",
      "CTC expectation within budget"
    ]
  }
]
```

---

## Fraud Detection APIs

### Verify Document
Uploads a document for fraud verification.

**Endpoint:** `POST /fraud/verify`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `document` (file): Document file (PDF, DOC, DOCX)
- `candidate_id`: Candidate ID
- `document_type`: Type of document (aadhar, pan, degree, experience_letter)
- `verified_by` (optional): Verifier name

**Response:**
```json
{
  "_id": "verification123",
  "candidate_id": "candidate1",
  "document_type": "degree",
  "document_url": "/uploads/doc-123.pdf",
  "verification_status": "verified",
  "fraud_score": 15,
  "fraud_indicators": [],
  "verified_at": "2024-10-16T10:00:00.000Z"
}
```

### Get Fraud Reports
Retrieves all fraud verification reports.

**Endpoint:** `GET /fraud/reports`

**Response:**
```json
[
  {
    "_id": "verification1",
    "candidate_id": "candidate1",
    "document_type": "degree",
    "verification_status": "verified",
    "fraud_score": 15,
    "fraud_indicators": [],
    "verified_at": "2024-10-16T10:00:00.000Z"
  }
]
```

---

## Hike Analysis APIs

### Analyze Hike Expectation
Analyzes a candidate's hike expectation.

**Endpoint:** `POST /hike/analyze`

**Request Body:**
```json
{
  "current_ctc": 800000,
  "expected_ctc": 1200000,
  "experience_years": 4,
  "role": "Software Engineer",
  "skills": ["React", "Node.js", "MongoDB"]
}
```

**Response:**
```json
{
  "current_ctc": 800000,
  "expected_ctc": 1200000,
  "experience_years": 4,
  "role": "Software Engineer",
  "hike_percentage": 50,
  "market_average_ctc": 900000,
  "risk_assessment": "High Risk",
  "recommendations": [
    "Consider negotiating a lower hike percentage",
    "Offer additional benefits instead of high salary"
  ],
  "analyzed_at": "2024-10-16T10:00:00.000Z"
}
```

### Get Hike Benchmarks
Retrieves industry hike benchmarks.

**Endpoint:** `GET /hike/benchmarks`

**Response:**
```json
{
  "software_engineer": {
    "0-2": { "min": 400000, "max": 800000, "avg": 600000 },
    "2-5": { "min": 600000, "max": 1200000, "avg": 900000 },
    "5+": { "min": 1000000, "max": 2000000, "avg": 1500000 }
  },
  "full_stack_developer": {
    "0-2": { "min": 500000, "max": 900000, "avg": 700000 },
    "2-5": { "min": 700000, "max": 1400000, "avg": 1050000 },
    "5+": { "min": 1200000, "max": 2500000, "avg": 1850000 }
  }
}
```

---

## Salary Prediction APIs

### Predict Salary
Predicts salary based on candidate profile.

**Endpoint:** `POST /salary/predict`

**Request Body:**
```json
{
  "role": "Full Stack Developer",
  "experience_years": 4,
  "education": "Bachelor of Technology",
  "location": "Bangalore, Karnataka",
  "skills": ["React", "Node.js", "TypeScript", "MongoDB", "AWS"]
}
```

**Response:**
```json
{
  "predicted_salary": 1200000,
  "min_salary": 1020000,
  "max_salary": 1380000,
  "confidence": 89.5,
  "factors": {
    "experience_impact": "60%",
    "skills_impact": "25%",
    "location_impact": "20%",
    "education_impact": "0%"
  },
  "market_comparison": {
    "below_market": 1020000,
    "at_market": 1200000,
    "above_market": 1380000
  }
}
```

### Get Salary Factors
Retrieves factors that influence salary predictions.

**Endpoint:** `GET /salary/factors`

**Response:**
```json
{
  "most_impactful": [
    { "name": "Experience", "weight": 40 },
    { "name": "Skills", "weight": 25 },
    { "name": "Role", "weight": 20 },
    { "name": "Location", "weight": 10 },
    { "name": "Education", "weight": 5 }
  ],
  "skill_premiums": {
    "React": 5,
    "Node.js": 5,
    "Python": 7,
    "AWS": 10,
    "Docker": 8,
    "Kubernetes": 12,
    "Machine Learning": 15
  }
}
```

---

## HR Assistance APIs

### Ask HR Query
Sends a query to the AI HR assistant.

**Endpoint:** `POST /hr-assistance/query`

**Request Body:**
```json
{
  "query": "What is the best team size for a medium-sized project?"
}
```

**Response:**
```json
{
  "query": "What is the best team size for a medium-sized project?",
  "response": "For a typical software project:\n- Small project: 3-5 developers\n- Medium project: 8-12 developers\n- Large project: 15-25 developers\nInclude: 1 PM, 1 Designer, 1 QA per 3-4 developers",
  "timestamp": "2024-10-16T10:00:00.000Z"
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Invalid input data"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to process request"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting in production.

## Authentication

Currently no authentication is required for API calls. Implement JWT authentication in production.

## CORS

CORS is enabled for all origins in development. Configure specific origins in production.

---

**Last Updated:** October 16, 2024
