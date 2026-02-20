import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ doctors: 0, interactions: 0, knowledge: 0, notifications: 0 });

    useEffect(() => {
        async function load() {
            try {
                const [doc, int, know, notif] = await Promise.allSettled([
                    api.get('/doctors/'),
                    api.get('/interactions/'),
                    api.get('/knowledge/'),
                    api.get('/notifications/'),
                ]);
                setStats({
                    doctors: doc.status === 'fulfilled' ? doc.value.data.length : 0,
                    interactions: int.status === 'fulfilled' ? int.value.data.length : 0,
                    knowledge: know.status === 'fulfilled' ? know.value.data.length : 0,
                    notifications: notif.status === 'fulfilled' ? notif.value.data.length : 0,
                });
            } catch (_) { }
        }
        load();
    }, []);

    const statCards = [
        { icon: '🏥', label: 'Doctors', value: stats.doctors, color: 'var(--accent)' },
        { icon: '🤝', label: 'Interactions', value: stats.interactions, color: 'var(--success)' },
        { icon: '📚', label: 'Knowledge Docs', value: stats.knowledge, color: 'var(--warning)' },
        { icon: '🔔', label: 'Notifications', value: stats.notifications, color: '#a78bfa' },
    ];

    return (
        <div>
            {/* Greeting */}
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700 }}>
                    Good morning, {user?.full_name?.split(' ')[0]} 👋
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: 13.5, marginTop: 4 }}>
                    {user?.role?.name} · {user?.region || 'No region set'}
                </p>
            </div>

            {/* Stat cards */}
            <div className="stat-grid">
                {statCards.map(s => (
                    <div className="stat-card" key={s.label} id={`stat-${s.label.toLowerCase().replace(/\s/g, '-')}`}>
                        <div className="stat-icon" style={{ background: `${s.color}20` }}>{s.icon}</div>
                        <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Info card */}
            <div className="card">
                <div className="card-header">
                    <span className="card-title">Your Profile</span>
                    <span className={`badge badge-blue role-${user?.role?.name}`}>{user?.role?.name || '—'}</span>
                </div>
                <table>
                    <tbody>
                        {[
                            ['Full Name', user?.full_name],
                            ['Email', user?.email],
                            ['Region', user?.region || '—'],
                            ['Status', user?.is_active ? '✅ Active' : '❌ Inactive'],
                        ].map(([k, v]) => (
                            <tr key={k}>
                                <td style={{ color: 'var(--text-muted)', width: 160 }}>{k}</td>
                                <td style={{ color: 'var(--text-primary)' }}>{v}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
