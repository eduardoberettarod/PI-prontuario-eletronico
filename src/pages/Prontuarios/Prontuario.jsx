import { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import TagStatus from '../../components/Tag/TagStatus'
import './Prontuario.css'
import { NavLink } from 'react-router-dom'

const Prontuario = () => {

    const [activeTab, setActiveTab] = useState("dados");

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
                                        <p>17 anos <span>•</span> A+</p>
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
                                                            <h6 className='fw-semibold'>Nome do Responsável</h6>
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
                                                    <div>
                                                        <h6>Prescrição criada por Dr. Eduardo Beretta</h6>
                                                        <span>No dia 03/03/206, as 16:00</span>
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
                                            <h6>Cuidados de Enfermagem</h6>
                                            <p>Monitorar pressão arterial</p>
                                            <p>Controle de glicemia</p>
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
