import API_BASE_URL from './apiConfig';

export interface Candidate {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  resume_url: string;
  resume_text: string;
  skills: string[];
  experience_years: number;
  current_ctc: number;
  expected_ctc: number;
  notice_period: number;
  education: string;
  certifications: string[];
  fraud_check: {
    is_verified: boolean;
    risk_score: number;
    flags: string[];
  };
  application_status: string;
  applied_date: Date;
  created_at?: Date;
}

export interface ResumeUploadRequest {
  name: string;
  email: string;
  phone: string;
  current_ctc: number;
  expected_ctc: number;
  notice_period: number;
  resume: File;
}

export interface CandidateFilters {
  skills?: string[];
  minExp?: number;
  maxExp?: number;
  minCtc?: number;
  maxCtc?: number;
  status?: string;
}

export class ResumeService {
  static async getAllCandidates(filters?: CandidateFilters): Promise<Candidate[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.skills) {
        params.append('skills', filters.skills.join(','));
      }
      if (filters?.minExp !== undefined) {
        params.append('minExp', filters.minExp.toString());
      }
      if (filters?.maxExp !== undefined) {
        params.append('maxExp', filters.maxExp.toString());
      }
      if (filters?.minCtc !== undefined) {
        params.append('minCtc', filters.minCtc.toString());
      }
      if (filters?.maxCtc !== undefined) {
        params.append('maxCtc', filters.maxCtc.toString());
      }
      if (filters?.status) {
        params.append('status', filters.status);
      }
      
      const url = `${API_BASE_URL}/candidates${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch candidates');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
  }

  static async getCandidateById(id: string): Promise<Candidate> {
    try {
      const response = await fetch(`${API_BASE_URL}/candidates/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch candidate');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching candidate:', error);
      throw error;
    }
  }

  static async uploadResume(uploadData: ResumeUploadRequest): Promise<Candidate> {
    try {
      const formData = new FormData();
      formData.append('name', uploadData.name);
      formData.append('email', uploadData.email);
      formData.append('phone', uploadData.phone);
      formData.append('current_ctc', uploadData.current_ctc.toString());
      formData.append('expected_ctc', uploadData.expected_ctc.toString());
      formData.append('notice_period', uploadData.notice_period.toString());
      formData.append('resume', uploadData.resume);

      const response = await fetch(`${API_BASE_URL}/candidates/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload resume');
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading resume:', error);
      throw error;
    }
  }

  static async createCandidate(candidate: Omit<Candidate, '_id' | 'created_at'>): Promise<Candidate> {
    try {
      const response = await fetch(`${API_BASE_URL}/candidates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(candidate),
      });

      if (!response.ok) {
        throw new Error('Failed to create candidate');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating candidate:', error);
      throw error;
    }
  }

  static async updateCandidate(id: string, candidate: Partial<Candidate>): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/candidates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(candidate),
      });

      if (!response.ok) {
        throw new Error('Failed to update candidate');
      }
    } catch (error) {
      console.error('Error updating candidate:', error);
      throw error;
    }
  }

  static async deleteCandidate(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/candidates/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete candidate');
      }
    } catch (error) {
      console.error('Error deleting candidate:', error);
      throw error;
    }
  }

  static async downloadResume(resumeUrl: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}${resumeUrl}`);
      if (!response.ok) {
        throw new Error('Failed to download resume');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = resumeUrl.split('/').pop() || 'resume';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading resume:', error);
      throw error;
    }
  }
}
