import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobList from './pages/JobList';
import JobDetails from './pages/JobDetails';
import PostJob from './pages/PostJob';
import RecruiterDashboard from './pages/RecruiterDashboard';
import Applicants from './pages/Applicants';
import CandidateSearch from './pages/CandidateSearch';
import CandidateProfile from './pages/CandidateProfile';
import MyApplications from './pages/MyApplications';

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        <Route path="/recruiter/dashboard" element={<PrivateRoute role="recruiter"><RecruiterDashboard /></PrivateRoute>} />
        <Route path="/recruiter/jobs/new" element={<PrivateRoute role="recruiter"><PostJob /></PrivateRoute>} />
        <Route path="/recruiter/jobs/:jobId/applicants" element={<PrivateRoute role="recruiter"><Applicants /></PrivateRoute>} />
        <Route path="/recruiter/candidates" element={<PrivateRoute role="recruiter"><CandidateSearch /></PrivateRoute>} />

        <Route path="/candidate/profile" element={<PrivateRoute role="candidate"><CandidateProfile /></PrivateRoute>} />
        <Route path="/candidate/applications" element={<PrivateRoute role="candidate"><MyApplications /></PrivateRoute>} />
      </Routes>
    </div>
  );
}
