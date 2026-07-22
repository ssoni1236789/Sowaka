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

const CurrentFeedback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [user, setUser] = useState(null);
  const [currentFeedback, setCurrentFeedback] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meRes, currentRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/employee/feedback/current')
        ]);
        
        setUser(meRes.data.user);
        setCurrentFeedback(currentRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          navigate('/');
        } else {
          setError('Failed to load current feedback.');
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
            <div className="font-label-md text-primary uppercase tracking-widest mb-3 flex gap-2">
              <span className="hover:underline cursor-pointer">Performance</span>
              <span>&gt;</span>
              <span>Current Feedback</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-4">
              Current Cycle Feedback
            </h1>
          </div>

          <div className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            {!currentFeedback || currentFeedback.status === 'none' ? (
              <div className="p-12 text-center text-on-surface-variant flex flex-col items-center">
                <span className="material-symbols-outlined text-6xl mb-4 opacity-50">pending_actions</span>
                <h3 className="font-headline-md text-on-surface mb-2">No Active Feedback</h3>
                <p>Your manager has not yet submitted feedback for the current cycle, or there is no active cycle.</p>
              </div>
            ) : currentFeedback.status === 'PENDING' ? (
              <div className="p-12 text-center text-on-surface-variant flex flex-col items-center">
                <span className="material-symbols-outlined text-6xl mb-4 opacity-50 text-error">hourglass_empty</span>
                <h3 className="font-headline-md text-on-surface mb-2">Evaluation Pending</h3>
                <p>Your manager is currently working on your evaluation for this cycle. Check back later.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="p-8 border-b border-outline-variant bg-surface-container-low flex justify-between items-start">
                  <div>
                    <h2 className="font-headline-md text-headline-md text-primary mb-2">
                      Completed Evaluation
                    </h2>
                    <p className="text-on-surface-variant font-label-md">Submitted on {new Date(currentFeedback.updatedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-label-md uppercase tracking-widest text-on-surface-variant mb-1">Overall Score</p>
                    <p className="font-headline-lg text-primary">{currentFeedback.overallScore?.toFixed(1)} / 5.0</p>
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="font-label-md tracking-widest uppercase text-on-surface-variant mb-4">Overall Comments</h3>
                  <p className="font-body-lg text-on-surface whitespace-pre-wrap mb-10">
                    {currentFeedback.comments || "No general comments provided."}
                  </p>

                  <h3 className="font-label-md tracking-widest uppercase text-on-surface-variant mb-4">Detailed Scores</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentFeedback.scores?.map(s => (
                      <div key={s.id} className="bg-surface-container-low p-6 rounded-xl border border-outline-variant hover:border-primary transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-headline-sm text-on-surface">{s.parameter}</h4>
                          <span className="font-headline-md text-primary">{s.score}</span>
                        </div>
                        <p className="text-xs text-on-surface-variant mb-4">{PARAMETERS.find(p => p.name === s.parameter)?.desc}</p>
                        <p className="text-body-md text-on-surface-variant italic whitespace-pre-wrap">
                          {s.comment ? `"${s.comment}"` : 'No specific comments provided.'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CurrentFeedback;
