import React, { useState, useRef, useEffect } from "react";
import './Pacientes.css';
import CardPaciente from '../../components/Card/CardPaciente';
import * as bootstrap from 'bootstrap';

const Pacientes = () => {

    /* ============================
       COLLAPSE (Filtros)
    ============================ */
    const collapseRef = useRef(null);
    const [aberto, setAberto] = useState(false);

    useEffect(() => {
        if (!collapseRef.current) return;

        const collapseEl = collapseRef.current;

        const onShow = () => setAberto(true);
        const onHide = () => setAberto(false);

        collapseEl.addEventListener("show.bs.collapse", onShow);
        collapseEl.addEventListener("hide.bs.collapse", onHide);

        return () => {
            collapseEl.removeEventListener("show.bs.collapse", onShow);
            collapseEl.removeEventListener("hide.bs.collapse", onHide);
        };
    }, []);


    /* ============================
       FILTRO
    ============================ */
    const formFiltro = useRef(null);
    function fnLimparFiltro() {
        formFiltro.current.reset();
    }


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


    /* ============================
       FORM DO MODAL / CRIAR PACIENTE
    ============================ */
    const NomePaciente = useRef(null);
    const NomeMaePaciente = useRef(null);
    const NascPaciente = useRef(null);
    const TipoSanguePaciente = useRef(null);
    const FatorRhPaciente = useRef(null);
    const EquipePaciente = useRef(null);
    const StatusPaciente = useRef(null);
    const ConvenioPaciente = useRef(null);
    const QuartoPaciente = useRef(null);
    const LeitoPaciente = useRef(null);
    const modalRef = useRef(null);

    const [pacientes, setPacientes] = useState([]);

    function fnCriarPaciente() {

        const novoPaciente = {
            NomePaciente: NomePaciente.current.value,
            NomeMaePaciente: NomeMaePaciente.current.value,
            NascPaciente: NascPaciente.current.value,
            TipoSanguePaciente: TipoSanguePaciente.current.value,
            FatorRhPaciente: FatorRhPaciente.current.value,
            EquipePaciente: EquipePaciente.current.value,
            StatusPaciente: StatusPaciente.current.value,
            ConvenioPaciente: ConvenioPaciente.current.value,
            QuartoPaciente: QuartoPaciente.current.value,
            LeitoPaciente: LeitoPaciente.current.value,
        };

        setPacientes(prev => [...prev, novoPaciente]);
    }

    /* ============================
VALIDAÇÃO PARA O FORM CRIAR PACIENTE
============================ */
    const formRef = useRef(null);
    function handleSubmit(e) {
        e.preventDefault();

        const form = formRef.current;

        // validação bootstrap
        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }

        // 1️⃣ cria o paciente
        fnCriarPaciente();

        // 2️⃣ fecha o modal corretamente
        const modal = bootstrap.Modal.getOrCreateInstance(modalRef.current);
        modal.hide();

        // remove foco do botão antes do modal fechar (EVITA TRAVAMENTO DO BACKDROP)
        document.activeElement.blur();

        // 3️⃣ mostra o toast
        toastInstance.current.show();

        // 4️⃣ limpa o form
        form.reset();
        form.classList.remove("was-validated");
    }

    /* ============================
       RESET AUTOMÁTICO DO FORM AO FECHAR O MODAL
    ============================ */
    useEffect(() => {
        if (!modalRef.current) return;

        const modalEl = modalRef.current;

        const handleHidden = () => {
            modalEl.querySelector("form").reset();
        };

        modalEl.addEventListener("hidden.bs.modal", handleHidden);

        return () => {
            modalEl.removeEventListener("hidden.bs.modal", handleHidden);
        };

    }, []);



    return (
        <section id="pacientes-page-section">

            {/* Modal Criar Paciente */}
            <div className="modal fade" id="modalCriarPaciente" tabIndex="-1" aria-hidden="true" ref={modalRef}>
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">

                        <div className="modal-header">
                            <div className="p-2">
                                <h5 className="modal-title">Novo Paciente</h5>
                                <p className="small opacity-75">Preencha os dados do paciente para fins educacionais</p>
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
                                ref={formRef}
                                onSubmit={handleSubmit} >

                                <div className="col-12">
                                    <label className="form-label">Nome do Paciente *</label>
                                    <input type="text" className="form-control" ref={NomePaciente} required />
                                    <div className="invalid-feedback">
                                        Informe o nome do paciente.
                                    </div>
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Nome da Mãe *</label>
                                    <input type="text" className="form-control" ref={NomeMaePaciente} required />
                                    <div className="invalid-feedback">
                                        Informe o nome da mãe do paciente.
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Data de Nascimento *</label>
                                    <input type="date" className="form-control" ref={NascPaciente} required />
                                    <div className="invalid-feedback">
                                        Informe a data de nascimento do paciente.
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">Tipo Sanguíneo *</label>
                                    <select className="form-select" ref={TipoSanguePaciente} required>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="AB">AB</option>
                                        <option value="O">O</option>
                                    </select>
                                    <div className="invalid-feedback">
                                        Informe o tipo sanguíneo do paciente.
                                    </div>
                                </div>

                                <div className="col-md-2">
                                    <label className="form-label">Fator RH *</label>
                                    <select className="form-select" ref={FatorRhPaciente} required>
                                        <option value="+">+</option>
                                        <option value="-">-</option>
                                    </select>
                                    <div className="invalid-feedback">
                                        Informe o fator RH do paciente.
                                    </div>
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Equipe *</label>
                                    <input type="text" className="form-control"
                                        placeholder="Ex: Equipe Azul - Clínica Médica"
                                        ref={EquipePaciente} required />
                                    <div className="invalid-feedback">
                                        Informe a equipe responsável pelo paciente.
                                    </div>
                                    <p className="small mt-1 opacity-50">
                                        A equipe representa o grupo multiprofissional responsável pelo cuidado ao paciente
                                    </p>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Status do Paciente *</label>
                                    <select className="form-select" ref={StatusPaciente} required>
                                        <option value="estavel">Estável</option>
                                        <option value="observacao">Em Observação</option>
                                        <option value="critico">Crítico</option>
                                    </select>
                                    <div className="invalid-feedback">
                                        Informe o status do paciente.
                                    </div>
                                    <p className="small mt-1 opacity-50">
                                        Define o nível de atenção necessário para o paciente
                                    </p>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Convênio *</label>
                                    <input type="text" className="form-control"
                                        placeholder="Ex: SUS, Unimed, etc."
                                        ref={ConvenioPaciente} required />
                                    <div className="invalid-feedback">
                                        Informe o convênio do paciente.
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label">Quarto *</label>
                                    <input type="text" className="form-control"
                                        placeholder="Ex: 201"
                                        ref={QuartoPaciente} required />
                                    <div className="invalid-feedback">
                                        Informe o quarto do paciente.
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label">Leito *</label>
                                    <input type="text" className="form-control"
                                        placeholder="Ex: A"
                                        ref={LeitoPaciente} required />
                                    <div className="invalid-feedback">
                                        Informe o leito do paciente.
                                    </div>
                                </div>

                                <div className="modal-footer mt-2">
                                    <button className="btn btn-outline-danger" data-bs-dismiss="modal">
                                        Cancelar
                                    </button>

                                    <button type="submit" className="btn btn-primary">
                                        Criar Paciente
                                    </button>
                                </div>
                            </form>
                        </div>


                    </div>
                </div>
            </div>


            {/* Toast */}
            <div className="toast-container position-fixed bottom-0 end-0 p-3">
                <div ref={toastRef} className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="toast-header toast-color">
                        <strong className="me-auto d-flex align-items-center text-success">
                            Paciente Criado <i className="bi bi-check fs-5 ms-1"></i>
                        </strong>
                        <button type="button" className="btn-close" data-bs-dismiss="toast"></button>
                    </div>

                    <div className="toast-body">
                        Paciente criado com sucesso!
                    </div>
                </div>
            </div>


            {/* Conteúdo principal */}
            <div className="container-pacientes">

                <div className="d-flex flex-column flex-md-row mb-3 align-items-start align-items-md-center justify-content-md-between">

                    <div className="text-start mb-2 mb-md-0">
                        <h2 className="fw-bold">Gestão de Pacientes</h2>
                        <p>Crie e gerencie pacientes fictícios para o aprendizado</p>
                    </div>

                    <div className="d-flex justify-content-md-end container-action-btn">
                        <button className="btn btn-primary d-flex align-items-center gap-2 header-action-btn"
                            data-bs-toggle="modal"
                            data-bs-target="#modalCriarPaciente"
                        >
                            <i className="bi bi-plus fs-5"></i>
                            Novo Paciente
                        </button>
                    </div>
                </div>


                {/* Filtros */}
                <div>
                    <form className="d-flex flex-column flex-md-row gap-3" role="search">

                        <div className="position-relative w-100 d-flex">
                            <i className="bi bi-search position-absolute top-50 translate-middle-y ms-3 text-secondary"></i>
                            <input
                                type="text"
                                className="form-control input-search"
                                placeholder="Buscar por nome, equipe ou quarto..."
                            />
                        </div>

                        <button
                            type="button"
                            className={`btn btn-filter ${aberto ? "bg-primary text-white" : "btn-outline-primary text-dark"}`}
                            data-bs-toggle="collapse"
                            data-bs-target="#FormularioFiltro"
                        >
                            <i className="bi bi-funnel fs-5 me-1"></i>
                            Filtros
                        </button>
                    </form>


                    <div className="collapse" id="FormularioFiltro" ref={collapseRef}>
                        <form className="row g-3 form-control d-flex mt-3 m-0" ref={formFiltro}>

                            <div className="col-md-4">
                                <label className="form-label">Status do Paciente</label>
                                <select className="form-select">
                                    <option value="">Todos os status</option>
                                    <option value="estavel">Estável</option>
                                    <option value="observacao">Em Observação</option>
                                    <option value="critico">Crítico</option>
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">Equipe</label>
                                <select className="form-select">
                                    <option value="">Todas as Equipes</option>
                                    <option value="ClinicaMedica">Equipe Azul - Clínica Médica</option>
                                    <option value="Cardologia">Equipe Verde - Cardologia</option>
                                    <option value="UTI">Equipe Vermelha - UTI</option>
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">Convênio</label>
                                <select className="form-select">
                                    <option value="">Todos os convênios</option>
                                    <option value="SUS">SUS</option>
                                    <option value="Unimed">Unimed</option>
                                    <option value="Particular">Particular</option>
                                    <option value="Outros">Outros</option>
                                </select>
                            </div>

                            <button
                                type="button"
                                className="btn-Limparfiltro text-primary w-auto mt-3 mb-2"
                                onClick={fnLimparFiltro}
                            >
                                Limpar filtros
                            </button>
                        </form>
                    </div>
                </div>

                {/* Contador */}
                <div className="mt-4">
                    <p className="opacity-75 small">{pacientes.length} pacientes encontrados</p>
                </div>


                {/* Cards */}
                <div className="row g-2">
                    {pacientes.map((p, index) => (
                        <div className="col-12 col-md-4" key={index}>
                            <CardPaciente
                                NomePaciente={p.NomePaciente}
                                NomeMaePaciente={p.NomeMaePaciente}
                                NascPaciente={p.NascPaciente}
                                StatusPaciente={p.StatusPaciente}
                                TipoSanguePaciente={p.TipoSanguePaciente}
                                FatorRhPaciente={p.FatorRhPaciente}
                                QuartoPaciente={p.QuartoPaciente}
                                LeitoPaciente={p.LeitoPaciente}
                                EquipePaciente={p.EquipePaciente}
                                ConvenioPaciente={p.ConvenioPaciente}
                            />
                        </div>
                    ))}
                </div>

            </div>

        </section>
    );
};

export default Pacientes;
