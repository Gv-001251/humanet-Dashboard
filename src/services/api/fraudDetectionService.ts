const API_BASE_URL = 'http://localhost:3001/api';

export interface DocumentVerification {
  _id?: string;
  candidate_id: string;
  document_type: string;
  document_url: string;
  verification_status: 'pending' | 'verified' | 'fraud_detected';
  fraud_score: number;
  fraud_indicators: string[];
  verified_by: string;
  verified_at: Date;
  created_at?: Date;
}

export interface FraudAnalysis {
  risk_score: number;
  indicators: string[];
}

export interface DocumentUploadRequest {
  candidate_id: string;
  document_type: string;
  verified_by: string;
  document: File;
}

export class FraudDetectionService {
  static async verifyDocument(uploadData: DocumentUploadRequest): Promise<DocumentVerification> {
    try {
      const formData = new FormData();
      formData.append('candidate_id', uploadData.candidate_id);
      formData.append('document_type', uploadData.document_type);
      formData.append('verified_by', uploadData.verified_by);
      formData.append('document', uploadData.document);

      const response = await fetch(`${API_BASE_URL}/fraud/verify`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to verify document');
      }

      return await response.json();
    } catch (error) {
      console.error('Error verifying document:', error);
      throw error;
    }
  }

  static async getFraudReports(): Promise<DocumentVerification[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/fraud/reports`);
      if (!response.ok) {
        throw new Error('Failed to fetch fraud reports');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching fraud reports:', error);
      throw error;
    }
  }

  static async analyzeDocument(file: File): Promise<FraudAnalysis> {
    try {
      const formData = new FormData();
      formData.append('document', file);

      const response = await fetch(`${API_BASE_URL}/fraud/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze document');
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing document:', error);
      throw error;
    }
  }

  static getRiskLevel(score: number): 'Low' | 'Medium' | 'High' {
    if (score < 30) return 'Low';
    if (score < 70) return 'Medium';
    return 'High';
  }

  static getRiskColor(score: number): string {
    if (score < 30) return 'text-green-600 bg-green-100';
    if (score < 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  }

  static getStatusColor(status: string): string {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-100';
      case 'fraud_detected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  }

  static getStatusText(status: string): string {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'fraud_detected':
        return 'Fraud Detected';
      default:
        return 'Pending';
    }
  }
}
