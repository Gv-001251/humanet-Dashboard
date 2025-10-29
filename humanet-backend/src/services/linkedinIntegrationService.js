/**
 * LinkedIn Integration Service
 * 
 * This service handles integration with LinkedIn for talent scouting.
 * It provides methods to search for profiles using keywords provided by HR.
 * 
 * Configuration:
 * Set LINKEDIN_API_KEY and LINKEDIN_CLIENT_ID in .env for production use.
 * Currently uses mock data for development.
 */

const LINKEDIN_API_CONFIG = {
  apiKey: process.env.LINKEDIN_API_KEY || null,
  clientId: process.env.LINKEDIN_CLIENT_ID || null,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET || null,
  enabled: process.env.LINKEDIN_INTEGRATION_ENABLED === 'true'
};

const mockLinkedInProfiles = [
  {
    id: 'li-1',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 9876543210',
    skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Redux'],
    experience: 5,
    currentCompany: 'Tech Innovations Pvt Ltd',
    currentRole: 'Senior Frontend Developer',
    location: 'Bangalore',
    education: 'B.Tech Computer Science',
    bio: 'Passionate frontend developer with 5 years of experience building scalable web applications. Expert in React ecosystem and modern JavaScript.',
    source: 'linkedin',
    profileUrl: 'https://linkedin.com/in/priya-sharma-dev',
    atsScore: 88,
    matchScore: 0,
    availability: 'Immediate',
    status: 'discovered',
    externalViewAvailable: true
  },
  {
    id: 'li-2',
    name: 'Rajesh Kumar',
    email: 'rajesh.k@email.com',
    phone: '+91 9876543211',
    skills: ['Python', 'Django', 'PostgreSQL', 'AWS', 'Docker'],
    experience: 6,
    currentCompany: 'DataTech Solutions',
    currentRole: 'Backend Engineer',
    location: 'Pune',
    education: 'M.Tech Software Engineering',
    bio: 'Backend specialist with expertise in building robust APIs and microservices. Strong background in cloud infrastructure.',
    source: 'linkedin',
    profileUrl: 'https://linkedin.com/in/rajesh-kumar-backend',
    atsScore: 92,
    matchScore: 0,
    availability: '15 Days',
    status: 'discovered',
    externalViewAvailable: true
  },
  {
    id: 'li-3',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@email.com',
    phone: '+91 9876543212',
    skills: ['Machine Learning', 'Python', 'TensorFlow', 'Data Science', 'AI'],
    experience: 4,
    currentCompany: 'AI Labs India',
    currentRole: 'ML Engineer',
    location: 'Hyderabad',
    education: 'M.S. Artificial Intelligence',
    bio: 'ML engineer focused on building intelligent systems. Experience in computer vision and NLP applications.',
    source: 'linkedin',
    profileUrl: 'https://linkedin.com/in/ananya-iyer-ml',
    atsScore: 90,
    matchScore: 0,
    availability: '1 Month',
    status: 'discovered',
    externalViewAvailable: true
  },
  {
    id: 'li-4',
    name: 'Vikrant Singh',
    email: 'vikrant.singh@email.com',
    phone: '+91 9876543213',
    skills: ['Full Stack', 'MERN', 'MongoDB', 'Express', 'React', 'Node.js'],
    experience: 5,
    currentCompany: 'Startup Hub',
    currentRole: 'Full Stack Developer',
    location: 'Bangalore',
    education: 'B.E. Computer Science',
    bio: 'Full stack developer with startup experience. Built multiple products from scratch using modern tech stack.',
    source: 'linkedin',
    profileUrl: 'https://linkedin.com/in/vikrant-singh-fullstack',
    atsScore: 86,
    matchScore: 0,
    availability: 'Immediate',
    status: 'discovered',
    externalViewAvailable: true
  },
  {
    id: 'li-5',
    name: 'Meera Patel',
    email: 'meera.patel@email.com',
    phone: '+91 9876543214',
    skills: ['DevOps', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'],
    experience: 7,
    currentCompany: 'Cloud Services Inc',
    currentRole: 'Senior DevOps Engineer',
    location: 'Mumbai',
    education: 'B.Tech Information Technology',
    bio: 'DevOps engineer specializing in cloud infrastructure and automation. Certified AWS Solutions Architect.',
    source: 'linkedin',
    profileUrl: 'https://linkedin.com/in/meera-patel-devops',
    atsScore: 94,
    matchScore: 0,
    availability: '15 Days',
    status: 'discovered',
    externalViewAvailable: true
  },
  {
    id: 'li-6',
    name: 'Arjun Menon',
    email: 'arjun.menon@email.com',
    phone: '+91 9876543215',
    skills: ['Java', 'Spring Boot', 'Microservices', 'Kafka', 'Redis'],
    experience: 8,
    currentCompany: 'Enterprise Solutions Ltd',
    currentRole: 'Lead Java Developer',
    location: 'Chennai',
    education: 'M.Tech Computer Science',
    bio: 'Experienced Java developer with expertise in building enterprise-grade applications. Strong in microservices architecture.',
    source: 'linkedin',
    profileUrl: 'https://linkedin.com/in/arjun-menon-java',
    atsScore: 91,
    matchScore: 0,
    availability: '1 Month',
    status: 'discovered',
    externalViewAvailable: true
  },
  {
    id: 'li-7',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@email.com',
    phone: '+91 9876543216',
    skills: ['UI/UX', 'Figma', 'React', 'CSS', 'Design Systems'],
    experience: 4,
    currentCompany: 'Design Studio',
    currentRole: 'UI/UX Engineer',
    location: 'Bangalore',
    education: 'B.Des Interaction Design',
    bio: 'UI/UX engineer with a passion for creating beautiful and functional interfaces. Strong technical implementation skills.',
    source: 'linkedin',
    profileUrl: 'https://linkedin.com/in/sneha-reddy-ux',
    atsScore: 85,
    matchScore: 0,
    availability: 'Immediate',
    status: 'discovered',
    externalViewAvailable: true
  },
  {
    id: 'li-8',
    name: 'Karthik Krishnan',
    email: 'karthik.k@email.com',
    phone: '+91 9876543217',
    skills: ['React Native', 'iOS', 'Android', 'Mobile Development', 'Redux'],
    experience: 5,
    currentCompany: 'Mobile Apps Co',
    currentRole: 'Mobile Developer',
    location: 'Hyderabad',
    education: 'B.Tech Computer Science',
    bio: 'Mobile developer specializing in React Native. Built and published 10+ apps on both iOS and Android platforms.',
    source: 'linkedin',
    profileUrl: 'https://linkedin.com/in/karthik-krishnan-mobile',
    atsScore: 87,
    matchScore: 0,
    availability: '15 Days',
    status: 'discovered',
    externalViewAvailable: true
  },
  {
    id: 'li-9',
    name: 'Divya Nair',
    email: 'divya.nair@email.com',
    phone: '+91 9876543218',
    skills: ['Data Engineering', 'Python', 'Spark', 'Airflow', 'Big Data'],
    experience: 6,
    currentCompany: 'Big Data Solutions',
    currentRole: 'Data Engineer',
    location: 'Pune',
    education: 'M.Tech Data Science',
    bio: 'Data engineer with expertise in building scalable data pipelines. Experience with big data technologies and cloud platforms.',
    source: 'linkedin',
    profileUrl: 'https://linkedin.com/in/divya-nair-data',
    atsScore: 89,
    matchScore: 0,
    availability: 'Immediate',
    status: 'discovered',
    externalViewAvailable: true
  },
  {
    id: 'li-10',
    name: 'Rahul Verma',
    email: 'rahul.verma@email.com',
    phone: '+91 9876543219',
    skills: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'JavaScript'],
    experience: 5,
    currentCompany: 'Web Solutions Inc',
    currentRole: 'Angular Developer',
    location: 'Delhi',
    education: 'B.Tech Information Technology',
    bio: 'Angular specialist with deep understanding of reactive programming. Built complex enterprise applications.',
    source: 'linkedin',
    profileUrl: 'https://linkedin.com/in/rahul-verma-angular',
    atsScore: 84,
    matchScore: 0,
    availability: '1 Month',
    status: 'discovered',
    externalViewAvailable: true
  }
];

