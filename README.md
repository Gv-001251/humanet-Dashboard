# Humanet - Complete HR Management Platform

A comprehensive HR Management Platform with advanced features integrated with MongoDB Atlas backend and React + TypeScript frontend.

## 🚀 Features

### 1. **HR Dashboard**
- Real-time employee statistics
- Department distribution analytics
- Recent candidates and offers tracking
- Visual charts and reports

### 2. **HireSmart - Intelligent Recruitment**
- Resume upload & parsing (PDF, DOCX)
- Multi-file upload support (up to 10 files)
- Automatic resume parsing using pdf-parse and mammoth
- Extract: name, email, phone, skills, experience, education, CTC
- Advanced candidate filtering system
- Match score algorithm
- Bulk operations (shortlist, reject, export)

### 3. **AutoMatch - AI-Powered Job Matching**
- Create job postings with requirements
- AI algorithm matches candidates to jobs
- Display top matches with scores
- Skill overlap analysis
- CTC fit indicators
- Notice period compatibility checks

### 4. **Document Fraud Detection**
- Upload ID proofs and certificates
- Metadata verification
- Font consistency checks
- Watermark detection
- Fraud risk scoring (0-100)
- Color-coded status (Green/Yellow/Red)

### 5. **Offer Management**
- Create and track job offers
- Auto-calculate hike percentage
- Offer shopping detection
- Shopping risk scoring
- Offer status tracking (pending, accepted, rejected)
- Offer analytics dashboard

### 6. **Hike Expectation Analyzer**
- Analyze hike expectations vs market benchmarks
- Calculate market average CTC
- Retention risk assessment
- ROI calculation for hiring
- Counter-offer suggestions
- Visual analytics (charts & graphs)

### 7. **Salary Prediction (AI Feature)**
- ML-based salary prediction
- Input: skills, experience, education, location, company size
- Confidence interval display
- Salary breakdown by factors
- Market competitiveness score
- Negotiation range suggestions

### 8. **HR Assistance (AI Chatbot)**
- Natural language query processing
- Answer HR policy questions
- Team composition suggestions
- Hiring recommendations
- Budget allocation guidance
- Skill gap analysis

## 🗄️ Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **File Processing:** pdf-parse, mammoth
- **File Upload:** multer

### Frontend
- **Framework:** React 18
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Charts:** Recharts
- **Build Tool:** Vite

## 📋 MongoDB Configuration

```
URI: mongodb+srv://navageevithang_db_user:BdvFg2iBkcz750gt@humanet-cluster.h99gras.mongodb.net/humanet_hr?retryWrites=true&w=majority&appName=humanet-Cluster
Database: humanet_hr
Backend Port: 3001
Frontend Port: 5173
```

## 🗂️ MongoDB Collections

### 1. Employees Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String,
  department: String,
  role: String,
  current_ctc: Number,
  expected_ctc: Number,
  joining_date: Date,
  status: String, // "active", "inactive", "on_leave"
  skills: [String],
  education: String,
  experience_years: Number,
  created_at: Date,
  updated_at: Date
}
```

### 2. Candidates Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  resume_url: String,
  resume_text: String,
  skills: [String],
  experience_years: Number,
  current_ctc: Number,
  expected_ctc: Number,
  notice_period: Number, // in days
  education: String,
  current_company: String,
  location: String,
  application_status: String, // "new", "shortlisted", "interviewed", "offered", "rejected"
  match_score: Number,
  applied_date: Date,
  created_at: Date
}
```

### 3. Offers Collection
```javascript
{
  _id: ObjectId,
  candidate_id: ObjectId,
  candidate_name: String,
  candidate_email: String,
  position: String,
  department: String,
  offered_ctc: Number,
  current_ctc: Number,
  hike_percentage: Number,
  joining_date: Date,
  offer_letter_url: String,
  status: String, // "pending", "accepted", "rejected", "withdrawn"
  shopping_risk_score: Number,
  risk_factors: [String],
  terms: String,
  created_at: Date,
  sent_date: Date,
  response_date: Date
}
```

### 4. Documents Collection
```javascript
{
  _id: ObjectId,
  candidate_id: ObjectId,
  document_type: String, // "aadhar", "pan", "degree", "experience_letter"
  document_url: String,
  verification_status: String, // "pending", "verified", "fraud_detected"
  fraud_score: Number,
  fraud_indicators: [String],
  metadata: Object,
  verified_at: Date,
  created_at: Date
}
```

