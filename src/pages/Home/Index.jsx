import React from 'react'
import './Index.css'
import TagStatus from '../../components/Tag/TagStatus';

const Index = () => {

    const paciente = {
        nome: "João",
        estado: "critico"
    }


    const nomesDias = [
        "Domingo",
        "Segunda-Feira",
        "Terça-Feira",
        "Quarta-Feira",
        "Quinta-Feira",
        "Sexta-Feira",
        "Sábado",
    ];

    const diaSemana = nomesDias[new Date().getDay()];
    const hoje = new Date();

    const dia = hoje.getDate();
    const meses = [
        "janeiro", "fevereiro", "março", "abril", "maio", "junho",
        "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ];
    const mes = meses[hoje.getMonth()];
    const ano = hoje.getFullYear();

    return (

        <>
            <section id='home-page-section'>

                <div className='container-home'>
                    <div className='text-start'>
                        <h1>
                            Boa noite, Dr. Eduardo!
                        </h1>
                        <p className='opacity-75'>{diaSemana}, {dia} de {mes} de {ano}</p>
                    </div>

                    <div className="row g-3">
                        {/* card de pacientes ativos */}
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className='card shadow p-4 h-100'>
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
                            <div className='card shadow p-4 h-100'>
                                <span className='icon-prescricoes-card rounded-2'>
                                    <i className='bi bi-journal-medical text-success fs-4'></i>
                                </span>
                                <p className='mb-0 fw-bold mt-3'>Prescrições:</p>
                                <p className='mt-1'>0</p>
                            </div>
                        </div>

                        {/* card de cuidados registrados */}
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className='card shadow p-4 h-100'>
                                <span className='icon-registros-card rounded-2'>
                                    <i className='bi bi-clipboard-check fs-4'></i>
                                </span>
                                <p className='mb-0 fw-bold mt-3'>Cuidados Registrados:</p>
                                <p className='mt-1'>0</p>
                            </div>
                        </div>

                        {/* card de relatorios escritos pelo usuario */}
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className='card shadow p-4 h-100'>
                                <span className='icon-relatorios-card rounded-2'>
                                    <i className='bi bi-clipboard fs-4'></i>
                                </span>
                                <p className='mb-0 fw-bold mt-3'>Meus Relatórios:</p>
                                <p className='mt-1'>0</p>
                            </div>
                        </div>
                    </div>

                    <div className='row g-3 mt-4'>

                        {/* Card de ultimos acessos */}
                        <div className='col-12 col-md-8'>
                            <div className='list-group shadow h-100'>
                                <div className='list-group-item p-3'>
                                    <p className='fw-bold mb-0 fs-6 ms-2 mt-2'>Últimos Acessos</p>
                                    <p className='card-subtitle opacity-75 mt-0 ms-2'>Pacientes acessados recentemente</p>
                                </div>

                                <a href="" className='list-group-item d-flex align-items-center gap-3 a-card-home'>
                                    <span className='a-card-home-icon'><i className='bi bi-person text-primary'></i></span>
                                    <div className='p-2 w-75'>

                                        <p className='fw-bold mb-0'>Carlos da Silva Santos</p>

                                        <p className='opacity-75 m-0 a-card-home-subtitle'>Quarto 201/A • Equipe Azul</p>

                                    </div>
                                    <span className='position-relative align-items-end ms-3'>
                                        <TagStatus status="critico" />
                                    </span>
                                </a>

                                <a href="" className='list-group-item d-flex align-items-center gap-3 a-card-home'>
                                    <span className='a-card-home-icon'><i className='bi bi-person text-primary'></i></span>
                                    <div className='p-2 w-75'>
                                        <p className='fw-bold mb-0'>Carlos da Silva Santos</p>
                                        <p className='opacity-75 m-0'>Quarto 201/A • Equipe Azul</p>
                                    </div>
                                    <span className='position-relative align-items-end ms-3'>
                                        <TagStatus status="estavel" />
                                    </span>
                                </a>

                                <a href="" className='list-group-item d-flex align-items-center gap-3 a-card-home h-100'>
                                    <span className='a-card-home-icon'><i className='bi bi-person text-primary'></i></span>
                                    <div className='p-2 w-75'>

                                        <p className='fw-bold mb-0'>Carlos da Silva Santos</p>

                                        <p className='opacity-75 m-0'>Quarto 201/A • Equipe Azul</p>

                                    </div>
                                    <span className='position-relative align-items-end ms-3'>
                                        <TagStatus status="critico" />
                                    </span>
                                </a>
                            </div>
                        </div>

                        {/* Card de acesso rapido */}
                        <div className='col-12 col-md-4'>
                            <div className='list-group shadow h-100'>
                                <div className='list-group-item p-3'>
                                    <p className='fw-bold mb-0 fs-6 ms-2 mt-2'>Acesso Rápido</p>
                                    <p className='card-subtitle opacity-75 mt-0 ms-2'>Atalhos do sistema</p>
                                </div>

                                <button className="list-group-item d-flex align-items-center gap-3 button-card-home">
                                    <span><i className="bi bi-person-plus"></i></span>
                                    Registrar paciente
                                </button>

                                <button className="list-group-item d-flex align-items-center gap-3 button-card-home">
                                    <span><i className="bi bi-file-earmark-medical"></i></span>
                                    Criar prescrição
                                </button>

                                <button className="list-group-item d-flex align-items-center gap-3 button-card-home">
                                    <span><i className="bi bi-clipboard-plus"></i></span>
                                    Criar relatório
                                </button>

                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}

export default Index
