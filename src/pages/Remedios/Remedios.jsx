import React from 'react'
import './Remedios.css'

function Remedios() {
    return (
        <>
            <section id='remedios-page-section'>

                <div className='container-remedios'>

                    <div className="d-flex flex-column flex-md-row mb-3 align-items-start align-items-md-center justify-content-md-between">

                        <div className="text-start mb-2 mb-md-0">
                            <h2 className="fw-bold">Tabela de Medicamentos</h2>
                            <p>Gerencie os medicamentos disponíveis para prescrição</p>
                        </div>

                        <div className="d-flex justify-content-md-end container-action-btn">
                            <button className="btn btn-primary d-flex align-items-center gap-2 header-action-btn"
                                data-bs-toggle="modal"
                                data-bs-target="#modalCriarRelatorio"
                            >
                                <i className="bi bi-plus fs-5"></i>
                                Novo Medicamento
                            </button>
                        </div>
                    </div>

                    <div className='w-100'>
                        <form role="search">
                            <div className="position-relative w-100 d-flex">
                                <i className="bi bi-search position-absolute top-50 translate-middle-y ms-3 text-secondary"></i>
                                <input
                                    type="text"
                                    className="form-control input-search"
                                    placeholder="Buscar por nome ou classe..."
                                />
                            </div>
                        </form>
                    </div>

                </div>

            </section>
        </>
    )
}

export default Remedios
