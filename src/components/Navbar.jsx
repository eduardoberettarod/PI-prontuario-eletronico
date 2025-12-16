import React from 'react'
import '../style/Navbar.css'
import logo from '/image/logo.svg';
import { NavLink } from "react-router-dom";

const navItems = [
    {
        route: 'dashboard',
        label: 'Dashboard',
        iconClass: "bi bi-house",
    },
    {
        route: 'pacientes',
        label: 'Pacientes',
        iconClass: "bi bi-people",
    },
    {
        route: 'prontuarios',
        label: 'Prontuários',
        iconClass: "bi bi-file-earmark-text",
    },
    {
        route: 'relatorios',
        label: 'Relatórios',
        iconClass: "bi bi-clipboard-data",
    },
    {
        route: 'remedios',
        label: 'Remédios',
        iconClass: "bi bi-capsule",
    },
];


function Navbar() {


    return (
        <>
            {/* Navbar Desktop */}

            <nav className="navbar navbar-system mt-3 rounded-4 position-relative bg-body-tertiary d-none d-xl-flex">

                {/* Logo à esquerda */}
                <div className="d-flex align-items-center ms-4">
                    <a
                        href="#"
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
                    </a>
                </div>


                {/* Botões centralizados */}
                <div className="position-absolute top-50 start-50 translate-middle d-flex container-button-navbar">
                    {navItems.map((item) => (
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
                <div className="d-flex align-items-center me-4">

                    <div className="me-4">
                        <h1 className="mb-0 fs-6 fw-semibold">Eduardo Beretta</h1>
                        <p className="mb-0 small text-muted text-end">Docente</p>
                    </div>
                    {/* Botão de perfil */}
                    <button href='' className="btn btn-link icon-button shadow-none focus-ring-0 p-0 me-3">
                        <i className='bi bi-person fs-6 mx-auto'></i>
                    </button>
                    {/* Botão de configuração */}
                    <a
                        href=''
                        className="btn btn-link icon-confi shadow-none focus-ring-0 p-0">
                        <i className="bi bi-gear fs-6 mx-auto"></i>
                    </a>
                </div>
            </nav>

            {/* Navbar Mobile */}

            <nav className="navbar fixed-top d-flex d-xl-none mt-2">
                <div className="container-fluid">

                    {/* Botões da Esquerda */}
                    <div className="d-flex align-items-center ms-2">
                        <a
                            href="#"
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
                        </a>
                    </div>

                    <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="offcanvas offcanvas-end" tabIndex={"-1"} id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                        <div className="offcanvas-header">

                            {/* Botões do header da Navbar */}
                            <div className="d-flex align-items-center mt-3">

                                {/* Botão de perfil */}
                                <button href='' className="btn btn-link icon-button shadow-none focus-ring-0 p-0 ms-2 me-3">
                                    <i className='bi bi-person fs-6 mx-auto'></i>
                                </button>
                                <div className="me-4">
                                    <h1 className="mb-0 fs-6 fw-semibold">Eduardo Beretta</h1>
                                    <p className="mb-0 small text-muted text-start">Docente</p>
                                </div>
                            </div>
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <hr class="my-3 border-secondary opacity-25" />
                        <div className="offcanvas-body">
                            <ul className="navbar-nav">
                                {navItems.map(item => (
                                    <li key={item.route} className="nav-item ms-2 btn p-lg-1 btn-slide-navbar d-flex mb-3 rounded-4">
                                        <NavLink
                                            to={`/${item.route}`}
                                            className="nav-link ms-2"
                                            data-bs-dismiss="offcanvas">
                                            <i className={`${item.iconClass} fs-6 me-3`} />
                                            {item.label}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                            <hr class="my-3 border-secondary opacity-25" />
                        </div>

                        {/* Botão de configuração */}
                        <a
                            href=''
                            className="btn btn-link icon-confi shadow-none focus-ring-0 p-0 position-absolute bottom-0 end-0 mb-4 me-4">
                            <i className="bi bi-gear fs-5 mx-auto"></i>
                        </a>
                    </div>
                </div>
            </nav>

        </>
    )
}

export default Navbar
