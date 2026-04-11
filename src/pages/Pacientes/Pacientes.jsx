import React, { useState, useRef, useEffect } from "react";
import './Pacientes.css';
import CardPaciente from '../../components/Card/CardPaciente';
import * as bootstrap from 'bootstrap';
import Navbar from '../../components/Navbar/Navbar';
import { urlServer } from "../../../config";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext/AuthContext";

const Pacientes = () => {

    const { usuario } = useAuth();

    const nivelAcesso = usuario?.nivel_acesso;
    const podeEditar = ['admin', 'docente'].includes(nivelAcesso);

    /* ============================
       COLLAPSE (Filtros)
    ============================ */
    const collapseRef = useRef(null);
    const [aberto, setAberto] = useState(false);
    const [busca, setBusca] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("");
    const [filtroSetor, setFiltroSetor] = useState("");
    const [listaSetores, setListaSetores] = useState([]);

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

        setBusca("");
        setFiltroStatus("");
        setFiltroSetor("");
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
    const setorSelecionado = useRef(null);
    const modalRefPaciente = useRef(null);

    const [pacientes, setPacientes] = useState([]);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [pacienteEditando, setPacienteEditando] = useState(null);


    const NascInvalido = useRef(null);

    const formRef = useRef(null);

    const [toastMsg, setToastMsg] = useState({
        titulo: "",
        mensagem: "",
        tipo: "success"
    });

    function handleSubmit(e) {
        e.preventDefault();

        const form = formRef.current;

        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }

        const dadosPaciente = {
            nome_paciente: NomePaciente.current.value,
            mae_paciente: NomeMaePaciente.current.value,
            data_nasc: NascPaciente.current.value,
            tipo_sanguineo: TipoSanguePaciente.current.value,
            fator_rh: FatorRhPaciente.current.value,
            equipe: EquipePaciente.current.value,
            status_paciente: StatusPaciente.current.value,
            convenio: ConvenioPaciente.current.value,
            quarto: QuartoPaciente.current.value,
            leito: LeitoPaciente.current.value,
            id_setor: setorSelecionado.current.value
        };


        const url = modoEdicao
            ? `${urlServer}/pacientes/${pacienteEditando.id}`
            : `${urlServer}/pacientes`;

        const method = modoEdicao ? "PUT" : "POST";

        fetch(url, {
            method,
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosPaciente)
        })
            .then(res => res.json())
            .then(() => {

                fnCarregarDados();

                // define o toast
                if (modoEdicao) {
                    setToastMsg({
                        titulo: "Paciente Editado",
                        mensagem: "Paciente editado com sucesso!",
                        tipo: "success"
                    });
                } else {
                    setToastMsg({
                        titulo: "Paciente Criado",
                        mensagem: "Paciente criado com sucesso!",
                        tipo: "success"
                    });
                }

                const modalInstance = bootstrap.Modal.getOrCreateInstance(
                    modalRefPaciente.current
                );
                modalInstance.hide();

                document.activeElement.blur();

                toastInstance.current?.show();

                form.reset();
                form.classList.remove("was-validated");

                // reseta o modo
                setModoEdicao(false);
                setPacienteEditando(null);
            })
            .catch(erro => console.log(erro));
    }

    useEffect(() => {
        if (!modalRefPaciente.current) return;

        const modalEl = modalRefPaciente.current;

        const handleHidden = () => {
            formRef.current?.reset();
            formRef.current?.classList.remove("was-validated");
        };

        modalEl.addEventListener("hidden.bs.modal", handleHidden);

        return () => {
            modalEl.removeEventListener("hidden.bs.modal", handleHidden);
        };
    }, []);

    function fnCarregarDados() {

        fetch(`${urlServer}/pacientes`, {
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
                    setPacientes(dados);
                } else {
                    setPacientes([]);
                }
            })
            .catch(erro => {
                console.log(erro.message)
                setPacientes([])
            })
            .catch(erro => console.log(erro.message))

    }

    useEffect(() => {
        fnCarregarDados()
    }, [])

    const navigate = useNavigate()

    function fnCarregarSetores() {
        fetch(`${urlServer}/setores`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(res => {

                if (res.status === 401) {
                    navigate('/login')
                    return null;
                }


                if (!res.ok) {
                    throw new Error("Erro na requisição")
                }

                return res.json();
            })
            .then(dados => {
                if (dados) {
                    setListaSetores(dados);
                }
            })
            .catch((erro) => {
                console.log(erro)
            })
    }

    useEffect(() => {
        if (!nivelAcesso) return;

        fnCarregarSetores()

    }, [nivelAcesso])

    // Excluir Pacientes

    const [pacienteParaExcluir, setPacienteParaExcluir] = useState(null);

    function pedirConfirmacaoDelete(id) {
        setPacienteParaExcluir(id);

        const modal = bootstrap.Modal.getOrCreateInstance(
            document.getElementById('modalConfirmarDeletePaciente')
        );

        modal.show();
    }

    async function confirmarDelete() {
        if (!pacienteParaExcluir) return;

        await removerPaciente(pacienteParaExcluir);

        setPacienteParaExcluir(null);

        const modal = bootstrap.Modal.getInstance(
            document.getElementById('modalConfirmarDeletePaciente')
        );

        modal.hide();
    }

    async function removerPaciente(id) {

        try {
            const response = await fetch(`${urlServer}/pacientes/${id}`, {
                method: "DELETE",
                credentials: "include"
            })

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.erro || "Erro ao deletar");
            }

            fnCarregarDados();

            setToastMsg({
                titulo: "Paciente removido",
                mensagem: "Paciente excluído com sucesso!",
                tipo: "success"
            });

            toastInstance.current?.show();

        } catch (erro) {
            console.error(erro);

            setToastMsg({
                titulo: "Erro",
                mensagem: "Erro ao excluir paciente",
                tipo: "danger"
            });

            toastInstance.current?.show();
        }
    }


    function editarPaciente(paciente) {

        setModoEdicao(true);
        setPacienteEditando(paciente);

        // preenche os campos
        NomePaciente.current.value = paciente.nome_paciente;
        NomeMaePaciente.current.value = paciente.mae_paciente;
        NascPaciente.current.value = paciente.data_nasc?.split("T")[0];
        TipoSanguePaciente.current.value = paciente.tipo_sanguineo;
        FatorRhPaciente.current.value = paciente.fator_rh;
        EquipePaciente.current.value = paciente.equipe;
        StatusPaciente.current.value = paciente.status_paciente;
        ConvenioPaciente.current.value = paciente.convenio;
        QuartoPaciente.current.value = paciente.quarto;
        LeitoPaciente.current.value = paciente.leito;
        setorSelecionado.current.value = paciente.id_setor;

        const modal = bootstrap.Modal.getOrCreateInstance(modalRefPaciente.current);
        modal.show();
    }


    const pacientesFiltrados = pacientes.filter((p) => {

        const matchBusca =
            p.nome_paciente.toLowerCase().includes(busca.toLowerCase()) ||
            p.equipe.toLowerCase().includes(busca.toLowerCase()) ||
            p.quarto.toLowerCase().includes(busca.toLowerCase());

        const matchStatus =
            !filtroStatus || p.status_paciente === filtroStatus;

        const matchSetor =
            !filtroSetor || String(p.id_setor) === filtroSetor;

        return matchBusca && matchStatus && matchSetor;
    });

    return (
        <>
            <Navbar />
            <section id="pacientes-page-section">

                {/* Modal para excluir paciente */}
                <div
                    className="modal fade"
                    id="modalConfirmarDeletePaciente"
                    tabIndex="-1"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered" style={{maxWidth: "350px"}}>
                        <div className="modal-content">

                            <div className="d-flex p-3 justify-content-center">
                                <div className="d-flex align-items-center flex-column justify-content-center text-center gap-2">
                                    <i className="bi bi-exclamation-circle text-danger" style={{fontSize: "5rem"}}></i>
                                    <h5 className="p-0 m-0">Confirmar exclusão</h5>
                                </div>
                                <button className="btn-close position-absolute end-0 top-0 me-3 mt-3" data-bs-dismiss="modal"  style={{fontSize: "0.75rem"}}></button>
                            </div>

                            <div className="modal-body text-center">
                                <p className='mt-2 text-muted small'>Tem certeza que deseja excluir este paciente? Essa ação não pode ser desfeita.</p>
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


                {/* Modal Criar Paciente */}
                <div className="modal fade" id="modalCriarPaciente" tabIndex="-1" aria-hidden="true" ref={modalRefPaciente}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">

                            <div className="modal-header">
                                <div className="p-2">
                                    <h5 className="modal-title">
                                        {modoEdicao ? "Editar Paciente" : "Novo Paciente"}
                                    </h5>
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
                                        <div className="small text-danger nascInvalido" ref={NascInvalido}>
                                            Informe uma data de nascimento válida para o paciente.
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label">Tipo Sanguíneo *</label>
                                        <select className="form-select" ref={TipoSanguePaciente} required>
                                            <option value=""></option>
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
                                            <option value=""></option>
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
                                            <option value=""></option>
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

                                    <div className="col-md-6">
                                        <label className="form-label">Setor *</label>
                                        <select className="form-select" required ref={setorSelecionado}>
                                            <option value="">Selecione um setor</option>

                                            {listaSetores.map(s => (
                                                <option key={s.id} value={s.id}>
                                                    {s.nome_setor}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="invalid-feedback">
                                            Informe o setor do paciente.
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
                                            {modoEdicao ? "Salvar Alterações" : "Criar Paciente"}
                                        </button>
                                    </div>
                                </form>
                            </div>


                        </div>
                    </div>
                </div>


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


                {/* Conteúdo principal */}
                <div className="container-pacientes">

                    <div className="d-flex flex-column flex-md-row mb-3 align-items-start align-items-md-center justify-content-md-between">

                        <div className="text-start mb-2 mb-md-0">
                            <h2 className="fw-bold">Gestão de Pacientes</h2>
                            <p>Crie e gerencie pacientes fictícios para o aprendizado</p>
                        </div>

                        {podeEditar && (
                            <div className="d-flex justify-content-md-end container-action-btn">
                                <button className="btn btn-primary d-flex align-items-center gap-2 header-action-btn"
                                    data-bs-toggle="modal"
                                    data-bs-target="#modalCriarPaciente"
                                >
                                    <i className="bi bi-plus fs-5"></i>
                                    Novo Paciente
                                </button>
                            </div>
                        )}
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
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
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

                                <div className="col-md-6">
                                    <label className="form-label">Status do Paciente</label>
                                    <select
                                        className="form-select"
                                        value={filtroStatus}
                                        onChange={(e) => setFiltroStatus(e.target.value)}
                                    >
                                        <option value="">Todos os status</option>
                                        <option value="estavel">Estável</option>
                                        <option value="observacao">Em Observação</option>
                                        <option value="critico">Crítico</option>
                                    </select>
                                </div>


                                <div className="col-md-6">
                                    <label className="form-label">Setor</label>
                                    <select
                                        className="form-select"
                                        value={filtroSetor}
                                        onChange={(e) => setFiltroSetor(e.target.value)}
                                    >
                                        <option value="">Selecione um setor</option>

                                        {listaSetores.map(s => (
                                            <option key={s.id} value={s.id}>
                                                {s.nome_setor}
                                            </option>
                                        ))}

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
                        <p className="opacity-75 small">
                            {pacientesFiltrados.length} pacientes encontrados
                        </p>
                    </div>


                    {/* Cards */}
                    <div className="row g-2">
                        {pacientesFiltrados.map((p, index) => (
                            <div className="col-12 col-md-4 card-pacientes" key={index}>
                                <CardPaciente
                                    key={p.id}
                                    id={p.id}
                                    NomePaciente={p.nome_paciente}
                                    NomeMaePaciente={p.mae_paciente}
                                    NascPaciente={p.data_nasc}
                                    StatusPaciente={p.status_paciente}
                                    TipoSanguePaciente={p.tipo_sanguineo}
                                    FatorRhPaciente={p.fator_rh}
                                    QuartoPaciente={p.quarto}
                                    LeitoPaciente={p.leito}
                                    EquipePaciente={p.equipe}
                                    ConvenioPaciente={p.convenio}
                                    setor={p.nome_setor}
                                    id_setor={p.id_setor}
                                    pedirConfirmacaoDelete={pedirConfirmacaoDelete}
                                    onEditar={editarPaciente}
                                />
                            </div>
                        ))}
                    </div>

                </div>

            </section>
        </>
    );
};

export default Pacientes;
