import { Plus, X, Check, XCircle } from 'lucide-react';
import { useState, useEffect } from "react";
import api from '../api';
import { useAuth } from '../context/AuthContext';

const statusColors = { Draft: 'badge-yellow', Submitted: 'badge-blue', Approved: 'badge-green', Rejected: 'badge-red' };
const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function TourPlans() {
    const { user } = useAuth();
    const isHOD = user?.role?.name === 'HOD';
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });

    const fetchPlans = () => {
        setLoading(true);
        api.get('/tour-plans/')
            .then(r => setData(r.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleApprove = async (planId, approved) => {
        try {
            await api.patch(`/tour-plans/${planId}/approve`, { approved });
            fetchPlans();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tour-plans/', form);
            setIsModalOpen(false);
            fetchPlans();
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to create plan');
        }
    };

    if (loading && data.length === 0) return <div className="spinner" />;

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Tour Plans</div>
                    <div className="page-subtitle">{data.length} monthly plans</div>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={16} /> Create Plan
                </button>
            </div>

            <div className="card">
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Year</th>
                                {isHOD && <th>MSL</th>}
                                <th>Status</th>
                                {isHOD && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0
                                ? <tr><td colSpan={3} className="empty-state">No tour plans created yet.</td></tr>
                                : data.map(t => (
                                    <tr key={t.id}>
                                        <td>{monthNames[t.month] || t.month}</td>
                                        <td>{t.year}</td>
                                        {isHOD && <td>{t.msl?.full_name || '—'}</td>}
                                        <td><span className={`badge ${statusColors[t.status] || 'badge-blue'}`}>{t.status}</span></td>
                                        {isHOD && t.status === 'Draft' && (
                                            <td style={{ display: 'flex', gap: '8px' }}>
                                                <button className="btn btn-sm btn-success" onClick={() => handleApprove(t.id, true)}>
                                                    <Check size={14} />
                                                </button>
                                                <button className="btn btn-sm btn-error" onClick={() => handleApprove(t.id, false)}>
                                                    <XCircle size={14} />
                                                </button>
                                            </td>
                                        )}
                                        {isHOD && t.status !== 'Draft' && <td>—</td>}
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3 className="modal-title">Create Tour Plan</h3>
                            <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Month</label>
                                <select
                                    className="form-input"
                                    value={form.month}
                                    onChange={e => setForm({ ...form, month: parseInt(e.target.value) })}
                                >
                                    {monthNames.map((name, i) => i > 0 && <option key={i} value={i}>{name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Year</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={form.year}
                                    onChange={e => setForm({ ...form, year: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create Plan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
