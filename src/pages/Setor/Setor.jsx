import React from 'react'
import './Setor.css'
import Navbar from '../../components/Navbar/Navbar'

const Setor = () => {
    return (
        <>
        <Navbar />

        <section id='setor-page-section'>

                <div className='container-setor'>

                    <div className="d-flex flex-column flex-md-row mb-3 align-items-start align-items-md-center justify-content-md-between">

                        <div className="text-start mb-2 mb-md-0">
                            <h2 className="fw-bold">Tabela de Setores</h2>
                            <p>Crie e administre os setores do sistema.</p>
                        </div>

                    </div>

                    <div className='w-100'>
                        <form role="search">
                            <div className="position-relative w-100 d-flex">
                                <i className="bi bi-search position-absolute top-50 translate-middle-y ms-3 text-secondary"></i>
                                <input
                                    type="text"
                                    className="form-control input-search"
                                    placeholder="Buscar por nome ou ID..."
                                />
                            </div>
                        </form>
                    </div>

                    <div className="row mt-4">
                        <div className="col">
                            <table className="table mx-auto table-hover">
                                <thead>
                                    <tr>
                                        <th className="ps-4 py-3">ID</th>
                                        <th className="px-3 py-3">Setor</th>
                                        <th className="pe-4 py-3 text-end">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    

                                        <tr className="align-middle">

                                            <td className="ps-4 py-3">
                                                teste
                                            </td>

                                            <td className="px-3 py-3">
                                                test
                                            </td>

                                            <td className="pe-4 py-3 text-end">
                                                <div className="d-inline-flex align-items-center gap-2">

                                                    <button className="btn btn-sm text-success p-1">
                                                        <i className="bi bi-pencil-square fs-5"></i>
                                                    </button>
                                                    
                                                    <button className="btn btn-sm text-danger p-1">
                                                        <i className="bi bi-trash fs-5"></i>
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>

                                    

                                </tbody>

                            </table>
                        </div>
                    </div>

                </div>

            </section>

        </>
    )
}

export default Setor
