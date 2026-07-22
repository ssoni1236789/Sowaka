import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import SidebarNavigation from '../components/layout/SidebarNavigation';

const HREmployees = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [user, setUser] = useState(null);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meRes, empRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/hr/employees')
        ]);
        
        setUser(meRes.data.user);
        setEmployees(empRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          navigate('/');
        } else {
          setError('Failed to load employees.');
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
            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-2">Company Employees</h1>
            <p className="text-on-surface-variant text-body-lg">Overview of all active employees in your organization.</p>
          </div>

          <div className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr>
                    <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase">Employee</th>
                    <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase">Manager</th>
                    <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {employees.map(emp => (
                    <tr key={emp.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant shrink-0">
                            <img className="w-full h-full object-cover" src={emp.avatar || "https://i.pravatar.cc/150"} alt={emp.name} />
                          </div>
                          <div>
                            <p className="font-headline-sm text-on-surface">{emp.name}</p>
                            <p className="text-sm text-on-surface-variant">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-body-md text-on-surface">{emp.manager?.name || 'No Manager'}</td>
                      <td className="px-6 py-4 text-body-md text-on-surface capitalize">Employee</td>
                    </tr>
                  ))}
                  {employees.length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-on-surface-variant">
                        No employees found.
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

export default HREmployees;
