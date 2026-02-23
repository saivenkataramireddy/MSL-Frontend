import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { Users, FileText, MessageSquare, Book, MapPin, CheckCircle, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function HODDashboard() {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/analytics/summary')
            .then(r => setData(r.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="spinner" />;
    if (!data) return <div className="error-msg">Failed to load dashboard data</div>;

    const metrics = [
        { label: 'Total Users', value: data.metrics.total_users, icon: <Users size={20} />, color: '#3b82f6' },
        { label: 'Active MSLs', value: data.metrics.active_msls, icon: <CheckCircle size={20} />, color: '#10b981' },
        { label: 'Pending Tours', value: data.metrics.pending_tour_plans, icon: <FileText size={20} />, color: '#f59e0b' },
        { label: 'Pending Objections', value: data.metrics.pending_objections, icon: <MessageSquare size={20} />, color: '#ef4444' },
        { label: 'Knowledge Drafts', value: data.metrics.pending_knowledge, icon: <Book size={20} />, color: '#8b5cf6' },
    ];

    const chartData = Object.entries(data.regional_interactions).map(([name, count]) => ({ name, count }));
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

    return (
        <div className="animate-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Executive Overview</h1>
                    <p className="page-subtitle">Welcome back, {user?.full_name} · Global MSL Management</p>
                </div>
            </div>

            <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                {metrics.map(m => (
                    <div className="card" key={m.label} style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ background: `${m.color}15`, color: m.color, padding: '12px', borderRadius: '12px' }}>
                            {m.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>{m.value}</div>
                            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>{m.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid-2 mt-24">
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Regional Interaction Trends</span>
                        <BarChart3 size={16} color="var(--text-muted)" />
                    </div>
                    <div style={{ padding: '20px', height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    cursor={{ fill: 'var(--bg-muted)', opacity: 0.4 }}
                                />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Pending Oversight</span>
                    </div>
                    <div style={{ padding: '0 20px 20px' }}>
                        <div style={{ display: 'grid', gap: '10px' }}>
                            <div className="flex-between" style={{ padding: '12px', background: 'var(--bg-muted)', borderRadius: '12px' }}>
                                <div className="flex-center" style={{ gap: '12px' }}>
                                    <div style={{ background: '#f59e0b15', color: '#f59e0b', padding: '8px', borderRadius: '8px' }}><FileText size={16} /></div>
                                    <span style={{ fontSize: '14px', fontWeight: '500' }}>Unapproved Tour Plans</span>
                                </div>
                                <span className="badge badge-yellow">{data.metrics.pending_tour_plans}</span>
                            </div>
                            <div className="flex-between" style={{ padding: '12px', background: 'var(--bg-muted)', borderRadius: '12px' }}>
                                <div className="flex-center" style={{ gap: '12px' }}>
                                    <div style={{ background: '#ef444415', color: '#ef4444', padding: '8px', borderRadius: '8px' }}><MessageSquare size={16} /></div>
                                    <span style={{ fontSize: '14px', fontWeight: '500' }}>Escalated Objections</span>
                                </div>
                                <span className="badge badge-red">{data.metrics.pending_objections}</span>
                            </div>
                            <div className="flex-between" style={{ padding: '12px', background: 'var(--bg-muted)', borderRadius: '12px' }}>
                                <div className="flex-center" style={{ gap: '12px' }}>
                                    <div style={{ background: '#8b5cf615', color: '#8b5cf6', padding: '8px', borderRadius: '8px' }}><Book size={16} /></div>
                                    <span style={{ fontSize: '14px', fontWeight: '500' }}>Knowledge Drafts</span>
                                </div>
                                <span className="badge badge-blue">{data.metrics.pending_knowledge}</span>
                            </div>
                        </div>
                        <div className="mt-24" style={{ display: 'grid', gap: '8px' }}>
                            <a href="/users" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>Manage MSL Accounts</a>
                            <a href="/tour-plans" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>Review Tour Plans</a>
                            <a href="/objections" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>Resolve Objections</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
