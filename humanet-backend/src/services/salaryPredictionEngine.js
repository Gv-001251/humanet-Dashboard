/**
 * Salary Prediction Engine for Talent Scout Module
 * 
 * This module converts years of experience into expected salary ranges
 * based on multiple factors including role, location, industry, skills,
 * company size, and current market trends (2025 data).
 */

// Base salary ranges by experience level (in INR per annum)
const BASE_SALARY_BY_EXPERIENCE = {
  0: { min: 300000, max: 500000 },      // 0-1 years (Fresher)
  1: { min: 400000, max: 700000 },      // 1-2 years
  2: { min: 500000, max: 900000 },      // 2-3 years
  3: { min: 700000, max: 1200000 },     // 3-4 years
  4: { min: 900000, max: 1500000 },     // 4-5 years
  5: { min: 1200000, max: 2000000 },    // 5-6 years
  6: { min: 1500000, max: 2500000 },    // 6-7 years
  7: { min: 1800000, max: 3000000 },    // 7-8 years
  8: { min: 2200000, max: 3500000 },    // 8-9 years
  9: { min: 2500000, max: 4000000 },    // 9-10 years
  10: { min: 3000000, max: 5000000 },   // 10-12 years
  12: { min: 3500000, max: 6000000 },   // 12-15 years
  15: { min: 4000000, max: 8000000 },   // 15-18 years
  18: { min: 5000000, max: 10000000 },  // 18-20 years
  20: { min: 6000000, max: 15000000 }   // 20+ years
};

// Location multipliers (Cost of living and demand)
const LOCATION_MULTIPLIERS = {
  'Bangalore': 1.25,
  'Bengaluru': 1.25,
  'Mumbai': 1.30,
  'Delhi': 1.20,
  'Gurgaon': 1.25,
  'Gurugram': 1.25,
  'Noida': 1.15,
  'Pune': 1.15,
  'Hyderabad': 1.20,
  'Chennai': 1.10,
  'Coimbatore': 0.95,
  'Kochi': 1.00,
  'Kolkata': 1.05,
  'Ahmedabad': 1.05,
  'Jaipur': 0.95,
  'Chandigarh': 1.05,
  'Indore': 0.90,
  'Bhubaneswar': 0.90,
  'Thiruvananthapuram': 0.95,
  'Visakhapatnam': 0.90,
  'Vadodara': 0.95,
  'Default': 1.00
};

// Industry sector multipliers
const INDUSTRY_MULTIPLIERS = {
  'IT/Tech': 1.30,
  'Technology': 1.30,
  'Software': 1.30,
  'FinTech': 1.40,
  'Finance': 1.25,
  'Banking': 1.25,
  'E-Commerce': 1.25,
  'SaaS': 1.35,
  'Product': 1.30,
  'Healthcare': 1.15,
  'Pharma': 1.10,
  'Manufacturing': 1.05,
  'Consulting': 1.20,
  'Education': 0.95,
  'EdTech': 1.20,
  'Media': 1.05,
  'Telecom': 1.15,
  'Automotive': 1.10,
  'Retail': 1.00,
  'Logistics': 1.05,
  'Default': 1.10
};

// Company size multipliers
const COMPANY_SIZE_MULTIPLIERS = {
  'Startup': 0.90,           // 1-50 employees
  'Small Startup': 0.85,
  'Growing Startup': 0.95,
  'SME': 1.00,               // 51-500 employees
  'Mid-Size': 1.10,          // 501-2000 employees
  'Large': 1.20,             // 2001-10000 employees
  'MNC': 1.30,               // 10000+ employees
  'Enterprise': 1.25,
  'Default': 1.00
};

