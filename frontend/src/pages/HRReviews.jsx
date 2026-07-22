import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import SidebarNavigation from '../components/layout/SidebarNavigation';

const HRReviews = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [meRes, revRes] = await Promise.all([
          api.get('/auth/me'),
          api.get(`/hr/reviews?status=${statusFilter}`)
        ]);
        
        setUser(meRes.data.user);
        setReviews(revRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          navigate('/');
        } else {
          setError('Failed to load reviews.');
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [navigate, statusFilter]);

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="font-body-md text-on-surface bg-background min-h-screen flex">
      <SidebarNavigation user={user} />

      <main className="min-h-screen flex-1 ml-64">
        <div className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
          
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="font-headline-xl text-headline-xl text-on-surface mb-2">Performance Reviews</h1>
              <p className="text-on-surface-variant text-body-lg">Monitor evaluation statuses across the company.</p>
            </div>
            
            <div className="flex gap-2 bg-surface-container-low p-1 rounded-lg border border-outline-variant">
              {['ALL', 'PENDING', 'COMPLETED'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-md font-label-md transition-all ${
                    statusFilter === status 
                      ? 'bg-white text-primary shadow-sm' 
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 text-error p-4 bg-error-container rounded-xl">{error}</div>
          )}

          <div className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm relative">
            {loading && user && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr>
                    <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase">Employee</th>
                    <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase">Manager</th>
                    <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase">Cycle</th>
                    <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase">Status</th>
                    <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {reviews.map(rev => (
                    <tr key={rev.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant shrink-0">
                            <img className="w-full h-full object-cover" src={rev.employee?.avatar || "https://i.pravatar.cc/150"} alt={rev.employee?.name} />
                          </div>
                          <span className="font-headline-sm text-on-surface">{rev.employee?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-body-md text-on-surface">{rev.manager?.name}</td>
                      <td className="px-6 py-4 text-body-md text-on-surface">{rev.cycle?.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
                          rev.status === 'COMPLETED' ? 'bg-primary-container text-on-primary-container' : 'bg-error-container/30 text-error'
                        }`}>
                          {rev.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-body-md text-on-surface-variant">
                        {new Date(rev.updatedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {reviews.length === 0 && !loading && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-on-surface-variant">
                        No reviews found for this status.
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

export default HRReviews;
