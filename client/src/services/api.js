// client/src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});


// Request interceptor: attach token if available
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      console.warn("Unauthorized. Backend rejected token.");
      // Do NOT redirect automatically during testing
    }
    return Promise.reject(err);
  }
);


// Response interceptor: handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      // invalid/expired token: clear local storage and redirect to login
      localStorage.removeItem('kmrl_token');
      localStorage.removeItem('kmrl_user');
   
    }
    return Promise.reject(error);
  }
);

export const AuthService = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),

  logout: () => {
    localStorage.removeItem('kmrl_token');
    localStorage.removeItem('kmrl_user');
    window.location.href = '/login';
  },
};

export const ScheduleService = {
  getAll: () => API.get('/schedule'),
  runOptimization: (params) => API.post('/schedule/optimize', params),
  updateTrip: (id, data) => API.put(`/schedule/trip/${id}`, data),
};

export const FleetService = {
  getStatus: () => API.get('/trains/status'),
  scheduleMaintenance: (trainId, type) => API.post(`/trains/${trainId}/maintenance`, { type }),
};

export const AnalyticsService = {
  getStationLoad: () => API.get('/analytics/station-load'),
  getPredictions: (date) => API.get(`/analytics/predictions?date=${date}`),
};

export const TicketService = {
  bookTicket: (data) => API.post("/tickets/book", data),
  myTickets: () => API.get("/tickets/my-tickets")
};


export default API;