// High-demand skills premium (percentage increase)
const HIGH_DEMAND_SKILLS = {
  // AI/ML/Data Science
  'Machine Learning': 25,
  'Artificial Intelligence': 25,
  'AI': 25,
  'Deep Learning': 30,
  'NLP': 25,
  'Computer Vision': 25,
  'Data Science': 20,
  'Big Data': 20,
  'TensorFlow': 20,
  'PyTorch': 20,
  
  // Cloud & DevOps
  'AWS': 18,
  'Azure': 18,
  'GCP': 18,
  'Google Cloud': 18,
  'Kubernetes': 22,
  'Docker': 15,
  'DevOps': 18,
  'Terraform': 18,
  'CI/CD': 15,
  
  // Modern Frontend
  'React': 15,
  'Next.js': 18,
  'Vue.js': 15,
  'Angular': 15,
  'TypeScript': 15,
  
  // Backend & Databases
  'Node.js': 15,
  'Microservices': 20,
  'GraphQL': 18,
  'PostgreSQL': 12,
  'MongoDB': 12,
  'Redis': 12,
  
  // Specialized
  'Blockchain': 30,
  'Web3': 30,
  'Solidity': 30,
  'Rust': 25,
  'Go': 20,
  'Golang': 20,
  'System Design': 20,
  'Architecture': 18,
  
  // Security
  'Cybersecurity': 22,
  'Security': 18,
  'Penetration Testing': 20,
  
  // Mobile
  'React Native': 15,
  'Flutter': 18,
  'iOS': 15,
  'Android': 15,
  'Swift': 15,
  'Kotlin': 15
};

// Role-specific multipliers
const ROLE_MULTIPLIERS = {
  // Leadership Roles
  'CTO': 3.5,
  'VP Engineering': 3.0,
  'Engineering Manager': 1.8,
  'Technical Lead': 1.6,
  'Tech Lead': 1.6,
  'Team Lead': 1.5,
  'Lead Engineer': 1.5,
  'Staff Engineer': 1.7,
  'Principal Engineer': 2.0,
  'Architect': 1.9,
  'Solution Architect': 1.8,
  'System Architect': 1.9,
  
  // Software Engineering
  'Senior Software Engineer': 1.4,
  'Software Engineer': 1.0,
  'Full Stack Developer': 1.2,
  'Senior Full Stack': 1.4,
  'Frontend Developer': 1.0,
  'Senior Frontend': 1.3,
  'Backend Developer': 1.1,
  'Senior Backend': 1.4,
  'DevOps Engineer': 1.3,
  'Senior DevOps': 1.5,
  
  // Data & AI
  'Data Scientist': 1.4,
  'Senior Data Scientist': 1.7,
  'ML Engineer': 1.5,
  'Senior ML Engineer': 1.8,
  'Data Engineer': 1.3,
  'Senior Data Engineer': 1.6,
  
  // Product & Design
  'Product Manager': 1.6,
  'Senior Product Manager': 1.9,
  'UX Designer': 1.1,
  'Senior UX Designer': 1.4,
  
  // QA
  'QA Engineer': 0.9,
  'Senior QA Engineer': 1.2,
  'SDET': 1.1,
  
  // Default
  'Default': 1.0
};

/**
 * Get the location multiplier for a given city
 */
function getLocationMultiplier(location) {
  if (!location) return LOCATION_MULTIPLIERS['Default'];
  
  const normalizedLocation = location.trim();
  for (const [city, multiplier] of Object.entries(LOCATION_MULTIPLIERS)) {
    if (normalizedLocation.toLowerCase().includes(city.toLowerCase())) {
      return multiplier;
    }
  }
  
  return LOCATION_MULTIPLIERS['Default'];
}

/**
 * Get the industry multiplier
 */
function getIndustryMultiplier(industry) {
  if (!industry) return INDUSTRY_MULTIPLIERS['Default'];
  
  const normalizedIndustry = industry.trim();
  for (const [sector, multiplier] of Object.entries(INDUSTRY_MULTIPLIERS)) {
    if (normalizedIndustry.toLowerCase().includes(sector.toLowerCase())) {
      return multiplier;
    }
  }
  
  return INDUSTRY_MULTIPLIERS['Default'];
}

/**
 * Get the company size multiplier
 */
function getCompanySizeMultiplier(companySize) {
  if (!companySize) return COMPANY_SIZE_MULTIPLIERS['Default'];
  
  const normalizedSize = companySize.trim();
  for (const [size, multiplier] of Object.entries(COMPANY_SIZE_MULTIPLIERS)) {
    if (normalizedSize.toLowerCase().includes(size.toLowerCase())) {
      return multiplier;
    }
  }
  
  return COMPANY_SIZE_MULTIPLIERS['Default'];
}

