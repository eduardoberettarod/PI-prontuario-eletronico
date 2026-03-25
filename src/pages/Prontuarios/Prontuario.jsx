import { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

import * as bootstrap from 'bootstrap';

import Navbar from '../../components/Navbar/Navbar'
import TagStatus from '../../components/Tag/TagStatus'
import './Prontuario.css'
import { urlServer } from '../../../config';

const Prontuario = () => {

    const [activeTab, setActiveTab] = useState("dados");
    const [tipoCuidado, setTipoCuidado] = useState("");
    const [paciente, setPaciente] = useState(null)

    // Modal e crição de novos Cuidados
    const modalCriarCuidado = useRef(null)
    const observacao = useRef(null)
    const tipoCuidadoRegistrado = useRef(null)

    const [cuidadosRegistrados, setCuidadosRegistrados] = useState([]);
    const [listaCuidados, setListaCuidados] = useState([]);
    const [cuidadosPaciente, setCuidadosPaciente] = useState([])

    function fnCarregarDados() {
        const parametros = new URLSearchParams(window.location.search)
        const id = parametros.get('id')

        fetch(`${urlServer}/pacientes/` + id, {
            method: 'GET',
            credentials: 'include',
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
                setPaciente(dados);
            })
            .catch(erro => console.log(erro.message))
    }

    function fnAdicionarNovoCuidado() {

        const paciente_id = new URLSearchParams(window.location.search).get("id");

        const novoCuidado = {
            paciente_id,
            cuidado_id: tipoCuidadoRegistrado.current.value,
            observacao: observacao.current.value
        };

        fetch(`${urlServer}/paciente-cuidados`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoCuidado)
        })
            .then(() => {
                fnCarregarCuidadosPaciente()
            })
    }

    useEffect(() => {
        fnCarregarDados()
    }, [])

    function alterarStatusCuidado(id, status_id) {

        fetch(`${urlServer}/paciente-cuidados/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status_id })
        })
            .then(() => fnCarregarCuidadosPaciente())
    }

    function fnCarregarCuidados() {
        fetch(`${urlServer}/cuidados`, {
            method: "GET",
            credentials: "include"
        })
            .then(res => res.json())
            .then(dados => setListaCuidados(dados))
            .catch(err => console.log(err))
    }

    function fnCarregarCuidadosPaciente() {
        const id = new URLSearchParams(window.location.search).get("id");

        fetch(`${urlServer}/paciente-cuidados/${id}`, {
            method: "GET",
            credentials: "include"
        })
            .then(res => res.json())
            .then(dados => {
                if (Array.isArray(dados)) {
                    setCuidadosPaciente(dados)
                } else {
                    console.error("Resposta não é array:", dados)
                    setCuidadosPaciente([])
                }
            })
    }

    useEffect(() => {
        fnCarregarCuidados()
        fnCarregarCuidadosPaciente()
    }, [])

    const formRefCuidados = useRef(null)
    function SubmitCuidado(e) {

        e.preventDefault();

        const formCuidados = formRefCuidados.current

        // validação bootstrap
        if (!formCuidados.checkValidity()) {
            formCuidados.classList.add("was-validated");
            return
        }

        // adiciona o medicamento
        fnAdicionarNovoCuidado();

        //fecha o modal
        const modalInstance = bootstrap.Modal.getOrCreateInstance(
            modalCriarCuidado.current
        );
        modalInstance.hide();


        //remove foco do botão antes do modal fechar (EVITA TRAVAMENTO DO BACKDROP)
        document.activeElement.blur();

        // 3️ mostra o toast

        formCuidados.classList.remove("was-validated")
    }

    useEffect(() => {
        if (!modalCriarCuidado.current) return;

        const modalEl = modalCriarCuidado.current;

        const handleHidden = () => {
            formRefCuidados.current?.reset();
            formRefCuidados.current?.classList.remove("was-validated");
        };

        modalEl.addEventListener("hidden.bs.modal", handleHidden);

        return () => {
            modalEl.removeEventListener("hidden.bs.modal", handleHidden);
        };
    }, []);

    // Modal e crição de novas Prescrições
    const modalCriarPrescricao = useRef(null)
    const frequencia = useRef(null)
    const medicamento = useRef(null)
    const dosagem = useRef(null)
    const unidade = useRef(null)
    const via = useRef(null)
    const observacaoPrescricao = useRef(null)

    const [prescricoesRegistradas, setprescricoesRegistradas] = useState([]);

    function fnGerarHorarios(frequencia) {

        const agora = new Date();
        const horarios = [];

        for (let i = frequencia; i <= 24; i += frequencia) {

            const novaData = new Date(agora);

            novaData.setHours(novaData.getHours() + i);

            const dia = String(novaData.getDate()).padStart(2, "0");
            const mes = String(novaData.getMonth() + 1).padStart(2, "0");
            const ano = novaData.getFullYear();

            const hora = String(novaData.getHours()).padStart(2, "0");
            const minuto = String(novaData.getMinutes()).padStart(2, "0");

            horarios.push({
                data: `${dia}/${mes}/${ano}`,
                hora: `${hora}:${minuto}`,
                status: ""
            });

        }

        return horarios;
    }

    function fnAdicionarNovaPrescricao() {

        const freq = parseInt(frequencia.current.value);

        const novaPrescricao = {
            frequencia: freq,
            medicamento: medicamento.current.value,
            dosagem: dosagem.current.value,
            unidade: unidade.current.value,
            via: via.current.value,
            observacaoPrescricao: observacaoPrescricao.current.value,
            horarios: fnGerarHorarios(freq)
        };

        setprescricoesRegistradas(prev => [...prev, novaPrescricao]);
    }

    function formatarDataBR(data) {
        if (!data) return "";

        const novaData = new Date(data);

        return novaData.toLocaleDateString("pt-BR");
    }

    function alterarStatusHorario(indexPrescricao, indexHorario, status) {

        setprescricoesRegistradas(prev => {

            const novas = [...prev];

            novas[indexPrescricao].horarios[indexHorario].status = status;

            return novas;

        });

    }

    const formRefPrescricao = useRef(null)
    function SubmitPrescricao(e) {

        e.preventDefault();

        const formPrescricao = formRefPrescricao.current

        // validação bootstrap
        if (!formPrescricao.checkValidity()) {
            formPrescricao.classList.add("was-validated");
            return
        }

        // adiciona o medicamento
        fnAdicionarNovaPrescricao();

        //fecha o modal
        const modalInstance = bootstrap.Modal.getOrCreateInstance(
            modalCriarPrescricao.current
        );
        modalInstance.hide();

        //remove foco do botão antes do modal fechar (EVITA TRAVAMENTO DO BACKDROP)
        document.activeElement.blur();

        formPrescricao.classList.remove("was-validated")
    }

    useEffect(() => {
        if (!modalCriarPrescricao.current) return;

        const modalEl = modalCriarPrescricao.current;

        const handleHidden = () => {
            formRefPrescricao.current?.reset();
            formRefPrescricao.current?.classList.remove("was-validated");
        };

        modalEl.addEventListener("hidden.bs.modal", handleHidden);

        return () => {
            modalEl.removeEventListener("hidden.bs.modal", handleHidden);
        };
    }, []);

    const statusClass = `status-${paciente?.status_paciente}`

    const nascimento = new Date(paciente?.data_nasc);
    const hoje = new Date();

    let idade = "";

    if (paciente?.data_nasc) {
        const nascimento = new Date(paciente.data_nasc);
        const hoje = new Date();

        idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();

        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
    }

    return (
        <>

            <Navbar />
            <section id='prontuario-page-section'>

                <div className="modal fade" id="modalCriarPrescricao"
                    tabIndex="-1" aria-hidden="true" ref={modalCriarPrescricao}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">

                            <div className="modal-header">
                                <div className="p-2">
                                    <h5 className="modal-title">Nova Prescrição</h5>
                                    <p className="small opacity-75">Adicione uma nova prescrição ao paciente.</p>
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
                                    ref={formRefPrescricao}
                                    onSubmit={SubmitPrescricao}
                                >

                                    <div className="col-12">
                                        <label className="form-label">Medicamento *</label>
                                        <select className='form-select' required ref={medicamento}>
                                            <option value="">Escolha um medicamento</option>
                                            <option value="Dipirona">Dipirona</option>
                                        </select>
                                        <div className="invalid-feedback">
                                            Informe um medicamento.
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label">Dosagem *</label>
                                        <input type="number" className="form-control" required
                                            placeholder='Ex: 500' ref={dosagem} />
                                        <div className="invalid-feedback">
                                            Informe a classe terapêutica.
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <label className="form-label">Unidade *</label>
                                        <select className="form-select" required ref={unidade}>
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

                                    <div className='col-12'>
                                        <label className='form-label'>Via *</label>
                                        <input type="text" className='form-control' required placeholder='Ex: Oral' ref={via} />
                                    </div>

                                    <div className='col-12'>
                                        <label className='form-label'>Frequência *</label>
                                        <select className="form-select" required ref={frequencia}>
                                            <option value="">Escolha a frequência</option>
                                            <option value="1">1/1hr</option>
                                            <option value="2">2/2hr</option>
                                            <option value="3">3/3hr</option>
                                            <option value="4">4/4hr</option>
                                            <option value="5">5/5hr</option>
                                            <option value="6">6/6hr</option>
                                            <option value="7">7/7hr</option>
                                            <option value="8">8/8hr</option>
                                            <option value="9">9/9hr</option>
                                            <option value="10">10/10hr</option>
                                            <option value="11">11/11hr</option>
                                            <option value="12">12/12hr</option>
                                            <option value="13">13/13hr</option>
                                            <option value="14">14/14hr</option>
                                            <option value="15">15/15hr</option>
                                            <option value="16">16/16hr</option>
                                            <option value="17">17/17hr</option>
                                            <option value="18">18/18hr</option>
                                            <option value="19">19/19hr</option>
                                            <option value="20">20/20hr</option>
                                            <option value="21">21/21hr</option>
                                            <option value="22">22/22hr</option>
                                            <option value="23">23/23hr</option>
                                            <option value="24">24/24hr</option>
                                        </select>
                                    </div>

                                    <div className='col-12'>
                                        <label className='form-label'>Observação</label>
                                        <input type="text" className='form-control' ref={observacaoPrescricao} placeholder='Ex: Se houver dor ou febre.' />
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


                <div className="modal fade" id="modalCriarCuidado"
                    tabIndex="-1" aria-hidden="true" ref={modalCriarCuidado}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">

                            <div className="modal-header">
                                <div className="p-2">
                                    <h5 className="modal-title">Novo Cuidado</h5>
                                    <p className="small opacity-75">Adicione um novo cuidado ao paciente.</p>
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
                                    onSubmit={SubmitCuidado}
                                >

                                    <div className="col-12">
                                        <label className="form-label">Tipo de cuidado *</label>
                                        <select className='form-select'
                                            required
                                            value={tipoCuidado}
                                            ref={tipoCuidadoRegistrado}
                                            onChange={(e) => setTipoCuidado(e.target.value)}>
                                            <option value="">Escolha um tipo de cuidado</option>
                                            {listaCuidados.map(c => (
                                                <option key={c.id} value={c.id}>
                                                    {c.tipo_cuidado}
                                                </option>
                                            ))}

                                        </select>
                                        <div className="invalid-feedback">
                                            Informe um cuidado.
                                        </div>
                                    </div>

                                    {tipoCuidado === "outro" && (
                                        <div className="col-12">
                                            <label className="form-label">Especifique o cuidado *</label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Descreva o cuidado"
                                                required
                                            />

                                            <div className="invalid-feedback">
                                                Informe qual cuidado será realizado.
                                            </div>
                                        </div>
                                    )}

                                    <div className="col-12">
                                        <label className="form-label">Observação *</label>
                                        <input type="text" className="form-control" required
                                            ref={observacao}
                                            placeholder='Ex: Aplicar Quando houver dor.' />
                                        <div className="invalid-feedback">
                                            Informe a classe terapêutica.
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

                <div className='container-prontuario'>

                    <div className='prontuario-header'>
                        <NavLink className='d-flex align-items-center gap-2 btn btn-primary px-3 py-2' id='voltarPaciente' to={'/pacientes'}>
                            <i className='bi bi-arrow-left'></i>
                            Voltar para os pacientes
                        </NavLink>
                    </div>

                    <div className='prontuario-content'>

                        <div className={`card card-prontuario ${statusClass}`}>

                            <div className='card-header d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-md-between py-3 px-4'>

                                <div className='d-flex align-items-center gap-3'>
                                    <div>
                                        <span className={`icone-prontuario ${statusClass}`}>
                                            <i className='bi bi-person'></i>
                                        </span>
                                    </div>

                                    <div className="d-flex flex-column">
                                        <h6 className='mb-0 mt-3'>{paciente?.nome_paciente}</h6>
                                        <p>{idade} <span>•</span> {paciente?.tipo_sanguineo} {paciente?.fator_rh}</p>
                                    </div>
                                </div>

                                <div className='mt-3 mt-md-0'>
                                    <TagStatus status={paciente?.status_paciente} />
                                </div>
                            </div>



                            <div className="card-button-group">
                                <div className="tabs-container">
                                    <button
                                        className={`tab-item ${activeTab === "dados" ? "active" : ""}`}
                                        onClick={() => setActiveTab("dados")}
                                    >
                                        Dados do Paciente
                                    </button>

                                    <button
                                        className={`tab-item ${activeTab === "prescricoes" ? "active" : ""}`}
                                        onClick={() => setActiveTab("prescricoes")}
                                    >
                                        Prescrições
                                    </button>

                                    <button
                                        className={`tab-item ${activeTab === "cuidados" ? "active" : ""}`}
                                        onClick={() => setActiveTab("cuidados")}
                                    >
                                        Cuidados de Enfermagem
                                    </button>
                                </div>

                                <div className="tab-content mt-2 card-body p-4">

                                    {activeTab === "dados" && (
                                        <div>
                                            <div className='row g-4'>

                                                <div className='col-12 col-md-6'>
                                                    <div className='row g-3'>

                                                        <div className='col-12'>
                                                            <h6 className='fw-semibold'>Nome Completo</h6>
                                                            <span className='text-muted'>{paciente?.nome_paciente}</span>
                                                        </div>

                                                        <div className='col-12'>
                                                            <h6 className='fw-semibold'>Data de Nascimento</h6>
                                                            <span className='text-muted'>{formatarDataBR(paciente?.data_nasc)} • {idade} anos</span>
                                                        </div>

                                                        <div className='col-12 mt-md-5'>
                                                            <h6>Equipe Responsável</h6>
                                                            <span className='text-muted'>{paciente?.equipe}</span>
                                                            <p className='text-muted'>Equipe multiprofissional responsável pelo cuidado integral.</p>
                                                        </div>

                                                        <div className='col-12'>
                                                            <h6 className='fw-semibold'>Localização</h6>
                                                            <span className='text-muted'>Quarto {paciente?.quarto} - Leito {paciente?.leito}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='col-12 col-md-6'>
                                                    <div className='row g-3'>

                                                        <div className='col-12'>
                                                            <h6 className='fw-semibold'>Nome da Mãe</h6>
                                                            <span className='text-muted'>{paciente?.mae_paciente}</span>
                                                        </div>

                                                        <div className='col-12'>
                                                            <h6 className='fw-semibold'>Tipo Sanguíneo / RH</h6>
                                                            <span className='text-muted'>{paciente?.tipo_sanguineo} {paciente?.fator_rh}</span>
                                                            <p className='text-muted'>Importante para transfusões e compatibilidade sanguínea.</p>
                                                        </div>

                                                        <div className='col-12'>
                                                            <h6 className='fw-semibold'>Setor</h6>
                                                            <span className='text-muted'>{paciente?.nome_setor}</span>
                                                        </div>

                                                        <div className='col-12 mt-5'>
                                                            <h6>Convênio</h6>
                                                            <span className='text-muted'>{paciente?.convenio}</span>

                                                        </div>

                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "prescricoes" && (
                                        <div>

                                            <div>
                                                <button className='btn btn-primary d-flex align-items-center gap-2'
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#modalCriarPrescricao"
                                                >
                                                    <i className='bi bi-plus fs-5 text-white'></i>
                                                    Nova Prescrição
                                                </button>
                                            </div>

                                            {prescricoesRegistradas.length === 0 && (
                                                <div className='mt-3 p-2 pb-3 text-muted'>

                                                    <span className='d-flex align-items-center gap-2 justify-content-center'>
                                                        Nenhuma prescrição registrada
                                                        <i className="bi bi-file-medical text-muted"></i>
                                                    </span>

                                                </div>
                                            )}

                                            {prescricoesRegistradas.map((p, index) => (

                                                <div className='mt-3' key={index}>
                                                    <div className='border rounded-2 p-3'>
                                                        <div className='d-flex justify-content-between align'>
                                                            <div>
                                                                <h6>Prescrição criada por Dr. Eduardo Beretta</h6>
                                                                <span>No dia 03/03/2026, às 16:00</span>
                                                            </div>

                                                        </div>

                                                        <div className='border rounded-2 p-3 mt-3'>
                                                            <div className='d-flex flex-column flex-md-row justify-content-between'>


                                                                <div className='row g-2'>
                                                                    <div className='col-12'>
                                                                        <h6>Medicamento:
                                                                            <span className='text-muted fw-normal'> {p.medicamento}</span>
                                                                        </h6>
                                                                    </div>

                                                                    <div className='col-12'>
                                                                        <h6>Dosagem:
                                                                            <span className='text-muted fw-normal'> {p.dosagem} / {p.unidade}</span>
                                                                        </h6>
                                                                    </div>

                                                                    <div className='col-12'>
                                                                        <h6>Via:
                                                                            <span className='text-muted fw-normal'> {p.via}</span>
                                                                        </h6>
                                                                    </div>

                                                                    <div className='col-12'>
                                                                        <h6>Observações:
                                                                            <span className='text-muted fw-normal'> {p.observacaoPrescricao}</span>
                                                                        </h6>
                                                                    </div>
                                                                </div>


                                                                <div className='mt-3 mt-md-0 text-md-end'>
                                                                    <h6>Frequência: <span className='text-muted fw-normal'>{p.frequencia}/{p.frequencia}hr</span></h6>
                                                                </div>

                                                            </div>

                                                            <div className="mt-3">

                                                                {p.horarios.map((h, i) => (

                                                                    <div key={i} className="d-flex justify-content-between align-items-center border rounded p-2 mt-2">

                                                                        <div className="d-flex flex-column">
                                                                            <span className="fw-semibold">{h.hora}</span>
                                                                            <span className="small text-muted">{h.data}</span>
                                                                        </div>

                                                                        <div className="grupo-validacao">

                                                                            <input
                                                                                type="radio"
                                                                                className="btn-check"
                                                                                name={`horario-${index}-${i}`}
                                                                                id={`ok-${index}-${i}`}
                                                                                checked={h.status === "ok"}
                                                                                onChange={() => alterarStatusHorario(index, i, "ok")}
                                                                            />
                                                                            <label className="btn-validacao sucesso" htmlFor={`ok-${index}-${i}`}>
                                                                                <i className="bi bi-check2"></i>
                                                                            </label>


                                                                            <input
                                                                                type="radio"
                                                                                className="btn-check"
                                                                                name={`horario-${index}-${i}`}
                                                                                id={`recusado-${index}-${i}`}
                                                                                checked={h.status === "recusado"}
                                                                                onChange={() => alterarStatusHorario(index, i, "recusado")}
                                                                            />
                                                                            <label className="btn-validacao negadoPorPaciente" htmlFor={`recusado-${index}-${i}`}>
                                                                                <i className="bi bi-circle"></i>
                                                                            </label>


                                                                            <input
                                                                                type="radio"
                                                                                className="btn-check"
                                                                                name={`horario-${index}-${i}`}
                                                                                id={`negado-${index}-${i}`}
                                                                                checked={h.status === "negado"}
                                                                                onChange={() => alterarStatusHorario(index, i, "negado")}
                                                                            />
                                                                            <label className="btn-validacao negado" htmlFor={`negado-${index}-${i}`}>
                                                                                <i className="bi bi-x-lg"></i>
                                                                            </label>

                                                                        </div>

                                                                    </div>

                                                                ))}

                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                        </div>
                                    )}

                                    {activeTab === "cuidados" && (
                                        <div>
                                            <div>
                                                <button className='btn btn-primary d-flex align-items-center gap-2'
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#modalCriarCuidado"
                                                >
                                                    <i className='bi bi-plus fs-5 text-white'></i>
                                                    Registrar Cuidado
                                                </button>
                                            </div>


                                            {cuidadosPaciente.length === 0 && (

                                                <div className='mt-3 p-2 pb-3 text-muted'>

                                                    <span className='d-flex align-items-center gap-2 justify-content-center'>
                                                        Nenhum cuidado registrado
                                                        <i className="bi bi-heart-pulse text-muted"></i>
                                                    </span>

                                                </div>
                                            )}


                                            {cuidadosPaciente.map((cuiRe, index) => (
                                                <div className='mt-3' key={index}>
                                                    <div className="border rounded-2 p-3">

                                                        <div className="d-flex justify-content-between align-items-center">

                                                            {/* Lado esquerdo */}
                                                            <div className="d-flex align-items-start gap-3">

                                                                <span className="icone-cuidados-registrados">
                                                                    <i className="bi bi-heart-pulse text-primary"></i>
                                                                </span>

                                                                <div>
                                                                    <h6 className="mb-1">{cuiRe.tipo_cuidado}</h6>
                                                                    <span id="descricao-cuidado" className="text-muted small">
                                                                        {cuiRe.observacao}
                                                                    </span>
                                                                </div>

                                                            </div>

                                                            {/* Lado direito */}
                                                            <div className='d-flex align-items-start justify-content-end gap-3'>
                                                                <div className="d-flex flex-column align-items-end gap-2">

                                                                    <div className="grupo-validacao">

                                                                        <input
                                                                            type="radio"
                                                                            className="btn-check"
                                                                            name={`validadoOpcoesCuidado-${index}`}
                                                                            id={`validado-okCuidado-${index}`}
                                                                            checked={cuiRe.status_id === 2}
                                                                            onChange={() => alterarStatusCuidado(cuiRe.id, 2)}
                                                                        />
                                                                        <label
                                                                            className="btn-validacao sucesso"
                                                                            htmlFor={`validado-okCuidado-${index}`}
                                                                        >
                                                                            <i className="bi bi-check2"></i>
                                                                        </label>


                                                                        <input
                                                                            type="radio"
                                                                            className="btn-check"
                                                                            name={`validadoOpcoesCuidado-${index}`}
                                                                            id={`validado-negadoPorPacienteCuidado-${index}`}
                                                                            checked={cuiRe.status_id === 4}
                                                                            onChange={() => alterarStatusCuidado(cuiRe.id, 4)}
                                                                        />
                                                                        <label
                                                                            className="btn-validacao negadoPorPaciente"
                                                                            htmlFor={`validado-negadoPorPacienteCuidado-${index}`}
                                                                        >
                                                                            <i className="bi bi-circle"></i>
                                                                        </label>


                                                                        <input
                                                                            type="radio"
                                                                            className="btn-check"
                                                                            name={`validadoOpcoesCuidado-${index}`}
                                                                            id={`validado-negadoCuidado-${index}`}
                                                                            checked={cuiRe.status_id === 3}
                                                                            onChange={() => alterarStatusCuidado(cuiRe.id, 3)}
                                                                        />
                                                                        <label
                                                                            className="btn-validacao negado"
                                                                            htmlFor={`validado-negadoCuidado-${index}`}
                                                                        >
                                                                            <i className="bi bi-x-lg"></i>
                                                                        </label>

                                                                    </div>

                                                                    <span className="text-muted small">
                                                                        {formatarDataBR(cuiRe.created_at)}
                                                                    </span>


                                                                </div>
                                                                <button type='button' className='btn btn-sm' title="Deletar cuidado">
                                                                    <i className='bi bi-trash text-danger'></i>
                                                                </button>
                                                            </div>

                                                        </div>

                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                </div>
                            </div>



                        </div>
                    </div>

                </div>
            </section>
        </>
    )
}

export default Prontuario