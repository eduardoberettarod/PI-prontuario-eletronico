import React from 'react'

import { useRef } from "react";
import TagStatus from '../Tag/TagStatus.jsx'
import './CardPaciente.css'

function CardPaciente({
    NomePaciente,
    NascPaciente,
    StatusPaciente,
    TipoSanguePaciente,
    FatorRhPaciente,
    QuartoPaciente,
    LeitoPaciente,
    EquipePaciente,
    ConvenioPaciente,
    NomeMaePaciente,
}) {

    const nascimento = new Date(NascPaciente);
    const hoje = new Date();

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }

    return (
        <>
            <div className='card rounded-2 p-3 card-paciente'>
                <div className='d-flex pt-2 justify-content-between align-items-center'>
                    <div className='d-flex w-100'>
                        <span className='icon-card-status'>
                            <i className='bi bi-person fs-5'></i>
                        </span>

                        <div className='ms-3'>
                            <p className='mb-0 fw-medium'>{NomePaciente}</p>
                            <p>{idade} anos</p>

                        </div>
                    </div>

                    <div className='d-flex mb-4'>
                        <span className='status-card-paciente'>
                            <TagStatus status={StatusPaciente} />
                        </span>
                    </div>

                </div>


                <div className='d-grid mt-2 ms-2'>
                    <p className='d-flex align-items-center gap-1'><i className='bi bi-heart fs-6 text-danger me-2'></i>Tipo: <span>{TipoSanguePaciente} {FatorRhPaciente}</span></p>
                    <p className='d-flex align-items-center gap-1'><i className='bi bi-house fs-6 text-primary me-2'></i>Quarto <span>{QuartoPaciente} - Leito {LeitoPaciente}</span></p>
                    <p className='d-flex align-items-center gap-1'><i className='bi bi-person-badge fs-6 text-success me-2'></i>Equipe <span>{EquipePaciente}</span></p>
                </div>
                <hr className="my-3 border-secondary opacity-25" />

                <div className='d-grid info-card-paciente'>
                    <span className='opacity-50 mb-0'>Convênio: <span>{ConvenioPaciente}</span></span>
                    <span className='opacity-50 mb-3'>Nome da Mãe: <span>{NomeMaePaciente}</span></span>
                </div>

                <button className='btn btn-primary w-100'>
                    Ver Prontuário
                </button>
            </div>
        </>
    )
}

export default CardPaciente
