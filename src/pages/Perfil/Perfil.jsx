import './Perfil.css'
import { useEffect, useState, useRef } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { urlServer } from '../../../config'
import * as bootstrap from 'bootstrap'

const Perfil = () => {

    const [primeiroNome, setPrimeiroNome] = useState('')
    const [sobrenome, setSobrenome] = useState('')
    const [email, setEmail] = useState('')
    const [nivelAcesso, setNivelAcesso] = useState('')
    const senhaAtualRef = useRef(null)
    const novaSenhaRef = useRef(null)
    const confirmarSenhaRef = useRef(null)

    const formRefSenha = useRef(null)
    const modalRefSenha = useRef(null)

    async function handleAlterarSenha(e) {
        e.preventDefault()

        const form = formRefSenha.current

        if (!form.checkValidity()) {
            form.classList.add("was-validated")
            return
        }

        const senhaAtual = senhaAtualRef.current.value
        const novaSenha = novaSenhaRef.current.value
        const confirmarSenha = confirmarSenhaRef.current.value

        if (novaSenha !== confirmarSenha) {
            setToastMsg({
                titulo: "Erro",
                mensagem: "As senhas não coincidem",
                tipo: "danger"
            })

            toastInstancePerfil.current?.show()
            return
        }

        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch(`${urlServer}/usuarios/alterar-senha`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    senhaAtual,
                    novaSenha
                })
            })

            if (res.status === 401) {
                localStorage.removeItem("authToken");
                window.location.href = "/login"
                return
            }

            if (res.status === 403) {
                alert("Sem permissão")
                return
            }

            const data = await res.json()

            if (!res.ok) throw new Error(data.erro)

            setToastMsg({
                titulo: "Sucesso",
                mensagem: "Senha alterada com sucesso!",
                tipo: "success"
            })

            const modalInstance = bootstrap.Modal.getOrCreateInstance(modalRefSenha.current)
            modalInstance.hide()

            document.activeElement.blur()

            form.reset()
            form.classList.remove("was-validated")

            toastInstancePerfil.current?.show()

        } catch (erro) {
            console.error(erro)

            setToastMsg({
                titulo: "Erro",
                mensagem: erro.message || "Erro ao alterar senha",
                tipo: "danger"
            })

            toastInstancePerfil.current?.show()
        }
    }

    useEffect(() => {
        if (!modalRefSenha.current) return

        const modalEl = modalRefSenha.current

        const handleHidden = () => {
            formRefSenha.current?.reset()
            formRefSenha.current?.classList.remove("was-validated")
        }

        modalEl.addEventListener("hidden.bs.modal", handleHidden)

        return () => {
            modalEl.removeEventListener("hidden.bs.modal", handleHidden)
        }
    }, [])

    const [textPassword, setTextPassword] = useState("password")

    function fnMudarTextoSenha() {
        setTextPassword(prev =>
            prev === "password" ? "text" : "password"
        )
    }

    useEffect(() => {
        async function buscarUsuario() {
            try {
                const token = localStorage.getItem("authToken");
                const response = await fetch(`${urlServer}/usuarios/me`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (response.status === 401) {
                    localStorage.removeItem("authToken");
                    window.location.href = "/login";
                    return;
                }

                if (!response.ok) {
                    throw new Error("Erro ao buscar usuário")
                }

                const data = await response.json()

                setPrimeiroNome(data.primeiro_nome)
                setSobrenome(data.sobrenome)
                setEmail(data.email)
                setNivelAcesso(data.nivel_acesso)

            } catch (erro) {
                console.error("Erro ao carregar usuário:", erro)
            }
        }

        buscarUsuario()
    }, [])

    function formatarNivel(nivel) {
        switch (nivel) {
            case 'admin': return 'Administrador'
            case 'docente': return 'Docente'
            case 'aluno': return 'Aluno'
            default: return nivel
        }
    }

    const toastRefPerfil = useRef(null)
    const toastInstancePerfil = useRef(null);

    useEffect(() => {
        if (toastRefPerfil.current) {
            toastInstancePerfil.current = bootstrap.Toast.getOrCreateInstance(toastRefPerfil.current, {
                autohide: true,
                delay: 2500,
            })
        }
    }, [])

    const [toastMsg, setToastMsg] = useState({
        titulo: "",
        mensagem: "",
        tipo: "success"
    });

    const primeiroNomeRef = useRef(null)
    const sobrenomeRef = useRef(null)
    const emailRef = useRef(null)

    const formRefPerfil = useRef(null)
    const modalRefPerfil = useRef(null)

    async function handleEditarPerfil(e) {
        e.preventDefault()

        const form = formRefPerfil.current

        if (!form.checkValidity()) {
            form.classList.add("was-validated")
            return
        }

        const dados = {
            primeiro_nome: primeiroNomeRef.current.value,
            sobrenome: sobrenomeRef.current.value,
            email: emailRef.current.value
        }

        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch(`${urlServer}/usuarios/editar-perfil`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(dados)
            })

            if (res.status === 401) {
                localStorage.removeItem("authToken");
                window.location.href = "/login"
                return
            }

            if (res.status === 403) {
                alert("Sem permissão")
                return
            }

            const data = await res.json()

            if (!res.ok) throw new Error(data.erro)


            setPrimeiroNome(dados.primeiro_nome)
            setSobrenome(dados.sobrenome)
            setEmail(dados.email)

            setToastMsg({
                titulo: "Sucesso",
                mensagem: "Perfil atualizado com sucesso! As alterações serão refletidas gradualmente no sistema.",
                tipo: "success"
            })

            const modalInstance = bootstrap.Modal.getOrCreateInstance(modalRefPerfil.current)
            modalInstance.hide()

            document.activeElement.blur()

            form.classList.remove("was-validated")

            toastInstancePerfil.current?.show()

        } catch (erro) {
            console.error(erro)

            setToastMsg({
                titulo: "Erro",
                mensagem: erro.message || "Erro ao atualizar perfil",
                tipo: "danger"
            })

            toastInstancePerfil.current?.show()
        }
    }

    useEffect(() => {
        if (!modalRefPerfil.current) return

        const modalEl = modalRefPerfil.current

        const handleHidden = () => {
            formRefPerfil.current?.reset()
            formRefPerfil.current?.classList.remove("was-validated")
        }

        modalEl.addEventListener("hidden.bs.modal", handleHidden)

        return () => {
            modalEl.removeEventListener("hidden.bs.modal", handleHidden)
        }
    }, [])

    return (
        <>
            <Navbar />

            <section id='perfil-page-section'>

                {/* Toast Perfil */}
                <div className="toast-container position-fixed bottom-0 end-0 p-3">
                    <div ref={toastRefPerfil} className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="toast-header toast-color">
                            <strong className={`me-auto d-flex align-items-center text-${toastMsg.tipo}`}>
                                {toastMsg.titulo}
                            </strong>
                            <button type="button" className="btn-close" data-bs-dismiss="toast"></button>
                        </div>

                        <div className="toast-body">
                            {toastMsg.mensagem}
                        </div>
                    </div>
                </div>

                {/* Modal das informações da conta */}
                <div ref={modalRefPerfil} className="modal fade" id="modalEditarPerfil"
                    tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">

                            <div className="modal-header">
                                <div className="p-2">
                                    <h5 className="modal-title">
                                        Editar Peril
                                    </h5>
                                    <p className="small opacity-75">Edite o seu perfil</p>
                                </div>
                                <button
                                    type="button"
                                    className="btn-close mb-5"
                                    data-bs-dismiss="modal"
                                ></button>
                            </div>

                            <div className="modal-body">

                                <form
                                    ref={formRefPerfil}
                                    onSubmit={handleEditarPerfil}
                                    className="row g-3 needs-validation"
                                    noValidate
                                >

                                    <div className="col-12">
                                        <label className="form-label">Primeiro Nome *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            ref={primeiroNomeRef}
                                            defaultValue={primeiroNome}
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            Insira o seu primeiro nome.
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label">Sobrenome *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            ref={sobrenomeRef}
                                            defaultValue={sobrenome}
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            Insira o seu sobrenome.
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label">Email *</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            ref={emailRef}
                                            defaultValue={email}
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            Insira o seu email.
                                        </div>
                                    </div>

                                    <div className="modal-footer mt-2">
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            data-bs-dismiss="modal"
                                        >
                                            Cancelar
                                        </button>

                                        <button type="submit" className="btn btn-primary">
                                            Salvar Alterações
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal da senha */}
                <div ref={modalRefSenha} className="modal fade" id="modalEditarSenha"
                    tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">

                            <div className="modal-header">
                                <div className="p-2">
                                    <h5 className="modal-title">
                                        Editar Senha
                                    </h5>
                                    <p className="small opacity-75">Edite a senha do seu perfil</p>
                                </div>
                                <button
                                    type="button"
                                    className="btn-close mb-5"
                                    data-bs-dismiss="modal"
                                ></button>
                            </div>

                            <div className="modal-body">

                                <form
                                    ref={formRefSenha}
                                    onSubmit={handleAlterarSenha}
                                    className="row g-3 needs-validation"
                                    noValidate
                                >

                                    <div className="col-12">
                                        <label className="form-label">Senha Atual *</label>

                                        <div className='container-input-login-senha'>
                                            <input type={textPassword} className="form-control" ref={senhaAtualRef} required />
                                            <button type='button' onClick={fnMudarTextoSenha}
                                                title='Mostrar a Senha'>
                                                <i className={`bi ${textPassword === "password" ? "bi bi-lock" : "bi bi-unlock"} fs-5`}></i>
                                            </button>
                                        </div>

                                    </div>

                                    <div className="col-12">
                                        <label className="form-label">Nova Senha *</label>

                                        <div className='container-input-login-senha'>
                                            <input type={textPassword} className="form-control" ref={novaSenhaRef} required />
                                            <button type='button' onClick={fnMudarTextoSenha}
                                                title='Mostrar a Senha'>
                                                <i className={`bi ${textPassword === "password" ? "bi bi-lock" : "bi bi-unlock"} fs-5`}></i>
                                            </button>
                                        </div>

                                    </div>

                                    <div className="col-12">
                                        <label className="form-label">Confirme sua senha *</label>

                                        <div className='container-input-login-senha'>
                                            <input type={textPassword} className="form-control" ref={confirmarSenhaRef} required />
                                            <button type='button' onClick={fnMudarTextoSenha}
                                                title='Mostrar a Senha'>
                                                <i className={`bi ${textPassword === "password" ? "bi bi-lock" : "bi bi-unlock"} fs-5`}></i>
                                            </button>
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

                                    <div className="modal-footer mt-2">
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            data-bs-dismiss="modal"
                                        >
                                            Cancelar
                                        </button>

                                        <button type="submit" className="btn btn-primary">
                                            Salvar Alterações
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div >

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
                                data-bs-toggle="modal"
                                data-bs-target="#modalEditarPerfil"
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
                                    value={primeiroNome}
                                    disabled
                                />
                            </div>

                            <div className='col-12'>
                                <label className='form-label'>Sobrenome</label>
                                <input
                                    type="text"
                                    className="form-control py-2"
                                    value={sobrenome}
                                    disabled
                                />
                            </div>

                            <div className='col-12'>
                                <label className='form-label'>Email</label>
                                <input
                                    type="email"
                                    className="form-control py-2"
                                    value={email}
                                    disabled
                                />
                            </div>

                            <div className='col-12'>
                                <label className='form-label'>Tipo de Usuário</label>
                                <input
                                    type="text"
                                    className="form-control py-2"
                                    value={formatarNivel(nivelAcesso)}
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
                                <button className="btn btn-outline-primary py-2"
                                    data-bs-toggle="modal"
                                    data-bs-target="#modalEditarSenha"
                                >
                                    Alterar Senha
                                </button>
                            </div>

                        </div>
                    </div>

                </div>

            </section >
        </>
    )
}

export default Perfil