/**
 * Get the role multiplier
 */
function getRoleMultiplier(role) {
  if (!role) return ROLE_MULTIPLIERS['Default'];
  
  const normalizedRole = role.trim();
  for (const [roleName, multiplier] of Object.entries(ROLE_MULTIPLIERS)) {
    if (normalizedRole.toLowerCase().includes(roleName.toLowerCase())) {
      return multiplier;
    }
  }
  
  return ROLE_MULTIPLIERS['Default'];
}

/**
 * Calculate skills premium percentage
 */
function calculateSkillsPremium(skills) {
  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    return 0;
  }
  
  let totalPremium = 0;
  let premiumCount = 0;
  
  skills.forEach(skill => {
    const normalizedSkill = skill.trim();
    for (const [demandSkill, premium] of Object.entries(HIGH_DEMAND_SKILLS)) {
      if (normalizedSkill.toLowerCase().includes(demandSkill.toLowerCase())) {
        totalPremium += premium;
        premiumCount++;
        break; // Only count each skill once
      }
    }
  });
  
  // Average the premiums, but cap at 50% total premium
  const averagePremium = premiumCount > 0 ? totalPremium / premiumCount : 0;
  return Math.min(averagePremium, 50);
}

/**
 * Get base salary range by experience
 */
function getBaseSalaryByExperience(years) {
  const experienceYears = Math.max(0, Math.min(years, 25));
  
  // Find the closest experience bracket
  const brackets = Object.keys(BASE_SALARY_BY_EXPERIENCE).map(Number).sort((a, b) => a - b);
  let closestBracket = brackets[0];
  
  for (const bracket of brackets) {
    if (experienceYears >= bracket) {
      closestBracket = bracket;
    } else {
      break;
    }
  }
  
  return BASE_SALARY_BY_EXPERIENCE[closestBracket];
}

/**
 * Main function to predict salary range
 * 
 * @param {Object} params - Prediction parameters
 * @param {number} params.experience - Years of experience
 * @param {string} params.role - Job role/title
 * @param {string} params.location - City/location
 * @param {string} params.industry - Industry sector
 * @param {Array<string>} params.skills - Array of skills
 * @param {string} params.companySize - Company size category
 * @returns {Object} Predicted salary range with breakdown
 */
function predictSalary(params) {
  const {
    experience,
    role,
    location,
    industry,
    skills = [],
    companySize
  } = params;
  
  // Get base salary
  const baseSalary = getBaseSalaryByExperience(experience);
  
  // Apply multipliers
  const locationMultiplier = getLocationMultiplier(location);
  const industryMultiplier = getIndustryMultiplier(industry);
  const companySizeMultiplier = getCompanySizeMultiplier(companySize);
  const roleMultiplier = getRoleMultiplier(role);
  
  // Calculate skills premium
  const skillsPremiumPercent = calculateSkillsPremium(skills);
  const skillsMultiplier = 1 + (skillsPremiumPercent / 100);
  
  // Calculate final salary range
  const totalMultiplier = locationMultiplier * industryMultiplier * companySizeMultiplier * roleMultiplier * skillsMultiplier;
  
  const predictedMin = Math.round(baseSalary.min * totalMultiplier);
  const predictedMax = Math.round(baseSalary.max * totalMultiplier);
  const predictedAverage = Math.round((predictedMin + predictedMax) / 2);
  
  return {
    salaryRange: {
      min: predictedMin,
      max: predictedMax,
      average: predictedAverage,
      currency: 'INR'
    },
    breakdown: {
      baseRange: baseSalary,
      locationMultiplier,
      industryMultiplier,
      companySizeMultiplier,
      roleMultiplier,
      skillsPremiumPercent,
      totalMultiplier: parseFloat(totalMultiplier.toFixed(2))
    },
    factors: {
      experience: `${experience} years`,
      role: role || 'Not specified',
      location: location || 'Not specified',
      industry: industry || 'Not specified',
      companySize: companySize || 'Not specified',
      highDemandSkills: skills.filter(skill => {
        return Object.keys(HIGH_DEMAND_SKILLS).some(demandSkill => 
          skill.toLowerCase().includes(demandSkill.toLowerCase())
        );
      })
    }
  };
}