/**
 * Search LinkedIn profiles using keywords provided by HR
 * @param {Object} filters - Search filters from HR
 * @param {string} filters.keywords - Keywords for search (job title, skills, etc.)
 * @param {string} filters.location - Desired location
 * @param {Object} filters.experience - Experience range {min, max}
 * @param {Array} filters.skills - Required skills
 * @returns {Promise<Array>} - Array of matching LinkedIn profiles
 */
const searchLinkedInProfiles = async (filters) => {
  if (LINKEDIN_API_CONFIG.enabled && LINKEDIN_API_CONFIG.apiKey) {
    // TODO: Implement real LinkedIn API integration
    // This is where you would make actual API calls to LinkedIn
    // Example:
    // const response = await fetch('https://api.linkedin.com/v2/people', {
    //   headers: {
    //     'Authorization': `Bearer ${LINKEDIN_API_CONFIG.apiKey}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ keywords: filters.keywords, ... })
    // });
    // return response.json();
    
    console.log('LinkedIn API integration enabled - would call real API here');
  }

  // Mock implementation - filter mock profiles based on HR keywords
  console.log('Using mock LinkedIn profiles for keyword search:', filters.keywords);
  
  const keywordLower = filters.keywords.toLowerCase();
  
  let results = mockLinkedInProfiles.filter(profile => {
    // Match against keywords in name, role, bio, and skills
    const keywordMatch = 
      profile.name.toLowerCase().includes(keywordLower) ||
      profile.currentRole.toLowerCase().includes(keywordLower) ||
      (profile.bio && profile.bio.toLowerCase().includes(keywordLower)) ||
      profile.skills.some(skill => skill.toLowerCase().includes(keywordLower));
    
    if (!keywordMatch) return false;
    
    // Filter by location if provided
    if (filters.location && filters.location.trim()) {
      const locationMatch = profile.location.toLowerCase().includes(filters.location.toLowerCase());
      if (!locationMatch) return false;
    }
    
    // Filter by experience range
    if (profile.experience < filters.experience.min || profile.experience > filters.experience.max) {
      return false;
    }
    
    // Filter by required skills
    if (filters.skills && filters.skills.length > 0) {
      const profileSkillsLower = profile.skills.map(s => s.toLowerCase());
      const hasRequiredSkills = filters.skills.some(reqSkill => 
        profileSkillsLower.some(profileSkill => 
          profileSkill.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(profileSkill)
        )
      );
      if (!hasRequiredSkills) return false;
    }
    
    return true;
  });
  
  return results;
};

