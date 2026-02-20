import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';

const titles = {
    '/dashboard': ['Dashboard', 'Overview of your MSL activity'],
    '/doctors': ['Doctors', 'Manage HCPs and KOLs'],
    '/interactions': ['Interactions', 'Doctor visit records'],
    '/objections': ['Objections', 'Track and resolve objections'],
    '/tour-plans': ['Tour Plans', 'Monthly MSL visit schedules'],
    '/knowledge': ['Knowledge Base', 'Scientific content library'],
    '/office': ['Office Log', 'Office activity tracker'],
    '/notifications': ['Notifications', 'Alerts and updates'],
    '/users': ['User Management', 'Admin: manage accounts'],
    '/roles': ['Role Management', 'Admin: manage role definitions'],
};

export default function AppShell({ children }) {
    const { pathname } = useLocation();
    const [title, subtitle] = titles[pathname] || ['MSL Portal', ''];
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="app-layout">
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            {/* Backdrop for mobile */}
            {isSidebarOpen && <div className="sidebar-backdrop" onClick={closeSidebar} />}

            <div className="main-area">
                <div className="topbar">
                    <button className="hamburger-btn" onClick={toggleSidebar} aria-label="Toggle Menu">
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <div className="topbar-title-section">
                        <h2 id="page-title">{title}</h2>
                        {subtitle && <span className="topbar-badge">{subtitle}</span>}
                    </div>
                </div>
                <div className="content">
                    {children}
                </div>
            </div>
        </div>
    );
}
