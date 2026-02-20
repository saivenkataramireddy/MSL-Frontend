import { useEffect, useState } from 'react';
import api from '../api';

const statusColors = { Draft: 'badge-yellow', Submitted: 'badge-blue', Approved: 'badge-green', Rejected: 'badge-red' };

export default function TourPlans() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/tour-plans/').then(r => setData(r.data)).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (loading) return <div className="spinner" />;

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Tour Plans</div>
                    <div className="page-subtitle">{data.length} monthly plans</div>
                </div>
            </div>
            <div className="card">
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr><th>MSL ID</th><th>Month</th><th>Year</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            {data.length === 0
                                ? <tr><td colSpan={4} className="empty-state">No tour plans created yet.</td></tr>
                                : data.map(t => (
                                    <tr key={t.id}>
                                        <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{t.msl_id?.slice(0, 8)}…</td>
                                        <td>{monthNames[t.month] || t.month}</td>
                                        <td>{t.year}</td>
                                        <td><span className={`badge ${statusColors[t.status] || 'badge-blue'}`}>{t.status}</span></td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
