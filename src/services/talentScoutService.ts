import { api } from './api';
import {
  ExternalCandidate,
  InviteRequest,
  InviteResponse,
  SearchFilters,
  SearchResponse
} from '../types/talentScout.types';

interface CandidateListResponse {
  success: boolean;
  data: ExternalCandidate[];
}

interface UploadResponse {
  success: boolean;
  data: ExternalCandidate[];
  message: string;
}

export const talentScoutService = {
  search: (filters: SearchFilters) =>
    api.post<SearchResponse>('/talent-scout/search', filters),

  getSavedCandidates: () =>
    api.get<CandidateListResponse>('/talent-scout/candidates'),

  inviteCandidate: (payload: InviteRequest) =>
    api.post<InviteResponse>('/talent-scout/invite', payload),

  uploadResumes: async (files: FileList): Promise<UploadResponse> => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('resumes', file);
    });
    return api.post<UploadResponse>('/talent-scout/upload', formData);
  }
};
