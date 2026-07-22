import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import SidebarNavigation from '../components/layout/SidebarNavigation';

const HRInsights = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [user, setUser] = useState(null);
  const [hrData, setHrData] = useState(null);

  const [showNewCycleModal, setShowNewCycleModal] = useState(false);
  const [newCycleName, setNewCycleName] = useState('');
  const [newCycleStart, setNewCycleStart] = useState('');
  const [newCycleEnd, setNewCycleEnd] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meRes, hrRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/hr/dashboard')
        ]);
        
        setUser(meRes.data.user);
        setHrData(hrRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          navigate('/');
        } else {
          setError('Failed to load HR data.');
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

  const { currentCycle, metrics, history, managersOverview } = hrData || { currentCycle: null, metrics: {}, history: [], managersOverview: [] };

  const handleStartCycle = async (e) => {
    e.preventDefault();
    try {
      await api.post('/hr/cycles', {
        name: newCycleName,
        startDate: newCycleStart,
        endDate: newCycleEnd
      });
      setShowNewCycleModal(false);
      window.location.reload(); // Quick refresh to load new data
    } catch (err) {
      console.error("Failed to start cycle", err);
      alert("Failed to start cycle");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 relative font-body-md text-on-surface flex">
      <SidebarNavigation user={user} />

      <main className="flex-1 ml-64 max-w-container-max mx-auto px-margin-desktop pt-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
          <div>
            <div className="font-label-md text-primary uppercase tracking-widest mb-3 flex gap-2">
              <span className="hover:underline cursor-pointer">Organization Wide</span>
              <span>&gt;</span>
              <span>Performance Analytics</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-4">
              Welcome to {user?.companyName || 'your company'}, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="font-body-lg text-on-surface-variant max-w-xl">
              Monitor organization-wide evaluation progress and historical performance trends. Ensure managers are completing reviews for their direct reports.
            </p>
          </div>
          
          <div className="flex gap-4 flex-col md:flex-row items-center">
            <button 
              onClick={() => navigate('/profile')}
              className="bg-surface-container-low text-on-surface border border-outline-variant font-label-md px-6 py-3 rounded-full hover:border-primary shadow-sm transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">manage_accounts</span> Edit Profile
            </button>
            <button 
              onClick={() => setShowNewCycleModal(true)}
              className="bg-primary text-white font-label-md px-6 py-3 rounded-full hover:bg-primary-fixed shadow-sm transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add</span> Start New Cycle
            </button>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center">
                <span className="material-symbols-outlined">track_changes</span>
              </div>
              <span className="text-[10px] font-label-md uppercase tracking-widest text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">Active</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">{metrics.completionRate}%</h2>
            <p className="font-label-md text-on-surface-variant uppercase tracking-widest mb-4">Completion Rate</p>
            <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${metrics.completionRate}%` }}></div>
            </div>
          </div>

          <div className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-full bg-error-container text-error flex items-center justify-center">
                <span className="material-symbols-outlined">assignment_late</span>
              </div>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">{metrics.totalEmployees - metrics.completedEvaluations}</h2>
            <p className="font-label-md text-on-surface-variant uppercase tracking-widest mb-4">Pending Evaluations</p>
            <div className="text-body-sm text-on-surface-variant">Out of {metrics.totalEmployees} total employees.</div>
          </div>

          <div className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center">
                <span className="material-symbols-outlined">groups</span>
              </div>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">{metrics.totalEmployees}</h2>
            <p className="font-label-md text-on-surface-variant uppercase tracking-widest mb-4">Total Employees</p>
            <div className="text-body-sm text-on-surface-variant">Registered in the tenant.</div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Managers Overview */}
          <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-stack-md border-b border-outline-variant flex justify-between items-center">
              <h2 className="font-headline-md text-headline-md text-on-surface">Managers Overview</h2>
            </div>
            <div className="overflow-y-auto max-h-[400px]">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low border-b border-outline-variant text-on-surface-variant font-label-md uppercase tracking-widest text-[10px] sticky top-0">
                  <tr>
                    <th className="px-6 py-4">Manager</th>
                    <th className="px-6 py-4">Team Size</th>
                    <th className="px-6 py-4">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {managersOverview?.map(mgr => (
                    <tr key={mgr.id} className="hover:bg-surface/50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <img src={mgr.avatar || `https://i.pravatar.cc/150?u=${mgr.id}`} className="w-10 h-10 rounded-full object-cover border border-outline-variant" />
                          <div>
                            <div className="font-headline-sm text-on-surface">{mgr.name}</div>
                            <div className="text-[10px] uppercase font-label-md text-on-surface-variant">{mgr.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-on-surface-variant font-label-md">{mgr.teamSize} reports</td>
                      <td className="px-6 py-5">
                        <div className="flex justify-between text-[10px] font-label-md uppercase mb-2">
                          <span className="text-on-surface">{mgr.progress}%</span>
                          <span className={mgr.progress === 100 ? 'text-primary' : 'text-on-surface-variant'}>
                            {mgr.progress === 100 ? 'Complete' : 'Pending'}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${mgr.progress}%` }}></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* History Table */}
          <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-stack-md border-b border-outline-variant flex justify-between items-center">
              <h2 className="font-headline-md text-headline-md text-on-surface">Evaluation Cycles History</h2>
            </div>
            <div className="overflow-y-auto max-h-[400px]">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low border-b border-outline-variant text-on-surface-variant font-label-md uppercase tracking-widest text-[10px] sticky top-0">
                  <tr>
                    <th className="px-6 py-4">Cycle Name</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {history.map(cycle => (
                    <tr key={cycle.id} className="hover:bg-surface/50 transition-colors">
                      <td className="px-6 py-5 font-headline-sm text-on-surface">{cycle.name}</td>
                      <td className="px-6 py-5">
                        <span className={`text-[10px] font-label-md uppercase tracking-widest px-3 py-1 rounded-full ${
                          cycle.status === 'ACTIVE' 
                            ? 'bg-primary-container text-on-primary' 
                            : 'bg-surface-container text-on-surface-variant'
                        }`}>
                          {cycle.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-on-surface-variant font-label-md">
                        {new Date(cycle.startDate).toLocaleDateString()} - {new Date(cycle.endDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

      </main>

      {/* New Cycle Modal */}
      {showNewCycleModal && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-background w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-white">
              <h2 className="font-headline-md text-headline-md text-primary">
                Start New Cycle
              </h2>
              <button onClick={() => setShowNewCycleModal(false)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleStartCycle}>
              <div className="p-6 space-y-4 bg-surface-container-low">
                <p className="font-body-md text-on-surface-variant mb-6">
                  Starting a new cycle will automatically close the current active cycle.
                </p>
                <div>
                  <label className="block text-[10px] font-label-md uppercase tracking-widest text-on-surface-variant mb-2">Cycle Name</label>
                  <input required type="text" value={newCycleName} onChange={e => setNewCycleName(e.target.value)} placeholder="e.g. Q3 2026 Evaluation" className="w-full border border-outline-variant rounded-lg px-4 py-3 bg-white text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-label-md uppercase tracking-widest text-on-surface-variant mb-2">Start Date</label>
                    <input required type="date" value={newCycleStart} onChange={e => setNewCycleStart(e.target.value)} className="w-full border border-outline-variant rounded-lg px-4 py-3 bg-white text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-label-md uppercase tracking-widest text-on-surface-variant mb-2">End Date</label>
                    <input required type="date" value={newCycleEnd} onChange={e => setNewCycleEnd(e.target.value)} className="w-full border border-outline-variant rounded-lg px-4 py-3 bg-white text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors" />
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-outline-variant bg-white flex justify-end gap-3">
                <button type="button" onClick={() => setShowNewCycleModal(false)} className="px-6 py-3 rounded-full font-label-md text-on-surface-variant hover:bg-surface-container transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-3 rounded-full font-label-md bg-primary text-white hover:bg-primary-fixed transition-colors">
                  Launch Cycle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default HRInsights;
