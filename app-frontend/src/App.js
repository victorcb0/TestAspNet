import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import IbanPage from "./pages/IbanPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import { useAuth } from "./auth/AuthContext";

function RootRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? "/ibans" : "/login"} />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/ibans" element={
            <ProtectedRoute roles={["Admin", "Operator", "OperatorRaion"]}>
              <AdminLayout><IbanPage /></AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute roles={["Admin"]}>
              <AdminLayout><AdminPage /></AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
