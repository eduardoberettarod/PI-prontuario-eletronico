import './Perfil.css'
import Navbar from '../../components/Navbar/Navbar'

const Perfil = () => {
    return (
        <>
            <Navbar />

            <section id='perfil-page-section'>

                <div className='container-perfil'>

                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <h2 className="fw-bold">Meu Perfil</h2>
                            <p className="text-muted mb-0">Configurações de conta.</p>
                        </div>


                        <div>
                            <button
                                className="btn btn-primary d-flex align-items-center gap-3"
                            >
                                Editar
                                <i className="bi bi-pencil fs-5"></i>
                            </button>
                        </div>
                    </div>


                    {/* CARD INFORMAÇÕES */}
                    <div className="card shadow-sm mb-4 p-2 pb-3">
                        <div className="card-body row g-3">
                            <div className='pt-3 col-12'>
                                <h4 className="mb-4">Informações da Conta</h4>
                            </div>

                            <div className='col-12'>
                                <label className='form-label'>Primeiro Nome</label>
                                <input
                                    type="text"
                                    className="form-control py-2"
                                    value="Eduardo"
                                    disabled
                                />
                            </div>

                            <div className='col-12'>
                                <label className='form-label'>Sobrenome</label>
                                <input
                                    type="text"
                                    className="form-control py-2"
                                    value="Beretta"
                                    disabled
                                />
                            </div>

                            <div className='col-12'>
                                <label className='form-label'>Email</label>
                                <input
                                    type="email"
                                    className="form-control py-2"
                                    value="eduardo@email.com"
                                    disabled
                                />
                            </div>

                            <div className='col-12'>
                                <label className='form-label'>Tipo de Usuário</label>
                                <input
                                    type="text"
                                    className="form-control py-2"
                                    value="Administrador"
                                    disabled
                                />
                            </div>

                        </div>

                    </div>


                    {/* CARD SEGURANÇA */}
                    <div className="card shadow-sm p-2">
                        <div className="card-body row g-3">

                            <div>
                                <h5 className="mb-3">Segurança</h5>
                            </div>

                            <div className="col-12">
                                <label className='form-label'>Senha</label>
                                <input
                                    type="password"
                                    className="form-control py-2"
                                    value="********"
                                    disabled
                                />
                            </div>

                            <div className="mt-3 col-12 d-flex justify-content-end">
                                <button className="btn btn-outline-primary py-2">
                                    Alterar Senha
                                </button>
                            </div>

                        </div>
                    </div>

                </div>

            </section>
        </>
    )
}

export default Perfil