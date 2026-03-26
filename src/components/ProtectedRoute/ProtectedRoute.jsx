import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";

function ProtectedRoute({ children }) {
  const { usuario, verificandoAuth } = useAuth();

  if (verificandoAuth) {
    return <div>Carregando...</div>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;