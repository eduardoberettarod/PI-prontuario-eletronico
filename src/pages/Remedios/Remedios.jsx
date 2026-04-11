import React, { useRef, useEffect, useState } from 'react'
import * as bootstrap from 'bootstrap'
import './Remedios.css'
import Navbar from '../../components/Navbar/Navbar';
import { urlServer } from '../../../config';

function Remedios() {

    // filtro
    const [busca, setBusca] = useState("");

    // TOAST RELATORIO
    const toastRefRemedios = useRef(null)
    const toastInstanceRemedios = useRef(null);

    useEffect(() => {
        if (toastRefRemedios.current) {
            toastInstanceRemedios.current = bootstrap.Toast.getOrCreateInstance(toastRefRemedios.current, {
                autohide: true,
                delay: 2500,
            })
        }
    }, [])

    const [medicamentoEditando, setMedicamentoEditando] = useState(null);

    const [toastMsg, setToastMsg] = useState({
        titulo: "",
        mensagem: "",
        tipo: "success"
    });

    // FORM DO MODAL DE REMEDIOS / ADICIONAR MEDICAMENTO
    const nome_medicamento = useRef(null)
    const modalRefRemedios = useRef(null);
    const classe_terapeutica = useRef(null)
    const unidade = useRef(null)

    const [medicamentos, setMedicamentos] = useState([]);


    const formRefRemedios = useRef(null)
    async function SubmitRemedios(e) {
        e.preventDefault();

        const formRemedios = formRefRemedios.current;

        if (!formRemedios.checkValidity()) {
            formRemedios.classList.add("was-validated");
            return;
        }

        const dados = {
            nome_medicamento: nome_medicamento.current.value,
            classe_terapeutica: classe_terapeutica.current.value,
            unidade: unidade.current.value
        };

        const url = medicamentoEditando
            ? `${urlServer}/medicamentos/${medicamentoEditando.id}`
            : `${urlServer}/medicamentos`;

        const method = medicamentoEditando ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.erro || "Erro");

            fnCarregarDados();

            if (medicamentoEditando) {
                setToastMsg({
                    titulo: "Medicamento Editado",
                    mensagem: "Medicamento atualizado com sucesso!",
                    tipo: "success"
                });
            } else {
                setToastMsg({
                    titulo: "Medicamento Criado",
                    mensagem: "Medicamento adicionado com sucesso!",
                    tipo: "success"
                });
            }

            const modalInstance = bootstrap.Modal.getOrCreateInstance(
                modalRefRemedios.current
            );
            modalInstance.hide();

            document.activeElement.blur();

            toastInstanceRemedios.current?.show();

            formRemedios.reset();
            formRemedios.classList.remove("was-validated");

            setMedicamentoEditando(null);

        } catch (erro) {
            console.error(erro);

            setToastMsg({
                titulo: "Erro",
                mensagem: "Erro ao salvar medicamento",
                tipo: "danger"
            });

            toastInstanceRemedios.current?.show();
        }
    }

    function abrirModalEditar(med) {
        setMedicamentoEditando(med);

        nome_medicamento.current.value = med.nome_medicamento;
        classe_terapeutica.current.value = med.classe_terapeutica;
        unidade.current.value = med.unidade;

        const modal = bootstrap.Modal.getOrCreateInstance(modalRefRemedios.current);
        modal.show();
    }

    useEffect(() => {
        if (!modalRefRemedios.current) return;

        const modalEl = modalRefRemedios.current;

        const handleHidden = () => {
            formRefRemedios.current?.reset();
            formRefRemedios.current?.classList.remove("was-validated");
        };

        modalEl.addEventListener("hidden.bs.modal", handleHidden);

        return () => {
            modalEl.removeEventListener("hidden.bs.modal", handleHidden);
        };
    }, []);

    //EXCLUIR O MEDICAMENTO

    const [medicamentoParaExcluir, setMedicamentoParaExcluir] = useState(null);

    function pedirConfirmacaoDelete(id) {
        setMedicamentoParaExcluir(id);

        const modal = bootstrap.Modal.getOrCreateInstance(
            document.getElementById('modalConfirmarDeleteMedicamento')
        );

        modal.show();
    }

    async function confirmarDelete() {
        if (!medicamentoParaExcluir) return;

        await removerMedicamento(medicamentoParaExcluir);

        setMedicamentoParaExcluir(null);

        const modal = bootstrap.Modal.getInstance(
            document.getElementById('modalConfirmarDeleteMedicamento')
        );

        modal.hide();
    }

    async function removerMedicamento(id) {

        try {
            const response = await fetch(`${urlServer}/medicamentos/${id}`, {
                method: "DELETE",
                credentials: "include"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.erro || "Erro ao deletar");
            }

            // 🔥 recarrega do banco (melhor prática)
            fnCarregarDados();

            // 🔥 toast dinâmico
            setToastMsg({
                titulo: "Medicamento removido",
                mensagem: "Medicamento excluído com sucesso!",
                tipo: "success"
            });

            toastInstanceRemedios.current?.show();

        } catch (erro) {
            console.error(erro);

            setToastMsg({
                titulo: "Erro",
                mensagem: "Erro ao excluir medicamento",
                tipo: "danger"
            });

            toastInstanceRemedios.current?.show();
        }
    }

    function fnCarregarDados() {

        fetch(`${urlServer}/medicamentos`, {
            method: "GET",
            credentials: "include"
        })
            .then(res => {

                if (res.status === 401) {
                    window.location.href = "/login"
                    return
                }

                if (!res.ok) {
                    throw new Error("Usuário não autorizado");
                }
                return res.json();
            })
            .then(dados => {
                if (Array.isArray(dados)) {
                    setMedicamentos(dados);
                } else {
                    setMedicamentos([]);
                }
            })
            .catch(erro => {
                console.log(erro.message)
                setMedicamentos([])
            })
            .catch(erro => console.log(erro.message))

    }

    useEffect(() => {
        fnCarregarDados()
    }, [])

    const medicamentosFiltrados = medicamentos.filter((med) => {

        const termo = busca.toLowerCase();

        return (
            med.nome_medicamento?.toLowerCase().includes(termo) ||
            med.classe_terapeutica?.toLowerCase().includes(termo) ||
            med.unidade?.toLowerCase().includes(termo)
        );

    });


    return (
        <>
            <Navbar />
            <section id='remedios-page-section'>

                {/* Modal para Deletar o Remedios */}
                <div
                    className="modal fade"
                    id="modalConfirmarDeleteMedicamento"
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
                                <p className='mt-2 text-muted small'>Tem certeza que deseja excluir este remédio? Essa ação não pode ser desfeita.</p>
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

                {/* Modal Criar Relatorio */}
                <div className="modal fade" id="modalCriarRemedio"
                    tabIndex="-1" aria-hidden="true" ref={modalRefRemedios}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">

                            <div className="modal-header">
                                <div className="p-2">
                                    <h5 className="modal-title">{medicamentoEditando ? "Editar Medicamento" : "Novo Medicamento"}</h5>
                                    <p className="small opacity-75">Adicione um novo medicamento à tabela</p>
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
                                    ref={formRefRemedios}
                                    onSubmit={SubmitRemedios}>

                                    <div className="col-12">
                                        <label className="form-label">Nome do Medicamento *</label>
                                        <input type="text" className="form-control" ref={nome_medicamento} required />
                                        <div className="invalid-feedback">
                                            Informe o nome do medicamento.
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label">Classe Terapêutica *</label>
                                        <input type="text" className="form-control" ref={classe_terapeutica} required
                                            placeholder='Ex: Avaliação Inicial, Evolução Clínica, etc.' />
                                        <div className="invalid-feedback">
                                            Informe a classe terapêutica.
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <label className="form-label">Unidade *</label>
                                        <select defaultValue="" className="form-select" ref={unidade} required>
                                            <option value="">Escolha a unidade</option>
                                            <option value="mg">mg (miligramas)</option>
                                            <option value="g">g (gramas)</option>
                                            <option value="mcg">mcg (microgramas)</option>
                                            <option value="ml">mL (mililitros)</option>
                                            <option value="ui">UI (unidades internacionais)</option>
                                            <option value="%">% (percentual)</option>
                                        </select>
                                        <div className="invalid-feedback">
                                            Escolha a unidade que deverá ser utilizada.
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
                                            {medicamentoEditando ? "Salvar Alterações" : "Adicionar"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toast Remedios */}
                <div className="toast-container position-fixed bottom-0 end-0 p-3">
                    <div ref={toastRefRemedios} className="toast" role="alert" aria-live="assertive" aria-atomic="true">
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
                <div className='container-remedios'>

                    <div className="d-flex flex-column flex-md-row mb-3 align-items-start align-items-md-center justify-content-md-between">

                        <div className="text-start mb-2 mb-md-0">
                            <h2 className="fw-bold">Tabela de Medicamentos</h2>
                            <p>Gerencie os medicamentos disponíveis para prescrição</p>
                        </div>

                        <div className="d-flex justify-content-md-end container-action-btn">
                            <button
                                className="btn btn-primary d-flex align-items-center gap-2 header-action-btn"
                                data-bs-toggle="modal"
                                data-bs-target="#modalCriarRemedio"
                            >
                                <i className="bi bi-plus fs-5"></i>
                                Novo Medicamento
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
                                    placeholder="Buscar por nome, unidade ou classe..."
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
                                        <th className="ps-4 py-3">Medicamento</th>
                                        <th className="px-3 py-3 d-none d-md-table-cell">Classe Terapêutica</th>
                                        <th className="px-3 py-3">Unidade</th>
                                        <th className="pe-4 py-3 text-end">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {medicamentosFiltrados.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center text-secondary py-4">
                                                Nenhum medicamento cadastrado
                                            </td>
                                        </tr>
                                    )}

                                    {medicamentosFiltrados.map((med, index) => (
                                        <tr key={index} className="align-middle">

                                            <td className="ps-4 py-3">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="icon-medicamento">
                                                        <i className="bi bi-capsule fs-5"></i>
                                                    </div>
                                                    <span>{med.nome_medicamento}</span>
                                                </div>
                                            </td>

                                            <td className="px-3 py-3 d-none d-md-table-cell">
                                                {med.classe_terapeutica}
                                            </td>

                                            <td className="px-3 py-3">
                                                {med.unidade}
                                            </td>

                                            <td className="pe-4 py-3 text-end">
                                                <div className="d-inline-flex align-items-center gap-2">
                                                    <button
                                                        className="btn btn-sm text-success p-1"
                                                        onClick={() => abrirModalEditar(med)}
                                                    >
                                                        <i className="bi bi-pencil-square fs-5"></i>
                                                    </button>

                                                    <button
                                                        className="btn btn-sm text-danger p-1"
                                                        onClick={() => pedirConfirmacaoDelete(med.id)}
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

export default Remedios