import { Plus, X, AlertCircle, ArrowUpCircle, CheckCircle2 } from 'lucide-react';
import api from '../api';
import { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';

const statusColors = {
    Draft: 'badge-yellow',
    Escalated: 'badge-red',
    Resolved: 'badge-green',
};

export default function Objections() {
    const { user } = useAuth();
    const isManagement = user?.role?.name === 'HOD' || user?.role?.name === 'AGM';
    const [data, setData] = useState([]);
    const [interactions, setInteractions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [form, setForm] = useState({
        doctor_id: '',
        interaction_id: '',
        category: 'Medical Query',
        objection_text: '',
    });

    const refreshData = async () => {
        setLoading(true);
        try {
            const [objR, intR] = await Promise.all([
                api.get('/objections/'),
                api.get('/interactions/')
            ]);
            setData(objR.data);
            setInteractions(intR.data);
        } catch (err) { }
        setLoading(false);
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.patch(`/objections/${id}/status?status=${status}`);
            refreshData();
        } catch (_) { }
    };

    useEffect(() => {
        refreshData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/objections/', form);
            setIsModalOpen(false);
            refreshData();
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to raise objection');
        }
    };

    if (loading && data.length === 0) return <div className="spinner" />;

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Objections</div>
                    <div className="page-subtitle">{data.length} recorded objections</div>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <AlertCircle size={16} /> Raise Objection
                </button>
            </div>

            <div className="card">
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Objection</th>
                                <th>Status</th>
                                {isManagement && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0
                                ? <tr><td colSpan={3} className="empty-state">No objections logged yet.</td></tr>
                                : data.map(o => (
                                    <tr key={o.id}>
                                        <td>{o.category}</td>
                                        <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.objection_text}</td>
                                        <td><span className={`badge ${statusColors[o.status] || 'badge-blue'}`}>{o.status}</span></td>
                                        {isManagement && (
                                            <td style={{ display: 'flex', gap: '8px' }}>
                                                {o.status === 'Draft' && (
                                                    <button className="btn btn-sm btn-ghost" onClick={() => handleStatusUpdate(o.id, 'Escalated')} title="Escalate">
                                                        <ArrowUpCircle size={14} color="var(--error)" />
                                                    </button>
                                                )}
                                                {o.status !== 'Resolved' && (
                                                    <button className="btn btn-sm btn-ghost" onClick={() => handleStatusUpdate(o.id, 'Resolved')} title="Resolve">
                                                        <CheckCircle2 size={14} color="var(--success)" />
                                                    </button>
                                                )}
                                            </td>
                                        )}
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
                            <h3 className="modal-title">Raise Objection</h3>
                            <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Linked Interaction (Visit)</label>
                                <select
                                    className="form-input"
                                    value={form.interaction_id}
                                    onChange={e => {
                                        const selected = interactions.find(i => i.id === e.target.value);
                                        setForm({ ...form, interaction_id: e.target.value, doctor_id: selected?.doctor_id || '' });
                                    }}
                                    required
                                >
                                    <option value="">Select an interaction</option>
                                    {interactions.map(i => (
                                        <option key={i.id} value={i.id}>
                                            {i.visit_date} - {i.doctor_id.slice(0, 8)}... ({i.summary.slice(0, 20)}...)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group mt-16">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-input"
                                    value={form.category}
                                    onChange={e => setForm({ ...form, category: e.target.value })}
                                >
                                    <option>Medical Query</option>
                                    <option>Safety Concern</option>
                                    <option>Pricing/Access</option>
                                    <option>Competitor Comparison</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div className="form-group mt-16">
                                <label className="form-label">Objection Details</label>
                                <textarea
                                    className="form-input"
                                    rows={4}
                                    value={form.objection_text}
                                    onChange={e => setForm({ ...form, objection_text: e.target.value })}
                                    placeholder="Describe the doctor's objection or concern..."
                                    required
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Submit Objection</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
