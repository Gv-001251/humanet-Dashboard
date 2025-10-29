export interface ExternalCandidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileUrl: string;
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
  profileImage?: string;
  invitedAt?: string | null;
  status: 'discovered' | 'invited' | 'applied' | 'rejected';
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
}

export interface SearchResponse {
  success: boolean;
  data: ExternalCandidate[];
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
