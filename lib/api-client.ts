import { ApiResponse, PaginatedResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

async function apiCall<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { params, ...fetchOptions } = options;

  // Build URL with query parameters
  let urlString = `${API_BASE_URL}${endpoint}`;
  const urlParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      urlParams.append(key, String(value));
    });
    const queryString = urlParams.toString();
    if (queryString) {
      urlString += (urlString.includes('?') ? '&' : '?') + queryString;
    }
  }

  try {
    const response = await fetch(urlString, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'An error occurred',
      };
    }

    return {
      success: true,
      data: data.data || data,
    };
  } catch (error) {
    console.error('API call error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}

// Jobs API
export const jobsApi = {
  list: (params?: { page?: number; pageSize?: number }) =>
    apiCall('/jobs', { params }),

  get: (id: string) =>
    apiCall(`/jobs/${id}`),

  create: (data: unknown) =>
    apiCall('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: unknown) =>
    apiCall(`/jobs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall(`/jobs/${id}`, {
      method: 'DELETE',
    }),
};

// Candidates API
export const candidatesApi = {
  list: (params?: { page?: number; pageSize?: number; search?: string }) =>
    apiCall('/candidates', { params }),

  get: (id: string) =>
    apiCall(`/candidates/${id}`),

  create: (data: unknown) =>
    apiCall('/candidates', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: unknown) =>
    apiCall(`/candidates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall(`/candidates/${id}`, {
      method: 'DELETE',
    }),

  bulkUpload: (file: File, preferredModel?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (preferredModel) {
      formData.append('preferredModel', preferredModel);
    }

    return fetch(`${API_BASE_URL}/candidates/bulk-upload`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .catch((err) => ({
        success: false,
        error: err.message,
      }));
  },
};

// Screening API
export const screeningApi = {
  create: (data: unknown) =>
    apiCall('/screenings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getRequest: (id: string) =>
    apiCall(`/screenings/${id}`),

  listRequests: (params?: { page?: number; pageSize?: number }) =>
    apiCall('/screenings', { params }),

  getResults: (screeningId: string, params?: { page?: number; pageSize?: number }) =>
    apiCall(`/screenings/${screeningId}/results`, { params }),

  retryScreening: (screeningId: string) =>
    apiCall(`/screenings/${screeningId}/retry`, {
      method: 'POST',
    }),
};

// Shortlists API
export const shortlistsApi = {
  list: (params?: { page?: number; pageSize?: number }) =>
    apiCall('/shortlists', { params }),

  get: (id: string) =>
    apiCall(`/shortlists/${id}`),

  create: (data: unknown) =>
    apiCall('/shortlists', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: unknown) =>
    apiCall(`/shortlists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  addCandidate: (shortlistId: string, candidateId: string) =>
    apiCall(`/shortlists/${shortlistId}/candidates`, {
      method: 'POST',
      body: JSON.stringify({ candidateId }),
    }),

  updateCandidateStatus: (shortlistId: string, candidateId: string, status: string) =>
    apiCall(`/shortlists/${shortlistId}/candidates/${candidateId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

// Dashboard API
export const dashboardApi = {
  getStats: () =>
    apiCall('/dashboard/stats'),

  getJobStats: (jobId: string) =>
    apiCall(`/dashboard/jobs/${jobId}/stats`),
};

// Export API
export const exportApi = {
  exportCandidates: (format: 'csv' | 'json') =>
    apiCall('/export/candidates', { params: { format } }),

  exportScreeningResults: (screeningId: string, format: 'csv' | 'json') =>
    apiCall(`/export/screening/${screeningId}`, { params: { format } }),
};
