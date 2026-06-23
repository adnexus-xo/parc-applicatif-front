import ApplicationsPage from './pages/ApplicationsPage';
import DashboardPage from './pages/DashboardPage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ApplicationFormPage from './pages/ApplicationFormPage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import ApplicationEditPage from './pages/ApplicationEditPage';
import UsersPage from './pages/UsersPage';
import DependancesPage from './pages/DependancesPage';
import AdminRoute from './components/AdminRoute';
import LandingPage from './pages/LandingPage';
import RapportsPage from './pages/RapportsPage';
import ParametresPage from './pages/ParametresPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
          <Route path="/accueil" element={<LandingPage />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="applications/new" element={<ApplicationFormPage />} />
          <Route path="applications/:id" element={<ApplicationDetailPage />} />
          <Route path="dependances" element={<DependancesPage />} />
          <Route path="utilisateurs" element={<AdminRoute><UsersPage /></AdminRoute>} />
          <Route path="applications/:id/edit" element={<ApplicationEditPage />} />
          <Route path="rapports" element={<RapportsPage />} />
          <Route path="*" element={<Navigate to="/accueil" replace />} />
          <Route path="parametres" element={<ParametresPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;