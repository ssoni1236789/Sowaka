import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import SidebarNavigation from '../components/layout/SidebarNavigation';

const PARAMETERS = [
  { id: 'ownership', name: 'Ownership', desc: 'Degree of accountability and proactive problem solving.' },
  { id: 'communication', name: 'Communication', desc: 'Clarity of thought and effectiveness of information sharing.' },
  { id: 'quality', name: 'Quality of Work', desc: 'Attention to detail and overall excellence of deliverables.' },
  { id: 'collaboration', name: 'Collaboration', desc: 'Teamwork and willingness to support peers.' },
  { id: 'problem_solving', name: 'Problem Solving', desc: 'Ability to navigate complex challenges and find solutions.' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [user, setUser] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [trend, setTrend] = useState([]);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [selectedEval, setSelectedEval] = useState(null);
  const [showAllHistory, setShowAllHistory] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meRes, dashRes, histRes, trendRes, currentRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/employee/dashboard'),
          api.get('/employee/feedback/history'),
          api.get('/employee/performance-trend'),
          api.get('/employee/feedback/current')
        ]);
        
        setUser(meRes.data.user);
        setDashboardStats(dashRes.data);
        setHistory(histRes.data);
        setTrend(trendRes.data);
        setCurrentFeedback(currentRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          navigate('/');
        } else {
          setError('Failed to load dashboard data.');
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbf9f4] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#823119]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fbf9f4] flex items-center justify-center">
        <div className="text-[#ba1a1a] p-4 bg-[#ffdad6] rounded-xl">{error}</div>
      </div>
    );
  }

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const displayedHistory = showAllHistory ? history : history.slice(0, 3);

  return (
    <div className="font-body-md text-on-surface bg-background min-h-screen flex">
      <SidebarNavigation user={user} />

      <main className="min-h-screen flex-1 ml-64">
        <div className="max-w-container-max mx-auto px-margin-desktop py-stack-lg flex flex-col lg:flex-row gap-gutter">
          
          {/* Left Content Area */}
          <div className="flex-1 space-y-stack-lg">
            
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-xl p-stack-md flex flex-col md:flex-row items-center gap-8 border border-outline-variant bg-white">
              <div className="flex-1 z-10">
                <span className="font-label-md text-label-md text-primary uppercase tracking-widest mb-4 block">
                  {dashboardStats?.currentCycle?.name || "No Active Cycle"}
                </span>
                <h1 className="font-headline-xl text-headline-xl mb-6 text-on-surface">
                  Welcome to {user?.companyName || 'your company'}, {user?.name?.split(' ')[0]}!
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                  {user?.role === 'EMPLOYEE' ? 'Growth is not a linear metric; it\'s a shared dialogue. Explore your evolution through qualitative insights and data-driven trends.' : 'Your Performance Journey. Explore your evolution through qualitative insights.'}
                </p>
                <div className="mt-8 flex gap-4">
                  <button 
                    onClick={() => navigate('/feedback/current')}
                    className="bg-primary-container text-on-primary px-8 py-3 rounded-full font-label-md hover:bg-primary transition-all duration-300 shadow-sm"
                  >
                    View Full Report
                  </button>
                  <button 
                    onClick={() => window.print()}
                    className="border border-primary text-primary px-8 py-3 rounded-full font-label-md hover:bg-primary-fixed transition-all duration-300 print:hidden"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            </section>

            {/* Chart & Analytics Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {/* Line Chart (CSS representation) */}
              <div className="md:col-span-2 bg-white rounded-xl border border-outline-variant p-stack-md flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Numerical Score Trend</h3>
                    <p className="font-label-md text-label-md text-on-surface-variant">Historical Evaluations</p>
                  </div>
                  <div className="bg-surface-container px-3 py-1 rounded-full flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="font-label-md text-label-md">Average: {dashboardStats?.averageOverallScore || "0.0"}</span>
                  </div>
                </div>
                
                <div className="h-[300px] flex items-end justify-between gap-2 pt-10">
                  {trend.length === 0 ? (
                    <div className="w-full text-center text-on-surface-variant h-full flex items-center justify-center">No trend data available</div>
                  ) : (
                    trend.slice(-6).map((item, index) => {
                      const heightPercent = Math.max(20, Math.min(100, (item.score / 5) * 100));
                      const isLast = index === trend.slice(-6).length - 1;
                      
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-4 h-full justify-end">
                          <div 
                            className={`w-full rounded-t-sm transition-all duration-700 relative group ${isLast ? 'bg-primary' : 'bg-primary-fixed-dim'}`}
                            style={{ height: `${heightPercent}%` }}
                          >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              {item.score.toFixed(1)}
                            </div>
                          </div>
                          <span className="text-[10px] font-label-md uppercase text-on-surface-variant">
                            {item.cycle.split(' ')[0].substring(0,3)}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Highlight Card */}
              <div className="bg-primary-container text-on-primary rounded-xl p-stack-md flex flex-col justify-between">
                <div>
                  <span className="material-symbols-outlined text-4xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <h3 className="font-headline-md text-headline-md">Top Strength</h3>
                  <p className="font-body-md mt-4 opacity-90">"Exceptional collaborative leadership during the Q2 roadmap transition."</p>
                </div>
                <div className="mt-8 border-t border-white/20 pt-4">
                  <p className="font-label-md uppercase tracking-widest opacity-70">Evaluations Completed</p>
                  <p className="font-headline-md mt-1">{dashboardStats?.completedEvaluationsCount || 0}</p>
                </div>
              </div>
            </div>

            {/* Recent Evaluations Table */}
            <section className="bg-white rounded-xl border border-outline-variant overflow-hidden">
              <div className="p-stack-md border-b border-outline-variant flex justify-between items-center">
                <h3 className="font-headline-md text-headline-md">Recent Evaluations</h3>
                <button 
                  onClick={() => setShowAllHistory(!showAllHistory)}
                  className="text-primary font-label-md hover:underline"
                >
                  {showAllHistory ? 'Show Less' : 'View Archives'}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-low border-b border-outline-variant">
                    <tr>
                      <th className="px-stack-md py-4 font-label-md text-on-surface-variant uppercase">Month</th>
                      <th className="px-stack-md py-4 font-label-md text-on-surface-variant uppercase">Overall Score</th>
                      <th className="px-stack-md py-4 font-label-md text-on-surface-variant uppercase text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30">
                    {displayedHistory.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-stack-md py-8 text-center text-on-surface-variant">
                          No evaluations completed yet.
                        </td>
                      </tr>
                    ) : (
                      displayedHistory.map(evalRecord => (
                        <tr key={evalRecord.id} className="hover:bg-surface-container-low transition-colors group">
                          <td className="px-stack-md py-6 font-headline-md text-on-surface">{evalRecord.cycle.name}</td>
                          <td className="px-stack-md py-6">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-primary">{evalRecord.overallScore?.toFixed(1)}</span>
                              <span className="text-on-surface-variant">/ 5.0</span>
                            </div>
                          </td>
                          <td className="px-stack-md py-6 text-right">
                            <button 
                              onClick={() => setSelectedEval(evalRecord)}
                              className="bg-surface-container px-4 py-2 rounded-lg font-label-md hover:bg-primary-container hover:text-on-primary transition-all"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <aside className="w-full lg:w-80 space-y-gutter">
            
            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-outline-variant p-stack-md text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary-fixed mx-auto">
                  <img className="w-full h-full object-cover" src={user?.avatar || "https://i.pravatar.cc/150"} alt="User Profile" />
                </div>
                <div className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full border-2 border-white">
                  <span className="material-symbols-outlined text-sm">verified</span>
                </div>
              </div>
              <h2 className="font-headline-md text-headline-md">{user?.name}</h2>
              <p className="font-label-md text-on-surface-variant mt-1">{user?.role}</p>
              
              <div className="mt-6 pt-6 border-t border-outline-variant/30 flex justify-around">
                <div>
                  <p className="font-label-md text-primary">Active</p>
                  <p className="text-[10px] uppercase text-on-surface-variant">Status</p>
                </div>
                <div>
                  <p className="font-label-md text-primary">{dashboardStats?.completedEvaluationsCount || 0}</p>
                  <p className="text-[10px] uppercase text-on-surface-variant">Reviews</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-surface-container-low rounded-xl p-stack-md space-y-4 border border-outline-variant">
              <h4 className="font-label-md uppercase tracking-widest text-on-surface-variant mb-4">Quick Actions</h4>
              <button onClick={() => navigate('/profile')} className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-outline-variant hover:border-primary transition-all group">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">manage_accounts</span>
                  <span className="font-label-md">Edit Profile</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
              </button>
              <a className="flex items-center justify-between p-4 bg-white rounded-lg border border-outline-variant hover:border-primary transition-all group" href="#">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">edit_note</span>
                  <span className="font-label-md">Self Assessment</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
              </a>
              <a className="flex items-center justify-between p-4 bg-white rounded-lg border border-outline-variant hover:border-primary transition-all group" href="#">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">track_changes</span>
                  <span className="font-label-md">My Goals</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
              </a>
            </div>
            
          </aside>
        </div>
      </main>

      {/* Details Modal */}
      {selectedEval && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-background w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-white">
              <div>
                <h2 className="font-headline-md text-headline-md text-primary">
                  Evaluation Details
                </h2>
                <p className="text-on-surface-variant font-label-md mt-1">{selectedEval.cycle.name}</p>
              </div>
              <button onClick={() => setSelectedEval(null)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 bg-surface-container-low">
              <div className="bg-white rounded-lg border border-outline-variant divide-y divide-outline-variant">
                {selectedEval.scores.map(s => (
                  <div key={s.id} className="p-6 flex gap-6 hover:bg-surface/50 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-headline-sm text-on-surface mb-1">{s.parameter}</h3>
                      <p className="text-xs text-on-surface-variant mb-2">{PARAMETERS.find(p => p.name === s.parameter)?.desc}</p>
                      <p className="text-body-md italic text-on-surface-variant whitespace-pre-wrap">
                        {s.comment ? `"${s.comment}"` : 'No specific comments provided.'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-start min-w-[60px]">
                      <span className="font-label-md tracking-widest uppercase text-on-surface-variant mb-1">Score</span>
                      <span className="font-headline-lg text-primary">{s.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-outline-variant bg-white flex justify-end">
              <button 
                onClick={() => setSelectedEval(null)}
                className="px-6 py-3 rounded-full font-label-md bg-primary text-white hover:bg-primary-fixed transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* FAB */}
      <button className="fixed bottom-8 right-8 bg-primary-container text-on-primary w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95 z-50">
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  );
};

export default Dashboard;
