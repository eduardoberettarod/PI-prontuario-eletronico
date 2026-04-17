import React, { useRef, useEffect, useState } from 'react'
import * as bootstrap from 'bootstrap'
import './Cuidados.css'
import Navbar from '../../components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { urlServer } from '../../../config';

function Cuidados() {

    // filtro
    const [busca, setBusca] = useState("");

    // TOAST RELATORIO
    const toastRefCuidados = useRef(null)
    const toastInstanceCuidados = useRef(null);

    const [toastMsg, setToastMsg] = useState({
        titulo: "",
        mensagem: "",
        tipo: "success"
    });

    useEffect(() => {
        if (toastRefCuidados.current) {
            toastInstanceCuidados.current = bootstrap.Toast.getOrCreateInstance(toastRefCuidados.current, {
                autohide: true,
                delay: 2500,
            })
        }
    }, [])

    // FORM DO MODAL DE Cuidados / ADICIONAR Cuidados
    const tipo_cuidado = useRef(null)
    const modalRefCuidados = useRef(null)

    const [cuidados, setCuidados] = useState([]);
    const [cuidadosEditando, setCuidadosEditando] = useState(null);

    const formRefCuidados = useRef(null)
    async function SubmitCuidados(e) {
        e.preventDefault();

        const formCuidados = formRefCuidados.current;

        if (!formCuidados.checkValidity()) {
            formCuidados.classList.add("was-validated");
            return;
        }

        const dados = {
            tipo_cuidado: tipo_cuidado.current.value
        };

        const url = cuidadosEditando
            ? `${urlServer}/cuidados/${cuidadosEditando.id}`
            : `${urlServer}/cuidados`;

        const method = cuidadosEditando ? "PUT" : "POST";

        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(dados)
            });

            if (res.status === 401) {
                localStorage.removeItem("authToken");
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

            if (cuidadosEditando) {
                setToastMsg({
                    titulo: "Cuidado Editado",
                    mensagem: "Cuidado atualizado com sucesso!",
                    tipo: "success"
                });
            } else {
                setToastMsg({
                    titulo: "Cuidado Criado",
                    mensagem: "Cuidado adicionado com sucesso!",
                    tipo: "success"
                });
            }

            const modalInstance = bootstrap.Modal.getOrCreateInstance(
                modalRefCuidados.current
            );
            modalInstance.hide();

            document.activeElement.blur();

            toastInstanceCuidados.current?.show();

            formCuidados.reset();
            formCuidados.classList.remove("was-validated");

            setCuidadosEditando(null);

        } catch (erro) {
            console.error(erro);

            setToastMsg({
                titulo: "Erro",
                mensagem: "Erro ao salvar Cuidado",
                tipo: "danger"
            });

            toastInstanceCuidados.current?.show();
        }
    }


    useEffect(() => {
        if (!modalRefCuidados.current) return;

        const modalEl = modalRefCuidados.current;

        const handleHidden = () => {
            formRefCuidados.current?.reset();
            formRefCuidados.current?.classList.remove("was-validated");
        };

        modalEl.addEventListener("hidden.bs.modal", handleHidden);

        return () => {
            modalEl.removeEventListener("hidden.bs.modal", handleHidden);
        };
    }, []);

    // excluir cuidado

    const [cuidadoParaExcluir, setCuidadoParaExcluir] = useState(null);

    function pedirConfirmacaoDelete(id) {
        setCuidadoParaExcluir(id);

        const modal = bootstrap.Modal.getOrCreateInstance(
            document.getElementById('modalConfirmarDeleteCuidado')
        );

        modal.show();
    }

    async function confirmarDelete() {
        if (!cuidadoParaExcluir) return;

        await removerCuidado(cuidadoParaExcluir);

        setCuidadoParaExcluir(null);

        const modal = bootstrap.Modal.getInstance(
            document.getElementById('modalConfirmarDeleteCuidado')
        );

        modal.hide();
    }

    async function removerCuidado(id) {

        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${urlServer}/cuidados/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.erro || "Erro ao deletar");
            }

            fnCarregarDados();

            setToastMsg({
                titulo: "Cuidado removido",
                mensagem: "Cuidado excluído com sucesso!",
                tipo: "success"
            });

            toastInstanceCuidados.current?.show();

        } catch (erro) {
            console.error(erro);

            setToastMsg({
                titulo: "Erro",
                mensagem: "Erro ao excluir cuidado",
                tipo: "danger"
            });

            toastInstanceCuidados.current?.show();
        }
    }

    // carregar dados da tabela

    const navigate = useNavigate()

    function fnCarregarDados() {
        const token = localStorage.getItem("authToken");
        fetch(`${urlServer}/cuidados`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => {

                if (res.status === 401) {
                    localStorage.removeItem("authToken");
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
                    setCuidados(dados);
                } else {
                    setCuidados([]);
                }
            })
            .catch(erro => {
                console.log(erro.message)
                setCuidados([])
            })
            .catch(erro => console.log(erro.message))

    }

    useEffect(() => {
        fnCarregarDados()
    }, [])

    const cuidadosFiltrados = cuidados.filter((cui) => {

        const termo = busca.toLowerCase();

        return (
            cui.tipo_cuidado?.toLowerCase().includes(termo) ||
            String(cui.id).includes(termo)
        );

    });

    return (
        <>
            <Navbar />
            <section id='cuidados-page-section'>

                {/* Modal para excluir cuidado */}
                <div
                    className="modal fade"
                    id="modalConfirmarDeleteCuidado"
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
                                <p className='mt-2 text-muted small'>Tem certeza que deseja excluir este cuidado? Essa ação não pode ser desfeita.</p>
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

                {/* Modal Criar Cuidado */}
                <div className="modal fade" id="modalCriarCuidado"
                    tabIndex="-1" aria-hidden="true" ref={modalRefCuidados}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">

                            <div className="modal-header">
                                <div className="p-2">
                                    <h5 className="modal-title">Novo Cuidado</h5>
                                    <p className="small opacity-75">Adicione um novo Cuidado à tabela</p>
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
                                    ref={formRefCuidados}
                                    onSubmit={SubmitCuidados}>

                                    <div className="col-12">
                                        <label className="form-label">Nome do Cuidado *</label>
                                        <input type="text" className="form-control" ref={tipo_cuidado} required />
                                        <div className="invalid-feedback">
                                            Informe o nome do cuidado.
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

                {/* Toast Cuidados */}
                <div className="toast-container position-fixed bottom-0 end-0 p-3">
                    <div ref={toastRefCuidados} className="toast" role="alert" aria-live="assertive" aria-atomic="true">
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
                <div className='container-cuidados'>

                    <div className="d-flex flex-column flex-md-row mb-3 align-items-start align-items-md-center justify-content-md-between">

                        <div className="text-start mb-2 mb-md-0">
                            <h2 className="fw-bold">Tabela de Cuidados</h2>
                            <p>Gerencie os cuidados disponíveis para os cuidados com enfermagem.</p>
                        </div>

                        <div className="d-flex justify-content-md-end container-action-btn">
                            <button
                                className="btn btn-primary d-flex align-items-center gap-2 header-action-btn"
                                data-bs-toggle="modal"
                                data-bs-target="#modalCriarCuidado"
                            >
                                <i className="bi bi-plus fs-5"></i>
                                Novo Cuidado
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
                            <table className="table table-hover align-middle mx-auto cuidados-table">
                                <thead>
                                    <tr>
                                        <th className="ps-4 py-3 fw-bold">ID</th>

                                        <th className="py-3 fw-bold" id='th-cuidado'>
                                            Tipo de Cuidado
                                        </th>

                                        <th className="pe-4 py-3 text-end fw-bold">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {cuidadosFiltrados.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="text-center text-secondary py-4">
                                                Nenhum cuidado cadastrado
                                            </td>
                                        </tr>
                                    )}

                                    {cuidadosFiltrados.map((cui, index) => (
                                        <tr key={index}>

                                            <td className="ps-4 py-3">
                                                {cui.id}
                                            </td>

                                            <td className="py-3" id='td-cuidado'>
                                                <div className="d-flex align-items-center gap-2">
                                                    <i className="icon-cuidados bi bi-heart-pulse"></i>
                                                    <span>{cui.tipo_cuidado}</span>
                                                </div>
                                            </td>

                                            <td className="pe-4 py-3 text-end">
                                                <div className="d-inline-flex align-items-center gap-3">

                                                    <button
                                                        className="btn btn-sm text-success p-1"
                                                        onClick={() => {
                                                            setCuidadosEditando(cui);
                                                            tipo_cuidado.current.value = cui.tipo_cuidado;

                                                            const modal = new bootstrap.Modal(modalRefCuidados.current);
                                                            modal.show();
                                                        }}
                                                    >
                                                        <i className="bi bi-pencil-square fs-5"></i>
                                                    </button>

                                                    <button
                                                        className="btn btn-sm text-danger p-1"
                                                        onClick={() => pedirConfirmacaoDelete(cui.id)}
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

export default Cuidados