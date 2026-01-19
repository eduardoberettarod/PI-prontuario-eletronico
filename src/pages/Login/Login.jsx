import React from 'react'
import './Login.css'

const Login = () => {
    return (
        <>
            <section id='login-page-section' className='d-flex align-items-center justify-content-center' style={{ minHeight: '100vh' }}>
                
                <img src="/public/image/logo.svg" alt="logo" className='icon-logo-login'/>


                <div className='card card-login p-4'>
                    <div className='d-flex align-items-center justify-content-center flex-column py-5'>
                        <h1 className='text-center card-title fs-2'>Prontuário Eletrônico</h1>
                        <p className='text-center card-subtitle small opacity-75'>Sistema de Prontuário Eletrônico Senac.</p>
                    </div>

                    <form className='row g-3 needs-validation'>
                        <div className='col-12'>
                            <label className='form-label'>Email</label>
                            <input type="text" className='form-control' placeholder='seu.email@senacsp.edu.br' />
                        </div>

                        <div className='col-12'>
                            <label className='form-label'>Senha</label>
                            <input type="password" className='form-control' placeholder='Senha' />
                        </div>

                        <div className='card-login-footer'>
                            <p>Não tem uma conta? <a href="#">Registre-se</a></p>
                            <a href='/index' className="btn btn-primary w-100">
                                Entrar
                            </a>
                        </div>
                    </form>
                </div>
            </section>
        </>
    )
}

export default Login