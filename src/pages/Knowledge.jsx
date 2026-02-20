import { useEffect, useState } from 'react';
import api from '../api';

export default function Knowledge() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/knowledge/').then(r => setData(r.data)).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const statusColor = { Draft: 'badge-yellow', Published: 'badge-green', Archived: 'badge-blue' };

    if (loading) return <div className="spinner" />;

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Knowledge Base</div>
                    <div className="page-subtitle">{data.length} scientific documents</div>
                </div>
            </div>

            {data.length === 0
                ? <div className="card"><div className="empty-state">No knowledge entries yet. Start adding scientific content.</div></div>
                : (
                    <div style={{ display: 'grid', gap: 14 }}>
                        {data.map(k => (
                            <div className="card" key={k.id} style={{ cursor: 'default' }}>
                                <div className="card-header">
                                    <span className="card-title">{k.title}</span>
                                    <span className={`badge ${statusColor[k.status] || 'badge-blue'}`}>{k.status}</span>
                                </div>
                                <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.7 }}>
                                    {k.content?.slice(0, 200)}{k.content?.length > 200 ? '…' : ''}
                                </p>
                                <div style={{ marginTop: 10, fontSize: 11.5, color: 'var(--text-muted)' }}>
                                    Category: <strong>{k.category}</strong>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    );
}
