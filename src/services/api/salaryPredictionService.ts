import API_BASE_URL from './apiConfig';

export interface SalaryPredictionRequest {
  skills: string[];
  experience_years: number;
  education: string;
  location: string;
  role: string;
}

export interface SalaryPrediction {
  predicted_salary: number;
  min_salary: number;
  max_salary: number;
  confidence: number;
  factors: {
    experience_impact: string;
    skills_impact: string;
    location_impact: string;
    education_impact: string;
  };
  market_comparison: {
    below_market: number;
    at_market: number;
    above_market: number;
  };
}

export interface SalaryFactors {
  most_impactful: Array<{
    name: string;
    weight: number;
  }>;
  skill_premiums: Record<string, number>;
}

export class SalaryPredictionService {
  static async predictSalary(data: SalaryPredictionRequest): Promise<SalaryPrediction> {
    try {
      const response = await fetch(`${API_BASE_URL}/salary/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to predict salary');
      }

      return await response.json();
    } catch (error) {
      console.error('Error predicting salary:', error);
      throw error;
    }
  }

  static async getSalaryFactors(): Promise<SalaryFactors> {
    try {
      const response = await fetch(`${API_BASE_URL}/salary/factors`);

      if (!response.ok) {
        throw new Error('Failed to fetch salary factors');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching salary factors:', error);
      throw error;
    }
  }
}
