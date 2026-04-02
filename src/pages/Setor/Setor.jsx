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

    const [toastMsg, setToastMsg] = useState({
        titulo: "",
        mensagem: "",
        tipo: "success"
    });


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
    const [setorEditando, setSetorEditando] = useState(null);

    const formRefSetor = useRef(null)
    async function SubmitSetor(e) {
        e.preventDefault();

        const formSetor = formRefSetor.current;

        if (!formSetor.checkValidity()) {
            formSetor.classList.add("was-validated");
            return;
        }

        const dados = {
            nome_setor: nome_setor.current.value
        };

        const url = setorEditando
            ? `${urlServer}/setores/${setorEditando.id}`
            : `${urlServer}/setores`;

        const method = setorEditando ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });

            if (res.status === 401) {
                navigate('/login');
                return;
            }

            if (res.status === 403) {
                alert("Sem permissão");
                return;
            }

            const data = await res.json();

            if (!res.ok) throw new Error(data.erro || "Erro");

            // recarrega tabela
            fnCarregarDados();

            if (setorEditando) {
                setToastMsg({
                    titulo: "Setor Editado",
                    mensagem: "Setor atualizado com sucesso!",
                    tipo: "success"
                });
            } else {
                setToastMsg({
                    titulo: "Setor Criado",
                    mensagem: "Setor adicionado com sucesso!",
                    tipo: "success"
                });
            }

            const modalInstance = bootstrap.Modal.getOrCreateInstance(
                modalRefSetor.current
            );
            modalInstance.hide();

            document.activeElement.blur();

            toastInstanceSetor.current?.show();

            formSetor.reset();
            formSetor.classList.remove("was-validated");

            setSetorEditando(null);

        } catch (erro) {
            console.error(erro);

            setToastMsg({
                titulo: "Erro",
                mensagem: "Erro ao salvar Setor",
                tipo: "danger"
            });

            toastInstanceSetor.current?.show();
        }
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

    // excluir setor

    const [setorParaExcluir, setSetorParaExcluir] = useState(null);

    function pedirConfirmacaoDelete(id) {
        setSetorParaExcluir(id);

        const modal = bootstrap.Modal.getOrCreateInstance(
            document.getElementById('modalConfirmarDeleteSetor')
        );

        modal.show();
    }

    async function confirmarDelete() {
        if (!setorParaExcluir) return;

        await removerSetor(setorParaExcluir);

        setSetorParaExcluir(null);

        const modal = bootstrap.Modal.getInstance(
            document.getElementById('modalConfirmarDeleteSetor')
        );

        modal.hide();
    }

    async function removerSetor(id) {

        try {
            const response = await fetch(`${urlServer}/setores/${id}`, {
                method: "DELETE",
                credentials: "include"
            })

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.erro || "Erro ao deletar");
            }

            fnCarregarDados();

            setToastMsg({
                titulo: "Setor removido",
                mensagem: "Setor excluído com sucesso!",
                tipo: "success"
            });

            toastInstanceSetor.current?.show();

        } catch (erro) {
            console.error(erro);

            setToastMsg({
                titulo: "Erro",
                mensagem: "Erro ao excluir setor",
                tipo: "danger"
            });

            toastInstanceSetor.current?.show();
        }
    }

    // carregar dados da tabela

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

                {/* Modal para excluir setor */}
                <div
                    className="modal fade"
                    id="modalConfirmarDeleteSetor"
                    tabIndex="-1"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h5 className="modal-title text-danger fw-bold">Confirmar exclusão</h5>
                                <button className="btn-close" data-bs-dismiss="modal"></button>
                            </div>

                            <div className="modal-body">
                                <p className='mb-1 mt-2'>Tem certeza que deseja excluir este setor?</p>
                                <p className="small text-muted">
                                    Essa ação não pode ser desfeita.
                                </p>
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" data-bs-dismiss="modal">
                                    Cancelar
                                </button>

                                <button
                                    className="btn btn-danger"
                                    onClick={confirmarDelete}
                                >
                                    Excluir
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Modal Criar Setor */}
                <div className="modal fade" id="modalCriarSetor"
                    tabIndex="-1" aria-hidden="true" ref={modalRefSetor}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">

                            <div className="modal-header">
                                <div className="p-2">
                                    <h5 className="modal-title">
                                        {setorEditando ? "Editar Setor" : "Novo Setor"}
                                    </h5>
                                    <p className="small opacity-75">{setorEditando ? "Edite um Setor da tabela" : "Adicione um novo Setor à tabela"}</p>
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
                                            {setorEditando ? "Salvar Alterações" : "Adicionar"}
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
                            <strong className={`me-auto d-flex align-items-center text-${toastMsg.tipo}`}>
                                {toastMsg.titulo}
                            </strong>
                            <button type="button" className="btn-close" data-bs-dismiss="toast"></button>
                        </div>

                        <div className="toast-body">
                            {toastMsg.mensagem}
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

                                                    <button
                                                        className="btn btn-sm text-success p-1"
                                                        onClick={() => {
                                                            setSetorEditando(setor);
                                                            nome_setor.current.value = setor.nome_setor;

                                                            const modal = new bootstrap.Modal(modalRefSetor.current);
                                                            modal.show();
                                                        }}
                                                    >
                                                        <i className="bi bi-pencil-square fs-5"></i>
                                                    </button>

                                                    <button
                                                        className="btn btn-sm text-danger p-1"
                                                        onClick={() => pedirConfirmacaoDelete(setor.id)}
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
