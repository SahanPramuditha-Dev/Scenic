import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './components/AuthProvider';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import MediaDetailPage from './pages/MediaDetailPage';
import SearchPage from './pages/SearchPage';
import LibraryPage from './pages/LibraryPage';
import AnimePage from './pages/AnimePage';
import AnimeDetailPage from './pages/AnimeDetailPage';
import { useAuthStore } from './stores/useAuth';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-[#0a0a0a] text-white/50">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Public Landing (Later) - redirect to login for now */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Protected Routes */}
        <Route path="/home" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
        <Route path="/library" element={<ProtectedRoute><LibraryPage /></ProtectedRoute>} />
        <Route path="/anime" element={<ProtectedRoute><AnimePage /></ProtectedRoute>} />
        <Route path="/anime/:id" element={<ProtectedRoute><AnimeDetailPage /></ProtectedRoute>} />
        
        <Route path="/media/:mediaType/:id" element={
          <ProtectedRoute>
            <MediaDetailPage />
          </ProtectedRoute>
        } />

        <Route path="/onboarding" element={
          <ProtectedRoute>
            <div className="flex items-center justify-center h-screen bg-[#0a0a0a] text-white">
              <h1 className="text-3xl font-bold">Onboarding Coming Soon</h1>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
            <AnimatedRoutes />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
