import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobListingsPage from './pages/JobListingsPage';
import JobDetailPage from './pages/JobDetailPage';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import ResumeUploadPage from './pages/ResumeUploadPage';
import CandidateRankingPage from './pages/CandidateRankingPage';
import PipelineKanbanPage from './pages/PipelineKanbanPage';
import MyApplicationsPage from './pages/MyApplicationsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#F5F7F6] text-[#202925] flex flex-col selection:bg-[#315B52] selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/jobs" element={<JobListingsPage />} />
              <Route path="/jobs/:id" element={<JobDetailPage />} />

              {/* Recruiter Protected Routes */}
              <Route
                path="/recruiter-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['recruiter']}>
                    <RecruiterDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/matching/job/:jobId"
                element={
                  <ProtectedRoute allowedRoles={['recruiter']}>
                    <CandidateRankingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pipeline"
                element={
                  <ProtectedRoute allowedRoles={['recruiter']}>
                    <PipelineKanbanPage />
                  </ProtectedRoute>
                }
              />

              {/* Candidate Protected Routes */}
              <Route
                path="/candidate-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['candidate']}>
                    <CandidateDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume-upload"
                element={
                  <ProtectedRoute allowedRoles={['candidate']}>
                    <ResumeUploadPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-applications"
                element={
                  <ProtectedRoute allowedRoles={['candidate']}>
                    <MyApplicationsPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Minimalist Footer */}
          <footer className="py-6 border-t border-[#DFE6E2] bg-white text-center text-xs text-[#7A8781]">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div>
                © {new Date().getFullYear()} <strong className="text-[#202925]">AI Recruit Pro</strong> — Intelligent Automated Recruitment System
              </div>
              <div className="flex items-center gap-4 text-[#596760]">
                <span>Node.js NLP</span>
                <span>•</span>
                <span>Weighted Matching Engine</span>
                <span>•</span>
                <span>Kanban Pipeline</span>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
