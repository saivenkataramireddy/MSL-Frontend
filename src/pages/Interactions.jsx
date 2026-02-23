import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import api from '../api';

export default function Interactions() {
    const [data, setData] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [form, setForm] = useState({
        doctor_id: '',
        visit_date: new Date().toISOString().split('T')[0],
        topics_discussed: '',
        scientific_depth: 5,
        engagement_quality: 5,
        clinical_interest_level: 5,
        objection_complexity: 5,
        summary: ''
    });

    const refreshData = async () => {
        setLoading(true);
        try {
            const [interR, docR] = await Promise.all([
                api.get('/interactions/'),
                api.get('/doctors/')
            ]);
            setData(interR.data);
            setDoctors(docR.data);
            if (docR.data.length > 0) setForm(f => ({ ...f, doctor_id: docR.data[0].id }));
        } catch (err) { }
        setLoading(false);
    };

    useEffect(() => {
        refreshData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/interactions/', form);
            setIsModalOpen(false);
            refreshData();
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to log interaction');
        }
    };

    if (loading && data.length === 0) return <div className="spinner" />;

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Interactions</div>
                    <div className="page-subtitle">{data.length} doctor visit records</div>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={16} /> Log Visit
                </button>
            </div>

            <div className="card">
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr><th>Doctor</th><th>Visit Date</th><th>Topics</th><th>Quality</th><th>Summary</th></tr>
                        </thead>
                        <tbody>
                            {data.length === 0
                                ? <tr><td colSpan={5} className="empty-state">No interactions logged yet.</td></tr>
                                : data.map(i => {
                                    const doc = doctors.find(d => d.id === i.doctor_id);
                                    return (
                                        <tr key={i.id}>
                                            <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{doc?.name || i.doctor_id}</td>
                                            <td>{i.visit_date}</td>
                                            <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.topics_discussed}</td>
                                            <td><span className="badge badge-green">{i.engagement_quality}/10</span></td>
                                            <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.summary}</td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal" style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h3 className="modal-title">Log Doctor Visit</h3>
                            <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label className="form-label">Doctor</label>
                                    <select
                                        className="form-input"
                                        value={form.doctor_id}
                                        onChange={e => setForm({ ...form, doctor_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Doctor</option>
                                        {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Visit Date</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={form.visit_date}
                                        onChange={e => setForm({ ...form, visit_date: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group mt-16">
                                <label className="form-label">Topics Discussed</label>
                                <input
                                    className="form-input"
                                    value={form.topics_discussed}
                                    onChange={e => setForm({ ...form, topics_discussed: e.target.value })}
                                    placeholder="e.g., Clinical trial results, Product X safety profile"
                                    required
                                />
                            </div>

                            <div className="grid-2 mt-16">
                                <div className="form-group">
                                    <label className="form-label">Scientific Depth (1-10)</label>
                                    <input type="range" min="1" max="10" className="form-input" value={form.scientific_depth} onChange={e => setForm({ ...form, scientific_depth: parseInt(e.target.value) })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Engagement Quality (1-10)</label>
                                    <input type="range" min="1" max="10" className="form-input" value={form.engagement_quality} onChange={e => setForm({ ...form, engagement_quality: parseInt(e.target.value) })} />
                                </div>
                            </div>

                            <div className="form-group mt-16">
                                <label className="form-label">Visit Summary</label>
                                <textarea
                                    className="form-input"
                                    rows={3}
                                    value={form.summary}
                                    onChange={e => setForm({ ...form, summary: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Log Interaction</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
