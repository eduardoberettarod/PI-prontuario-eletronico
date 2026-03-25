import React from 'react'
import { NavLink } from 'react-router-dom';
import TagStatus from '../Tag/TagStatus.jsx'
import './CardPaciente.css'

function CardPaciente({
    id,
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
    setor,
    id_setor,
    onEditar,
    onExcluir,
}) {

    const statusClass = `status-${StatusPaciente}`

    const nascimento = new Date(NascPaciente);
    const hoje = new Date();

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }

    return (
        <>
            <div className={`card rounded-2 p-3 card-paciente h-100 ${statusClass}`}>

                {/* Cabeçalho: ícone + nome + tag de status */}
                <div className='d-flex pt-2 align-items-start gap-2'>

                    {/* Ícone — não encolhe */}
                    <span className={`icon-card-status flex-shrink-0 ${statusClass}`}>
                        <i className='bi bi-person fs-5'></i>
                    </span>

                    {/* Nome + idade — ocupa o espaço disponível e trunca se necessário */}
                    <div className='overflow-hidden flex-grow-1'>
                        <p className='mb-0 fw-medium text-truncate' title={NomePaciente}>
                            {NomePaciente}
                        </p>
                        <p className='mb-0'>{idade} anos</p>
                    </div>

                    {/* Tag de status — não encolhe */}
                    <div className='flex-shrink-0'>
                        <TagStatus status={StatusPaciente} />
                    </div>

                </div>

                {/* Informações principais */}
                <div className='d-grid mt-3 ms-2'>

                    <p className='d-flex align-items-center gap-1 mb-2'>
                        <i className='bi bi-heart fs-6 text-danger me-2'></i>
                        Tipo: <span>{TipoSanguePaciente} {FatorRhPaciente}</span>
                    </p>

                    <p className='d-flex align-items-center gap-1 mb-2'>
                        <i className='bi bi-house fs-6 text-primary me-2'></i>
                        Quarto <span>{QuartoPaciente} - Leito {LeitoPaciente}</span>
                    </p>

                    <p className='d-flex align-items-center gap-1 mb-2'>
                        <i className='bi bi-person-badge fs-6 text-success me-2'></i>
                        Equipe <span>{EquipePaciente}</span>
                    </p>

                </div>

                <hr className="my-3 border-secondary opacity-25" />

                {/* Informações secundárias */}
                <div className='d-grid info-card-paciente'>
                    <span className='opacity-50 mb-0'>Convênio: <span>{ConvenioPaciente}</span></span>
                    <span className='opacity-50 mb-0'>Setor: <span>{setor}</span></span>
                    <span className='opacity-50 mb-3'>Nome da Mãe: <span>{NomeMaePaciente}</span></span>
                </div>

                {/* Rodapé: prontuário + botões de ação */}
                <div className='d-flex gap-2 mt-auto'>
                    <NavLink className='btn btn-primary flex-grow-1' to={`/prontuario?id=${id}`}>
                        Ver Prontuário
                    </NavLink>

                    <button
                        className='btn btn-outline-success'
                        title='Editar paciente'
                        onClick={() => onEditar({
                            id,
                            nome_paciente: NomePaciente,
                            mae_paciente: NomeMaePaciente,
                            data_nasc: NascPaciente,
                            tipo_sanguineo: TipoSanguePaciente,
                            fator_rh: FatorRhPaciente,
                            equipe: EquipePaciente,
                            status_paciente: StatusPaciente,
                            convenio: ConvenioPaciente,
                            quarto: QuartoPaciente,
                            leito: LeitoPaciente,
                            id_setor: id_setor
                        })}
                    >
                        <i className='bi bi-pencil-square'></i>
                    </button>

                    <button
                        className='btn btn-outline-danger'
                        title='Excluir paciente'
                        onClick={() => onExcluir(id)}
                    >
                        <i className='bi bi-trash'></i>
                    </button>
                </div>

            </div>
        </>
    )
}

export default CardPaciente
