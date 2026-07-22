import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import SidebarNavigation from '../components/layout/SidebarNavigation';

const HRCycles = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [user, setUser] = useState(null);
  const [cycles, setCycles] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [newCycleName, setNewCycleName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meRes, cyclesRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/hr/cycles')
        ]);
        
        setUser(meRes.data.user);
        setCycles(cyclesRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          navigate('/');
        } else {
          setError('Failed to load cycles.');
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [navigate]);

  const handleCreate = async () => {
    if (!newCycleName.trim()) return;
    setCreating(true);
    try {
      const today = new Date();
      const endDate = new Date(today);
      endDate.setMonth(today.getMonth() + 1); // Auto-end in 1 month for simplicity

      await api.post('/hr/cycles', {
        name: newCycleName,
        startDate: today.toISOString(),
        endDate: endDate.toISOString()
      });
      
      const res = await api.get('/hr/cycles');
      setCycles(res.data);
      setShowModal(false);
      setNewCycleName('');
    } catch (err) {
      alert('Failed to create cycle');
    } finally {
      setCreating(false);
    }
  };

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
          
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="font-headline-xl text-headline-xl text-on-surface mb-2">Feedback Cycles</h1>
              <p className="text-on-surface-variant text-body-lg">Manage review periods for the company.</p>
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-primary text-white px-6 py-2 rounded-full font-label-md hover:bg-primary-fixed shadow-sm"
            >
              Create New Cycle
            </button>
          </div>

          <div className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr>
                    <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase">Cycle Name</th>
                    <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase">Start Date</th>
                    <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase">End Date</th>
                    <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase">Status</th>
                    <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase text-center">Evaluations Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {cycles.map(cycle => (
                    <tr key={cycle.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4 font-headline-sm text-on-surface">{cycle.name}</td>
                      <td className="px-6 py-4 text-body-md text-on-surface">{new Date(cycle.startDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-body-md text-on-surface">{new Date(cycle.endDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
                          cycle.status === 'ACTIVE' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-variant text-on-surface-variant'
                        }`}>
                          {cycle.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-headline-md text-on-surface text-center">
                        {cycle._count?.evaluations || 0}
                      </td>
                    </tr>
                  ))}
                  {cycles.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-on-surface-variant">
                        No cycles found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </main>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col p-6">
            <h2 className="font-headline-md text-primary mb-2">Create New Cycle</h2>
            <p className="text-on-surface-variant text-sm mb-6">This will automatically close any currently active cycle and open a new one starting today.</p>
            
            <label className="font-label-md uppercase tracking-widest text-on-surface-variant mb-2">Cycle Name</label>
            <input 
              type="text" 
              placeholder="e.g. Q3 Performance Review"
              value={newCycleName}
              onChange={(e) => setNewCycleName(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 text-body-md focus:border-primary focus:outline-none mb-6"
            />
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-full font-label-md text-on-surface hover:bg-surface-container"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreate}
                disabled={creating || !newCycleName.trim()}
                className="px-6 py-2 rounded-full font-label-md bg-primary text-white hover:bg-primary-fixed disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create Cycle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRCycles;
