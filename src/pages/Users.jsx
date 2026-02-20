import { useEffect, useState } from 'react';
import api from '../api';
import { Plus, X } from 'lucide-react';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ full_name: '', email: '', password: '', role_id: '', region: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([api.get('/users/'), api.get('/roles/')])
            .then(([u, r]) => { setUsers(u.data); setRoles(r.data); })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setSaving(true); setError('');
        try {
            const { data } = await api.post('/users/', form);
            setUsers(prev => [data, ...prev]);
            setShowModal(false);
            setForm({ full_name: '', email: '', password: '', role_id: '', region: '' });
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to create user');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="spinner" />;

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">User Management</div>
                    <div className="page-subtitle">{users.length} accounts · Admin only</div>
                </div>
                <button id="btn-add-user" className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={15} /> Add User
                </button>
            </div>

            <div className="card">
                <div className="table-wrap">
                    <table>
                        <thead><tr><th>Name</th><th>Email</th></tr></thead>
                        <tbody>
                            {users.length === 0
                                ? <tr><td colSpan={2} className="empty-state">No users yet.</td></tr>
                                : users.map(u => (
                                    <tr key={u.id}>
                                        <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{u.full_name}</td>
                                        <td>{u.email}</td>
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
                            <span className="modal-title">Create New User</span>
                            <button className="btn btn-ghost" style={{ padding: '4px 8px' }} onClick={() => setShowModal(false)}><X size={15} /></button>
                        </div>
                        {error && <div className="error-msg" style={{ marginBottom: 12 }}>{error}</div>}
                        <form onSubmit={handleCreate}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input id="user-fullname" className="form-input" value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input id="user-email" type="email" className="form-input" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input id="user-password" type="password" className="form-input" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required minLength={6} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Role</label>
                                <select id="user-role" className="form-input" value={form.role_id} onChange={e => setForm(p => ({ ...p, role_id: e.target.value }))} required>
                                    <option value="">Select role…</option>
                                    {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Region</label>
                                <input id="user-region" className="form-input" value={form.region} onChange={e => setForm(p => ({ ...p, region: e.target.value }))} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                                <button id="btn-save-user" type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Creating…' : 'Create User'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
