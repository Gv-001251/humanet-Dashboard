export interface SalaryRange {
  min: number;
  max: number;
  average: number;
  currency: string;
}

export interface SalaryFit {
  fits: boolean;
  fitPercentage: number;
  status: 'perfect-match' | 'below-budget' | 'negotiable' | 'stretch' | 'above-budget' | 'no-match' | 'unknown';
  message: string;
  difference: number;
  expectedSalary: number;
  budgetRange: {
    min: number;
    max: number;
  };
}

export interface MarketComparison {
  label: string;
  type: 'companySize' | 'location';
  salaryRange: SalaryRange;
  multiplier: number;
}

export interface SalaryInsights {
  predictedRange: SalaryRange;
  breakdown: {
    baseRange: {
      min: number;
      max: number;
    };
    locationMultiplier: number;
    industryMultiplier: number;
    companySizeMultiplier: number;
    roleMultiplier: number;
    skillsPremiumPercent: number;
    totalMultiplier: number;
  };
  salaryFit: SalaryFit | null;
  marketComparisons: MarketComparison[];
  formatted: {
    predictedMin: string;
    predictedMax: string;
    predictedAverage: string;
    expectedCtc: string;
    budgetMin: string | null;
    budgetMax: string | null;
  };
  summary: string;
  recommendation: string;
}

export interface ExperienceProbability {
  experience: {
    min: number;
    max: number;
  };
  experienceYears: number;
  salaryRange: {
    min: number;
    max: number;
  };
  probability: number;
}

export interface ExperienceMapping {
  min: number;
  max: number;
  confidence: number;
  probabilities: ExperienceProbability[];
}

export interface ExternalCandidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileUrl?: string | null;
  externalViewAvailable?: boolean;
  externalViewMessage?: string;
  skills: string[];
  experience: number;
  currentCompany?: string;
  currentRole?: string;
  location: string;
  education: string;
  bio?: string;
  source: 'linkedin' | 'naukri';
  atsScore: number;
  matchScore: number;
  availability: 'Immediate' | '15 Days' | '1 Month' | 'Not Specified';
  expectedCtc?: number;
  salaryInsights?: SalaryInsights;
  salaryFitStatus?: SalaryFit['status'];
  salaryFitPercentage?: number;
  profileImage?: string;
  invitedAt?: string | null;
  status: 'discovered' | 'invited' | 'applied' | 'rejected';
  experienceProbability?: number | null;
  experienceRangeMatch?: {
    min: number;
    max: number;
  } | null;
}

export interface SearchFilters {
  platform: 'both' | 'linkedin' | 'naukri';
  keywords: string;
  location: string;
  experience: {
    min: number;
    max: number;
  };
  skills: string[];
  salaryBudget?: {
    min: number;
    max: number;
    includeNegotiable?: boolean;
  } | null;
  jobTitle?: string;
  industry?: string;
  companySize?: string;
}

export interface SalarySummary {
  budgetRange: {
    min: number;
    max: number;
    includeNegotiable: boolean;
  } | null;
  predictedRange: SalaryRange;
  breakdown: SalaryInsights['breakdown'];
  averageExpectedCtc: number | null;
  medianExpectedCtc: number | null;
  candidateCount: number;
  totalGenerated: number;
  marketComparisons: MarketComparison[];
  experienceMapping?: ExperienceMapping | null;
  formatted: {
    averageExpectedCtc: string | null;
    medianExpectedCtc: string | null;
    budgetMin: string | null;
    budgetMax: string | null;
    predictedMin: string;
    predictedMax: string;
  };
}

export interface SearchResponse {
  success: boolean;
  data: ExternalCandidate[];
  salarySummary?: SalarySummary;
  message?: string;
}

export interface InviteRequest {
  candidateId: string;
  jobId?: string;
  message: string;
}

export interface InviteResponse {
  success: boolean;
  message: string;
  data?: ExternalCandidate;
}
