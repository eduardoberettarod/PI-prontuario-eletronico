import React from 'react'
import { useState } from "react";
import './Pacientes.css'
import TagStatus from '../../components/Tag/TagStatus'

const Pacientes = () => {

    const [ativo, setAtivo] = useState(false);

    return (
        <section id='pacientes-page-section'>


            {/* Modal */}
            <div className="modal fade" id="modalCriarPaciente" tabIndex="-1" aria-hidden='true'>
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">

                        <div className="modal-header">
                            <div className='p-2'>
                                <h5 className="modal-title">Novo Paciente</h5>
                                <p className='small opacity-75'>Preencha os dados do paciente para fins educacionais</p>
                            </div>
                            <button
                                type="button"
                                className="btn-close mb-5"
                                data-bs-dismiss="modal"
                            ></button>
                        </div>

                        <div className="modal-body">
                            <form className='row g-3'>

                                <div className='col-12'>
                                    <label className='form-label'>Nome do Paciente *</label>
                                    <input type="text" className='form-control' />
                                </div>

                                <div className='col-12'>
                                    <label className='form-label'>Nome da Mãe *</label>
                                    <input type="text" className='form-control' />
                                </div>

                                <div className='col-md-6'>
                                    <label className='form-label'>Data de Nascimento *</label>
                                    <input type="date" className='form-control' />
                                </div>

                                <div className='col-md-4'>
                                    <label className='form-label'>Tipo Sanguíneo *</label>
                                    <select className='form-select'>
                                        <option value={'A'}>A</option>
                                        <option value={'B'}>B</option>
                                        <option value={'AB'}>AB</option>
                                        <option value={'O'}>O</option>
                                    </select>
                                </div>

                                <div className='col-md-2'>
                                    <label className='form-label'>Fator RH *</label>
                                    <select className='form-select'>
                                        <option value={'-'}>+</option>
                                        <option value={'-'}>-</option>
                                    </select>
                                </div>

                                <div className='col-12'>
                                    <label className='form-label'>Equipe *</label>
                                    <input type="text" className='form-control' placeholder='Ex: Equipe Azul - Clínica Médica' />
                                    <p className='small mt-1 opacity-50'>A equipe representa o grupo multiprofissional responsável pelo cuidado ao paciente</p>
                                </div>

                                <div className='col-md-6'>
                                    <label className='form-label'>Status do Paciente *</label>
                                    <select className='form-select'>
                                        <option value="estavel">Estável</option>
                                        <option value="observacao">Em Observação</option>
                                        <option value="critico">Crítico</option>
                                    </select>
                                    <p className='small mt-1 opacity-50'>Define o nível de atenção necessário para o paciente</p>
                                </div>

                                <div className='col-md-6'>
                                    <label className='form-label'>Convênio *</label>
                                    <input type="text" className='form-control'
                                        placeholder='Ex: SUS, Unimed, etc.' />
                                </div>

                                <div className='col-md-3'>
                                    <label className='form-label'>Quarto *</label>
                                    <input type="text" className='form-control'
                                        placeholder='Ex: 201' />
                                </div>

                                <div className='col-md-3'>
                                    <label className='form-label'>Leito *</label>
                                    <input type="text" className='form-control' placeholder='Ex: A' />
                                </div>

                            </form>
                        </div>

                        <div className="modal-footer mt-2">
                            <button
                                className="btn btn-outline-danger"
                                data-bs-dismiss="modal"
                            >
                                Cancelar
                            </button>
                            <button className="btn btn-primary">
                                Criar Paciente
                            </button>
                        </div>

                    </div>
                </div>
            </div>


            <div className='container-pacientes'>

                <div className="d-flex flex-column flex-md-row mb-3 align-items-start align-items-md-center justify-content-md-between">

                    <div className="text-start mb-2 mb-md-0">
                        <h2 className="fw-bold">Gestão de Pacientes</h2>
                        <p>Crie e gerencie pacientes fictícios para o aprendizado</p>
                    </div>

                    <div className="d-flex justify-content-md-end container-action-btn">
                        <button className="btn btn-primary d-flex align-items-center gap-2 header-action-btn" data-bs-toggle="modal" data-bs-target='#modalCriarPaciente'>
                            <i className="bi bi-plus fs-5"></i>
                            Novo Paciente
                        </button>
                    </div>
                </div>

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
                            className={`btn btn-filter ${ativo ? "bg-primary text-white" : "btn-outline-primary text-dark"
                                }`}
                            onClick={() => setAtivo(!ativo)}
                            data-bs-toggle="collapse"
                            data-bs-target="#FormularioFiltro"
                            aria-expanded={ativo}
                            aria-controls="FormularioFiltro"
                        >
                            <i className="bi bi-funnel fs-5 me-1"></i>
                            Filtros
                        </button>



                    </form>

                    {/* Collapse */}
                    <div class="collapse" id="FormularioFiltro">
                        <form className='row g-3 form-control d-flex mt-3 m-0'>

                            <div className='col-md-4'>
                                <label className='form-label'>Status do Paciente</label>
                                <select className='form-select'>
                                    <option disabled>Todos os status</option>
                                    <option value={'estavel'}>Estável</option>
                                    <option value={'observacao'}>Em Observação</option>
                                    <option value={'critico'}>Crítico</option>
                                </select>
                            </div>

                            <div className='col-md-4'>
                                <label className='form-label'>Equipe</label>
                                <select className='form-select'>
                                    <option disabled>Todas as Equipes</option>
                                    <option value={'ClinicaMedica'}>Equipe Azul - Clínica Médica</option>
                                    <option value={'Cardologia'}>Equipe Verde - Cardologia</option>
                                    <option value={'UTI'}>Equipe Vermelha - UTI</option>
                                </select>
                            </div>

                            <div className='col-md-4'>
                                <label className='form-label'>Convênio</label>
                                <select className='form-select'>
                                    <option disabled>Todos os convênios</option>
                                    <option value={'SUS'}>SUS</option>
                                    <option value={'Unimed'}>Unimed</option>
                                    <option value={'Particular'}>Particular</option>
                                </select>
                            </div>
                            <button type='button' className=' btn-Limparfiltro text-primary w-auto mt-3 mb-2'>
                                Limpar filtros
                            </button>
                        </form>
                    </div>

                </div>

            </div>



        </section>
    )
}

export default Pacientes
