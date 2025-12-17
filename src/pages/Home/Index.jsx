import React from 'react'
import './Index.css'

const Index = () => {
    return (
        <>
            <section id='home-page-section'>

                <div className='container-home'>
                    <div className='text-start'>
                        <h1>
                            Boa noite, Dr. Eduardo!
                        </h1>
                        <p className='opacity-75'>Sexta-Feira, 17 de novembro de dezembro de 2025</p>
                    </div>

                    <div className="row g-3">
                        {/* card de pacientes ativos */}
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className='card shadow-lg p-4 h-100'>
                                <span className='icon-pacientes-card rounded-2'>
                                    <i className='bi bi-people text-primary fs-4'></i>
                                </span>
                                <p className='mb-0 fw-bold mt-3'>Pacientes Ativos:</p>
                                <p className='mt-1'>3</p>
                                <p className='mt-3'><span className='text-danger'>1 crítico</span> • <span className='text-warning'>1 em observação</span></p>
                            </div>
                        </div>

                        {/* card das prescrições */}
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className='card shadow-lg p-4 h-100'>
                                <span className='icon-prescricoes-card rounded-2'>
                                    <i className='bi bi-journal-medical text-success fs-4'></i>
                                </span>
                                <p className='mb-0 fw-bold mt-3'>Prescrições:</p>
                                <p className='mt-1'>0</p>
                            </div>
                        </div>

                        {/* card de cuidados registrados */}
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className='card shadow-lg p-4 h-100'>
                                <span className='icon-registros-card rounded-2'>
                                    <i className='bi bi-clipboard-check fs-4'></i>
                                </span>
                                <p className='mb-0 fw-bold mt-3'>Cuidados Registrados:</p>
                                <p className='mt-1'>0</p>
                            </div>
                        </div>

                        {/* card de relatorios escritos pelo usuario */}
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className='card shadow-lg p-4 h-100'>
                                <span className='icon-relatorios-card rounded-2'>
                                    <i className='bi bi-clipboard fs-4'></i>
                                </span>
                                <p className='mb-0 fw-bold mt-3'>Meus Relatórios:</p>
                                <p className='mt-1'>0</p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </>
    )
}

export default Index
