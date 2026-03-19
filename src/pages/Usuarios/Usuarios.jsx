import React, { useState, useEffect } from 'react'
import './Usuarios.css'
import Navbar from '../../components/Navbar/Navbar'
import { urlServer } from '../../../config'

const Usuarios = () => {

    const [usuarios, setUsuarios] = useState([])

    function fnCarregarDados() {

        fetch(`${urlServer}/usuarios`, {
            method: 'GET',
            credentials: 'include'
        })
            .then(res => res.json())
            .then(dados => {
                setUsuarios(dados)
            })
            .catch(erro => console.log(erro.message))

    }

    useEffect(() => {
        fnCarregarDados()
    }, [])

    function fnDeletarUsuario(id) {

        if (!confirm("Tem certeza que deseja deletar este usuário?")) return

        fetch(`${urlServer}/usuarios/${id}`, {
            method: "DELETE",
            credentials: "include"
        })
            .then(res => res.json())
            .then(dados => {
                console.log(dados)
                fnCarregarDados() // recarrega tabela
            })
            .catch(erro => console.log(erro))

    }
    
    function fnDeletarAlunos() {

        if (!confirm("Tem certeza que deseja deletar TODOS os alunos?")) return

        fetch(`${urlServer}/usuarios/alunos`, {
            method: "DELETE",
            credentials: "include"
        })
            .then(res => res.json())
            .then(dados => {
                console.log(dados)
                alert(dados.mensagem)
                fnCarregarDados() 
            })
            .catch(erro => console.log(erro))

    }

    return (
        <>
            <Navbar />

            <section id='usuarios-page-section'>

                <div className='container-usuarios'>

                    <div className="d-flex flex-column flex-md-row mb-3 align-items-start align-items-md-center justify-content-md-between">

                        <div className="text-start mb-2 mb-md-0">
                            <h2 className="fw-bold">Tabela de Usuários</h2>
                            <p>Gerencie e administre os usuários do sistema.</p>
                        </div>

                        <div>
                            <button className='btn btn-danger align-items-center d-flex gap-2 py-2 px-3'
                                onClick={fnDeletarAlunos}>
                                Deletar todos os usuários <i className='bi bi-trash'></i>
                            </button>
                        </div>

                    </div>

                    <div className='w-100'>
                        <form role="search">
                            <div className="position-relative w-100 d-flex">
                                <i className="bi bi-search position-absolute top-50 translate-middle-y ms-3 text-secondary"></i>
                                <input
                                    type="text"
                                    className="form-control input-search"
                                    placeholder="Buscar por nome ou ID..."
                                />
                            </div>
                        </form>
                    </div>

                    <div className="row mt-4">
                        <div className="col">
                            <table className="table mx-auto table-hover">
                                <thead>
                                    <tr>
                                        <th className="ps-4 py-3">ID</th>
                                        <th className="px-3 py-3">Nome</th>
                                        <th className="px-3 py-3">Sobrenome</th>
                                        <th className="px-3 py-3 d-none d-md-table-cell">Email</th>
                                        <th className="pe-4 py-3 text-end">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {usuarios.map((usuario) => (

                                        <tr key={usuario.id} className="align-middle">

                                            <td className="ps-4 py-3">
                                                {usuario.id}
                                            </td>

                                            <td className="px-3 py-3">
                                                {usuario.primeiro_nome}
                                            </td>

                                            <td className="px-3 py-3">
                                                {usuario.sobrenome}
                                            </td>

                                            <td className="px-3 py-3 d-none d-md-table-cell">
                                                {usuario.email}
                                            </td>

                                            <td className="pe-4 py-3 text-end">
                                                <div className="d-inline-flex align-items-center gap-2">

                                                    <button className="btn btn-sm text-danger p-1"
                                                        onClick={() => fnDeletarUsuario(usuario.id)}>
                                                        <i className="bi bi-trash fs-5"></i>
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>
                        </div>
                    </div>

                </div>

            </section>

        </>
    )
}

export default Usuarios
