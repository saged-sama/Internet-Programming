import type { FeeStructure } from '../types/financials';

const API_BASE_URL = 'http://localhost:8000/api/financials';

// Helper function to get auth token (same as schedulingApi)
const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

class FinancialApi {
  private async request(endpoint: string, options?: RequestInit) {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Network error' }));
      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Student endpoints
  async getMyFees(): Promise<FeeStructure[]> {
    return this.request('/fees/my-fees');
  }

  async createPaymentIntent(data: {
    student_fee_id: string;
    amount: number;
    currency?: string;
  }) {
    return this.request('/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        currency: 'bdt'
      }),
    });
  }

  async confirmPayment(data: {
    payment_intent_id: string;
    payment_method_id: string;
  }) {
    return this.request('/payments/confirm', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPaymentHistory() {
    return this.request('/payments/history');
  }

  // Admin endpoints
  async getAllFees() {
    return this.request('/admin/fees');
  }

  async getPaymentStatistics() {
    return this.request('/admin/payment-statistics');
  }

  async createFee(data: {
    title: string;
    description?: string;
    type: string;
    amount: number;
    deadline: string;
    semester?: string;
    academic_year?: string;
    is_installment_available?: boolean;
    installment_count?: number;
    installment_amount?: number;
  }) {
    return this.request('/admin/fees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateFee(feeId: string, data: Partial<{
    title: string;
    description: string;
    type: string;
    amount: number;
    deadline: string;
    semester: string;
    academic_year: string;
    is_installment_available: boolean;
    installment_count: number;
    installment_amount: number;
  }>) {
    return this.request(`/admin/fees/${feeId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteFee(feeId: string) {
    return this.request(`/admin/fees/${feeId}`, {
      method: 'DELETE',
    });
  }

  async assignFeeToStudent(feeId: string, studentId: string, amountDue?: number) {
    return this.request(`/admin/assign-fee/${feeId}/student/${studentId}`, {
      method: 'POST',
      body: JSON.stringify({ amount_due: amountDue }),
    });
  }
}

export const financialApi = new FinancialApi(); 