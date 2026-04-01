import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import Loader from "../Loader/Loader";

function ProtectedRoute({ children }) {
  const { usuario, verificandoAuth } = useAuth();

  if (verificandoAuth) {
    return <Loader />;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;