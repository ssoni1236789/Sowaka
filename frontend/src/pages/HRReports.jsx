import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import SidebarNavigation from '../components/layout/SidebarNavigation';

const HRReports = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meRes, reportRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/hr/reports')
        ]);
        
        setUser(meRes.data.user);
        setReports(reportRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          navigate('/');
        } else {
          setError('Failed to load reports.');
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-error p-4 bg-error-container rounded-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="font-body-md text-on-surface bg-background min-h-screen flex">
      <SidebarNavigation user={user} />

      <main className="min-h-screen flex-1 ml-64">
        <div className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
          
          <div className="mb-8">
            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-2">Company Reports</h1>
            <p className="text-on-surface-variant text-body-lg">A comprehensive view of all completed historical evaluations.</p>
          </div>

          <div className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr>
                    <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase">Employee</th>
                    <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase">Review Month</th>
                    <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase">Overall Score</th>
                    <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase">Manager</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {reports.map(rep => (
                    <tr key={rep.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant shrink-0">
                            <img className="w-full h-full object-cover" src={rep.employee?.avatar || "https://i.pravatar.cc/150"} alt={rep.employee?.name} />
                          </div>
                          <span className="font-headline-sm text-on-surface">{rep.employee?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-body-md text-on-surface">{rep.cycle?.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-primary">{rep.overallScore?.toFixed(1)}</span>
                          <span className="text-on-surface-variant">/ 5.0</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-body-md text-on-surface">{rep.manager?.name}</td>
                    </tr>
                  ))}
                  {reports.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-on-surface-variant">
                        No completed reports found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default HRReports;
