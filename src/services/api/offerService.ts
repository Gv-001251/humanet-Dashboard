const API_BASE_URL = 'http://localhost:3001/api';

export interface Offer {
  _id?: string;
  candidate_id: string;
  candidate_name: string;
  candidate_email: string;
  position: string;
  department: string;
  offered_ctc: number;
  current_ctc: number;
  hike_percentage: number;
  joining_date: Date;
  offer_letter_url?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  risk_assessment: {
    shopping_risk: boolean;
    risk_factors: string[];
    recommendation: string;
  };
  created_at?: Date;
  sent_date?: Date;
  response_date?: Date;
}

export interface CreateOfferRequest {
  candidate_id: string;
  candidate_name: string;
  candidate_email: string;
  position: string;
  department: string;
  offered_ctc: number;
  current_ctc: number;
  joining_date: Date;
}

export interface UpdateOfferStatusRequest {
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  response_date?: Date;
}

export interface RiskAnalysis {
  shopping_risk: boolean;
  risk_factors: string[];
  recommendation: string;
}

export class OfferService {
  static async getAllOffers(): Promise<Offer[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/offers`);
      if (!response.ok) {
        throw new Error('Failed to fetch offers');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching offers:', error);
      throw error;
    }
  }

  static async getOfferById(id: string): Promise<Offer> {
    try {
      const response = await fetch(`${API_BASE_URL}/offers/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch offer');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching offer:', error);
      throw error;
    }
  }

  static async createOffer(offer: CreateOfferRequest): Promise<Offer> {
    try {
      const response = await fetch(`${API_BASE_URL}/offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offer),
      });

      if (!response.ok) {
        throw new Error('Failed to create offer');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  }

  static async updateOfferStatus(id: string, statusData: UpdateOfferStatusRequest): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/offers/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statusData),
      });

      if (!response.ok) {
        throw new Error('Failed to update offer status');
      }
    } catch (error) {
      console.error('Error updating offer status:', error);
      throw error;
    }
  }

  static calculateHikePercentage(currentCtc: number, offeredCtc: number): number {
    return ((offeredCtc - currentCtc) / currentCtc) * 100;
  }

  static calculateShoppingRisk(offer: Offer): RiskAnalysis {
    const hikePercentage = offer.hike_percentage;
    const riskFactors: string[] = [];
    let shoppingRisk = false;

    if (hikePercentage > 40) {
      riskFactors.push('High hike percentage (>40%)');
      shoppingRisk = true;
    }

    if (offer.offered_ctc > offer.current_ctc * 1.5) {
      riskFactors.push('Significant CTC increase (>50%)');
      shoppingRisk = true;
    }

    if (offer.notice_period && offer.notice_period > 90) {
      riskFactors.push('Long notice period (>90 days)');
      shoppingRisk = true;
    }

    let recommendation = 'Proceed with offer';
    if (shoppingRisk) {
      recommendation = 'High shopping risk - consider negotiation or additional benefits';
    }

    return {
      shopping_risk: shoppingRisk,
      risk_factors: riskFactors,
      recommendation: recommendation
    };
  }

  static getStatusColor(status: string): string {
    switch (status) {
      case 'accepted':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'withdrawn':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  }

  static getStatusText(status: string): string {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      case 'withdrawn':
        return 'Withdrawn';
      default:
        return 'Pending';
    }
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

  static formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
