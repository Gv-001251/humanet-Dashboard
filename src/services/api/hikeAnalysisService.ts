const API_BASE_URL = 'http://localhost:3001/api';

export interface HikeAnalysis {
  current_ctc: number;
  expected_ctc: number;
  experience_years: number;
  role: string;
  skills: string[];
  hike_percentage: number;
  market_average_ctc: number;
  risk_assessment: string;
  recommendations: string[];
  analyzed_at: Date;
}

export interface HikeAnalysisRequest {
  current_ctc: number;
  expected_ctc: number;
  experience_years: number;
  role: string;
  skills: string[];
}

export interface BenchmarkData {
  [role: string]: {
    [experienceRange: string]: {
      min: number;
      max: number;
      avg: number;
    };
  };
}

export class HikeAnalysisService {
  static async analyzeHikeExpectation(request: HikeAnalysisRequest): Promise<HikeAnalysis> {
    try {
      const response = await fetch(`${API_BASE_URL}/hike/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze hike expectation');
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing hike expectation:', error);
      throw error;
    }
  }

  static async getBenchmarks(): Promise<BenchmarkData> {
    try {
      const response = await fetch(`${API_BASE_URL}/hike/benchmarks`);
      if (!response.ok) {
        throw new Error('Failed to fetch benchmarks');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching benchmarks:', error);
      throw error;
    }
  }

  static calculateHikePercentage(currentCtc: number, expectedCtc: number): number {
    return ((expectedCtc - currentCtc) / currentCtc) * 100;
  }

  static assessRiskLevel(hikePercentage: number): 'Low' | 'Medium' | 'High' {
    if (hikePercentage < 20) return 'Low';
    if (hikePercentage < 40) return 'Medium';
    return 'High';
  }

  static getRiskColor(riskLevel: string): string {
    switch (riskLevel) {
      case 'Low':
        return 'text-green-600 bg-green-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'High':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  static getExperienceRange(experience: number): string {
    if (experience < 2) return '0-2';
    if (experience < 5) return '2-5';
    return '5+';
  }

  static getMarketAverageForRole(role: string, experience: number, benchmarks: BenchmarkData): number {
    const roleBenchmarks = benchmarks[role];
    if (!roleBenchmarks) return 0;

    const expRange = this.getExperienceRange(experience);
    const rangeBenchmarks = roleBenchmarks[expRange];
    
    return rangeBenchmarks ? rangeBenchmarks.avg : 0;
  }

  static generateRecommendations(analysis: HikeAnalysis): string[] {
    const recommendations: string[] = [];
    const hikePercentage = analysis.hike_percentage;

    if (hikePercentage > 50) {
      recommendations.push('Hike expectation is very high (>50%). Consider negotiating a lower percentage.');
      recommendations.push('Offer additional benefits like ESOPs, flexible work, or learning budget instead.');
      recommendations.push('Highlight career growth opportunities and company culture.');
    } else if (hikePercentage > 30) {
      recommendations.push('Hike expectation is moderate (30-50%). Standard negotiation approach recommended.');
      recommendations.push('Consider performance-based increments after joining.');
    } else if (hikePercentage < 10) {
      recommendations.push('Hike expectation is low (<10%). This might indicate strong interest in the role.');
      recommendations.push('Consider offering additional benefits to make the offer more attractive.');
    } else {
      recommendations.push('Hike expectation is within acceptable range (10-30%).');
      recommendations.push('Proceed with standard offer terms.');
    }

    if (analysis.expected_ctc > analysis.market_average_ctc * 1.2) {
      recommendations.push('Expected CTC is above market average. Provide market data during negotiation.');
    }

    return recommendations;
  }

  static calculateRetentionRisk(hikePercentage: number, experience: number): number {
    let risk = 0;
    
    // Higher hike = higher risk of shopping
    if (hikePercentage > 40) risk += 40;
    else if (hikePercentage > 25) risk += 20;
    
    // Mid-level experience = higher shopping risk
    if (experience >= 3 && experience <= 6) risk += 20;
    
    // Very high hike with mid-experience = maximum risk
    if (hikePercentage > 50 && experience >= 3 && experience <= 6) risk += 20;
    
    return Math.min(risk, 100);
  }

  static getRetentionRiskColor(risk: number): string {
    if (risk < 30) return 'text-green-600 bg-green-100';
    if (risk < 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  }

  static getRetentionRiskLevel(risk: number): string {
    if (risk < 30) return 'Low Risk';
    if (risk < 60) return 'Medium Risk';
    return 'High Risk';
  }
}
