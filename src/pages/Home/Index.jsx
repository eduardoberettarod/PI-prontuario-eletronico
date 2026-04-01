import React, { useEffect, useState } from 'react'
import './Index.css'
import { NavLink } from "react-router-dom";
import TagStatus from '../../components/Tag/TagStatus';
import Navbar from '../../components/Navbar/Navbar';
import { useAuth } from '../../components/AuthContext/AuthContext';
import { urlServer } from '../../../config';
import Loader from '../../components/Loader/Loader';

const Index = () => {

    const [usuarios, setUsuarios] = useState([]);
    const [totalPrescricoes, setTotalPrescricoes] = useState(0);
    const [totalCuidados, setTotalCuidados] = useState(0);
    const [totalRelatorios, setTotalRelatorios] = useState(0);

    const mapa = Object.fromEntries(
        usuarios.map(u => [u.status_paciente, u.total])
    );

    const estavel = mapa.estavel || 0;
    const observacao = mapa.observacao || 0;
    const critico = mapa.critico || 0;

    const totalPacientes = estavel + observacao + critico;

    function fnCarregarQuantPaciente() {
        fetch(`${urlServer}/pacientes/count`, {
            method: 'GET',
            credentials: 'include'
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
                setUsuarios(dados)
            })
            .catch(erro => console.log(erro.message))
    }

    function fnCarregarQuantPrescricoes() {
        fetch(`${urlServer}/prescricoes/count`, {
            method: 'GET',
            credentials: 'include'
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
                setTotalPrescricoes(dados.total)
            })
            .catch(erro => console.log(erro.message))
    }

    function fnCarregarQuantCuidados() {
        fetch(`${urlServer}/paciente-cuidados/count`, {
            method: 'GET',
            credentials: 'include'
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
                setTotalCuidados(dados.total)
            })
            .catch(erro => console.log(erro.message))
    }

    function fnCarregarQuantRelatorios() {
        fetch(`${urlServer}/relatorios/count`, {
            method: 'GET',
            credentials: 'include'
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
                setTotalRelatorios(dados.total)
            })
            .catch(erro => console.log(erro.message))
    }

    useEffect(() => {
        fnCarregarQuantRelatorios()
        fnCarregarQuantCuidados()
        fnCarregarQuantPaciente()
        fnCarregarQuantPrescricoes()
    }, [])




    const { usuario, verificandoAuth } = useAuth()
    if (verificandoAuth) {
        return <Loader />
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
            <Navbar />
            <section id='home-page-section'>

                <div className='container-home'>
                    <div className='text-start'>
                        <h1>
                            Boa noite, {usuario?.primeiro_nome || 'Usuário'}!
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
                                <p className='mt-1'>{totalPacientes}</p>
                                <p className='mt-3'>
                                    <span className='text-danger'>
                                        {critico} crítico
                                    </span> • <span className='text-warning'>
                                        {observacao} em observação
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* card das prescrições */}
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className='card shadow p-4 h-100'>
                                <span className='icon-prescricoes-card rounded-2'>
                                    <i className='bi bi-journal-medical text-success fs-4'></i>
                                </span>
                                <p className='mb-0 fw-bold mt-3'>Prescrições:</p>
                                <p className='mt-1'>{totalPrescricoes}</p>
                            </div>
                        </div>

                        {/* card de cuidados registrados */}
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className='card shadow p-4 h-100'>
                                <span className='icon-registros-card rounded-2'>
                                    <i className='bi bi-clipboard-check fs-4'></i>
                                </span>
                                <p className='mb-0 fw-bold mt-3'>Cuidados Registrados:</p>
                                <p className='mt-1'>{totalCuidados}</p>
                            </div>
                        </div>

                        {/* card de relatorios escritos pelo usuario */}
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className='card shadow p-4 h-100'>
                                <span className='icon-relatorios-card rounded-2'>
                                    <i className='bi bi-clipboard fs-4'></i>
                                </span>
                                <p className='mb-0 fw-bold mt-3'>Meus Relatórios:</p>
                                <p className='mt-1'>{totalRelatorios}</p>
                            </div>
                        </div>
                    </div>

                    <div className='row g-3 mt-4 container-cards-home'>

                        {/* Card de ultimos acessos */}
                        <div className='col-12 col-md-8'>
                            <div className='list-group shadow h-100'>
                                <div className='list-group-item p-3'>
                                    <p className='fw-bold mb-0 fs-6 ms-2 mt-2'>Últimos Acessos</p>
                                    <p className='card-subtitle opacity-75 mt-0 ms-2'>Pacientes acessados recentemente</p>
                                </div>

                                <a href="" className='list-group-item d-flex align-items-center gap-3 a-card-home'>
                                    <span className='a-card-home-icon'><i className='bi bi-person text-primary'></i></span>

                                    <div className='p-2 width-a-home'>
                                        <p className='fw-bold mb-0'>Carlos da Silva Santos</p>
                                        <p className='opacity-75 m-0'>Quarto 201/A • Equipe Azul</p>
                                    </div>

                                    <span className='position-absolute end-0 me-4'>
                                        <TagStatus status="critico" />
                                    </span>
                                </a>

                                <a href="" className='list-group-item d-flex align-items-center gap-3 a-card-home'>
                                    <span className='a-card-home-icon'><i className='bi bi-person text-primary'></i></span>
                                    <div className='p-2 width-a-home'>
                                        <p className='fw-bold mb-0'>Vania Rodrigues</p>
                                        <p className='opacity-75 m-0'>Quarto 102/A • Equipe Amarela</p>
                                    </div>
                                    <span className='position-absolute end-0 me-4'>
                                        <TagStatus status="estavel" />
                                    </span>
                                </a>

                                <a href="" className='list-group-item d-flex align-items-center gap-3 a-card-home h-100'>
                                    <span className='a-card-home-icon'><i className='bi bi-person text-primary'></i></span>

                                    <div className='p-2 width-a-home'>
                                        <p className='fw-bold mb-0'>Roberto Santana</p>
                                        <p className='opacity-75 m-0 '>Quarto 325/B • Equipe Vermelha</p>
                                    </div>

                                    <span className='position-absolute end-0 me-4'>
                                        <TagStatus status="observacao" />
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

                                <NavLink to='/pacientes' className="list-group-item d-flex align-items-center gap-3 button-card-home">
                                    <span><i className="bi bi-person-plus"></i></span>
                                    Registrar paciente
                                </NavLink>

                                <a href='/prescricao' className="list-group-item d-flex align-items-center gap-3 button-card-home">
                                    <span><i className="bi bi-file-earmark-medical"></i></span>
                                    Criar prescrição
                                </a>

                                <NavLink to={'/relatorios'} className="list-group-item d-flex align-items-center gap-3 button-card-home">
                                    <span><i className="bi bi-clipboard-plus"></i></span>
                                    Criar relatório
                                </NavLink>

                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}

export default Index
