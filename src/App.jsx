import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar/Navbar'

//Páginas
import Index from './pages/Home/Index.jsx';
import Pacientes from './pages/Pacientes/Pacientes.jsx';
import Relatorio from './pages/Relatorios/Relatorio.jsx';
import Remedios from './pages/Remedios/Remedios.jsx';
import Login from './pages/Login/Login.jsx';
import Registro from './pages/Registro/Registro.jsx';
import Perfil from './pages/Perfil/Perfil.jsx';


function App() {

  return (
    <>

      {/* // Navbar aparece em todas as paginas 
        // <Navbar /> */}


      {/* conteudo das paginas */}
      <Routes>
        <Route path='/index' element={<Index />} ></Route>
        <Route path='/pacientes' element={<Pacientes />} ></Route>
        <Route path='/relatorios' element={<Relatorio />} ></Route>
        <Route path='/remedios' element={<Remedios />} ></Route>
        <Route path='/login' element={<Login />} ></Route>
        <Route path='/registro' element={<Registro />} ></Route>
        <Route path='/perfil' element={<Perfil />} ></Route>

        {/* rota padrão */}
        <Route path="/" element={<Login />} />
      </Routes>

    </>
  )
}

export default App
