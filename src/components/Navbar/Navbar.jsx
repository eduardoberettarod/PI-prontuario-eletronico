import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import * as bootstrap from 'bootstrap'
import './Navbar.css'
import Loader from '../Loader/Loader'
import logo from '/image/logo.svg';
import { NavLink, useNavigate } from "react-router-dom";
import { urlServer } from '../../../config'
import { useAuth } from '../AuthContext/AuthContext'

const navItems = [
    {
        route: 'index',
        label: 'Página Inicial',
        iconClass: "bi bi-house",
        desktop: true,
        mobile: true
    },
    {
        route: 'pacientes',
        label: 'Pacientes',
        iconClass: "bi bi-people",
        desktop: true,
        mobile: true
    },
    {
        route: 'relatorios',
        label: 'Relatórios',
        iconClass: "bi bi-clipboard-data",
        desktop: true,
        mobile: true
    },
    {
        route: 'remedios',
        label: 'Remédios',
        iconClass: "bi bi-capsule",
        desktop: true,
        mobile: true
    },
    {
        route: 'usuarios',
        label: 'Usuários',
        iconClass: "bi bi-person-gear",
        desktop: true,
        mobile: true
    },
    {
        route: 'cuidados',
        label: 'Cuidados',
        iconClass: "bi bi-heart-pulse",
        desktop: true,
        mobile: true
    },
    {
        route: 'setor',
        label: 'Setor',
        iconClass: "bi bi-hospital",
        desktop: true,
        mobile: true
    },
    {
        route: 'perfil',
        label: 'Perfil',
        iconClass: "bi bi-person",
        desktop: false,
        mobile: true
    }
];

const navItemsAluno = [
    {
        route: 'index',
        label: 'Página Inicial',
        iconClass: "bi bi-house",
        desktop: true,
        mobile: true
    },
    {
        route: 'pacientes',
        label: 'Pacientes',
        iconClass: "bi bi-people",
        desktop: true,
        mobile: true
    },
    {
        route: 'relatorios',
        label: 'Relatórios',
        iconClass: "bi bi-clipboard-data",
        desktop: true,
        mobile: true
    },
    {
        route: 'perfil',
        label: 'Perfil',
        iconClass: "bi bi-person",
        desktop: false,
        mobile: true
    }
];


