import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireStudentCouncil?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false, requireStudentCouncil = false }: ProtectedRouteProps) => {
  const { user, isAdmin, isStudentCouncil, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  if (requireStudentCouncil && !isStudentCouncil && !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};
