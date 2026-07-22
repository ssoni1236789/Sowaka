import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Calendar, CheckCircle2, AlertTriangle, Play, Square, LayoutDashboard, Users, BarChart2, Settings, TrendingUp } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import StatusBadge from '../components/ui/StatusBadge';

const CYCLES = [
  { id: 1, name: 'June 2024 Cycle', start: 'Jun 1, 2024', end: 'Jun 30, 2024', status: 'ACTIVE', completion: 45 },
  { id: 2, name: 'May 2024 Cycle', start: 'May 1, 2024', end: 'May 31, 2024', status: 'CLOSED', completion: 98 },
  { id: 3, name: 'April 2024 Cycle', start: 'Apr 1, 2024', end: 'Apr 30, 2024', status: 'CLOSED', completion: 100 },
];

const FeedbackCycles = () => {
  const navigate = useNavigate();

  const sidebarProps = {
    logoIcon: <TrendingUp size={24} />,
    logoText: 'Performance',
    subtitle: 'Growth Engine',
    navigation: [
      { label: 'Overview', path: '/hr-insights', icon: <LayoutDashboard size={18} /> },
      { label: 'Directory', path: '/hr/directory', icon: <Users size={18} /> },
      { label: 'Cycles', path: '/hr/cycles', icon: <Calendar size={18} /> },
      { label: 'Analytics', path: '/hr-insights', icon: <BarChart2 size={18} /> },
      { label: 'Settings', path: '#', icon: <Settings size={18} /> },
    ],
    onAction: () => alert('Opening new cycle...'),
    actionLabel: 'New Cycle',
    actionIcon: Plus
  };

  const topNavProps = {
    links: [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'My Team', path: '/team' },
      { label: 'Reviews', path: '/feedback' },
      { label: 'HR Insights', path: '/hr-insights' }
    ]
  };

  return (
    <PageLayout sidebarProps={sidebarProps} topNavProps={topNavProps}>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-sowaka-text mb-4">
            Feedback Cycle Management
          </h1>
          <p className="text-sowaka-textMuted text-sm max-w-xl leading-relaxed">
            Manage the monthly performance evaluation cycles. Open new cycles and monitor overall completion progress.
          </p>
        </div>
        
        <button className="bg-sowaka-primary text-white hover:bg-sowaka-primaryHover px-5 py-2.5 rounded font-bold text-sm transition-colors flex items-center gap-2 shadow-sm">
          <Play size={16} /> Open New Cycle
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {CYCLES.map(cycle => (
          <div key={cycle.id} className={`bg-white border ${cycle.status === 'ACTIVE' ? 'border-sowaka-primary shadow-md' : 'border-sowaka-border shadow-sm'} rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6`}>
            
            <div className="flex gap-6 items-center flex-1">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${cycle.status === 'ACTIVE' ? 'bg-[#FCECE8] text-sowaka-primary' : 'bg-[#F5F1EB] text-sowaka-textMuted'}`}>
                <Calendar size={24} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-serif font-bold text-xl text-sowaka-text">{cycle.name}</h3>
                  <StatusBadge status={cycle.status} variant={cycle.status === 'ACTIVE' ? 'PENDING' : 'COMPLETED'} />
                </div>
                <p className="text-xs font-bold text-sowaka-textMuted uppercase tracking-widest">
                  {cycle.start} - {cycle.end}
                </p>
              </div>
            </div>

            <div className="flex-1 w-full max-w-xs">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-sowaka-textMuted uppercase tracking-widest">Completion</span>
                <span className={cycle.status === 'ACTIVE' ? 'text-sowaka-primary' : 'text-green-600'}>
                  {cycle.completion}%
                </span>
              </div>
              <div className="h-2 w-full bg-[#F5F1EB] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${cycle.status === 'ACTIVE' ? 'bg-sowaka-primary' : 'bg-green-500'}`} 
                  style={{ width: `${cycle.completion}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {cycle.status === 'ACTIVE' ? (
                <button className="bg-white border border-[#C04C4C] text-[#C04C4C] hover:bg-[#FDECEC] px-5 py-2.5 rounded font-bold text-sm transition-colors flex items-center gap-2">
                  <Square size={16} fill="currentColor" /> Close Cycle
                </button>
              ) : (
                <button className="bg-white border border-sowaka-border text-sowaka-text hover:bg-gray-50 px-5 py-2.5 rounded font-bold text-sm transition-colors flex items-center gap-2">
                  <BarChart2 size={16} /> View Report
                </button>
              )}
            </div>

          </div>
        ))}
      </div>
    </PageLayout>
  );
};

export default FeedbackCycles;