function Navbar() {

    const { usuario, setUsuario, verificandoAuth } = useAuth();

    const navigate = useNavigate()

    async function fnSairLogin() {
        try {
            const response = await fetch(`${urlServer}/auth/logout`, {
                method: "POST",
                credentials: "include"
            });

            if (response.ok) {
                setUsuario(null);
                navigate('/login');
            }

        } catch (erro) {
            console.error(erro);
        }
    }

    const location = useLocation()

    useEffect(() => {
        const offcanvasEl = document.getElementById('offcanvasNavbar')

        if (offcanvasEl) {
            const instance = bootstrap.Offcanvas.getInstance(offcanvasEl)
            if (instance) {
                instance.hide()
            }
        }

        // garante que o body volte ao normal
        document.body.style.overflow = 'auto'
    }, [location])


    if (verificandoAuth) {
        return <Loader />;
    }

    const nomeUsuario = `${usuario?.primeiro_nome} ${usuario?.sobrenome}`;
    const nivelAcesso = usuario?.nivel_acesso;
    const isAluno = nivelAcesso === 'aluno';

    function formatarNivel(nivel) {
        switch (nivel) {
            case 'admin': return 'Administrador'
            case 'docente': return 'Docente'
            case 'aluno': return 'Aluno'
            default: return nivel
        }
    }

    const itensNavbar =
        nivelAcesso === 'aluno' ? navItemsAluno : navItems;

    const podeVerServicosRapidos = ['admin', 'docente'].includes(nivelAcesso);
    return (
        <>
            {/* Navbar Desktop */}
            {isAluno && (
                <nav className={`navbar navbar-system mt-3 rounded-4 position-relative bg-body-tertiary 
    ${isAluno ? 'd-none d-xl-flex' : 'd-none'}`}>

                    {/* Logo à esquerda */}
                    <div className="d-flex align-items-center ms-4">
                        <NavLink
                            to={'/index'}
                            className="navbar-brand d-flex align-items-center"
                        >
                            <img
                                src={logo}
                                alt="Logo Sistema Senac"
                                className="img-fluid object-fit-contain"
                                style={{ height: 40 }}
                            />

                            <div className="ms-3">
                                <h1 className="mb-0 fs-6 fw-semibold">
                                    Prontuário Eletrônico
                                </h1>
                                <p className="mb-0 fs-6 text-muted">
                                    Sistema Senac
                                </p>
                            </div>
                        </NavLink>
                    </div>


                    {/* Botões centralizados */}
                    <div className="position-absolute top-50 start-50 translate-middle d-flex container-button-navbar">
                        {itensNavbar
                            .filter(item => item.desktop)
                            .map((item) => (
                                <NavLink
                                    key={item.route}
                                    to={`/${item.route}`}
                                    className={({ isActive }) =>
                                        `btn btn-link text-decoration-none d-flex align-items-center gap-1 p-0
     ${isActive ? 'nav-active text-primary fw-semibold' : 'text-dark'}`}>
                                    <i className={`${item.iconClass} fs-6 me-1`} />
                                    <span className="fs-6">{item.label}</span>
                                </NavLink>

                            ))}
                    </div>
                    {/* Botões à direita */}
                    <div className="d-flex align-items-center me-2">
                        <div className="dropdown dropdown-navbar-desk">
                            <button
                                className="btn d-flex gap-3 align-items-center"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <div>
                                    <h1 className="mb-0 fs-6 fw-semibold">{nomeUsuario}</h1>
                                    <p className="mb-0 small text-muted text-end">{formatarNivel(nivelAcesso)}</p>
                                </div>
                                <span className="dropdown-icon">
                                    <i className="bi bi-person fs-6"></i>
                                </span>
                            </button>

                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><NavLink className="dropdown-item" to={'/perfil'}>Meu Perfil</NavLink></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button className="dropdown-item text-danger"
                                        onClick={fnSairLogin}>
                                        <i className="bi bi-box-arrow-left fs-6 me-2"></i>
                                        Sair
                                    </button>
                                </li>
                            </ul>
                        </div>

                    </div>
                </nav>
            )}


            {/* Navbar Mobile */}

            <nav className={`navbar fixed-top d-flex bg-navbar navbar-mobile 
    ${isAluno ? 'd-xl-none' : ''}`}>
                <div className="container-fluid">

                    {/* Botões da Esquerda */}
                    <div className="d-flex align-items-center">
                        <NavLink
                            to={'/index'}
                            className="navbar-brand d-flex align-items-center"
                        >
                            <img
                                src={logo}
                                alt="Logo Sistema Senac"
                                className="img-fluid object-fit-contain"
                                style={{ height: 40 }}
                            />

                            <div className="ms-3">
                                <h1 className="mb-0 fs-6 fw-semibold">
                                    Prontuário Eletrônico
                                </h1>
                                <p className="mb-0 fs-6 text-muted">
                                    Sistema Senac
                                </p>
                            </div>
                        </NavLink>
                    </div>

                    <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="offcanvas offcanvas-end" tabIndex={"-1"} id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                        <div className="offcanvas-header">

                            {/* Botões do header da Navbar */}
                            <div className="d-flex align-items-center mt-3">

                                {/* Botão de perfil */}
                                <NavLink to={'/perfil'} className={'d-flex align-items-center text-decoration-none'} id='navlink-perfil'>
                                    <span className="icon-button me-3">
                                        <i className='bi bi-person fs-6 mx-auto text-primary'></i>
                                    </span>
                                    <div className="me-4">
                                        <h1 className="mb-0 fs-6 fw-semibold text-dark">{nomeUsuario}</h1>
                                        <p className="mb-0 small text-muted text-start">{formatarNivel(nivelAcesso)}</p>
                                    </div>
                                </NavLink>
                            </div>
                            <button type="button" className="btn-close me-1 mb-2" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <hr className="my-3 border-secondary opacity-25" />
                        <div className="offcanvas-body">
                            <p className='ms-3 opacity-50 fw-bold text-uppercase small'>Menu</p>
                            <ul className="navbar-nav">
                                {itensNavbar
                                    .filter(item => item.mobile)
                                    .map((item) => (
                                        <NavLink
                                            key={item.route}
                                            to={`/${item.route}`}
                                            className='nav-item ms-2 btn btn-slide-navbar d-flex mb-1 rounded-2 p-2'>
                                            <i className={`${item.iconClass} fs-6 me-3`} />
                                            <span className="fs-6">{item.label}</span>
                                        </NavLink>
                                    ))}
                            </ul>
                            {podeVerServicosRapidos && (
                                <>
                                    <hr className="my-3 border-secondary opacity-25" />
                                    <div className='navbar-nav position-relative'>
                                        <p className='ms-3 opacity-50 fw-bold text-uppercase small'>Serviços Rápidos</p>

                                        <div className="list-group rounded-4 p-2">
                                            <NavLink to={'/pacientes'} className="list-group-item d-flex btn-slide-navbar quick-item">
                                                <i className="bi bi-person-plus me-2"></i>
                                                Registrar paciente
                                            </NavLink>

                                            <button className="list-group-item d-flex btn-slide-navbar quick-item">
                                                <i className="bi bi-file-earmark-medical me-2"></i>
                                                Criar prescrição
                                            </button>

                                            <NavLink to={'/relatorios'} className="list-group-item d-flex btn-slide-navbar quick-item">
                                                <i className="bi bi-clipboard-plus me-2"></i>
                                                Criar relatório
                                            </NavLink>
                                        </div>
                                    </div>
                                </>
                            )}

                            <hr className="my-3 border-secondary opacity-25" />

                            <button onClick={fnSairLogin} className='btn text-danger w-100 log-out mt-5'>
                                <i className="bi bi-box-arrow-left fs-5 me-2"></i>
                                Sair
                            </button>
                        </div>

                    </div>
                </div>
            </nav>

        </>
    )
}

export default Navbar