### 5. Jobs Collection
```javascript
{
  _id: ObjectId,
  title: String,
  department: String,
  required_skills: [String],
  required_experience: Number,
  budget_min: Number,
  budget_max: Number,
  max_notice_period: Number,
  job_description: String,
  status: String, // "open", "closed", "on_hold"
  created_at: Date
}
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd humanet-hr-platform
```

2. **Install backend dependencies**
```bash
cd humanet-backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ..
npm install
```

4. **Configure environment variables**

Create `.env` file in `humanet-backend/` directory:
```env
MONGODB_URI=mongodb+srv://navageevithang_db_user:BdvFg2iBkcz750gt@humanet-cluster.h99gras.mongodb.net/humanet_hr?retryWrites=true&w=majority&appName=humanet-Cluster
DB_NAME=humanet_hr
PORT=3001
NODE_ENV=development
```

### Running the Application

1. **Start the backend server**
```bash
cd humanet-backend
node server.js
```

Backend will run on `http://localhost:3001`

2. **Start the frontend development server**
```bash
cd ..
npm run dev
```

Frontend will run on `http://localhost:5173`

3. **Access the application**
Open your browser and navigate to `http://localhost:5173`

## 📡 API Endpoints

### Employee Routes
- `GET /api/employees` - Fetch all employees
- `POST /api/employees` - Add new employee
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Candidate Routes
- `GET /api/candidates` - Get all candidates with filters
- `POST /api/candidates/upload` - Upload resume
- `POST /api/candidates` - Create candidate manually
- `GET /api/candidates/:id` - Get candidate details
- `PUT /api/candidates/:id` - Update candidate
- `PUT /api/candidates/:id/status` - Update candidate status
- `POST /api/candidates/bulk-action` - Bulk operations

### Offer Routes
- `GET /api/offers` - List all offers
- `POST /api/offers` - Create new offer
- `GET /api/offers/:id` - Get offer details
- `PUT /api/offers/:id/status` - Update offer status
- `GET /api/offers/analytics` - Get offer statistics

### Job Posting Routes
- `GET /api/jobs` - List all jobs
- `POST /api/jobs` - Create job posting
- `GET /api/jobs/:id` - Get job details
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `GET /api/jobs/:id/matches` - Get matched candidates for job

### Fraud Detection Routes
- `POST /api/fraud/verify` - Upload document for verification
- `GET /api/fraud/reports` - Get all fraud reports

### Hike Analysis Routes
- `POST /api/hike/analyze` - Analyze hike expectation
- `GET /api/hike/benchmarks` - Get industry benchmarks
- `GET /api/hike/trends` - Get hike trends data

### Salary Prediction Routes
- `POST /api/salary/predict` - Get salary prediction
- `GET /api/salary/factors` - Get salary influencing factors

### HR Assistance Routes
- `POST /api/hr-assistance/query` - Ask HR assistant

### Dashboard Routes
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🔒 Security Features

- Input validation on all forms
- File upload validation (type, size limits)
- MongoDB injection prevention
- XSS protection
- CORS configuration
- Environment variables for sensitive data
- Error handling without exposing internals

## ⚡ Performance Optimization

- Lazy loading for large lists
- Pagination (20 items per page)
- MongoDB indexes on frequently queried fields
- Debounced search inputs
- Optimized file sizes
- Caching for frequently accessed data

## 🎨 UI/UX Features

- Modern, clean interface
- Professional HR-focused design
- Responsive design (mobile, tablet, desktop)
- Dark mode support (via ThemeContext)
- Loading states with spinners
- Toast notifications for errors/success
- Touch-friendly buttons (min 44px)

## 📊 Analytics & Reporting

- Dashboard with key metrics
- Export reports in CSV/Excel format
- Charts using Recharts
- Date range filters
- Comparison views (month-over-month, year-over-year)

## 🧪 Testing

Run tests:
```bash
npm test
```

## 📦 Build for Production

Build frontend:
```bash
npm run build
```

Build output will be in the `dist/` directory.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Team

Built by the Humanet team for comprehensive HR management needs.

## 📧 Support

For support, email support@humanet.com or create an issue in the repository.

---

**Note:** Make sure MongoDB Atlas is accessible and the connection string is correct before running the application.