/**
 * Get profile details from LinkedIn
 * @param {string} profileId - LinkedIn profile ID
 * @returns {Promise<Object>} - Profile details
 */
const getLinkedInProfile = async (profileId) => {
  if (LINKEDIN_API_CONFIG.enabled && LINKEDIN_API_CONFIG.apiKey) {
    // TODO: Implement real LinkedIn API call to get profile details
    console.log('Would fetch LinkedIn profile details for:', profileId);
  }
  
  // Mock implementation
  const profile = mockLinkedInProfiles.find(p => p.id === profileId);
  return profile || null;
};

/**
 * Check if LinkedIn integration is configured
 * @returns {boolean}
 */
const isLinkedInConfigured = () => {
  return LINKEDIN_API_CONFIG.enabled && 
         LINKEDIN_API_CONFIG.apiKey !== null &&
         LINKEDIN_API_CONFIG.clientId !== null;
};

/**
 * Get configuration status
 * @returns {Object}
 */
const getConfigurationStatus = () => {
  return {
    enabled: LINKEDIN_API_CONFIG.enabled,
    configured: isLinkedInConfigured(),
    apiKeySet: LINKEDIN_API_CONFIG.apiKey !== null,
    clientIdSet: LINKEDIN_API_CONFIG.clientId !== null,
    mode: isLinkedInConfigured() ? 'production' : 'mock'
  };
};

module.exports = {
  searchLinkedInProfiles,
  getLinkedInProfile,
  isLinkedInConfigured,
  getConfigurationStatus,
  mockLinkedInProfiles
};
