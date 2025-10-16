import API_BASE_URL from './apiConfig';

export interface JobPosting {
  _id: string;
  title: string;
  department: string;
  description: string;
  required_skills: string[];
  experience_required: number;
  budget_min: number;
  budget_max: number;
  location: string;
  employment_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateJobPostingRequest {
  title: string;
  department: string;
  description: string;
  required_skills: string[];
  experience_required: number;
  budget_min: number;
  budget_max: number;
  location: string;
  employment_type: string;
  status?: string;
}

export interface UpdateJobPostingRequest extends Partial<CreateJobPostingRequest> {}

export interface CandidateMatch {
  _id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience_years: number;
  current_ctc: number;
  expected_ctc: number;
  match_score: number;
  match_reasons: string[];
}

export class JobPostingService {
  static async getAllJobPostings(): Promise<JobPosting[]> {
    const response = await fetch(`${API_BASE_URL}/jobs`);
    if (!response.ok) {
      throw new Error('Failed to fetch job postings');
    }
    return response.json();
  }

  static async getJobPostingById(id: string): Promise<JobPosting> {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch job posting');
    }
    return response.json();
  }

  static async createJobPosting(job: CreateJobPostingRequest): Promise<JobPosting> {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(job),
    });
    if (!response.ok) {
      throw new Error('Failed to create job posting');
    }
    return response.json();
  }

  static async updateJobPosting(id: string, job: UpdateJobPostingRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(job),
    });
    if (!response.ok) {
      throw new Error('Failed to update job posting');
    }
  }

  static async deleteJobPosting(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete job posting');
    }
  }

  static async getJobMatches(jobId: string): Promise<CandidateMatch[]> {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/matches`);
    if (!response.ok) {
      throw new Error('Failed to fetch job matches');
    }
    return response.json();
  }

  // Helper functions for UI
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  static getMatchScoreColor(score: number): string {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  }

  static getExperienceLevel(experience: number): string {
    if (experience < 2) return 'Junior';
    if (experience < 5) return 'Mid-level';
    return 'Senior';
  }

  static getSkillGaps(candidateSkills: string[], requiredSkills: string[]): string[] {
    return requiredSkills.filter(skill => 
      !candidateSkills.some(candidateSkill => 
        candidateSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );
  }

  static calculateCTCFit(candidateExpected: number, jobBudgetMin: number, jobBudgetMax: number): string {
    if (candidateExpected <= jobBudgetMax && candidateExpected >= jobBudgetMin) {
      return 'Perfect Fit';
    } else if (candidateExpected <= jobBudgetMax * 1.2) {
      return 'Good Fit';
    } else if (candidateExpected <= jobBudgetMax * 1.5) {
      return 'Negotiable';
    } else {
      return 'Over Budget';
    }
  }

  static getCTCFitColor(fit: string): string {
    switch (fit) {
      case 'Perfect Fit':
        return 'text-green-600 bg-green-50';
      case 'Good Fit':
        return 'text-blue-600 bg-blue-50';
      case 'Negotiable':
        return 'text-yellow-600 bg-yellow-50';
      case 'Over Budget':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  }
}

