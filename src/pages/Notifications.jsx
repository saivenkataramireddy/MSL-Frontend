import { useEffect, useState } from 'react';
import api from '../api';
import { Bell } from 'lucide-react';

export default function Notifications() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/notifications/').then(r => setData(r.data)).catch(() => { }).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="spinner" />;

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Notifications</div>
                    <div className="page-subtitle">{data.filter(n => !n.is_read).length} unread</div>
                </div>
            </div>

            {data.length === 0
                ? (
                    <div className="card">
                        <div className="empty-state">
                            <Bell size={32} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
                            You're all caught up! No notifications yet.
                        </div>
                    </div>
                )
                : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {data.map(n => (
                            <div
                                key={n.id}
                                className="card"
                                style={{ borderLeft: `3px solid ${n.is_read ? 'var(--border)' : 'var(--accent)'}` }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <p style={{ fontSize: 13.5, color: n.is_read ? 'var(--text-muted)' : 'var(--text-primary)' }}>{n.message}</p>
                                    <span style={{ marginLeft: 12, fontSize: 11 }}>
                                        <span className={`badge ${n.is_read ? 'badge-yellow' : 'badge-green'}`}>
                                            {n.is_read ? 'Read' : 'New'}
                                        </span>
                                    </span>
                                </div>
                                <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-muted)' }}>Type: {n.type}</div>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    );
}
