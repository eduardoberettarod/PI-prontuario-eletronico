import React from 'react'
import '../style/Navbar.css'
import logo from '/image/logo.svg';

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

    // function fnNomeUsuario() {
    //     let nomeUsuario = prompt("Qual seu nome?");
    //     document.getElementById("nomeUsuario").innerHTML = nomeUsuario;
    // }

    return (
        <nav className="navbar navbar-system mt-3 rounded-4 position-relative bg-body-tertiary">

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
            <div className="position-absolute top-50 start-50 translate-middle d-flex gap-5">
                {navItems.map((item) => (
                    <button
                        key={item.route}
                        className="btn text-decoration-none d-flex align-items-center gap-1 p-0 text-dark btn-link"
                        onClick={() => console.log(item.route)}
                    >
                        <i className={`${item.iconClass} fs-6 me-1 text-dark`} />
                        <span className="fs-6">{item.label}</span>
                    </button>
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
                    className="btn btn-link icon-confi shadow-none focus-ring-0 p-0"
                >
                    <i className="bi bi-gear fs-6 mx-auto"></i>
                </a>


            </div>
        </nav>


    )
}

export default Navbar
