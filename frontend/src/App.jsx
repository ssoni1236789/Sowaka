import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FeedbackForm from './pages/FeedbackForm';
import ManagerDashboard from './pages/ManagerDashboard';
import HRInsights from './pages/HRInsights';
import EmployeeDirectory from './pages/EmployeeDirectory';
import CurrentFeedback from './pages/CurrentFeedback';
import History from './pages/History';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import HREmployees from './pages/HREmployees';
import HRManagers from './pages/HRManagers';
import HRReviews from './pages/HRReviews';
import HRCycles from './pages/HRCycles';
import HRReports from './pages/HRReports';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Core Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/team" element={<ManagerDashboard />} />
        <Route path="/hr-insights" element={<HRInsights />} />
        <Route path="/hr/directory" element={<EmployeeDirectory />} />

        {/* Employee Routes */}
        <Route path="/feedback/current" element={<CurrentFeedback />} />
        <Route path="/feedback/history" element={<History />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<Profile />} />

        {/* Manager Placeholder Routes */}
        <Route path="/reviews/pending" element={<ManagerDashboard />} />
        <Route path="/reviews/completed" element={<ManagerDashboard />} />
        <Route path="/performance" element={<Analytics />} />

        {/* HR Placeholder Routes */}
        <Route path="/hr/employees" element={<HREmployees />} />
        <Route path="/hr/managers" element={<HRManagers />} />
        <Route path="/hr/reviews" element={<HRReviews />} />
        <Route path="/hr/reports" element={<HRReports />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
