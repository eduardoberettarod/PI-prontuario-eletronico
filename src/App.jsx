import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar/Navbar'

//Páginas
import Index from './pages/Home/Index.Jsx';



function App() {

  return (
    <>
        {/* Navbar aparece em todas as paginas */}
        <Navbar />

        {/* conteudo das paginas */}
        <Routes>
          <Route path='/index' element={<Index />} ></Route>


          {/* rota padrão */}
          <Route path="/" element={<Index />} />
        </Routes>

    </>
  )
}

export default App
