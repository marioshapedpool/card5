import { Navigate } from 'react-router-dom';
import useUser from '../hooks/useUser';

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Cargando sesión...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
