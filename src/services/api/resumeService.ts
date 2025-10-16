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
  location?: string;
  domain?: string;
  ats_score?: number;
  ats_details?: {
    matched_keywords: string[];
    total_keywords: number;
  };
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
  name?: string;
  email?: string;
  phone?: string;
  current_ctc?: number;
  expected_ctc?: number;
  notice_period?: number;
  location?: string;
  domain?: string;
  experience_years?: number;
  education?: string;
  required_keywords?: string[];
  status?: string;
  resume: File;
}

export interface CandidateFilters {
  skills?: string[];
  experience_min?: number;
  experience_max?: number;
  ctc_min?: number;
  ctc_max?: number;
  location?: string;
  domain?: string;
  ats_min?: number;
  status?: string;
  search?: string;
  sort_by?: 'ats_score' | 'experience' | 'current_ctc' | 'applied_date';
}

export class ResumeService {
  static async getAllCandidates(filters?: CandidateFilters): Promise<Candidate[]> {
    try {
      const params = new URLSearchParams();
      const legacyFilters = filters as {
        minExp?: number;
        maxExp?: number;
        minCtc?: number;
        maxCtc?: number;
      };

      if (filters?.skills?.length) {
        filters.skills.forEach(skill => params.append('skills[]', skill));
      }

      const experienceMin = filters?.experience_min ?? legacyFilters?.minExp;
      if (experienceMin !== undefined) {
        params.append('experience_min', experienceMin.toString());
      }

      const experienceMax = filters?.experience_max ?? legacyFilters?.maxExp;
      if (experienceMax !== undefined) {
        params.append('experience_max', experienceMax.toString());
      }

      const ctcMin = filters?.ctc_min ?? legacyFilters?.minCtc;
      if (ctcMin !== undefined) {
        params.append('ctc_min', ctcMin.toString());
      }

      const ctcMax = filters?.ctc_max ?? legacyFilters?.maxCtc;
      if (ctcMax !== undefined) {
        params.append('ctc_max', ctcMax.toString());
      }

      if (filters?.location) {
        params.append('location', filters.location);
      }

      if (filters?.domain) {
        params.append('domain', filters.domain);
      }

      if (filters?.ats_min !== undefined) {
        params.append('ats_min', filters.ats_min.toString());
      }

      if (filters?.status) {
        params.append('status', filters.status);
      }

      if (filters?.search) {
        params.append('search', filters.search);
      }

      if (filters?.sort_by) {
        params.append('sort_by', filters.sort_by);
      }

      const query = params.toString();
      const response = await fetch(`${API_BASE_URL}/candidates${query ? `?${query}` : ''}`);
      
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
      
      if (uploadData.name) formData.append('name', uploadData.name);
      if (uploadData.email) formData.append('email', uploadData.email);
      if (uploadData.phone) formData.append('phone', uploadData.phone);
      if (uploadData.current_ctc !== undefined) formData.append('current_ctc', uploadData.current_ctc.toString());
      if (uploadData.expected_ctc !== undefined) formData.append('expected_ctc', uploadData.expected_ctc.toString());
      if (uploadData.notice_period !== undefined) formData.append('notice_period', uploadData.notice_period.toString());
      if (uploadData.location) formData.append('location', uploadData.location);
      if (uploadData.domain) formData.append('domain', uploadData.domain);
      if (uploadData.experience_years !== undefined) formData.append('experience_years', uploadData.experience_years.toString());
      if (uploadData.education) formData.append('education', uploadData.education);
      if (uploadData.status) formData.append('status', uploadData.status);
      if (uploadData.required_keywords) formData.append('required_keywords', uploadData.required_keywords.join(','));
      
      formData.append('resume', uploadData.resume);

      const response = await fetch(`${API_BASE_URL}/candidates/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload resume: ${errorText}`);
      }

      const result = await response.json();
      return Array.isArray(result.candidates) ? result.candidates[0] : result;
    } catch (error) {
      console.error('Error uploading resume:', error);
      throw error;
    }
  }

  static async uploadResumes(uploadItems: ResumeUploadRequest[]): Promise<Candidate[]> {
    try {
      if (!uploadItems.length) {
        throw new Error('No resumes provided');
      }

      const formData = new FormData();
      const metadataPayload = uploadItems.map(({ resume, required_keywords, ...rest }) => {
        const metadata: Record<string, unknown> = { ...rest };
        if (required_keywords && required_keywords.length) {
          metadata.required_keywords = required_keywords;
        }

        Object.keys(metadata).forEach(key => {
          const value = metadata[key];
          if (value === undefined || value === null || value === '') {
            delete metadata[key];
          }
        });

        return metadata;
      });

      if (metadataPayload.some(item => Object.keys(item).length > 0)) {
        formData.append('metadata', JSON.stringify(metadataPayload));
      }

      uploadItems.forEach(item => {
        formData.append('resumes', item.resume);
      });

      const response = await fetch(`${API_BASE_URL}/candidates/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload resumes: ${errorText}`);
      }

      const result = await response.json();
      if (Array.isArray(result?.candidates)) {
        return result.candidates;
      }
      if (Array.isArray(result)) {
        return result;
      }
      if (result) {
        return [result];
      }

      return [];
    } catch (error) {
      console.error('Error uploading resumes:', error);
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
