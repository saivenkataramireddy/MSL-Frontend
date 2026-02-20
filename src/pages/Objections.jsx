import { useEffect, useState } from 'react';
import api from '../api';

const statusColors = {
    Draft: 'badge-yellow',
    Escalated: 'badge-red',
    Resolved: 'badge-green',
};

export default function Objections() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/objections/').then(r => setData(r.data)).catch(() => { }).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="spinner" />;

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Objections</div>
                    <div className="page-subtitle">{data.length} recorded objections</div>
                </div>
            </div>
            <div className="card">
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr><th>Category</th><th>Objection</th><th>Response</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            {data.length === 0
                                ? <tr><td colSpan={4} className="empty-state">No objections logged yet.</td></tr>
                                : data.map(o => (
                                    <tr key={o.id}>
                                        <td>{o.category}</td>
                                        <td style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.objection_text}</td>
                                        <td style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.immediate_response}</td>
                                        <td><span className={`badge ${statusColors[o.status] || 'badge-blue'}`}>{o.status}</span></td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
