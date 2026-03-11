import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

//Componentes
import Navbar from './components/Navbar/Navbar'
import Loader from './components/Loader/Loader.jsx';

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


function App() {

  const [loading, setLoading] = useState(true)

  return (
    <>

      {/* // Navbar aparece em todas as paginas 
        // <Navbar /> */}

        {loading && <Loader onComplete={() => setLoading(false)} />}


      {/* conteudo das paginas */}
      <Routes>
        <Route path='/index' element={<Index />} ></Route>
        <Route path='/pacientes' element={<Pacientes />} ></Route>
        <Route path='/prontuario' element={<Prontuario />} ></Route>
        <Route path='/relatorios' element={<Relatorio />} ></Route>
        <Route path='/remedios' element={<Remedios />} ></Route>
        <Route path='/login' element={<Login loading={loading} />} ></Route>
        <Route path='/registro' element={<Registro />} ></Route>
        <Route path='/perfil' element={<Perfil />} ></Route>
        <Route path='/usuarios' element={<Usuarios />} ></Route>
        <Route path='/cuidados' element={<Cuidados />} ></Route>

        {/* rota padrão */}
        <Route path="/" element={<Login loading={loading} />} />
      </Routes>

    </>
  )
}

export default App
