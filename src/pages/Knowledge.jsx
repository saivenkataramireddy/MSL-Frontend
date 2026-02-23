import { Plus, X, BookOpen, Send } from 'lucide-react';
import api from '../api';
import { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';


export default function Knowledge() {
    const { user } = useAuth();
    const isHOD = user?.role?.name === 'HOD';
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchKnowledge = () => {
        setLoading(true);
        api.get('/knowledge/').then(r => setData(r.data)).catch(() => { }).finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchKnowledge();
    }, []);

    const handlePublish = async (id) => {
        try {
            await api.patch(`/knowledge/${id}/status?status=Published`);
            fetchKnowledge();
        } catch (_) { }
    };

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
                                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                                        Category: <strong>{k.category}</strong>
                                    </div>
                                    {isHOD && k.status === 'Draft' && (
                                        <button className="btn btn-sm btn-ghost" onClick={() => handlePublish(k.id)} style={{ color: 'var(--success)', gap: 6 }}>
                                            <Send size={13} /> Publish
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    );
}
