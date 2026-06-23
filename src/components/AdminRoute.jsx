import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (user.role !== 'Administrateur') {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

export default AdminRoute;