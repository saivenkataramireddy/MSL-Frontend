import { useEffect, useState } from 'react';
import api from '../api';
import { Plus, X } from 'lucide-react';
import { useAuth, hasRole } from '../context/AuthContext';

export default function Doctors() {
    const { user } = useAuth();
    const canCreate = hasRole(user, 'Admin', 'Manager', 'MSL');

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: '', specialty: '', hospital: '', region: '', therapy_area: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [msls, setMsls] = useState([]);

    useEffect(() => {
        api.get('/doctors/')
            .then(r => setDoctors(r.data))
            .catch(() => { });

        if (hasRole(user, 'HOD', 'Admin')) {
            api.get('/users/msls')
                .then(r => setMsls(r.data))
                .catch(() => { });
        }
        setLoading(false);
    }, []);

    const handleAssign = async (doctorId, mslId) => {
        try {
            const { data } = await api.patch(`/doctors/${doctorId}`, { assigned_msl_id: mslId });
            setDoctors(prev => prev.map(d => d.id === doctorId ? data : d));
        } catch (_) { }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSaving(true); setError('');
        try {
            const { data } = await api.post('/doctors/', form);
            setDoctors(prev => [data, ...prev]);
            setShowModal(false);
            setForm({ name: '', specialty: '', hospital: '', region: '', therapy_area: '' });
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to create doctor');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="spinner" />;

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Doctors</div>
                    <div className="page-subtitle">{doctors.length} registered HCPs/KOLs</div>
                </div>
                {canCreate && (
                    <button id="btn-add-doctor" className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <Plus size={15} /> Add Doctor
                    </button>
                )}
            </div>

            <div className="card">
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th><th>Specialty</th><th>Hospital</th>
                                <th>Region</th><th>Therapy Area</th><th>Assigned MSL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.length === 0
                                ? <tr><td colSpan={6} className="empty-state">No doctors registered yet.</td></tr>
                                : doctors.map(d => (
                                    <tr key={d.id}>
                                        <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{d.name}</td>
                                        <td>{d.specialty}</td>
                                        <td>{d.hospital}</td>
                                        <td>{d.region}</td>
                                        <td>{d.therapy_area}</td>
                                        <td>
                                            {hasRole(user, 'HOD', 'Admin') ? (
                                                <select
                                                    value={d.assigned_msl_id || ''}
                                                    onChange={(e) => handleAssign(d.id, e.target.value)}
                                                    className="badge badge-gray"
                                                    style={{ border: 'none', cursor: 'pointer', background: 'var(--bg-muted)', width: '100%' }}
                                                >
                                                    <option value="">Unassigned</option>
                                                    {msls.map(m => <option key={m.id} value={m.id}>{m.full_name}</option>)}
                                                </select>
                                            ) : (
                                                <span className="badge badge-blue">{d.assigned_msl?.full_name || 'Unassigned'}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-title">Register New Doctor</span>
                            <button className="btn btn-ghost" style={{ padding: '4px 8px' }} onClick={() => setShowModal(false)}><X size={15} /></button>
                        </div>
                        {error && <div className="error-msg" style={{ marginBottom: 12 }}>{error}</div>}
                        <form onSubmit={handleCreate}>
                            {[['name', 'Name'], ['specialty', 'Specialty'], ['hospital', 'Hospital'], ['region', 'Region'], ['therapy_area', 'Therapy Area']].map(([field, label]) => (
                                <div className="form-group" key={field}>
                                    <label className="form-label">{label}</label>
                                    <input id={`doctor-${field}`} className="form-input" value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} required />
                                </div>
                            ))}
                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                                <button id="btn-save-doctor" type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Doctor'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
