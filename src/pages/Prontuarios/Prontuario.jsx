import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import * as bootstrap from 'bootstrap';

import Navbar from '../../components/Navbar/Navbar'
import TagStatus from '../../components/Tag/TagStatus'
import './Prontuario.css'

const Prontuario = () => {

    const [activeTab, setActiveTab] = useState("dados");
    const [validado, setValidado] = useState('validado1')

    const handleChange = (event) => {
        setValidado(event.target.value)
    }

    return (
        <>

            <Navbar />
            <section id='prontuario-page-section'>
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
                                                            <h6>Convênio</h6>
                                                            <span className='text-muted'>SUS</span>

                                                        </div>

                                                        <div className='col-12 mt-md-5'>
                                                            <h6 className='fw-semibold'>Cadastrado por</h6>
                                                            <span className='text-muted'>Dr. Eduardo Beretta</span>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "prescricoes" && (
                                        <div>

                                            <div>
                                                <button className='btn btn-primary d-flex align-items-center gap-2'>
                                                    <i className='bi bi-plus fs-5'></i>
                                                    Nova Prescrição
                                                </button>
                                            </div>

                                            <div className='mt-3'>
                                                <div className='border rounded-2 p-3'>
                                                    <div className='d-flex justify-content-between align'>
                                                        <div>
                                                            <h6>Prescrição criada por Dr. Eduardo Beretta</h6>
                                                            <span>No dia 03/03/206, as 16:00</span>
                                                        </div>

                                                        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                                                            <input type="radio"
                                                                className="btn-check"
                                                                name="validadoOpcoes"
                                                                id="btnradio1"
                                                                value={'validado1'}
                                                                checked={validado === 'validado1'}
                                                                onChange={handleChange}
                                                            />
                                                            <label className="btn btn-outline-success d-flex align-items-center justify-content-center" htmlFor="btnradio1">
                                                                <i className='bi bi-check2'></i>
                                                            </label>

                                                            <input type="radio"
                                                                className="btn-check"
                                                                name="validadoOpcoes"
                                                                id="btnradio2"
                                                                value={'validado2'}
                                                                checked={validado === 'validado2'}
                                                                onChange={handleChange}
                                                            />
                                                            <label className="btn btn-outline-warning d-flex align-items-center justify-content-center" htmlFor="btnradio2">
                                                                <i className='bi bi-circle'></i>
                                                            </label>

                                                            <input type="radio"
                                                                className="btn-check"
                                                                name="validadoOpcoes"
                                                                id="btnradio3"
                                                                value={'validado3'}
                                                                checked={validado === 'validado3'}
                                                                onChange={handleChange}
                                                            />
                                                            <label className="btn btn-outline-danger d-flex align-items-center justify-content-center" htmlFor="btnradio3">
                                                                <i className='bi bi-x-lg'></i>
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
                                                <button className='btn btn-primary d-flex align-items-center gap-2'>
                                                    <i className='bi bi-plus fs-5'></i>
                                                    Registrar Cuidado
                                                </button>
                                            </div>


                                            {/* Usar essa div para caso nao tenha nenhum cuidado registrado */}

                                            {/* <div className='mt-3 p-2 pb-3 text-muted'>

                                                <span className='d-flex align-items-center gap-2 justify-content-center'>
                                                    Nenhum cuidado registrado
                                                    <i className="bi bi-heart-pulse"></i>
                                                </span>

                                            </div> */}

                                            <div className='mt-3'>
                                                <div className='border rounded-2 p-3'>

                                                    <div className='d-flex justify-content-between align-items-center'>

                                                        <div className='d-flex align-items-center gap-3'>
                                                            <div>
                                                                <span className='icone-cuidados-registrados'>
                                                                    <i className="bi bi-heart-pulse"></i>
                                                                </span>
                                                            </div>

                                                            <div>
                                                                <h6>Tipo de cuidado</h6>
                                                                <span id='descricao-cuidado' className='text-muted'>Aplicar quando houver dor.</span>
                                                            </div>

                                                        </div>


                                                        <div>
                                                            <p className='text-muted'>03/03/2026, 19:38</p>
                                                        </div>

                                                    </div>

                                                </div>
                                            </div>

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
