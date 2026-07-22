import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import SidebarNavigation from '../components/layout/SidebarNavigation';

const PARAMETERS = [
  { id: 'ownership', name: 'Ownership', desc: 'Degree of accountability and proactive problem solving.' },
  { id: 'communication', name: 'Communication', desc: 'Clarity of thought and effectiveness of information sharing.' },
  { id: 'quality', name: 'Quality of Work', desc: 'Attention to detail and overall excellence of deliverables.' },
  { id: 'collaboration', name: 'Collaboration', desc: 'Teamwork and willingness to support peers.' },
  { id: 'problem_solving', name: 'Problem Solving', desc: 'Ability to navigate complex challenges and find solutions.' },
];

const FeedbackForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const employeeId = searchParams.get('employee');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [user, setUser] = useState(null);
  const [targetEmployee, setTargetEmployee] = useState(null);
  const [currentCycle, setCurrentCycle] = useState(null);
  const [evaluationId, setEvaluationId] = useState(null);

  const [feedback, setFeedback] = useState({
    ownership: { score: null, comment: '' },
    communication: { score: null, comment: '' },
    quality: { score: null, comment: '' },
    collaboration: { score: null, comment: '' },
    problem_solving: { score: null, comment: '' },
  });
  const [overallComment, setOverallComment] = useState('');
  
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meRes, teamRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/manager/team')
        ]);
        
        setUser(meRes.data.user);
        setCurrentCycle(teamRes.data.currentCycle);

        if (!employeeId) {
          setError('No employee specified for review.');
          setLoading(false);
          return;
        }

        const employee = teamRes.data.team.find(m => m.id === employeeId);
        if (!employee) {
          setError('Employee not found in your team.');
          setLoading(false);
          return;
        }

        setTargetEmployee(employee);
        
        const evalRecord = employee.evaluationsReceived[0];
        if (evalRecord && evalRecord.id !== 'none') {
          if (evalRecord.status === 'COMPLETED') {
            setError('This evaluation has already been completed.');
          } else {
            setEvaluationId(evalRecord.id);
          }
        } else {
          setError('No pending evaluation found for this employee in the current cycle.');
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load data.');
        setLoading(false);
      }
    };
    fetchData();
  }, [employeeId]);

  const handleScoreChange = (paramId, score) => {
    setFeedback(prev => ({ ...prev, [paramId]: { ...prev[paramId], score } }));
  };

  const handleCommentChange = (paramId, comment) => {
    setFeedback(prev => ({ ...prev, [paramId]: { ...prev[paramId], comment } }));
  };

  const completedCount = Object.values(feedback).filter(f => f.score && f.comment.trim() !== '').length;

  const handleSubmit = async () => {
    if (!evaluationId) return;
    setSubmitting(true);
    
    try {
      const scores = Object.keys(feedback).map(key => ({
        parameter: PARAMETERS.find(p => p.id === key).name,
        score: feedback[key].score,
        comment: feedback[key].comment
      })).filter(s => s.score !== null);

      await api.post(`/manager/evaluations/${evaluationId}`, {
        scores,
        comments: overallComment.trim() || 'Submitted via Feedback Form'
      });

      alert('Feedback Submitted successfully!');
      navigate('/team');
    } catch (err) {
      console.error(err);
      alert('Failed to submit feedback.');
      setSubmitting(false);
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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="text-error p-4 bg-error-container rounded-xl">{error}</div>
        <button onClick={() => navigate('/team')} className="text-primary hover:underline font-label-md">Return to My Team</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 relative font-body-md text-on-surface flex">
      <SidebarNavigation user={user} />

      <main className="flex-1 ml-64 max-w-container-max mx-auto px-margin-desktop pt-12 grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        
        {/* Left Column (Form) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="mb-2">
            <div className="font-label-md text-primary tracking-widest uppercase flex gap-2 items-center mb-4">
              <span className="hover:underline cursor-pointer" onClick={() => navigate('/team')}>Team Reviews</span>
              <span>&gt;</span>
              <span>{targetEmployee.name}</span>
            </div>
            <h1 className="text-headline-xl font-headline-xl text-on-surface mb-4">
              Performance Feedback:<br/>{targetEmployee.name} - {currentCycle?.name}
            </h1>
            <p className="text-on-surface-variant text-body-lg max-w-xl">
              This evaluation focuses on growth and achievement over the past cycle. Please provide candid, qualitative feedback alongside numerical ratings.
            </p>
          </div>

          <div className="flex flex-col gap-8 mt-4">
            {PARAMETERS.map((param) => (
              <div key={param.id} className="bg-white rounded-xl border border-outline-variant p-stack-md shadow-sm">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-1">{param.name}</h2>
                <p className="text-on-surface-variant text-body-md mb-6">{param.desc}</p>
                
                <div className="mb-6">
                  <p className="font-label-md tracking-widest uppercase text-on-surface-variant mb-3">Rating</p>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button
                        key={score}
                        onClick={() => handleScoreChange(param.id, score)}
                        className={`w-12 h-12 rounded-lg font-headline-md flex items-center justify-center transition-all ${
                          feedback[param.id].score === score
                            ? 'bg-primary text-white border-primary shadow-sm'
                            : 'bg-surface text-on-surface border border-outline-variant hover:border-primary hover:text-primary'
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-label-md tracking-widest uppercase text-on-surface-variant mb-3">Comments</p>
                  <textarea
                    rows={4}
                    placeholder={`Describe specific instances of ${param.name.toLowerCase()}...`}
                    value={feedback[param.id].comment}
                    onChange={(e) => handleCommentChange(param.id, e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-colors"
                  ></textarea>
                </div>
              </div>
            ))}
            
            {/* Overall Comments Section */}
            <div className="bg-white rounded-xl border border-outline-variant p-stack-md shadow-sm">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-1">Overall Comments</h2>
              <p className="text-on-surface-variant text-body-md mb-6">Summarize this employee's performance for the cycle.</p>
              <textarea
                rows={4}
                placeholder="Overall summary..."
                value={overallComment}
                onChange={(e) => setOverallComment(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-colors"
              ></textarea>
            </div>

          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 flex flex-col gap-6">
            
            {/* Guidelines */}
            <div className="bg-surface-container-low rounded-xl border border-outline-variant p-6">
              <h3 className="font-label-md tracking-widest uppercase text-on-surface-variant mb-4">Rating Guidelines</h3>
              <div className="flex flex-col gap-4 text-sm">
                <div>
                  <span className="font-bold text-on-surface">5. Exceptional</span>
                  <p className="text-on-surface-variant text-xs mt-1">Consistently sets new standards, influences team direction, and past growth significantly.</p>
                </div>
                <div>
                  <span className="font-bold text-on-surface">4. Exceeds Expectations</span>
                  <p className="text-on-surface-variant text-xs mt-1">Proactive performance that often goes beyond assigned responsibilities.</p>
                </div>
                <div>
                  <span className="font-bold text-on-surface">3. Meets Expectations</span>
                  <p className="text-on-surface-variant text-xs mt-1">Solid, reliable contributor. Achieves all key results with standard guidance.</p>
                </div>
                <div>
                  <span className="font-bold text-on-surface">2. Needs Improvement</span>
                  <p className="text-on-surface-variant text-xs mt-1">Performance is inconsistent. Development plan or closer monitoring required.</p>
                </div>
                <div>
                  <span className="font-bold text-on-surface">1. Poor</span>
                  <p className="text-on-surface-variant text-xs mt-1">Significant gaps in delivery. Urgent attention and corrective action required.</p>
                </div>
              </div>
            </div>

            {/* Review Progress Card */}
            <div className="bg-primary-container text-on-primary rounded-xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10">
                <span className="material-symbols-outlined text-9xl transform translate-x-8 -translate-y-8" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
              <h3 className="font-headline-md text-headline-md relative z-10">Review Progress</h3>
              <p className="text-on-primary/80 text-body-md mt-1 mb-6 relative z-10">{completedCount} / 5 parameters completed</p>
              
              <button 
                onClick={() => setShowSummary(true)}
                disabled={completedCount < 5}
                className="w-full bg-white text-primary hover:bg-surface-container font-label-md py-3 rounded-full transition-colors relative z-10 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Review & Submit
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-background w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-white">
              <h2 className="font-headline-md text-headline-md text-primary">
                Review Summary: {targetEmployee.name}
              </h2>
              <button onClick={() => setShowSummary(false)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="overflow-y-auto p-6 bg-surface-container-low">
              <div className="bg-white rounded-lg border border-outline-variant divide-y divide-outline-variant">
                {PARAMETERS.map((param) => {
                  const item = feedback[param.id];
                  return (
                    <div key={param.id} className="p-6 flex gap-6 hover:bg-surface/50 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-headline-sm text-on-surface mb-2">{param.name}</h3>
                        <p className="text-body-md italic text-on-surface-variant whitespace-pre-wrap">
                          {item.comment.trim() ? `"${item.comment}"` : '"No comments provided yet."'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-start min-w-[60px]">
                        <span className="font-label-md tracking-widest uppercase text-on-surface-variant mb-1">Score</span>
                        <span className="font-headline-lg text-primary">
                          {item.score || '-'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-outline-variant bg-white flex justify-end gap-4">
              <button 
                onClick={() => setShowSummary(false)}
                className="px-6 py-3 rounded-full font-label-md border border-outline-variant text-on-surface hover:bg-surface-container transition-colors"
                disabled={submitting}
              >
                Edit Review
              </button>
              <button 
                onClick={handleSubmit}
                disabled={submitting || completedCount < 5}
                className="px-6 py-3 rounded-full font-label-md bg-primary hover:bg-primary-fixed text-white transition-colors disabled:opacity-50 shadow-sm"
              >
                {submitting ? 'Submitting...' : 'Submit Final Review'}
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
};

export default FeedbackForm;
