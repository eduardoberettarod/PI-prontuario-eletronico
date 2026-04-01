import { useState, useRef } from 'react'
import './Registro.css'
import { useNavigate } from 'react-router-dom'
import { urlServer } from '../../../config'

// imagens
import Medica from '/image/medicaRegistro.jpg'
import Logo from '/image/logo.svg'

const Registro = () => {

    const navigate = useNavigate()
    const [primeiro_nome, setPrimeiro_nome] = useState("")
    const [sobrenome, setSobrenome] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [senha2, setSenha2] = useState("")

    const formRef = useRef(null)


    async function fnFazerRegistro(e) {
        e.preventDefault();

        const form = formRef.current

        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }

        if (senha != senha2) {
            alert("As senhas não coincidem");
            return;
        } else {

            const resposta = await fetch(`${urlServer}/registro`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ primeiro_nome, sobrenome, email, senha })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                alert(dados.erro);
                return;
            }
        }

        // login ok
        navigate("/login")
    }

    const [textPassword, setTextPassword] = useState("password")

    function fnMudarTextoSenha() {
        setTextPassword(prev =>
            prev === "password" ? "text" : "password"
        )
    }

    return (
        <>
            <section
                id='registro-page-section'
                className='d-flex align-items-center justify-content-center'
                style={{ minHeight: '100vh' }}
            >

                <div className='card p-4 d-flex card-register'>

                    <div className='d-flex gap-4 align-items-center'>
                        <div className='container-img-register'>
                            <img src={Logo} alt="" className='position-absolute ms-4 mt-4' style={{ width: '35px' }} />
                            <img src={Medica} style={{ height: '625px' }} className='object-fit-cover' />
                        </div>

                        <div className='d-flex flex-column'>
                            <div className='d-flex align-items-center justify-content-center flex-column py-5'>
                                <h1 className='text-center card-title fs-2'>Prontuário Eletrônico</h1>
                                <p className='text-center card-subtitle small opacity-75'>
                                    Sistema de Prontuário Eletrônico Senac.
                                </p>
                            </div>

                            <form className='row g-2 needs-validation'
                                noValidate
                                onSubmit={fnFazerRegistro}
                                ref={formRef}>

                                <div className='col-12'>
                                    <label className='form-label'>Primeiro Nome</label>
                                    <input type="text"
                                        className='form-control'
                                        placeholder='Digite o seu primeiro nome'
                                        required
                                        value={primeiro_nome}
                                        onChange={(e) => setPrimeiro_nome(e.target.value)}
                                    />
                                    <div className='invalid-feedback'>
                                        Insira o seu primeiro nome.
                                    </div>
                                </div>

                                <div className='col-12'>
                                    <label className='form-label'>Sobrenome</label>
                                    <input type="text"
                                        className='form-control'
                                        placeholder='Digite o seu sobrenome'
                                        required
                                        value={sobrenome}
                                        onChange={(e) => setSobrenome(e.target.value)}
                                    />
                                    <div className='invalid-feedback'>
                                        Insira o seu sobrenome.
                                    </div>
                                </div>

                                <div className='col-12'>
                                    <label className='form-label'>Email</label>
                                    <input type="email"
                                        className='form-control'
                                        required
                                        placeholder='Digite o seu email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <div className='invalid-feedback'>
                                        Insira o seu email.
                                    </div>
                                </div>

                                <div className='col-12'>
                                    <label className='form-label'>Senha</label>
                                    <input type={textPassword}
                                        className='form-control'
                                        placeholder='Digite a sua senha'
                                        required
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                    />
                                    <div className='invalid-feedback'>
                                        Insira uma senha.
                                    </div>
                                </div>

                                <div className='col-12'>
                                    <label className='form-label'>Confirme sua senha</label>
                                    <input type={textPassword}
                                        className='form-control'
                                        placeholder='Confirme a sua senha'
                                        required
                                        value={senha2}
                                        onChange={(e) => setSenha2(e.target.value)}
                                    />
                                    <div className='invalid-feedback'>
                                        A senha e a confirmação de senha devem ser idênticas.
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
                                            Mostrar senhas
                                        </label>
                                    </div>
                                </div>

                                <div className='mt-4'>
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