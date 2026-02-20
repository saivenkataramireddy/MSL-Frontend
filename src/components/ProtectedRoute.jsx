import { Navigate } from 'react-router-dom';
import { useAuth, hasRole } from '../context/AuthContext';

/**
 * Wraps a route component.
 * - If not logged in → redirect to /login
 * - If requiredRoles provided and user doesn't match → show 403
 */
export default function ProtectedRoute({ children, requiredRoles = [] }) {
    const { user, loading } = useAuth();

    if (loading) return <div className="spinner" />;
    if (!user) return <Navigate to="/login" replace />;

    if (requiredRoles.length > 0 && !hasRole(user, ...requiredRoles)) {
        return (
            <div style={{ padding: 40, textAlign: 'center' }}>
                <h2 style={{ color: 'var(--danger)', marginBottom: 12 }}>Access Denied</h2>
                <p style={{ color: 'var(--text-muted)' }}>
                    Your role (<strong>{user?.role?.name}</strong>) does not have permission to view this page.
                </p>
            </div>
        );
    }

    return children;
}
