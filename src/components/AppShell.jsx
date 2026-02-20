import { useLocation } from 'react-router-dom';
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

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-area">
                <div className="topbar">
                    <div>
                        <h2 id="page-title">{title}</h2>
                    </div>
                    {subtitle && <span className="topbar-badge">{subtitle}</span>}
                </div>
                <div className="content">
                    {children}
                </div>
            </div>
        </div>
    );
}
