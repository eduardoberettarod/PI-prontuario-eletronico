import React, { useRef, useEffect, useState } from 'react'
import * as bootstrap from 'bootstrap'
import './Remedios.css'
import Navbar from '../../components/Navbar/Navbar';

function Remedios() {

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

    // FORM DO MODAL DE REMEDIOS / ADICIONAR MEDICAMENTO
    const NomeMedicamento = useRef(null)
    const modalRefRemedios = useRef(null);
    const ClasseTerapeutica = useRef(null)
    const Unidade = useRef(null)

    const [medicamentos, setMedicamentos] = useState([]);

    function fnAdicionarMedicamento() {

        const novoMedicamento = {
            NomeMedicamento: NomeMedicamento.current.value,
            ClasseTerapeutica: ClasseTerapeutica.current.value,
            Unidade: Unidade.current.value
        };

        setMedicamentos(prev => [...prev, novoMedicamento]);
    }

    const formRefRemedios = useRef(null)
    function SubmitRemedios(e) {

        e.preventDefault();

        const formRemedios = formRefRemedios.current

        // validação bootstrap
        if (!formRemedios.checkValidity()) {
            formRemedios.classList.add("was-validated");
            return
        }

        // adiciona o medicamento
        fnAdicionarMedicamento();

        //fecha o modal
        const modalInstance = bootstrap.Modal.getOrCreateInstance(
            modalRefRemedios.current
        );
        modalInstance.hide();


        //remove foco do botão antes do modal fechar (EVITA TRAVAMENTO DO BACKDROP)
        document.activeElement.blur();

        // 3️ mostra o toast
        toastInstanceRemedios.current?.show();


        formRemedios.classList.remove("was-validated")
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

    function removerMedicamento(index) {
        setMedicamentos(prev =>
            prev.filter((_, i) => i !== index)
        );
    }



    return (
        <>
        <Navbar />
            <section id='remedios-page-section'>

                {/* Modal Criar Relatorio */}
                <div className="modal fade" id="modalCriarRemedio"
                    tabIndex="-1" aria-hidden="true" ref={modalRefRemedios}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">

                            <div className="modal-header">
                                <div className="p-2">
                                    <h5 className="modal-title">Novo Medicamento</h5>
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
                                        <input type="text" className="form-control" ref={NomeMedicamento} required />
                                        <div className="invalid-feedback">
                                            Informe o nome do medicamento.
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label">Classe Terapêutica *</label>
                                        <input type="text" className="form-control" ref={ClasseTerapeutica} required
                                            placeholder='Ex: Avaliação Inicial, Evolução Clínica, etc.' />
                                        <div className="invalid-feedback">
                                            Informe a classe terapêutica.
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <label className="form-label">Unidade *</label>
                                        <select className="form-select" ref={Unidade} required>
                                            <option value="">Escolha a unidade</option>
                                            <option value="mg">mg (miligramas)</option>
                                            <option value="g">g (gramas)</option>
                                            <option value="mcg">mcg (microgramas)</option>
                                            <option value="mL">mL (mililitros)</option>
                                            <option value="UI">UI (unidades internacionais)</option>
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
                                            Adicionar
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
                            <strong className="me-auto d-flex align-items-center text-success">
                                Medicamento adicionado <i className="bi bi-check fs-5 ms-1"></i>
                            </strong>
                            <button type="button" className="btn-close" data-bs-dismiss="toast"></button>
                        </div>

                        <div className="toast-body">
                            Medicamento adicionado com sucesso!
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
                                Novo Medicamento
                                <i className="bi bi-plus fs-5"></i>
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
                                    placeholder="Buscar por nome ou classe..."
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
                                        <th className="px-4 py-3 d-none d-md-table-cell">Classe Terapêutica</th>
                                        <th className='px-4 py-3'>Unidade</th>
                                        <th className="pe-4 py-3 text-end">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {medicamentos.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center text-secondary py-4">
                                                Nenhum medicamento cadastrado
                                            </td>
                                        </tr>
                                    )}

                                    {medicamentos.map((med, index) => (
                                        <tr key={index} className="align-middle">

                                            {/* Medicamento (ícone + nome) */}
                                            <td className="ps-4 py-3">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="icon-medicamento">
                                                        <i className="bi bi-capsule fs-5"></i>
                                                    </div>
                                                    <span>{med.NomeMedicamento}</span>
                                                </div>
                                            </td>


                                            {/* Classe terapêutica */}
                                            <td className="py-3 px-3 d-none d-md-table-cell">{med.ClasseTerapeutica}</td>

                                            {/* Unidade */}
                                            <td className="py-3 px-3">{med.Unidade}</td>

                                            {/* Ações */}
                                            <td className="pe-4 py-3 text-end">
                                                <button
                                                    className="btn btn-sm text-danger p-1"
                                                    onClick={() => removerMedicamento(index)}
                                                >
                                                    <i className="bi bi-trash fs-5"></i>
                                                </button>
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
