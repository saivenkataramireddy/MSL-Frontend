import { useEffect, useState } from 'react';
import api from '../api';

export default function Interactions() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/interactions/').then(r => setData(r.data)).catch(() => { }).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="spinner" />;

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Interactions</div>
                    <div className="page-subtitle">{data.length} doctor visit records</div>
                </div>
            </div>
            <div className="card">
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr><th>Doctor</th><th>Visit Date</th><th>Topics</th><th>Sci. Depth</th><th>Engagement</th><th>Summary</th></tr>
                        </thead>
                        <tbody>
                            {data.length === 0
                                ? <tr><td colSpan={6} className="empty-state">No interactions logged yet.</td></tr>
                                : data.map(i => (
                                    <tr key={i.id}>
                                        <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{i.doctor_id}</td>
                                        <td>{i.visit_date}</td>
                                        <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.topics_discussed}</td>
                                        <td><span className={`badge badge-blue`}>{i.scientific_depth}/10</span></td>
                                        <td><span className="badge badge-green">{i.engagement_quality}/10</span></td>
                                        <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.summary}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
