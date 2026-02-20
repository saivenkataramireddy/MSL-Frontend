import { NavLink, useLocation } from 'react-router-dom';
import { useAuth, hasRole } from '../context/AuthContext';
import {
    LayoutDashboard, Users, Stethoscope, Activity,
    BookOpen, Briefcase, Bell, LogOut, Shield, Calendar,
    AlertCircle, X,
} from 'lucide-react';

const allNav = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', section: 'Overview' },
    { to: '/doctors', icon: Stethoscope, label: 'Doctors', section: 'Operations' },
    { to: '/interactions', icon: Activity, label: 'Interactions', section: 'Operations' },
    { to: '/objections', icon: AlertCircle, label: 'Objections', section: 'Operations' },
    { to: '/tour-plans', icon: Calendar, label: 'Tour Plans', section: 'Operations' },
    { to: '/knowledge', icon: BookOpen, label: 'Knowledge', section: 'Resources' },
    { to: '/office', icon: Briefcase, label: 'Office Log', section: 'Resources' },
    { to: '/notifications', icon: Bell, label: 'Notifications', section: 'Resources' },
    { to: '/users', icon: Users, label: 'Users', section: 'Admin', adminOnly: true },
    { to: '/roles', icon: Shield, label: 'Roles', section: 'Admin', adminOnly: true },
];

// Group nav items by section
function groupNav(items) {
    const groups = {};
    for (const item of items) {
        if (!groups[item.section]) groups[item.section] = [];
        groups[item.section].push(item);
    }
    return groups;
}

export default function Sidebar({ isOpen, onClose }) {
    const { user, logout } = useAuth();
    const isAdmin = hasRole(user, 'Admin');

    const visible = allNav.filter(n => !n.adminOnly || isAdmin);
    const groups = groupNav(visible);
    const initials = user?.full_name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-logo">
                <div className="sidebar-logo-flex">
                    <h1>🧬 MSL Portal</h1>
                    <button className="sidebar-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <p>Medical Science Liaison</p>
            </div>

            <nav className="sidebar-nav">
                {Object.entries(groups).map(([section, items]) => (
                    <div key={section}>
                        <div className="nav-section-label">{section}</div>
                        {items.map(({ to, icon: Icon, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                id={`nav-${label.toLowerCase().replace(/\s/g, '-')}`}
                                onClick={onClose}
                                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                            >
                                <Icon size={16} />
                                {label}
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-pill">
                    <div className="user-avatar">{initials}</div>
                    <div className="user-info">
                        <div className="name">{user?.full_name || 'User'}</div>
                        <div className="role">{user?.role?.name || '—'}</div>
                    </div>
                    <button className="logout-btn" onClick={logout} title="Sign out">
                        <LogOut size={15} />
                    </button>
                </div>
            </div>
        </aside>
    );
}
