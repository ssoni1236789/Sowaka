import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import SidebarNavigation from '../components/layout/SidebarNavigation';

const Analytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [user, setUser] = useState(null);
  const [trend, setTrend] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meRes, trendRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/employee/performance-trend')
        ]);
        
        setUser(meRes.data.user);
        setTrend(trendRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          navigate('/');
        } else {
          setError('Failed to load performance analytics.');
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

  // Calculate average score for the header
  const averageOverallScore = trend.length > 0 
    ? (trend.reduce((sum, item) => sum + item.score, 0) / trend.length).toFixed(1)
    : "0.0";

  return (
    <div className="font-body-md text-on-surface bg-background min-h-screen flex">
      <SidebarNavigation user={user} />

      <main className="min-h-screen flex-1 ml-64">
        <div className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
          
          <div className="mb-8">
            <div className="font-label-md text-primary uppercase tracking-widest mb-3 flex gap-2">
              <span className="hover:underline cursor-pointer">Performance</span>
              <span>&gt;</span>
              <span>Analytics</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-4">
              Performance Analytics
            </h1>
            <p className="font-body-lg text-on-surface-variant max-w-xl">
              Visualize your growth and identify areas for improvement over time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Chart Area */}
            <div className="md:col-span-2 bg-white rounded-xl border border-outline-variant p-stack-md flex flex-col h-[500px]">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Numerical Score Trend</h3>
                  <p className="font-label-md text-label-md text-on-surface-variant">Historical Evaluations</p>
                </div>
                <div className="bg-surface-container px-3 py-1 rounded-full flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="font-label-md text-label-md">Average: {averageOverallScore}</span>
                </div>
              </div>
              
              <div className="flex-1 flex items-end justify-between gap-4 pt-10">
                {trend.length === 0 ? (
                  <div className="w-full text-center text-on-surface-variant h-full flex items-center justify-center">No trend data available</div>
                ) : (
                  trend.slice(-6).map((item, index) => {
                    const heightPercent = Math.max(20, Math.min(100, (item.score / 5) * 100));
                    const isLast = index === trend.slice(-6).length - 1;
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-4 h-full justify-end">
                        <div 
                          className={`w-full rounded-t-sm transition-all duration-700 relative group flex items-end justify-center ${isLast ? 'bg-primary' : 'bg-primary-fixed-dim'}`}
                          style={{ height: `${heightPercent}%` }}
                        >
                          <div className="absolute -top-10 bg-on-surface text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.score.toFixed(1)}
                          </div>
                        </div>
                        <span className="text-[10px] font-label-md uppercase tracking-widest text-on-surface-variant text-center leading-tight">
                          {item.cycle}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Quick Stats Sidebar for Analytics */}
            <div className="space-y-6">
              <div className="bg-primary-container text-on-primary rounded-xl p-stack-md">
                <span className="material-symbols-outlined text-4xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <h3 className="font-headline-md text-headline-md mb-2">Highest Score</h3>
                <p className="font-headline-xl">{trend.length > 0 ? Math.max(...trend.map(t => t.score)).toFixed(1) : 'N/A'}</p>
                <p className="font-label-md tracking-widest uppercase opacity-80 mt-4">Out of 5.0</p>
              </div>
              
              <div className="bg-surface-container-low border border-outline-variant rounded-xl p-stack-md">
                <span className="material-symbols-outlined text-3xl mb-4 text-on-surface-variant">monitoring</span>
                <h3 className="font-headline-md text-on-surface mb-2">Total Reviews</h3>
                <p className="font-headline-xl text-primary">{trend.length}</p>
                <p className="font-label-md tracking-widest uppercase text-on-surface-variant mt-4">Completed Cycles</p>
              </div>
            </div>
          </div>

          {/* Parameter Breakdown Table */}
          {trend.length > 0 && trend[0].parameters && Object.keys(trend[0].parameters).length > 0 && (
            <div className="mt-8 bg-white rounded-xl border border-outline-variant p-stack-md shadow-sm">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-6">Parameter Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant">
                      <th className="py-3 px-4 font-label-md text-on-surface-variant uppercase tracking-widest text-[10px]">Parameter</th>
                      {trend.map((t, idx) => (
                        <th key={idx} className="py-3 px-4 font-label-md text-on-surface-variant uppercase tracking-widest text-[10px] text-center">{t.cycle}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(trend[0].parameters).map((param, pIdx) => (
                      <tr key={pIdx} className="border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors">
                        <td className="py-4 px-4 font-headline-sm text-on-surface">{param}</td>
                        {trend.map((t, tIdx) => {
                          const val = t.parameters?.[param] || 0;
                          return (
                            <td key={tIdx} className="py-4 px-4 text-center">
                              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs ${val >= 4 ? 'bg-primary-container text-on-primary-container' : val === 3 ? 'bg-surface-variant text-on-surface-variant' : 'bg-error-container text-error'}`}>
                                {val}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Analytics;
