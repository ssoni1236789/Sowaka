import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  History, 
  BarChart2, 
  User, 
  LogOut, 
  Users, 
  ClipboardList, 
  CheckCircle,
  Activity,
  FileText,
  Clock,
  Briefcase
} from 'lucide-react';

const SidebarNavigation = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getLinksForRole = (role) => {
    switch(role) {
      case 'EMPLOYEE':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
          { label: 'Current Feedback', path: '/feedback/current', icon: <MessageSquare size={20} /> },
          { label: 'History', path: '/feedback/history', icon: <History size={20} /> },
          { label: 'Analytics', path: '/analytics', icon: <BarChart2 size={20} /> },
          { label: 'Profile', path: '/profile', icon: <User size={20} /> },
        ];
      case 'MANAGER':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
          { label: 'My Team', path: '/team', icon: <Users size={20} /> },
          { label: 'Performance', path: '/performance', icon: <Activity size={20} /> },
        ];
      case 'HR':
        return [
          { label: 'Employee Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
          { label: 'HR Insights', path: '/hr-insights', icon: <BarChart2 size={20} /> },
          { label: 'Employees', path: '/hr/employees', icon: <Users size={20} /> },
          { label: 'Managers', path: '/hr/managers', icon: <Briefcase size={20} /> },
          { label: 'Reviews', path: '/hr/reviews', icon: <ClipboardList size={20} /> },
          { label: 'Reports', path: '/hr/reports', icon: <FileText size={20} /> },
        ];
      default:
        return [];
    }
  };

  const links = getLinksForRole(user?.role || 'EMPLOYEE');

  return (
    <div className="w-64 h-screen bg-surface border-r border-surface-variant flex flex-col fixed left-0 top-0">
      <div className="h-20 flex items-center px-6 border-b border-surface-variant">
        <Link to="/dashboard" className="font-headline-md text-primary font-bold text-2xl tracking-tight">
          Sowaka
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="space-y-1">
          {links.map((link, idx) => {
            const isActive = location.pathname === link.path || (link.path !== '/dashboard' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={idx}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? "bg-primary-container text-on-primary-container font-medium" 
                    : "text-on-surface hover:bg-surface-variant/50 hover:text-primary"
                }`}
              >
                <span className={isActive ? "text-primary" : "text-on-surface-variant"}>
                  {link.icon}
                </span>
                <span className="text-sm">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-surface-variant">
        <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-surface-container-low">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant shrink-0">
            <img className="w-full h-full object-cover" src={user?.avatar || "https://i.pravatar.cc/150"} alt={user?.name || "User"} />
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-medium text-on-surface truncate">{user?.name || 'Loading...'}</span>
            <span className="text-xs text-on-surface-variant capitalize">{user?.role?.toLowerCase() || 'Employee'}</span>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error-container/20 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarNavigation;
