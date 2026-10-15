import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Add Authorization Bearer token interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ai_recruit_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 unauth
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on protected route, can clear token if expired
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        // localStorage.removeItem('ai_recruit_token');
        // localStorage.removeItem('ai_recruit_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

// Jobs API
export const jobsAPI = {
  getJobs: (params) => API.get('/jobs', { params }),
  getMyJobs: () => API.get('/jobs/my-jobs'),
  getJobById: (id) => API.get(`/jobs/${id}`),
  createJob: (jobData) => API.post('/jobs', jobData),
  updateJob: (id, jobData) => API.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => API.delete(`/jobs/${id}`),
};

// Resume & Profile API
export const resumeAPI = {
  uploadResume: (formData) =>
    API.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  uploadRawText: (rawText) => API.post('/resume/upload', { rawText }),
  getMyProfile: () => API.get('/resume/my-profile'),
  updateMyProfile: (parsedData) => API.put('/resume/my-profile', { parsedData }),
  getProfileById: (id) => API.get(`/resume/${id}`),
};

// Matching & Ranking API
export const matchingAPI = {
  getRankedCandidates: (jobId) => API.get(`/matching/job/${jobId}/ranked-candidates`),
  evaluateCandidateForJob: (jobId, profileId) =>
    API.get(`/matching/evaluate/${jobId}`, { params: { profileId } }),
};

// Applications & Pipeline API
export const applicationAPI = {
  applyToJob: (jobId) => API.post(`/applications/apply/${jobId}`),
  getJobApplications: (jobId) => API.get(`/applications/job/${jobId}`),
  updateStage: (id, stage, note) => API.put(`/applications/${id}/stage`, { stage, note }),
  scheduleInterview: (id, interviewDetails) =>
    API.put(`/applications/${id}/schedule-interview`, interviewDetails),
  updateNotes: (id, recruiterNotes) => API.put(`/applications/${id}/notes`, { recruiterNotes }),
  getMyApplications: () => API.get('/applications/my-applications'),
};

// Stats API
export const statsAPI = {
  getRecruiterStats: () => API.get('/stats/recruiter'),
  getCandidateStats: () => API.get('/stats/candidate'),
};

export default API;
