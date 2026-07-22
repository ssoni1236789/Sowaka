import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Upload, MoreHorizontal, LayoutDashboard, Users, BarChart2, Settings, TrendingUp } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import StatusBadge from '../components/ui/StatusBadge';

const EMPLOYEES = [
  { id: 1, name: 'Helena Vance', role: 'VP Engineering', dept: 'Engineering', manager: 'CEO', status: 'ACTIVE' },
  { id: 2, name: 'Julian Thorne', role: 'Design Lead', dept: 'Brand & UX', manager: 'Helena Vance', status: 'ACTIVE' },
  { id: 3, name: 'Sarah Chen', role: 'Operations Manager', dept: 'Logistics', manager: 'COO', status: 'ON_LEAVE' },
  { id: 4, name: 'Marcus Reeves', role: 'Global Sales Dir', dept: 'Sales', manager: 'CEO', status: 'ACTIVE' },
  { id: 5, name: 'David Kim', role: 'Frontend Engineer', dept: 'Engineering', manager: 'Helena Vance', status: 'INACTIVE' },
];

const EmployeeDirectory = () => {
  const navigate = useNavigate();

  const sidebarProps = {
    logoIcon: <TrendingUp size={24} />,
    logoText: 'Performance',
    subtitle: 'Growth Engine',
    navigation: [
      { label: 'Overview', path: '/hr-insights', icon: <LayoutDashboard size={18} /> },
      { label: 'Directory', path: '/hr/directory', icon: <Users size={18} /> },
      { label: 'Analytics', path: '/hr-insights', icon: <BarChart2 size={18} /> },
      { label: 'Settings', path: '#', icon: <Settings size={18} /> },
    ],
    onAction: () => navigate('/feedback'),
    actionLabel: 'New Evaluation'
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
            Employee Directory
          </h1>
          <p className="text-sowaka-textMuted text-sm max-w-xl leading-relaxed">
            Manage your organization's user accounts, roles, and reporting hierarchy.
          </p>
        </div>
        
        <div className="flex gap-4">
          <button className="bg-white border border-sowaka-border text-sowaka-text hover:bg-gray-50 px-5 py-2.5 rounded font-bold text-sm transition-colors flex items-center gap-2 shadow-sm">
            <Upload size={16} /> Import CSV
          </button>
          <button className="bg-sowaka-primary text-white hover:bg-sowaka-primaryHover px-5 py-2.5 rounded font-bold text-sm transition-colors flex items-center gap-2 shadow-sm">
            <Plus size={16} /> Add Employee
          </button>
        </div>
      </div>

      <div className="bg-white border border-sowaka-border rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 border-b border-sowaka-border flex justify-between items-center bg-[#FCFAF8]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sowaka-textMuted" />
            <input 
              type="text" 
              placeholder="Search employees..."
              className="bg-white border border-sowaka-border text-sm rounded px-9 py-2 w-72 focus:outline-none focus:border-sowaka-primary"
            />
          </div>
          <div className="flex gap-3">
            <select className="border border-sowaka-border rounded px-4 py-2 text-sm text-sowaka-text bg-white outline-none">
              <option>All Departments</option>
              <option>Engineering</option>
            </select>
            <select className="border border-sowaka-border rounded px-4 py-2 text-sm text-sowaka-text bg-white outline-none">
              <option>Status: Active</option>
              <option>All Statuses</option>
            </select>
          </div>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-[#FDFCF9] text-[10px] font-bold text-sowaka-textMuted uppercase tracking-widest border-b border-sowaka-border">
            <tr>
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Manager</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sowaka-border">
            {EMPLOYEES.map(emp => (
              <tr key={emp.id} className="hover:bg-[#FCFAF8] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={`https://i.pravatar.cc/150?u=100${emp.id}`} className="w-10 h-10 rounded-full object-cover border border-sowaka-border" />
                    <div>
                      <div className="font-bold text-sowaka-text text-sm">{emp.name}</div>
                      <div className="text-xs text-sowaka-textMuted mt-0.5">{emp.role}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sowaka-text">{emp.dept}</td>
                <td className="px-6 py-4 text-sowaka-text">{emp.manager}</td>
                <td className="px-6 py-4">
                  <StatusBadge 
                    status={emp.status.replace('_', ' ')} 
                    variant={emp.status === 'ACTIVE' ? 'ON_TRACK' : emp.status === 'INACTIVE' ? 'PENDING' : 'STEADY'} 
                  />
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-sowaka-textMuted hover:text-sowaka-text transition-colors p-1">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageLayout>
  );
};

export default EmployeeDirectory;
