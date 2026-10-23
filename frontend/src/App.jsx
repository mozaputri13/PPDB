import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import MockBanner from './components/MockBanner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';

// Pages
import PublicHome from './pages/PublicHome';
import AuthPage from './pages/AuthPage';
import RegistrationForm from './pages/RegistrationForm';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import VerificationPanel from './pages/VerificationPanel';
import SelectionManager from './pages/SelectionManager';
import ReportsExport from './pages/ReportsExport';

function AppContent() {
  const { currentPage } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <PublicHome />;
      case 'auth':
        return <AuthPage />;
      case 'form':
        return <RegistrationForm />;
      case 'student-dashboard':
        return <StudentDashboard />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'verification':
        return <VerificationPanel />;
      case 'selection':
        return <SelectionManager />;
      case 'reports':
        return <ReportsExport />;
      default:
        return <PublicHome />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <MockBanner />
      <Navbar />
      <main style={{ flex: 1 }}>{renderPage()}</main>
      <Footer />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

