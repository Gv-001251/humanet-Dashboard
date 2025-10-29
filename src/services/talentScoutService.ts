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

export const talentScoutService = {
  search: (filters: SearchFilters) =>
    api.post<SearchResponse>('/talent-scout/search', filters),

  getSavedCandidates: () =>
    api.get<CandidateListResponse>('/talent-scout/candidates'),

  inviteCandidate: (payload: InviteRequest) =>
    api.post<InviteResponse>('/talent-scout/invite', payload)
};
