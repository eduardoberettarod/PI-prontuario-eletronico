import React, { useRef } from 'react'
import './CardRelatorio.css'

function CardRelatorio({
    TituloRelatorio,
    ConteudoRelatorio,
    PacienteSelecionado,
    onDelete
}) {

    const hoje = new Date();

    const data = hoje.toLocaleDateString('pt-BR');
    const hora = hoje.toLocaleTimeString('pt-BR');


    return (
        <>
            <div className="card p-3 position-relative card-relatorio">

                <div className="row align-items-center">

                    <div className="col-12 col-md-1 d-flex align-items-center justify-content-start justify-content-md-center mb-2 mb-md-0">
                        <span className="icon-relatorio">
                            <i className="bi bi-file-earmark-text text-warning fs-4"></i>
                        </span>
                    </div>

                    <div className="col-12 col-md-11">
                        <p className="fw-medium fs-6 mb-1 mt-2">{TituloRelatorio}</p>
                        <p className="mb-0">Paciente: {PacienteSelecionado}</p>
                        <p className="mb-0">
                            Criado por Dr. Eduardo Rodrigues em {data}, {hora}
                        </p>

                    </div>

                </div>

                <div className="bg-body-secondary p-2 mt-3 rounded-2 d-flex align-items-center" style={{ overflow: 'hidden' }}>
                    <p className="mb-0">{ConteudoRelatorio}</p>
                </div>

                <div className="position-absolute end-0 me-3 top-0 mt-3 gap-2 d-flex">
                    <button className="btn">
                        <i className="bi bi-printer text-primary fs-5"></i>
                    </button>

                    <button className="btn" onClick={onDelete}>
                        <i className="bi bi-trash text-danger fs-5"></i>
                    </button>

                </div>

            </div>

        </>
    )
}

export default CardRelatorio
