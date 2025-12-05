import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./index.css";
import AuthForm from "./components/AuthForm";
import NotesSection from "./components/NotesSection";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";

function RequireAuth({ children }) {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const { loggedIn, authMessage, register, login } = useAuth();
  const navigate = useNavigate();

  async function handleRegister(formData) {
    await register(formData);
  }

  async function handleLogin(formData) {
    const success = await login(formData);
    if (success) {
      navigate("/notes");
    }
  }

  return (
    <div className="app">
      <Navbar />

      <main className="main">
        <Routes>
          {/* Login page */}
          <Route
            path="/login"
            element={
              loggedIn ? (
                <Navigate to="/notes" replace />
              ) : (
                <AuthForm
                  onRegister={handleRegister}
                  onLogin={handleLogin}
                  message={authMessage}
                />
              )
            }
          />

          {/* Notes page (protected) */}
          <Route
            path="/notes"
            element={
              <RequireAuth>
                <NotesSection />
              </RequireAuth>
            }
          />

          {/* Default / fallback route */}
          <Route
            path="*"
            element={
              <Navigate to={loggedIn ? "/notes" : "/login"} replace />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
