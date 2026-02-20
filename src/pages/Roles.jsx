import { useEffect, useState } from 'react';
import api from '../api';
import { Plus, X } from 'lucide-react';

export default function Roles() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: '', description: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/roles/').then(r => setRoles(r.data)).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setSaving(true); setError('');
        try {
            const { data } = await api.post(`/roles/?name=${encodeURIComponent(form.name)}&description=${encodeURIComponent(form.description)}`);
            setRoles(prev => [data, ...prev]);
            setShowModal(false);
            setForm({ name: '', description: '' });
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to create role');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="spinner" />;

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Roles</div>
                    <div className="page-subtitle">{roles.length} role definitions</div>
                </div>
                <button id="btn-add-role" className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={15} /> Add Role
                </button>
            </div>

            <div className="card">
                <div className="table-wrap">
                    <table>
                        <thead><tr><th>Name</th><th>Description</th></tr></thead>
                        <tbody>
                            {roles.length === 0
                                ? <tr><td colSpan={2} className="empty-state">No roles defined yet. Create Admin, MSL, Manager roles to get started.</td></tr>
                                : roles.map(r => (
                                    <tr key={r.id}>
                                        <td>
                                            <span className={`badge role-${r.name}`}>{r.name}</span>
                                        </td>
                                        <td style={{ color: 'var(--text-muted)' }}>{r.description}</td>
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
                            <span className="modal-title">Create Role</span>
                            <button className="btn btn-ghost" style={{ padding: '4px 8px' }} onClick={() => setShowModal(false)}><X size={15} /></button>
                        </div>
                        {error && <div className="error-msg" style={{ marginBottom: 12 }}>{error}</div>}
                        <form onSubmit={handleCreate}>
                            <div className="form-group">
                                <label className="form-label">Role Name</label>
                                <input id="role-name" className="form-input" placeholder="e.g. MSL, Admin, Manager" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <input id="role-desc" className="form-input" placeholder="Brief role description…" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                                <button id="btn-save-role" type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Create Role'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
