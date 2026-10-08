const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Helper to fetch with JSON handling and Authorization header injection
 */
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem('wecare_admin_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error);
    throw error;
  }
};

export const api = {
  // Departments
  getDepartments: () => request('/departments'),
  getDepartment: (id) => request(`/departments/${id}`),

  // Doctors
  getDoctors: (params = {}) => {
    const query = new URLSearchParams();
    if (params.department && params.department !== 'all') {
      query.append('department', params.department);
    }
    if (params.search) {
      query.append('search', params.search);
    }
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request(`/doctors${qs}`);
  },
  getDoctor: (id) => request(`/doctors/${id}`),

  // Appointments
  createAppointment: (appointmentData) =>
    request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    }),
  trackAppointment: (bookingId) =>
    request(`/appointments/${encodeURIComponent(bookingId.trim())}`),

  // AI Doctor Recommendation
  getDoctorRecommendation: (message, conversationHistory = []) =>
    request('/ai/doctor-recommendation', {
      method: 'POST',
      body: JSON.stringify({ message, conversationHistory }),
    }),

  // Admin Portal
  adminLogin: (credentials) =>
    request('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  getAdminAppointments: (status) => {
    const qs = status && status !== 'all' ? `?status=${status}` : '';
    return request(`/admin/appointments${qs}`);
  },
  updateAppointmentStatus: (id, status, adminNotes) =>
    request(`/admin/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, adminNotes }),
    }),
  getAdminStats: () => request('/admin/stats'),
};

export default api;
