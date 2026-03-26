import { useState, useEffect } from 'react'
import './App.css'
import { Routes, Route, useNavigate } from "react-router-dom";

//Componentes
import { urlServer } from '../config'
import Loader from './components/Loader/Loader.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import { useAuth } from './components/AuthContext/AuthContext.jsx';

//Páginas
import Index from './pages/Home/Index.jsx';
import Pacientes from './pages/Pacientes/Pacientes.jsx';
import Relatorio from './pages/Relatorios/Relatorio.jsx';
import Remedios from './pages/Remedios/Remedios.jsx';
import Login from './pages/Login/Login.jsx';
import Registro from './pages/Registro/Registro.jsx';
import Perfil from './pages/Perfil/Perfil.jsx';
import Prontuario from './pages/Prontuarios/Prontuario.jsx';
import Usuarios from './pages/Usuarios/Usuarios.jsx';
import Cuidados from './pages/Cuidados/Cuidados.jsx';
import Setor from './pages/Setor/Setor.jsx';

function App() {

  const [loading, setLoading] = useState(true)
  const { usuario, verificandoAuth } = useAuth();

  return (
    <>

      {loading && <Loader onComplete={() => setLoading(false)} />}

      <Routes>

        <Route
          path='/index'
          element={
            <ProtectedRoute usuario={usuario} verificandoAuth={verificandoAuth}>
              <Index />
            </ProtectedRoute>
          }
        />

        <Route
          path='/pacientes'
          element={
            <ProtectedRoute usuario={usuario} verificandoAuth={verificandoAuth}>
              <Pacientes />
            </ProtectedRoute>
          }
        />

        <Route
          path='/prontuario'
          element={
            <ProtectedRoute usuario={usuario} verificandoAuth={verificandoAuth}>
              <Prontuario />
            </ProtectedRoute>
          }
        />

        <Route
          path='/relatorios'
          element={
            <ProtectedRoute usuario={usuario} verificandoAuth={verificandoAuth}>
              <Relatorio />
            </ProtectedRoute>
          }
        />

        <Route
          path='/remedios'
          element={
            <ProtectedRoute usuario={usuario} verificandoAuth={verificandoAuth}>
              <Remedios />
            </ProtectedRoute>
          }
        />

        <Route
          path='/perfil'
          element={
            <ProtectedRoute usuario={usuario} verificandoAuth={verificandoAuth}>
              <Perfil />
            </ProtectedRoute>
          }
        />

        <Route
          path='/usuarios'
          element={
            <ProtectedRoute usuario={usuario} verificandoAuth={verificandoAuth}>
              <Usuarios />
            </ProtectedRoute>
          }
        />

        <Route
          path='/cuidados'
          element={
            <ProtectedRoute usuario={usuario} verificandoAuth={verificandoAuth}>
              <Cuidados />
            </ProtectedRoute>
          }
        />

        <Route
          path='/setor'
          element={
            <ProtectedRoute usuario={usuario} verificandoAuth={verificandoAuth}>
              <Setor />
            </ProtectedRoute>
          }
        />

        <Route path='/login' element={<Login />} />
        <Route path='/registro' element={<Registro />} />
        <Route path="/" element={<Login />} />

      </Routes>

    </>
  )
}

export default App