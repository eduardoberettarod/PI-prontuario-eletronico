import { useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './Login.css'
import logo from '/image/logo.svg'
import { urlServer } from '../../../config'
import { useAuth } from '../../components/AuthContext/AuthContext'

const Login = () => {

    const navigate = useNavigate();
    const { setUsuario } = useAuth();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const formRef = useRef(null)


    async function fazerLogin(e) {
        e.preventDefault();

        const form = formRef.current

        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }

        const resposta = await fetch(`${urlServer}/auth/login`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, senha })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.erro);
            return;
        }

        //  pega usuário logado
        const respostaMe = await fetch(`${urlServer}/auth/me`, {
            credentials: "include"
        });

        const usuario = await respostaMe.json();

        //  salva no contexto
        setUsuario(usuario);

        // redireciona
        navigate("/index", { replace: true });
    }

    const [textPassword, setTextPassword] = useState("password")

    function fnMudarTextoSenha() {
        setTextPassword(prev =>
            prev === "password" ? "text" : "password"
        )
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

                <form className='row g-3 needs-validation'
                    onSubmit={fazerLogin}
                    noValidate
                    ref={formRef}>
                    <div className='col-12'>
                        <label className='form-label' htmlFor='email'>Email</label>
                        <div className='container-input-login'>
                            <i className='bi bi-person fs-5'></i>
                            <input
                                type="email"
                                id='email'
                                className='form-control px-3'
                                placeholder='seu.email@senacsp.edu.br'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className='invalid-feedback'>
                            Informe um email válido.
                        </div>
                    </div>

                    <div className='col-12'>
                        <label className='form-label' htmlFor='senha'>Senha</label>
                        <div className='container-input-login-senha2'>
                            <button type='button' onClick={fnMudarTextoSenha}
                            title='Mostrar senha'>
                                <i className={`bi ${textPassword === "password" ? "bi bi-lock" : "bi bi-unlock"} fs-5`}></i>
                            </button>
                            <input
                                type={textPassword}
                                id='senha'
                                className='form-control h-50 px-3'
                                placeholder='Senha'
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                        </div>
                        <div className='invalid-feedback'>
                            Informe uma senha válida
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="mostrarSenha"
                                checked={textPassword === "text"}
                                onChange={fnMudarTextoSenha}
                            />
                            <label className="form-check-label" htmlFor="mostrarSenha">
                                Mostrar senha
                            </label>
                        </div>
                    </div>

                    <div className='card-login-footer'>
                        <p>Não tem uma conta? <NavLink to={'/registro'}>Registra-se</NavLink></p>
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
