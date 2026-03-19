import { Navigate } from "react-router-dom";

function ProtectedRoute({ usuario, verificandoAuth, children }) {

  if (verificandoAuth) {
    return null
  }

  // 🔒 NÃO logado
  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  // ✅ OK
  return children
}

export default ProtectedRoute;