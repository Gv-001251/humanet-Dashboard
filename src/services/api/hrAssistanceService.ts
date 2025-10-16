import API_BASE_URL from './apiConfig';

export interface HRQueryRequest {
  query: string;
}

export interface HRQueryResponse {
  query: string;
  response: string;
  timestamp: string;
}

export class HRAssistanceService {
  static async askQuery(query: string): Promise<HRQueryResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/hr-assistance/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to process query');
      }

      return await response.json();
    } catch (error) {
      console.error('Error processing HR query:', error);
      throw error;
    }
  }
}
