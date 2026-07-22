import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import SidebarNavigation from '../components/layout/SidebarNavigation';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [user, setUser] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meRes, teamRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/manager/team')
        ]);
        
        setUser(meRes.data.user);
        setTeamData(teamRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          navigate('/');
        } else {
          setError('Failed to load team data.');
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

  const { currentCycle, team } = teamData || { currentCycle: null, team: [] };
  
  // Calculate progress
  const totalReports = team.length;
  const completedReports = team.filter(m => m.evaluationsReceived[0]?.status === 'COMPLETED').length;
  const progressPercent = totalReports > 0 ? (completedReports / totalReports) * 100 : 0;

  const displayedTeam = filter === 'ALL' 
    ? team 
    : filter === 'PENDING'
      ? team.filter(m => m.evaluationsReceived[0]?.status !== 'COMPLETED')
      : team.filter(m => m.evaluationsReceived[0]?.status === 'COMPLETED');

  return (
    <div className="font-body-md text-on-surface bg-background min-h-screen flex">
      <SidebarNavigation user={user} />

      <main className="min-h-screen flex-1 ml-64 max-w-container-max mx-auto px-margin-desktop py-stack-lg pb-stack-lg">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
          <div>
            <div className="font-label-md text-primary uppercase tracking-widest mb-3 flex gap-2">
              <span className="hover:underline cursor-pointer">Team Management</span>
              <span>&gt;</span>
              <span>{currentCycle?.name || "No Active Cycle"}</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-4">
              Welcome to {user?.companyName || 'your company'}, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="font-body-lg text-on-surface-variant max-w-xl">
              Focus on qualitative growth and potential. Identify key development paths for your direct reports during this evaluation period.
            </p>
          </div>
          
          <div className="flex flex-col gap-4 w-full md:w-72">
            <button onClick={() => navigate('/profile')} className="w-full bg-surface-container-low border border-outline-variant hover:border-primary text-on-surface px-6 py-3 rounded-xl font-label-md transition-colors flex items-center justify-center gap-2 shadow-sm">
              <span className="material-symbols-outlined text-sm">manage_accounts</span> Edit Profile
            </button>
            <div className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm">
              <h3 className="font-label-md text-on-surface-variant tracking-widest uppercase mb-4">Cycle Progress</h3>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="font-headline-xl text-primary">{completedReports}</span>
              <span className="font-headline-md text-on-surface">of {totalReports}</span>
              <span className="text-xs text-on-surface-variant ml-1 leading-tight uppercase">evaluations<br/>completed</span>
            </div>
            <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8">
          <button 
            onClick={() => setFilter('ALL')}
            className={`${filter === 'ALL' ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-low border border-outline-variant text-on-surface hover:bg-surface-container'} px-6 py-2 rounded-full font-label-md transition-colors`}
          >
            All Members
          </button>
          <button 
            onClick={() => setFilter('PENDING')}
            className={`${filter === 'PENDING' ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-low border border-outline-variant text-on-surface hover:bg-surface-container'} px-6 py-2 rounded-full font-label-md transition-colors`}
          >
            Pending Only
          </button>
          <button 
            onClick={() => setFilter('COMPLETED')}
            className={`${filter === 'COMPLETED' ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-low border border-outline-variant text-on-surface hover:bg-surface-container'} px-6 py-2 rounded-full font-label-md transition-colors`}
          >
            Completed Only
          </button>
        </div>

        {/* Grid of Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTeam.map((member) => {
            const evaluation = member.evaluationsReceived[0];
            const isCompleted = evaluation?.status === 'COMPLETED';
            
            return (
              <div key={member.id} className="bg-white border border-outline-variant rounded-xl p-6 flex flex-col shadow-sm hover:border-primary transition-colors group">
                
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4 items-center">
                    <img src={member.avatar || "https://i.pravatar.cc/150"} alt={member.name} className="w-12 h-12 rounded-xl object-cover border border-outline-variant" />
                    <div>
                      <h3 className="font-headline-sm text-on-surface">{member.name}</h3>
                      <p className="font-label-md text-on-surface-variant mt-1">{member.role}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-label-md uppercase tracking-widest px-3 py-1 rounded-full ${
                    isCompleted 
                      ? 'bg-primary-container text-on-primary' 
                      : 'bg-error-container text-error'
                  }`}>
                    {isCompleted ? 'COMPLETED' : 'PENDING'}
                  </span>
                </div>

                <div className="flex-1 flex flex-col gap-4 mb-8">
                  {isCompleted ? (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-on-surface-variant">Last updated</span>
                        <span className="font-semibold text-on-surface">{new Date(evaluation.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-on-surface-variant">Overall Score</span>
                        <span className="font-bold text-primary">{evaluation.overallScore?.toFixed(1) || 'N/A'}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-on-surface-variant">Self-review</span>
                        <span className="font-semibold italic text-on-surface-variant">
                          Not started
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-on-surface-variant">Deadline</span>
                        <span className="font-bold text-error">Active Cycle</span>
                      </div>
                    </>
                  )}
                </div>

                {isCompleted ? (
                  <button 
                    onClick={() => setSelectedReview({ member, evaluation })}
                    className="w-full text-on-surface font-label-md py-3 flex items-center justify-center gap-2 hover:bg-surface-container rounded-lg transition-colors border border-transparent"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant">visibility</span> View Review
                  </button>
                ) : (
                  <Link 
                    to={`/feedback?employee=${member.id}`}
                    className="w-full bg-primary hover:bg-primary-fixed text-white font-label-md py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span> Submit Feedback
                  </Link>
                )}
              </div>
            );
          })}
        </div>

      </main>

      {/* View Review Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-background w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-white">
              <div>
                <h2 className="font-headline-md text-headline-md text-primary">
                  Review for {selectedReview.member.name}
                </h2>
                <p className="text-on-surface-variant font-label-md mt-1">{currentCycle?.name}</p>
              </div>
              <button onClick={() => setSelectedReview(null)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 bg-surface-container-low flex flex-col gap-6">
              
              {/* Overall comments */}
              <div className="bg-white rounded-lg border border-outline-variant p-6">
                <h3 className="font-label-md text-on-surface-variant tracking-widest uppercase mb-4">Overall Feedback</h3>
                <p className="font-body-lg text-on-surface whitespace-pre-wrap">{selectedReview.evaluation.comments || "No general comments provided."}</p>
              </div>

              {/* Scores */}
              <div className="bg-white rounded-lg border border-outline-variant divide-y divide-outline-variant">
                {selectedReview.evaluation.scores?.map(s => (
                  <div key={s.id} className="p-6 flex gap-6 hover:bg-surface/50 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-headline-sm text-on-surface mb-2">{s.parameter}</h3>
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

            <div className="p-6 border-t border-outline-variant bg-white flex justify-between items-center">
              <div className="font-label-md text-on-surface-variant">
                Submitted on {new Date(selectedReview.evaluation.updatedAt).toLocaleDateString()}
              </div>
              <button 
                onClick={() => setSelectedReview(null)}
                className="px-6 py-3 rounded-full font-label-md bg-primary text-white hover:bg-primary-fixed transition-colors"
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
