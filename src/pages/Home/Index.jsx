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
        const token = localStorage.getItem("authToken");
        fetch(`${urlServer}/pacientes/count`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => {

                if (res.status === 401) {
                    localStorage.removeItem("authToken");
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
        const token = localStorage.getItem("authToken");
        fetch(`${urlServer}/prescricoes/count`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => {

                if (res.status === 401) {
                    localStorage.removeItem("authToken");
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
        const token = localStorage.getItem("authToken");
        fetch(`${urlServer}/paciente-cuidados/count`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => {

                if (res.status === 401) {
                    localStorage.removeItem("authToken");
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
        const token = localStorage.getItem("authToken");
        fetch(`${urlServer}/relatorios/count`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => {

                if (res.status === 401) {
                    localStorage.removeItem("authToken");
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

    const [ultimos, setUltimos] = useState([]);

    useEffect(() => {
        const dados = JSON.parse(localStorage.getItem("ultimosPacientes")) || [];
        setUltimos(dados);
    }, []);

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

                    <div className='mt-4 container-cards-home'>

                        {/* Card de ultimos acessos */}
                        <div>
                            <div className='list-group shadow'>
                                <div className='list-group-item p-3'>
                                    <p className='fw-bold mb-0 fs-6 ms-2 mt-2'>Últimos Acessos</p>
                                    <p className='card-subtitle opacity-75 mt-0 ms-2'>Pacientes acessados recentemente</p>
                                </div>

                                {ultimos.length === 0 &&
                                    <div className='bg-light p-3 text-center'>
                                        <p className='text-muted'>Nenhum acesso recente.</p>
                                    </div>}
                                {ultimos.map(p => (
                                    <div key={p.id}>
                                        <NavLink to={`/prontuario?id=${p.id}`} className='list-group-item d-flex align-items-center gap-3 a-card-home'>
                                            <span className='a-card-home-icon'><i className='bi bi-person text-primary'></i></span>

                                            <div className='p-2 width-a-home'>
                                                <p className='fw-bold mb-0'>{p.nome}</p>
                                                <p className='opacity-75 m-0'>Quarto {p.quarto}/{p.leito} • {p.equipe}</p>
                                            </div>

                                            <span className='position-absolute end-0 me-4'>
                                                <TagStatus status={p.status} />
                                            </span>
                                        </NavLink>

                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}

export default Index
