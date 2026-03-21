import React, { useRef, useEffect, useState } from 'react'
import './Setor.css'
import Navbar from '../../components/Navbar/Navbar'
import * as bootstrap from 'bootstrap'
import { useNavigate } from 'react-router-dom';
import { urlServer } from '../../../config';

const Setor = () => {

    // TOAST SETOR
    const toastRefSetor = useRef(null)
    const toastInstanceSetor = useRef(null);

    useEffect(() => {
        if (toastRefSetor.current) {
            toastInstanceSetor.current = bootstrap.Toast.getOrCreateInstance(toastRefSetor.current, {
                autohide: true,
                delay: 2500,
            })
        }
    }, [])

    // FORM DO MODAL DE SETOR / ADICIONAR SETOR
    const nome_setor = useRef(null)
    const modalRefSetor = useRef(null)

    const [setor, setSetor] = useState([]);


    const formRefSetor = useRef(null)
    function SubmitSetor(e) {

        e.preventDefault();

        const formSetor = formRefSetor.current

        if (!formSetor.checkValidity()) {
            formSetor.classList.add("was-validated");
            return
        }

        const novoSetor = {
            nome_setor: nome_setor.current.value
        };

        fetch(`${urlServer}/setores`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoSetor)
        })
            .then(res => {
                if (res.status === 401) {
                    navigate('/login')
                    return
                }

                if (res.status === 403) {
                    alert("Sem permissão")
                    return
                }

                if (!res.ok) {
                    throw new Error("Erro ao cadastrar setor")
                }

                return res.json()
            })
            .then(() => {

                // recarrega tabela
                fnCarregarDados()

                // fecha modal
                const modalInstance = bootstrap.Modal.getOrCreateInstance(
                    modalRefSetor.current
                );
                modalInstance.hide();

                document.activeElement.blur();

                toastInstanceSetor.current?.show();

                formSetor.classList.remove("was-validated")

            })
            .catch(erro => console.log(erro))

    }


    useEffect(() => {
        if (!modalRefSetor.current) return;

        const modalEl = modalRefSetor.current;

        const handleHidden = () => {
            formRefSetor.current?.reset();
            formRefSetor.current?.classList.remove("was-validated");
        };

        modalEl.addEventListener("hidden.bs.modal", handleHidden);

        return () => {
            modalEl.removeEventListener("hidden.bs.modal", handleHidden);
        };
    }, []);

    //EXCLUIR O MEDICAMENTO

    function fnDeletarSetor(id) {

        if (!confirm("Tem certeza que deseja deletar este setor?")) return

        fetch(`${urlServer}/setores/${id}`, {
            method: "DELETE",
            credentials: "include"
        })
            .then(res => {
                if (res.status === 401) {
                    navigate('/login')
                    return
                }

                if (res.status === 403) {
                    alert("Sem permissão")
                    return
                }

                if (!res.ok) {
                    throw new Error("Erro ao deletar")
                }

                return res.json()
            })
            .then(dados => {
                console.log(dados)
                fnCarregarDados() // recarrega tabela
            })
            .catch(erro => console.log(erro))

    }

    const navigate = useNavigate()

    function fnCarregarDados() {

        fetch(`${urlServer}/setores`, {
            method: "GET",
            credentials: "include"
        })
            .then(res => {

                if (res.status === 401) {
                    navigate('/login')
                    return
                }

                if (res.status === 403) {
                    alert("Sem permissão")
                    return
                }

                if (!res.ok) {
                    throw new Error("Erro na requisição")
                }
                return res.json();
            })
            .then(dados => {
                if (Array.isArray(dados)) {
                    setSetor(dados);
                } else {
                    setSetor([]);
                }
            })
            .catch(erro => {
                console.log(erro.message)
                setSetor([])
            })

    }

    useEffect(() => {
        fnCarregarDados()
    }, [])

    return (
        <>
            <Navbar />

            <section id='setor-page-section'>

                {/* Modal Criar Setor */}
                <div className="modal fade" id="modalCriarSetor"
                    tabIndex="-1" aria-hidden="true" ref={modalRefSetor}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">

                            <div className="modal-header">
                                <div className="p-2">
                                    <h5 className="modal-title">Novo Setor</h5>
                                    <p className="small opacity-75">Adicione um novo Setor à tabela</p>
                                </div>
                                <button
                                    type="button"
                                    className="btn-close mb-5"
                                    data-bs-dismiss="modal"
                                ></button>
                            </div>

                            <div className="modal-body">

                                <form className="row g-3 needs-validation"
                                    noValidate
                                    ref={formRefSetor}
                                    onSubmit={SubmitSetor}>

                                    <div className="col-12">
                                        <label className="form-label">Nome do Setor *</label>
                                        <input type="text" className="form-control" ref={nome_setor} required />
                                        <div className="invalid-feedback">
                                            Informe o nome do setor.
                                        </div>
                                    </div>

                                    <div className="modal-footer mt-2">
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            data-bs-dismiss="modal"
                                        >
                                            Cancelar
                                        </button>

                                        <button type="submit" className="btn btn-primary">
                                            Adicionar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toast Setor */}
                <div className="toast-container position-fixed bottom-0 end-0 p-3">
                    <div ref={toastRefSetor} className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="toast-header toast-color">
                            <strong className="me-auto d-flex align-items-center text-success">
                                Setor adicionado <i className="bi bi-check fs-5 ms-1"></i>
                            </strong>
                            <button type="button" className="btn-close" data-bs-dismiss="toast"></button>
                        </div>

                        <div className="toast-body">
                            Setor adicionado com sucesso!
                        </div>
                    </div>
                </div>

                {/* conteudo principal */}
                <div className='container-setor'>

                    <div className="d-flex flex-column flex-md-row mb-3 align-items-start align-items-md-center justify-content-md-between">

                        <div className="text-start mb-2 mb-md-0">
                            <h2 className="fw-bold">Tabela de Setores</h2>
                            <p>Crie e administre os setores do sistema.</p>
                        </div>

                        <div className="d-flex justify-content-md-end container-action-btn">
                            <button
                                className="btn btn-primary d-flex align-items-center gap-2 header-action-btn"
                                data-bs-toggle="modal"
                                data-bs-target="#modalCriarSetor"
                            >
                                <i className="bi bi-plus fs-5"></i>
                                Novo Setor
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
                                        <th className="px-3 py-3">Setor</th>
                                        <th className="pe-4 py-3 text-end">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {setor.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="text-center text-secondary py-4">
                                                Nenhum setor cadastrado
                                            </td>
                                        </tr>
                                    )}

                                    {setor.map((setor, index) => (
                                        <tr key={index}>

                                            <td className="ps-4 py-3">
                                                {setor.id}
                                            </td>

                                            <td className="py-3" id='td-setor'>
                                                <div className="d-flex align-items-center gap-2">
                                                    <i className="icon-setor bi bi-hospital"></i>
                                                    <span>{setor.nome_setor}</span>
                                                </div>
                                            </td>

                                            <td className="pe-4 py-3 text-end">
                                                <div className="d-inline-flex align-items-center gap-3">

                                                    <button className="btn btn-sm text-success p-1">
                                                        <i className="bi bi-pencil-square fs-5"></i>
                                                    </button>

                                                    <button
                                                        className="btn btn-sm text-danger p-1"
                                                        onClick={() => fnDeletarSetor(setor.id)}
                                                    >
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

export default Setor
