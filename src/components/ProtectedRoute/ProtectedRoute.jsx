import { Navigate } from "react-router-dom";

function ProtectedRoute({ usuario, children }) {

  if (usuario === null) {
    return <Navigate to="/login" />
  }

  return children
}

export default ProtectedRoute;