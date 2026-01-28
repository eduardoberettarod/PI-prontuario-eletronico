import { useRef } from 'react'
import './Registro.css'

// imagens
import Medica from '/image/medicaRegistro.jpg'
import Logo from '/image/logo.svg'

const Registro = () => {
    return (
        <>
            <section
                id='registro-page-section'
                className='d-flex align-items-center justify-content-center'
                style={{ minHeight: '100vh' }}
            >

                <div className='card p-4 d-flex card-register'>

                    <div className='d-flex gap-4 align-items-center'>
                        <div className=' d-none d-md-none d-lg-block'>
                            <img src={Logo} alt="" className='position-absolute ms-4 mt-4' style={{width:'35px'}} />
                            <img src={Medica} style={{height: '650px'}} className='object-fit-cover'/>
                        </div>

                        <div className='d-flex flex-column'>
                            <div className='d-flex align-items-center justify-content-center flex-column py-5'>
                                <h1 className='text-center card-title fs-2'>Prontuário Eletrônico</h1>
                                <p className='text-center card-subtitle small opacity-75'>
                                    Sistema de Prontuário Eletrônico Senac.
                                </p>
                            </div>

                            <form className='row g-3'>

                                <div className='col-12'>
                                    <label className='form-label'>Primeiro Nome</label>
                                    <input type="text"
                                        className='form-control'
                                    />
                                </div>

                                <div className='col-12'>
                                    <label className='form-label'>Sobrenome</label>
                                    <input type="text"
                                        className='form-control'
                                    />
                                </div>

                                <div className='col-12'>
                                    <label className='form-label'>Email</label>
                                    <input type="email"
                                        className='form-control'
                                    />
                                </div>

                                <div className='col-12'>
                                    <label className='form-label'>Senha</label>
                                    <input type="password"
                                        className='form-control'
                                    />
                                </div>

                                <div className='col-12'>
                                    <label className='form-label'>Confirme sua senha</label>
                                    <input type="password"
                                        className='form-control'
                                    />
                                </div>

                                <div>
                                    <button type='submit' className="btn btn-primary w-100 py-2">
                                        Registrar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Registro