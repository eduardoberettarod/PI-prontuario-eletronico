import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import logo from '/image/logo.svg'

const Login = () => {

    const EmailUsuario = useRef(null)
    const SenhaUsuario = useRef(null)

    const navigate = useNavigate()

    function handleSubmitLogin(e) {
        e.preventDefault()

        // redireciona para /index
        navigate('/index')
    }

    return (
        <section
            id='login-page-section'
            className='d-flex align-items-center justify-content-center'
            style={{ minHeight: '100vh' }}
        >
            <img src={logo} alt="logo" className='icon-logo-login' />

            <div className='card card-login p-4'>
                <div className='d-flex align-items-center justify-content-center flex-column py-5'>
                    <h1 className='text-center card-title fs-2'>Prontuário Eletrônico</h1>
                    <p className='text-center card-subtitle small opacity-75'>
                        Sistema de Prontuário Eletrônico Senac.
                    </p>
                </div>

                <form className='row g-3'
                    onSubmit={handleSubmitLogin}>
                    <div className='col-12'>
                        <label className='form-label'>Email</label>
                        <div className='container-input-login'>
                            <input
                                type="email"
                                className='form-control px-3'
                                placeholder='seu.email@senacsp.edu.br'
                                ref={EmailUsuario}
                            />
                            <i className='bi bi-person fs-5'></i>
                        </div>
                    </div>

                    <div className='col-12'>
                        <label className='form-label'>Senha</label>
                        <div className='container-input-login'>
                            <input
                                type="password"
                                className='form-control h-50 px-3'
                                placeholder='Senha'
                                ref={SenhaUsuario}
                            />
                            <i className='bi bi-lock fs-5'></i>
                        </div>
                    </div>

                    <div className='card-login-footer'>
                        <p>Não tem uma conta? <a href="#">Registre-se</a></p>
                        <button type='submit' className="btn btn-primary w-100 py-2">
                            Entrar
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default Login
