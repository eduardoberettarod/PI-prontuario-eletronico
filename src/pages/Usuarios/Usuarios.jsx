import React, { useState, useEffect, useRef } from 'react'
import * as bootstrap from 'bootstrap';
import './Usuarios.css'
import Navbar from '../../components/Navbar/Navbar'
import { urlServer } from '../../../config'

const Usuarios = () => {

    // filtro
    const [busca, setBusca] = useState("");

    /* ============================
       TOAST
    ============================ */
    const toastRef = useRef(null);
    const toastInstance = useRef(null);

    useEffect(() => {
        if (toastRef.current) {
            toastInstance.current = bootstrap.Toast.getOrCreateInstance(toastRef.current, {
                autohide: true,
                delay: 2500,
            });
        }
    }, []);

    const [toastMsg, setToastMsg] = useState({
        titulo: "",
        mensagem: "",
        tipo: "success"
    });

    const [usuarios, setUsuarios] = useState([])

    function fnCarregarDados() {
        const token = localStorage.getItem("authToken");
        fetch(`${urlServer}/usuarios`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.status === 401) {
                    localStorage.removeItem("authToken");
                    window.location.href = "/login";
                    return;
                }
                return res.json();
            })
            .then(dados => {
                setUsuarios(dados)
            })
            .catch(erro => console.log(erro.message))
    }

    useEffect(() => {
        fnCarregarDados()
    }, [])

    // deletar todos os usuarios

    function pedirConfirmacaoDeleteUsuarios() {
        const modal = bootstrap.Modal.getOrCreateInstance(
            document.getElementById('modalConfirmarDeleteUsuarios')
        );
        modal.show();
    }

    async function confirmarDeleteUsuarios() {
        await removerUsuarios();

        const modal = bootstrap.Modal.getInstance(
            document.getElementById('modalConfirmarDeleteUsuarios')
        );
        modal.hide();
    }

    async function removerUsuarios() {

        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${urlServer}/usuarios/alunos`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            if (response.status === 401) {
                localStorage.removeItem("authToken");
                window.location.href = "/login";
                return;
            }

            fnCarregarDados();

            setToastMsg({
                titulo: "Usuários removidos",
                mensagem: "Usuários excluídos com sucesso!",
                tipo: "success"
            });

            toastInstance.current?.show();

        } catch (erro) {
            console.error(erro);

            setToastMsg({
                titulo: "Erro",
                mensagem: "Erro ao excluir os usuários",
                tipo: "danger"
            });

            toastInstance.current?.show();
        }
    }


    // deletar um usuario

    const [usuarioParaExcluir, setUsuarioParaExcluir] = useState(null);

    function pedirConfirmacaoDelete(id) {
        setUsuarioParaExcluir(id);

        const modal = bootstrap.Modal.getOrCreateInstance(
            document.getElementById('modalConfirmarDeleteUsuario')
        );

        modal.show();
    }

    async function confirmarDelete() {
        if (!usuarioParaExcluir) return;

        await removerUsuario(usuarioParaExcluir);

        setUsuarioParaExcluir(null);

        const modal = bootstrap.Modal.getInstance(
            document.getElementById('modalConfirmarDeleteUsuario')
        );

        modal.hide();
    }

    async function removerUsuario(id) {

        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${urlServer}/usuarios/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            if (response.status === 401) {
                localStorage.removeItem("authToken");
                window.location.href = "/login";
                return;
            }

            fnCarregarDados();

            setToastMsg({
                titulo: "Usuário removido",
                mensagem: "Usuário excluído com sucesso!",
                tipo: "success"
            });

            toastInstance.current?.show();

        } catch (erro) {
            console.error(erro);

            setToastMsg({
                titulo: "Erro",
                mensagem: "Erro ao excluir usuário",
                tipo: "danger"
            });

            toastInstance.current?.show();
        }
    }

    const usuariosFiltrados = usuarios.filter((usuario) => {

        const termo = busca.toLowerCase();

        return (
            usuario.primeiro_nome?.toLowerCase().includes(termo) ||
            usuario.sobrenome?.toLowerCase().includes(termo) ||
            String(usuario.id).includes(termo)
        );

    });

    return (
        <>
            <Navbar />

            <section id='usuarios-page-section'>

                {/* Toast */}
                <div className="toast-container position-fixed bottom-0 end-0 p-3">
                    <div ref={toastRef} className="toast" role="alert">
                        <div className="toast-header toast-color">
                            <strong className="me-auto d-flex align-items-center text-success">
                                {toastMsg.titulo}
                                <i className="bi bi-check fs-5 ms-1"></i>
                            </strong>
                            <button type="button" className="btn-close" data-bs-dismiss="toast"></button>
                        </div>

                        <div className="toast-body">
                            {toastMsg.mensagem}
                        </div>
                    </div>
                </div>

                {/* Modal para excluir usuario */}
                <div
                    className="modal fade"
                    id="modalConfirmarDeleteUsuario"
                    tabIndex="-1"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "350px" }}>
                        <div className="modal-content">

                            <div className="d-flex p-3 justify-content-center">
                                <div className="d-flex align-items-center flex-column justify-content-center text-center gap-2">
                                    <i className="bi bi-exclamation-circle text-danger" style={{ fontSize: "5rem" }}></i>
                                    <h5 className="p-0 m-0">Confirmar exclusão</h5>
                                </div>
                                <button className="btn-close position-absolute end-0 top-0 me-3 mt-3" data-bs-dismiss="modal" style={{ fontSize: "0.75rem" }}></button>
                            </div>

                            <div className="modal-body text-center">
                                <p className='mt-2 text-muted small'>Tem certeza que deseja excluir este usuário? Essa ação não pode ser desfeita.</p>
                            </div>

                            <div className="p-3 d-flex align-items-center gap-2 border-top">
                                <button className="btn btn-secondary w-50" data-bs-dismiss="modal">
                                    Cancelar
                                </button>

                                <button
                                    className="btn btn-danger w-50"
                                    onClick={confirmarDelete}
                                >
                                    Excluir
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Modal para excluir todos os usuario */}
                <div
                    className="modal fade"
                    id="modalConfirmarDeleteUsuarios"
                    tabIndex="-1"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "350px" }}>
                        <div className="modal-content">

                            <div className="d-flex p-3 justify-content-center">
                                <div className="d-flex align-items-center flex-column justify-content-center text-center gap-2">
                                    <i className="bi bi-exclamation-circle text-danger" style={{ fontSize: "5rem" }}></i>
                                    <h5 className="p-0 m-0">Confirmar exclusão</h5>
                                </div>
                                <button className="btn-close position-absolute end-0 top-0 me-3 mt-3" data-bs-dismiss="modal" style={{ fontSize: "0.75rem" }}></button>
                            </div>

                            <div className="modal-body text-center">
                                <p className='mt-2 text-muted small'>Tem certeza que deseja excluir todos os usuários? Essa ação não pode ser desfeita.</p>
                            </div>

                            <div className="p-3 d-flex align-items-center gap-2 border-top">
                                <button className="btn btn-secondary w-50" data-bs-dismiss="modal">
                                    Cancelar
                                </button>

                                <button
                                    className="btn btn-danger w-50"
                                    onClick={confirmarDeleteUsuarios}
                                >
                                    Excluir
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                <div className='container-usuarios'>

                    <div className="d-flex flex-column flex-md-row mb-3 align-items-start align-items-md-center justify-content-md-between">

                        <div className="text-start mb-2 mb-md-0">
                            <h2 className="fw-bold">Tabela de Usuários</h2>
                            <p>Gerencie e administre os usuários do sistema.</p>
                        </div>

                        <div>
                            <button className='btn btn-danger align-items-center d-flex gap-2 py-2 px-3'
                                onClick={() => pedirConfirmacaoDeleteUsuarios(usuarios)}>
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
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
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

                                    {usuariosFiltrados.map((usuario) => (

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
                                                        onClick={() => pedirConfirmacaoDelete(usuario.id)}>
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
