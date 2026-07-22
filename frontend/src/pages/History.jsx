import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import SidebarNavigation from '../components/layout/SidebarNavigation';

const History = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedEval, setSelectedEval] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meRes, histRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/employee/feedback/history')
        ]);
        
        setUser(meRes.data.user);
        setHistory(histRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          navigate('/');
        } else {
          setError('Failed to load feedback history.');
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
              <span>History</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-4">
              Evaluation Archive
            </h1>
            <p className="font-body-lg text-on-surface-variant max-w-xl">
              Review your past performance evaluations to track your growth over time.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr>
                    <th className="px-stack-md py-4 font-label-md text-on-surface-variant uppercase">Cycle</th>
                    <th className="px-stack-md py-4 font-label-md text-on-surface-variant uppercase">Date</th>
                    <th className="px-stack-md py-4 font-label-md text-on-surface-variant uppercase">Overall Score</th>
                    <th className="px-stack-md py-4 font-label-md text-on-surface-variant uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-stack-md py-8 text-center text-on-surface-variant">
                        No historical evaluations found.
                      </td>
                    </tr>
                  ) : (
                    history.map(evalRecord => (
                      <tr key={evalRecord.id} className="hover:bg-surface-container-low transition-colors group">
                        <td className="px-stack-md py-6 font-headline-md text-on-surface">{evalRecord.cycle.name}</td>
                        <td className="px-stack-md py-6 text-on-surface-variant">
                          {new Date(evalRecord.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-stack-md py-6">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-primary">{evalRecord.overallScore?.toFixed(1)}</span>
                            <span className="text-on-surface-variant">/ 5.0</span>
                          </div>
                        </td>
                        <td className="px-stack-md py-6 text-right">
                          <button 
                            onClick={() => setSelectedEval(evalRecord)}
                            className="bg-surface-container px-4 py-2 rounded-lg font-label-md hover:bg-primary-container hover:text-on-primary transition-all shadow-sm"
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
          </div>
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
                {selectedEval.scores?.map(s => (
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
              {selectedEval.comments && (
                <div className="mt-6 bg-white p-6 rounded-lg border border-outline-variant">
                  <h3 className="font-label-md tracking-widest uppercase text-on-surface-variant mb-4">Overall Comments</h3>
                  <p className="font-body-md text-on-surface whitespace-pre-wrap">{selectedEval.comments}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-outline-variant bg-white flex justify-end">
              <button 
                onClick={() => setSelectedEval(null)}
                className="px-6 py-3 rounded-full font-label-md bg-primary text-white hover:bg-primary-fixed transition-colors shadow-sm"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default History;
