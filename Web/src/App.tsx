import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import HomePage from "@/Pages/HomePage";
import TravelLogPage from "@/Pages/TravelLogPage";
import FeaturesPage from "@/Pages/FeaturesPage";
import AboutPage from "@/Pages/AboutPage";
import AuthPage from "@/Pages/AuthPage";
import Layout from "@/Components/Layout";
import { useAuth } from "@/hooks/useAuth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/travel-log"
              element={
                <ProtectedRoute>
                  <TravelLogPage />
                </ProtectedRoute>
              }
            />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/auth" element={<AuthPage />} />
            {/* Fallback for old /log path */}
            <Route path="/log" element={<Navigate to="/travel-log" />} />
          </Routes>
        </Layout>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
