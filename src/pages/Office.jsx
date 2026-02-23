import { useEffect, useState } from 'react';

import api from '../api';

export default function Office() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/office-activities/').then(r => setData(r.data)).catch(() => { }).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="spinner" />;

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Office Log</div>
                    <div className="page-subtitle">{data.length} activity records</div>
                </div>
            </div>
            <div className="card">
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr><th>Date</th><th>Category</th><th>Summary</th></tr>
                        </thead>
                        <tbody>
                            {data.length === 0
                                ? <tr><td colSpan={3} className="empty-state">No office activities logged yet.</td></tr>
                                : data.map(a => (
                                    <tr key={a.id}>
                                        <td>{a.activity_date}</td>
                                        <td><span className="badge badge-blue">{a.category}</span></td>
                                        <td style={{ color: 'var(--text-primary)' }}>{a.summary}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
