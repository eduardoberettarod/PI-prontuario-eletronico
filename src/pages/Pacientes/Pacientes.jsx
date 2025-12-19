import React from 'react'
import './Pacientes.css'
import TagStatus from '../../components/Tag/TagStatus'

const Pacientes = () => {
    return (
        <section id='pacientes-page-section'>

            <div className='container-pacientes'>

                <div className="d-flex flex-column flex-md-row mb-3 align-items-start align-items-md-center justify-content-md-between">

                    <div className="text-start mb-2 mb-md-0">
                        <h2 className="fw-bold">Gestão de Pacientes</h2>
                        <p>Crie e gerencie pacientes fictícios para o aprendizado</p>
                    </div>

                    <div className="d-flex justify-content-md-end container-action-btn">
                        <button className="btn btn-primary d-flex align-items-center gap-2 header-action-btn">
                            <i className="bi bi-plus fs-5"></i>
                            Novo Paciente
                        </button>
                    </div>
                </div>

                <div>
                    <form class="d-flex flex-column flex-md-row gap-3" role="search">

                        <div class="position-relative w-100 d-flex">
                            <i class="bi bi-search position-absolute top-50 translate-middle-y ms-3 text-secondary"></i>
                            <input
                                type="text"
                                class="form-control input-search"
                                placeholder="Buscar por nome, equipe ou quarto..."
                            />
                        </div>

                        <button class="btn-filter" type="submit">
                            <i class="bi bi-funnel fs-5"></i> Filtros
                        </button>
                    </form>

                </div>

            </div>



        </section>
    )
}

export default Pacientes
