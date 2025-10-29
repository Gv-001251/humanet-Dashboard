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

interface LinkedInStatusResponse {
  success: boolean;
  data: {
    enabled: boolean;
    configured: boolean;
    apiKeySet: boolean;
    clientIdSet: boolean;
    mode: 'production' | 'mock';
  };
  message: string;
}

export const talentScoutService = {
  search: (filters: SearchFilters) =>
    api.post<SearchResponse>('/talent-scout/search', filters),

  getSavedCandidates: () =>
    api.get<CandidateListResponse>('/talent-scout/candidates'),

  inviteCandidate: (payload: InviteRequest) =>
    api.post<InviteResponse>('/talent-scout/invite', payload),

  getLinkedInStatus: () =>
    api.get<LinkedInStatusResponse>('/talent-scout/linkedin-status')
};
