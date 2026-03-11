import React, { useRef, useEffect, useState } from 'react'
import * as bootstrap from 'bootstrap'
import './Cuidados.css'
import Navbar from '../../components/Navbar/Navbar';

function Cuidados() {

    // TOAST RELATORIO
    const toastRefCuidados = useRef(null)
    const toastInstanceCuidados = useRef(null);

    useEffect(() => {
        if (toastRefCuidados.current) {
            toastInstanceCuidados.current = bootstrap.Toast.getOrCreateInstance(toastRefCuidados.current, {
                autohide: true,
                delay: 2500,
            })
        }
    }, [])

    // FORM DO MODAL DE Cuidados / ADICIONAR Cuidados
    const tipoCuidado = useRef(null)
    const modalRefCuidados = useRef(null)

    const [cuidados, setCuidados] = useState([]);

    function fnAdicionarCuidado() {

        const novoCuidado = {
            tipoCuidado: tipoCuidado.current.value
        };

        setCuidados(prev => [...prev, novoCuidado]);
    }

    const formRefCuidados = useRef(null)
    function SubmitCuidados(e) {

        e.preventDefault();

        const formCuidados = formRefCuidados.current

        // validação bootstrap
        if (!formCuidados.checkValidity()) {
            formCuidados.classList.add("was-validated");
            return
        }

        // adiciona o medicamento
        fnAdicionarCuidado();

        //fecha o modal
        const modalInstance = bootstrap.Modal.getOrCreateInstance(
            modalRefCuidados.current
        );
        modalInstance.hide();


        //remove foco do botão antes do modal fechar (EVITA TRAVAMENTO DO BACKDROP)
        document.activeElement.blur();

        // 3️ mostra o toast
        toastInstanceCuidados.current?.show();


        formCuidados.classList.remove("was-validated")
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

    //EXCLUIR O MEDICAMENTO

    function removerCuidado(index) {
        setCuidados(prev =>
            prev.filter((_, i) => i !== index)
        );
    }



    return (
        <>
            <Navbar />
            <section id='cuidados-page-section'>

                {/* Modal Criar Relatorio */}
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
                                        <input type="text" className="form-control" ref={tipoCuidado} required />
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
                            <strong className="me-auto d-flex align-items-center text-success">
                                Cuidado adicionado <i className="bi bi-check fs-5 ms-1"></i>
                            </strong>
                            <button type="button" className="btn-close" data-bs-dismiss="toast"></button>
                        </div>

                        <div className="toast-body">
                            Cuidado adicionado com sucesso!
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
                                />
                            </div>
                        </form>
                    </div>

                    <div className="row mt-4">
                        <div className="col">
                            <table className="table table-hover align-middle mx-auto cuidados-table">
                                <thead>
                                    <tr>
                                        <th className="ps-4 py-3 text-muted small">ID</th>

                                        <th className="py-3" id='th-cuidado'>
                                            Tipo de Cuidado
                                        </th>

                                        <th className="pe-4 py-3 text-end text-muted small">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {cuidados.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="text-center text-secondary py-4">
                                                Nenhum cuidado cadastrado
                                            </td>
                                        </tr>
                                    )}

                                    {cuidados.map((cui, index) => (
                                        <tr key={index}>

                                            <td className="ps-4 py-3">
                                                {index + 1}
                                            </td>

                                            <td className="py-3" id='td-cuidado'>
                                                <div className="d-flex align-items-center gap-2">
                                                    <i className="icon-cuidados bi bi-heart-pulse"></i>
                                                    <span>{cui.tipoCuidado}</span>
                                                </div>
                                            </td>

                                            <td className="pe-4 py-3 text-end">
                                                <div className="d-inline-flex align-items-center gap-3">

                                                    <button className="btn btn-sm text-success p-1">
                                                        <i className="bi bi-pencil-square fs-5"></i>
                                                    </button>

                                                    <button
                                                        className="btn btn-sm text-danger p-1"
                                                        onClick={() => removerCuidado(index)}
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