/**
 * Get market comparison data across different companies
 * 
 * @param {Object} params - Comparison parameters
 * @returns {Array<Object>} Market comparison data
 */
function getMarketComparison(params) {
  const companySizes = ['Startup', 'SME', 'Mid-Size', 'Large', 'MNC'];
  const locations = ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune'];
  
  const comparisons = [];
  
  // Generate comparison for different company sizes
  companySizes.forEach(companySize => {
    const prediction = predictSalary({
      ...params,
      companySize
    });
    
    comparisons.push({
      companySize,
      salaryRange: prediction.salaryRange,
      multiplier: prediction.breakdown.companySizeMultiplier
    });
  });
  
  // Generate comparison for different locations (if location not specified)
  if (!params.location) {
    locations.forEach(location => {
      const prediction = predictSalary({
        ...params,
        location
      });
      
      comparisons.push({
        location,
        salaryRange: prediction.salaryRange,
        multiplier: prediction.breakdown.locationMultiplier
      });
    });
  }
  
  return comparisons;
}

/**
 * Check if candidate salary expectation fits within budget
 * 
 * @param {number} expectedSalary - Candidate's expected salary
 * @param {Object} budgetRange - Company's budget range
 * @param {number} budgetRange.min - Minimum budget
 * @param {number} budgetRange.max - Maximum budget
 * @returns {Object} Fit analysis
 */
function checkSalaryFit(expectedSalary, budgetRange) {
  if (!expectedSalary || !budgetRange) {
    return {
      fits: false,
      fitPercentage: 0,
      status: 'unknown',
      message: 'Insufficient data for comparison'
    };
  }
  
  const { min: budgetMin, max: budgetMax } = budgetRange;
  
  // Check if expected salary is within budget
  const fitsWithinBudget = expectedSalary >= budgetMin && expectedSalary <= budgetMax;
  
  // Calculate fit percentage
  let fitPercentage = 0;
  let status = 'no-match';
  let message = '';
  
  if (fitsWithinBudget) {
    fitPercentage = 100;
    status = 'perfect-match';
    message = 'Candidate expectation aligns perfectly with budget';
  } else if (expectedSalary < budgetMin) {
    // Candidate expects less - good for company
    const difference = budgetMin - expectedSalary;
    const percentBelow = (difference / budgetMin) * 100;
    fitPercentage = 100 + percentBelow; // More than 100% indicates below budget
    status = 'below-budget';
    message = `Candidate expects ${percentBelow.toFixed(0)}% less than minimum budget`;
  } else {
    // Candidate expects more - may need negotiation
    const difference = expectedSalary - budgetMax;
    const percentAbove = (difference / budgetMax) * 100;
    
    if (percentAbove <= 10) {
      fitPercentage = 90;
      status = 'negotiable';
      message = `Candidate expects ${percentAbove.toFixed(0)}% more (negotiable range)`;
    } else if (percentAbove <= 20) {
      fitPercentage = 70;
      status = 'stretch';
      message = `Candidate expects ${percentAbove.toFixed(0)}% more (requires approval)`;
    } else {
      fitPercentage = 40;
      status = 'above-budget';
      message = `Candidate expects ${percentAbove.toFixed(0)}% more than budget`;
    }
  }
  
  return {
    fits: fitsWithinBudget,
    fitPercentage: Math.round(fitPercentage),
    status,
    message,
    difference: expectedSalary - budgetMax,
    expectedSalary,
    budgetRange
  };
}

/**
 * Format salary for display
 */
function formatSalary(amount) {
  if (!amount) return 'Not Specified';
  
  const lakhs = amount / 100000;
  if (lakhs >= 100) {
    const crores = lakhs / 100;
    return `₹${crores.toFixed(2)} Cr`;
  }
  return `₹${lakhs.toFixed(1)} LPA`;
}

module.exports = {
  predictSalary,
  getMarketComparison,
  checkSalaryFit,
  formatSalary,
  HIGH_DEMAND_SKILLS,
  LOCATION_MULTIPLIERS,
  INDUSTRY_MULTIPLIERS,
  COMPANY_SIZE_MULTIPLIERS,
  ROLE_MULTIPLIERS
};
