import { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

import * as bootstrap from 'bootstrap';

import Navbar from '../../components/Navbar/Navbar'
import TagStatus from '../../components/Tag/TagStatus'
import './Prontuario.css'

const Prontuario = () => {

    const [activeTab, setActiveTab] = useState("dados");
    const [validado, setValidado] = useState('')
    const [validadoCuidado, setValidadoCuidado] = useState('')
    const [tipoCuidado, setTipoCuidado] = useState("");

    const handleChangeCuidado = (event) => {
        setValidadoCuidado(event.target.value)
    }

    const handleChange = (event) => {
        setValidado(event.target.value)
    }

    const modalCriarPrescricao = useRef(null)


    // Modal e crição de novos Cuidados
    const modalCriarCuidado = useRef(null)
    const observacao = useRef(null)
    const tipoCuidadoRegistrado = useRef(null)

    const [cuidadosRegistrados, setCuidadosRegistrados] = useState([]);

    function fnAdicionarNovoCuidado() {

        const novoCuidado = {
            tipoCuidadoRegistrado: tipoCuidadoRegistrado.current.value,
            observacao: observacao.current.value
        };

        setCuidadosRegistrados(prev => [...prev, novoCuidado]);
    }

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
                                >

                                    <div className="col-12">
                                        <label className="form-label">Medicamento *</label>
                                        <select className='form-select' required>
                                            <option value="" disabled selected>Escolha um medicamento</option>
                                        </select>
                                        <div className="invalid-feedback">
                                            Informe um medicamento.
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label">Dosagem *</label>
                                        <input type="number" className="form-control" required
                                            placeholder='Ex: 500' />
                                        <div className="invalid-feedback">
                                            Informe a classe terapêutica.
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <label className="form-label">Unidade *</label>
                                        <select className="form-select" required>
                                            <option value="" disabled selected>Escolha a unidade</option>
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
                                        <input type="text" className='form-control' required placeholder='Ex: Oral' />
                                    </div>

                                    <div className='col-12'>
                                        <label className='form-label'>Frequência *</label>
                                        <select className="form-select" required>
                                            <option value="" disabled selected>Escolha a frequência</option>
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
                                            <option value="" disabled selected>Escolha um tipo de cuidado</option>
                                            <option value="outro">Outro</option>
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

                        <div className='card card-prontuario'>

                            <div className='card-header d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-md-between py-3 px-4'>

                                <div className='d-flex align-items-center gap-3'>
                                    <div>
                                        <span className='icone-prontuario'>
                                            <i className='bi bi-person'></i>
                                        </span>
                                    </div>

                                    <div className="d-flex flex-column">
                                        <h6 className='mb-0 mt-3'>Nome do Paciente</h6>
                                        <p>Idade <span>•</span> Tipo Sanguíneo</p>
                                    </div>
                                </div>

                                <div className='mt-3 mt-md-0'>
                                    <TagStatus status={'observacao'} />
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
                                                            <span className='text-muted'>Nome do Paciente</span>
                                                        </div>

                                                        <div className='col-12'>
                                                            <h6 className='fw-semibold'>Data de Nascimento</h6>
                                                            <span className='text-muted'>12/04/2008 • (17 anos)</span>
                                                        </div>

                                                        <div className='col-12 mt-md-5'>
                                                            <h6>Equipe Responsável</h6>
                                                            <span className='text-muted'>Equipe Azul - Clínica Médica</span>
                                                            <p className='text-muted'>Equipe multiprofissional responsável pelo cuidado integral.</p>
                                                        </div>

                                                        <div className='col-12'>
                                                            <h6 className='fw-semibold'>Localização</h6>
                                                            <span className='text-muted'>Quarto 201 - Leito A</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='col-12 col-md-6'>
                                                    <div className='row g-3'>

                                                        <div className='col-12'>
                                                            <h6 className='fw-semibold'>Nome da Mãe</h6>
                                                            <span className='text-muted'>Maria da Silva Santos</span>
                                                        </div>

                                                        <div className='col-12'>
                                                            <h6 className='fw-semibold'>Tipo Sanguíneo / RH</h6>
                                                            <span className='text-muted'>A +</span>
                                                            <p className='text-muted'>Importante para transfusões e compatibilidade sanguínea.</p>
                                                        </div>

                                                        <div className='col-12'>
                                                            <h6 className='fw-semibold'>Setor</h6>
                                                            <span className='text-muted'>Maternidade</span>
                                                        </div>

                                                        <div className='col-12'>
                                                            <h6>Convênio</h6>
                                                            <span className='text-muted'>SUS</span>

                                                        </div>

                                                        <div className='col-12 text-end small'>
                                                            <span className='fw-semibold'> Cadastrado por:
                                                                <span className='text-muted fw-normal'> Dr. Eduardo Beretta</span>
                                                            </span>
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
                                                    <i className='bi bi-plus fs-5'></i>
                                                    Nova Prescrição
                                                </button>
                                            </div>

                                            <div className='mt-3'>
                                                <div className='border rounded-2 p-3'>
                                                    <div className='d-flex justify-content-between align'>
                                                        <div>
                                                            <h6>Prescrição criada por Dr. Eduardo Beretta</h6>
                                                            <span>No dia 03/03/2026, às 16:00</span>
                                                        </div>

                                                        <div className="grupo-validacao">

                                                            <input
                                                                type="radio"
                                                                className="btn-check"
                                                                name="validadoOpcoes"
                                                                id="validado-ok"
                                                                value="validado1"
                                                                checked={validado === 'validado1'}
                                                                onChange={handleChange}
                                                            />
                                                            <label className="btn-validacao sucesso" htmlFor="validado-ok">
                                                                <i className="bi bi-check2"></i>
                                                            </label>


                                                            <input
                                                                type="radio"
                                                                className="btn-check"
                                                                name="validadoOpcoes"
                                                                id="validado-pendente"
                                                                value="validado2"
                                                                checked={validado === 'validado2'}
                                                                onChange={handleChange}
                                                            />
                                                            <label className="btn-validacao pendente" htmlFor="validado-pendente">
                                                                <i className="bi bi-circle"></i>
                                                            </label>


                                                            <input
                                                                type="radio"
                                                                className="btn-check"
                                                                name="validadoOpcoes"
                                                                id="validado-negado"
                                                                value="validado3"
                                                                checked={validado === 'validado3'}
                                                                onChange={handleChange}
                                                            />
                                                            <label className="btn-validacao negado" htmlFor="validado-negado">
                                                                <i className="bi bi-x-lg"></i>
                                                            </label>

                                                        </div>

                                                    </div>

                                                    <div className='border rounded-2 p-3 mt-3'>
                                                        <div className='d-flex flex-column flex-md-row justify-content-between'>

                                                            {/* Lado esquerdo */}
                                                            <div className='row g-2'>
                                                                <div className='col-12'>
                                                                    <h6>Medicamento:
                                                                        <span className='text-muted fw-normal'> Dipirona</span>
                                                                    </h6>
                                                                </div>

                                                                <div className='col-12'>
                                                                    <h6>Dosagem:
                                                                        <span className='text-muted fw-normal'> 500 / mg</span>
                                                                    </h6>
                                                                </div>

                                                                <div className='col-12'>
                                                                    <h6>Via:
                                                                        <span className='text-muted fw-normal'> Oral</span>
                                                                    </h6>
                                                                </div>

                                                                <div className='col-12'>
                                                                    <h6>Observações:
                                                                        <span className='text-muted fw-normal'> Se houver dor ou febre</span>
                                                                    </h6>
                                                                </div>
                                                            </div>

                                                            {/* Lado direito */}
                                                            <div className='mt-3 mt-md-0 text-md-end'>
                                                                <h6>Frequência: <span className='text-muted fw-normal'>24/24h</span></h6>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "cuidados" && (
                                        <div>
                                            <div>
                                                <button className='btn btn-primary d-flex align-items-center gap-2'
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#modalCriarCuidado"
                                                >
                                                    <i className='bi bi-plus fs-5'></i>
                                                    Registrar Cuidado
                                                </button>
                                            </div>


                                            {cuidadosRegistrados.length === 0 && (

                                                <div className='mt-3 p-2 pb-3 text-muted'>

                                                    <span className='d-flex align-items-center gap-2 justify-content-center'>
                                                        Nenhum cuidado registrado
                                                        <i className="bi bi-heart-pulse"></i>
                                                    </span>

                                                </div>
                                            )}


                                            {cuidadosRegistrados.map((cuiRe, index) => (
                                                <div className='mt-3' key={index}>
                                                    <div className="border rounded-2 p-3">

                                                        <div className="d-flex justify-content-between align-items-center">

                                                            {/* Lado esquerdo */}
                                                            <div className="d-flex align-items-start gap-3">

                                                                <span className="icone-cuidados-registrados">
                                                                    <i className="bi bi-heart-pulse"></i>
                                                                </span>

                                                                <div>
                                                                    <h6 className="mb-1">{cuiRe.tipoCuidadoRegistrado}</h6>
                                                                    <span id="descricao-cuidado" className="text-muted small">
                                                                        {cuiRe.observacao}
                                                                    </span>
                                                                </div>

                                                            </div>


                                                            {/* Lado direito */}
                                                            <div className="d-flex flex-column align-items-end gap-2">

                                                                <div className="grupo-validacao">

                                                                    <input
                                                                        type="radio"
                                                                        className="btn-check"
                                                                        name="validadoOpcoesCuidado"
                                                                        id="validado-okCuidado"
                                                                        value="validadoCuidado1"
                                                                        checked={validadoCuidado === 'validadoCuidado1'}
                                                                        onChange={handleChangeCuidado}
                                                                    />
                                                                    <label className="btn-validacao sucesso" htmlFor="validado-okCuidado">
                                                                        <i className="bi bi-check2"></i>
                                                                    </label>


                                                                    <input
                                                                        type="radio"
                                                                        className="btn-check"
                                                                        name="validadoOpcoesCuidado"
                                                                        id="validado-pendenteCuidado"
                                                                        value="validadoCuidado2"
                                                                        checked={validadoCuidado === 'validadoCuidado2'}
                                                                        onChange={handleChangeCuidado}
                                                                    />
                                                                    <label className="btn-validacao pendente" htmlFor="validado-pendenteCuidado">
                                                                        <i className="bi bi-circle"></i>
                                                                    </label>


                                                                    <input
                                                                        type="radio"
                                                                        className="btn-check"
                                                                        name="validadoOpcoesCuidado"
                                                                        id="validado-negadoCuidado"
                                                                        value="validadoCuidado3"
                                                                        checked={validadoCuidado === 'validadoCuidado3'}
                                                                        onChange={handleChangeCuidado}
                                                                    />
                                                                    <label className="btn-validacao negado" htmlFor="validado-negadoCuidado">
                                                                        <i className="bi bi-x-lg"></i>
                                                                    </label>

                                                                </div>

                                                                <span className="text-muted small">
                                                                    03/03/2026, 19:38
                                                                </span>

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
