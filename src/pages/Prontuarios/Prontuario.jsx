import { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

import * as bootstrap from 'bootstrap';

import Navbar from '../../components/Navbar/Navbar'
import TagStatus from '../../components/Tag/TagStatus'
import './Prontuario.css'
import { urlServer } from '../../../config';
import CardRelatorio from '../../components/CardRelatorio/CardRelatorio';

// ─── Item vazio padrão ────────────────────────────────────────────────────────
const itemVazio = () => ({
    medicamento_id: "",
    dosagem: "",
    via: "",
    frequencia: "",
});

const Prontuario = () => {

    const [activeTab, setActiveTab] = useState("dados");
    const [tipoCuidado, setTipoCuidado] = useState("");
    const [paciente, setPaciente] = useState(null)

    // ─── Cuidados ─────────────────────────────────────────────────────────────
    const modalCriarCuidado = useRef(null)
    const observacao = useRef(null)
    const tipoCuidadoRegistrado = useRef(null)
    const [relatorios, setRelatorios] = useState([]);
    const [listaCuidados, setListaCuidados] = useState([]);
    const [cuidadosPaciente, setCuidadosPaciente] = useState([])

    // ─── Prescrições ──────────────────────────────────────────────────────────
    const modalCriarPrescricao = useRef(null)
    const formRefPrescricao = useRef(null)

    const [listaMedicamentos, setListaMedicamentos] = useState([]);
    const [observacaoPrescricao, setObservacaoPrescricao] = useState("");
    const [itens, setItens] = useState([itemVazio()]);
    const [prescricoesRegistradas, setprescricoesRegistradas] = useState([]);

    // ─── Edição de prescrição ──────────────────────────────────────────────────
    const modalEditarPrescricao = useRef(null)
    const [prescricaoEditando, setPrescricaoEditando] = useState({ id: null, observacao: "" })

    // ─── Funções de dados ─────────────────────────────────────────────────────

    function fnCarregarDados() {
        const parametros = new URLSearchParams(window.location.search)
        const id = parametros.get('id')

        fetch(`${urlServer}/pacientes/` + id, {
            method: 'GET',
            credentials: 'include',
        })
            .then(res => {
                if (res.status === 401) { window.location.href = "/login"; return }
                if (!res.ok) throw new Error("Usuário não autorizado");
                return res.json();
            })
            .then(dados => setPaciente(dados))
            .catch(erro => console.log(erro.message))
    }

    function fnCarregarRelatorios(pacienteId) {
        fetch(`${urlServer}/relatorios/paciente/${pacienteId}`, {
            credentials: 'include',
            method: 'GET'
        })

            .then(res => {
                if (res.status === 401)
                    return; return res.json();
            })
            .then(dados => {
                if (Array.isArray(dados)) setRelatorios(dados);
            })
            .catch(err => console.log(err));
    }

    function fnCarregarMedicamentos() {
        fetch(`${urlServer}/medicamentos`, { method: "GET", credentials: "include" })
            .then(res => res.json())
            .then(dados => setListaMedicamentos(dados))
            .catch(err => console.log(err))
    }

    function fnAdicionarNovaPrescricao() {
        const paciente_id = new URLSearchParams(window.location.search).get("id");
        if (!paciente_id || isNaN(parseInt(paciente_id))) {
            alert("⚠️ Paciente não identificado");
            return;
        }

        if (itens.length === 0) {
            alert("⚠️ Adicione pelo menos um medicamento");
            return;
        }

        // Valida campos — horários NÃO são enviados (gerados no backend)
        try {
            itens.forEach((item, idx) => {
                if (!item.medicamento_id) {
                    throw new Error(`Medicamento ${idx + 1}: selecione um medicamento`);
                }
                if (!item.dosagem || isNaN(parseFloat(item.dosagem))) {
                    throw new Error(`Medicamento ${idx + 1}: dosagem inválida`);
                }
                if (!item.via || item.via.trim().length === 0) {
                    throw new Error(`Medicamento ${idx + 1}: informe a via`);
                }
                if (!item.frequencia || isNaN(parseInt(item.frequencia))) {
                    throw new Error(`Medicamento ${idx + 1}: frequência inválida`);
                }
            });
        } catch (e) {
            alert("❌ " + e.message);
            return;
        }

        const payload = {
            paciente_id: parseInt(paciente_id),
            observacao: observacaoPrescricao.trim(),
            itens: itens.map(item => ({
                medicamento_id: item.medicamento_id,
                dosagem: item.dosagem,
                via: item.via,
                frequencia: item.frequencia,
            }))
        };

        fetch(`${urlServer}/prescricoes`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then(res => {
                if (res.status === 201 || res.status === 200) return res.json();
                return res.json().then(err => { throw new Error(err.erro || "Erro ao salvar prescrição") });
            })
            .then(dados => {
                console.log("✅ Prescrição salva:", dados);
                alert("✅ Prescrição criada com sucesso!");
                fnCarregarPrescricoes();
            })
            .catch(err => {
                console.error("Erro:", err);
                alert("❌ " + err.message);
            });
    }

    // ─── Editar prescrição ─────────────────────────────────────────────────────

    function abrirEdicaoPrescricao(prescricao) {
        setPrescricaoEditando({
            id: prescricao.id,
            observacao: prescricao.observacao || ""
        });
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEditarPrescricao.current);
        modalInstance.show();
    }

    function fnSalvarEdicaoPrescricao() {
        if (!prescricaoEditando.id) return;

        fetch(`${urlServer}/prescricoes/${prescricaoEditando.id}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ observacao: prescricaoEditando.observacao })
        })
            .then(res => {
                if (!res.ok) return res.json().then(err => { throw new Error(err.erro || "Erro ao editar prescrição") });
                return res.json();
            })
            .then(() => {
                const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEditarPrescricao.current);
                modalInstance.hide();
                fnCarregarPrescricoes();
            })
            .catch(err => {
                console.error("Erro ao editar prescrição:", err);
                alert("❌ " + err.message);
            });
    }

    // ─── Deletar prescrição ────────────────────────────────────────────────────

    function deletarPrescricao(prescricao_id, numeroPrescricao) {
        if (!confirm(`Tem certeza que deseja excluir a Prescrição #${numeroPrescricao}?\n\nEsta ação também removerá todos os medicamentos e horários vinculados.`)) {
            return;
        }

        fetch(`${urlServer}/prescricoes/${prescricao_id}`, {
            method: "DELETE",
            credentials: "include",
        })
            .then(res => {
                if (!res.ok) return res.json().then(err => { throw new Error(err.erro || "Erro ao deletar prescrição") });
                return res.json();
            })
            .then(() => fnCarregarPrescricoes())
            .catch(err => {
                console.error("Erro ao deletar prescrição:", err);
                alert("❌ " + err.message);
            });
    }

    // ─── Alterar status de horário ─────────────────────────────────────────────
    // 1 = pendente | 2 = finalizado | 3 = nao_feito | 4 = negado_paciente
    function alterarStatusHorario(horario_id, status_id) {
        fetch(`${urlServer}/prescricoes/horario/${horario_id}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status_id })
        })
            .then(res => {
                if (!res.ok) return res.json().then(err => { throw new Error(err.erro || "Erro ao atualizar status") });
                return res.json();
            })
            .then(() => fnCarregarPrescricoes())
            .catch(err => {
                console.error("Erro ao atualizar status do horário:", err);
                alert("❌ " + err.message);
            });
    }

    // ─── Manipulação dos itens dinâmicos ──────────────────────────────────────

    function adicionarItem() {
        setItens(prev => [...prev, itemVazio()]);
    }

    function removerItem(index) {
        setItens(prev => prev.filter((_, i) => i !== index));
    }

    function atualizarItem(index, campo, valor) {
        setItens(prev => prev.map((item, i) =>
            i === index ? { ...item, [campo]: valor } : item
        ));
    }

    // ─── Submit modal criar prescrição ────────────────────────────────────────
    function SubmitPrescricao(e) {
        e.preventDefault();

        const form = formRefPrescricao.current;
        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }

        fnAdicionarNovaPrescricao();

        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalCriarPrescricao.current);
        modalInstance.hide();
        document.activeElement.blur();
        form.classList.remove("was-validated");
    }

    // Reset ao fechar o modal de criar
    useEffect(() => {
        if (!modalCriarPrescricao.current) return;
        const modalEl = modalCriarPrescricao.current;

        const handleHidden = () => {
            formRefPrescricao.current?.classList.remove("was-validated");
            setObservacaoPrescricao("");
            setItens([itemVazio()]);
        };

        modalEl.addEventListener("hidden.bs.modal", handleHidden);
        return () => modalEl.removeEventListener("hidden.bs.modal", handleHidden);
    }, []);

    // Reset ao fechar o modal de editar
    useEffect(() => {
        if (!modalEditarPrescricao.current) return;
        const modalEl = modalEditarPrescricao.current;

        const handleHidden = () => {
            setPrescricaoEditando({ id: null, observacao: "" });
        };

        modalEl.addEventListener("hidden.bs.modal", handleHidden);
        return () => modalEl.removeEventListener("hidden.bs.modal", handleHidden);
    }, []);

    // ─── Cuidados ──────────────────────────────────────────────────────────────

    function fnAdicionarNovoCuidado() {
        const paciente_id = new URLSearchParams(window.location.search).get("id");
        const novoCuidado = {
            paciente_id,
            cuidado_id: tipoCuidadoRegistrado.current.value,
            observacao: observacao.current.value
        };
        fetch(`${urlServer}/paciente-cuidados`, {
            method: "POST", credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novoCuidado)
        }).then(() => fnCarregarCuidadosPaciente())
    }

    function deletarCuidado(id) {
        if (!confirm("Tem certeza que deseja excluir este cuidado?")) return;
        fetch(`${urlServer}/paciente-cuidados/${id}`, { method: "DELETE", credentials: "include" })
            .then(res => { if (!res.ok) throw new Error("Erro ao deletar"); return res.json(); })
            .then(() => fnCarregarCuidadosPaciente())
            .catch(err => console.log(err));
    }

    function alterarStatusCuidado(id, status_id) {
        fetch(`${urlServer}/paciente-cuidados/${id}`, {
            method: "PUT", credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status_id })
        }).then(() => fnCarregarCuidadosPaciente())
    }

    function fnCarregarCuidados() {
        fetch(`${urlServer}/cuidados`, { method: "GET", credentials: "include" })
            .then(res => res.json()).then(dados => setListaCuidados(dados)).catch(err => console.log(err))
    }

    function fnCarregarCuidadosPaciente() {
        const id = new URLSearchParams(window.location.search).get("id");
        fetch(`${urlServer}/paciente-cuidados/${id}`, { method: "GET", credentials: "include" })
            .then(res => res.json())
            .then(dados => { if (Array.isArray(dados)) setCuidadosPaciente(dados); else setCuidadosPaciente([]) })
    }

    const formRefCuidados = useRef(null)
    function SubmitCuidado(e) {
        e.preventDefault();
        const formCuidados = formRefCuidados.current
        if (!formCuidados.checkValidity()) { formCuidados.classList.add("was-validated"); return }
        fnAdicionarNovoCuidado();
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalCriarCuidado.current);
        modalInstance.hide();
        document.activeElement.blur();
        formCuidados.classList.remove("was-validated")
    }

    useEffect(() => {
        if (!modalCriarCuidado.current) return;
        const modalEl = modalCriarCuidado.current;
        const handleHidden = () => {
            formRefCuidados.current?.reset();
            formRefCuidados.current?.classList.remove("was-validated");
        };
        modalEl.addEventListener("hidden.bs.modal", handleHidden);
        return () => modalEl.removeEventListener("hidden.bs.modal", handleHidden);
    }, []);

    // ─── useEffects ───────────────────────────────────────────────────────────

    useEffect(() => { fnCarregarDados() }, [])
    useEffect(() => { if (paciente?.id) fnCarregarRelatorios(paciente.id); }, [paciente]);
    useEffect(() => { fnCarregarCuidados(); fnCarregarCuidadosPaciente(); fnCarregarMedicamentos(); fnCarregarPrescricoes(); }, [])

    // ─── Helpers ──────────────────────────────────────────────────────────────

    function formatarDataBR(data) {
        if (!data) return "";
        return new Date(data).toLocaleDateString("pt-BR");
    }

    // Formata o DATETIME do horário de prescrição para exibição.
    // O backend envia "YYYY-MM-DD HH:MM:SS" (string sem fuso).
    // Exibe como "DD/MM/YYYY HH:MM" sem conversão de fuso.
    function formatarHorarioPrescricao(horario) {
        if (!horario) return "";
        const str = String(horario);
        // Aceita "YYYY-MM-DD HH:MM:SS" ou "YYYY-MM-DDTHH:MM:SS"
        const partes = str.replace('T', ' ').split(' ');
        if (partes.length < 2) return str;
        const [datePart, timePart] = partes;
        const [y, m, d] = datePart.split('-');
        const [h, mi] = timePart.split(':');
        if (!y || !m || !d || !h || !mi) return str;
        return `${d}/${m}/${y} ${h}:${mi}`;
    }

    const statusClass = `status-${paciente?.status_paciente}`

    let idade = "";
    if (paciente?.data_nasc) {
        const nasc = new Date(paciente.data_nasc);
        const hoje = new Date();
        idade = hoje.getFullYear() - nasc.getFullYear();
        const mes = hoje.getMonth() - nasc.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) idade--;
    }

    // ─── Opções de frequência (intervalo em horas) ────────────────────────────
    // n/n h = a cada n horas | ex: 4/4 h = a cada 4 horas
    const opcoesFrequencia = Array.from({ length: 24 }, (_, i) => i + 1);

    function fnCarregarPrescricoes() {
        const paciente_id = new URLSearchParams(window.location.search).get("id");

        fetch(`${urlServer}/prescricoes/paciente/${paciente_id}`, {
            method: "GET",
            credentials: "include"
        })
            .then(res => {
                if (!res.ok) throw new Error("Erro ao carregar prescrições");
                return res.json();
            })
            .then(dados => setprescricoesRegistradas(dados))
            .catch(err => console.log(err));
    }

    return (
        <>
            <Navbar />
            <section id='prontuario-page-section'>

                {/* ── Modal Criar Prescrição ───────────────────────────────── */}
                <div className="modal fade" id="modalCriarPrescricao"
                    tabIndex="-1" aria-hidden="true" ref={modalCriarPrescricao}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <div className="p-2">
                                    <h5 className="modal-title">Nova Prescrição</h5>
                                    <p className="small opacity-75">Adicione uma ou mais medicações ao paciente.</p>
                                </div>
                                <button type="button" className="btn-close mb-5" data-bs-dismiss="modal" />
                            </div>

                            <div className="modal-body">
                                <form
                                    className="row g-3 needs-validation"
                                    noValidate
                                    ref={formRefPrescricao}
                                    onSubmit={SubmitPrescricao}
                                >
                                    <div className="col-12">
                                        <label className="form-label">Observação Geral</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Ex: Administrar com alimento."
                                            value={observacaoPrescricao}
                                            onChange={e => setObservacaoPrescricao(e.target.value)}
                                        />
                                    </div>

                                    <div className="col-12">
                                        <hr className="my-1 opacity-25" />
                                    </div>

                                    {itens.map((item, index) => (
                                        <div key={index} className="col-12">
                                            <div className="border rounded-2 p-3 position-relative">

                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <span className="fw-semibold small text-muted">
                                                        Medicamento {index + 1}
                                                    </span>
                                                    {itens.length > 1 && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() => removerItem(index)}
                                                        >
                                                            <i className="bi bi-trash"></i> Remover
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="row g-2">

                                                    <div className="col-12 col-md-6">
                                                        <label className="form-label">Medicamento *</label>
                                                        <select
                                                            className="form-select"
                                                            required
                                                            value={item.medicamento_id}
                                                            onChange={e => atualizarItem(index, "medicamento_id", e.target.value)}
                                                        >
                                                            <option value="">Escolha um medicamento</option>
                                                            {listaMedicamentos.map(m => (
                                                                <option key={m.id} value={m.id}>{m.nome_medicamento}</option>
                                                            ))}
                                                        </select>
                                                        <div className="invalid-feedback">Informe um medicamento.</div>
                                                    </div>

                                                    <div className="col-12 col-md-6">
                                                        <label className="form-label">Dosagem *</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="Ex: 500"
                                                            required
                                                            value={item.dosagem}
                                                            onChange={e => atualizarItem(index, "dosagem", e.target.value)}
                                                        />
                                                        <div className="invalid-feedback">Informe a dosagem.</div>
                                                    </div>

                                                    <div className="col-12 col-md-6">
                                                        <label className="form-label">Via *</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Ex: Oral"
                                                            required
                                                            value={item.via}
                                                            onChange={e => atualizarItem(index, "via", e.target.value)}
                                                        />
                                                        <div className="invalid-feedback">Informe a via.</div>
                                                    </div>

                                                    <div className="col-12 col-md-6">
                                                        <label className="form-label">Frequência *</label>
                                                        <select
                                                            className="form-select"
                                                            required
                                                            value={item.frequencia}
                                                            onChange={e => atualizarItem(index, "frequencia", e.target.value)}
                                                        >
                                                            <option value="">Escolha a frequência</option>
                                                            {/* n/n h = a cada n horas */}
                                                            {opcoesFrequencia.map(n => (
                                                                <option key={n} value={n}>{n}/{n} h</option>
                                                            ))}
                                                        </select>
                                                        <div className="invalid-feedback">Informe a frequência.</div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="col-12">
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
                                            onClick={adicionarItem}
                                        >
                                            <i className="bi bi-plus-circle"></i>
                                            Adicionar medicamento
                                        </button>
                                    </div>

                                    <div className="modal-footer mt-2">
                                        <button type="button" className="btn btn-outline-danger" data-bs-dismiss="modal">
                                            Cancelar
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            Salvar Prescrição
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Modal Editar Prescrição ──────────────────────────────── */}
                <div className="modal fade" id="modalEditarPrescricao"
                    tabIndex="-1" aria-hidden="true" ref={modalEditarPrescricao}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <div className="p-2">
                                    <h5 className="modal-title">Editar Prescrição</h5>
                                    <p className="small opacity-75">Altere a observação desta prescrição.</p>
                                </div>
                                <button type="button" className="btn-close mb-5" data-bs-dismiss="modal" />
                            </div>
                            <div className="modal-body">
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label">Observação</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Ex: Administrar com alimento."
                                            value={prescricaoEditando.observacao}
                                            onChange={e => setPrescricaoEditando(prev => ({ ...prev, observacao: e.target.value }))}
                                            maxLength={500}
                                        />
                                        <div className="form-text">Máximo 500 caracteres.</div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-danger" data-bs-dismiss="modal">
                                    Cancelar
                                </button>
                                <button type="button" className="btn btn-primary" onClick={fnSalvarEdicaoPrescricao}>
                                    Salvar Alterações
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Modal Cuidado ────────────────────────────────────────── */}
                <div className="modal fade" id="modalCriarCuidado"
                    tabIndex="-1" aria-hidden="true" ref={modalCriarCuidado}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <div className="p-2">
                                    <h5 className="modal-title">Novo Cuidado</h5>
                                    <p className="small opacity-75">Adicione um novo cuidado ao paciente.</p>
                                </div>
                                <button type="button" className="btn-close mb-5" data-bs-dismiss="modal" />
                            </div>
                            <div className="modal-body">
                                <form className="row g-3 needs-validation" noValidate ref={formRefCuidados} onSubmit={SubmitCuidado}>
                                    <div className="col-12">
                                        <label className="form-label">Tipo de cuidado *</label>
                                        <select className='form-select' required value={tipoCuidado}
                                            ref={tipoCuidadoRegistrado} onChange={(e) => setTipoCuidado(e.target.value)}>
                                            <option value="">Escolha um tipo de cuidado</option>
                                            {listaCuidados.map(c => (
                                                <option key={c.id} value={c.id}>{c.tipo_cuidado}</option>
                                            ))}
                                        </select>
                                        <div className="invalid-feedback">Informe um cuidado.</div>
                                    </div>
                                    {tipoCuidado === "outro" && (
                                        <div className="col-12">
                                            <label className="form-label">Especifique o cuidado *</label>
                                            <input type="text" className="form-control" placeholder="Descreva o cuidado" required />
                                            <div className="invalid-feedback">Informe qual cuidado será realizado.</div>
                                        </div>
                                    )}
                                    <div className="col-12">
                                        <label className="form-label">Observação *</label>
                                        <input type="text" className="form-control" required ref={observacao}
                                            placeholder='Ex: Aplicar quando houver dor.' />
                                        <div className="invalid-feedback">Informe a observação.</div>
                                    </div>
                                    <div className="modal-footer mt-2">
                                        <button type="button" className="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>
                                        <button type="submit" className="btn btn-primary">Adicionar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Conteúdo principal ───────────────────────────────────── */}
                <div className='container-prontuario'>
                    <div className='prontuario-header'>
                        <NavLink className='d-flex align-items-center gap-2 btn btn-primary px-3 py-2' id='voltarPaciente' to={'/pacientes'}>
                            <i className='bi bi-arrow-left'></i>
                            Voltar para os pacientes
                        </NavLink>
                    </div>

                    <div className='prontuario-content'>
                        <div className={`card card-prontuario ${statusClass}`}>

                            <div className='card-header d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-md-between py-3 px-4'>
                                <div className='d-flex align-items-center gap-3'>
                                    <span className={`icone-prontuario ${statusClass}`}>
                                        <i className='bi bi-person'></i>
                                    </span>
                                    <div className="d-flex flex-column">
                                        <h6 className='mb-0 mt-3'>{paciente?.nome_paciente}</h6>
                                        <p>{idade} <span>•</span> {paciente?.tipo_sanguineo} {paciente?.fator_rh}</p>
                                    </div>
                                </div>
                                <div className='mt-3 mt-md-0'>
                                    <TagStatus status={paciente?.status_paciente} />
                                </div>
                            </div>

                            <div className="card-button-group">
                                <div className="tabs-container">
                                    <button className={`tab-item ${activeTab === "dados" ? "active" : ""}`} onClick={() => setActiveTab("dados")}>
                                        Dados do Paciente
                                    </button>
                                    <button className={`tab-item ${activeTab === "prescricoes" ? "active" : ""}`} onClick={() => setActiveTab("prescricoes")}>
                                        Prescrições
                                    </button>
                                    <button className={`tab-item ${activeTab === "cuidados" ? "active" : ""}`} onClick={() => setActiveTab("cuidados")}>
                                        Cuidados de Enfermagem
                                    </button>
                                </div>

                                <div className="tab-content mt-2 card-body p-4">

                                    {/* ── Aba: Dados ── */}
                                    {activeTab === "dados" && (
                                        <div>
                                            <div className='row g-4'>
                                                <div className='col-12 col-md-6'>
                                                    <div className='row g-3'>
                                                        <div className='col-12'>
                                                            <h6 className='fw-semibold'>Nome Completo</h6>
                                                            <span className='text-muted'>{paciente?.nome_paciente}</span>
                                                        </div>
                                                        <div className='col-12'>
                                                            <h6 className='fw-semibold'>Data de Nascimento</h6>
                                                            <span className='text-muted'>{formatarDataBR(paciente?.data_nasc)} • {idade} anos</span>
                                                        </div>
                                                        <div className='col-12 mt-md-5'>
                                                            <h6>Equipe Responsável</h6>
                                                            <span className='text-muted'>{paciente?.equipe}</span>
                                                            <p className='text-muted'>Equipe multiprofissional responsável pelo cuidado integral.</p>
                                                        </div>
                                                        <div className='col-12'>
                                                            <h6 className='fw-semibold'>Localização</h6>
                                                            <span className='text-muted'>Quarto {paciente?.quarto} - Leito {paciente?.leito}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-12 col-md-6'>
                                                    <div className='row g-3'>
                                                        <div className='col-12'>
                                                            <h6 className='fw-semibold'>Nome da Mãe</h6>
                                                            <span className='text-muted'>{paciente?.mae_paciente}</span>
                                                        </div>
                                                        <div className='col-12'>
                                                            <h6 className='fw-semibold'>Tipo Sanguíneo / RH</h6>
                                                            <span className='text-muted'>{paciente?.tipo_sanguineo} {paciente?.fator_rh}</span>
                                                            <p className='text-muted'>Importante para transfusões e compatibilidade sanguínea.</p>
                                                        </div>
                                                        <div className='col-12'>
                                                            <h6 className='fw-semibold'>Setor</h6>
                                                            <span className='text-muted'>{paciente?.nome_setor}</span>
                                                        </div>
                                                        <div className='col-12 mt-5'>
                                                            <h6>Convênio</h6>
                                                            <span className='text-muted'>{paciente?.convenio}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-5">
                                                <hr className='text-muted mb-5' />
                                                <h5 className="fw-semibold mb-4">Relatórios do Paciente</h5>
                                                {relatorios.length === 0 && (
                                                    <p className="text-muted text-center fs-6 pb-3">Nenhum relatório encontrado.</p>
                                                )}
                                                <div className='row g-3 '>
                                                    {relatorios.map((r, index) => (
                                                        <div className='col-12' key={index}>
                                                            <CardRelatorio
                                                                PacienteSelecionado={r.nome_paciente}
                                                                usuario_nome={r.usuario_nome}
                                                                created_at={r.created_at}
                                                                TituloRelatorio={r.titulo}
                                                                ConteudoRelatorio={r.conteudo}
                                                                onPrint={() => onPrint(r)}
                                                                mostrarAcoes={true}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ── Aba: Prescrições ── */}
                                    {activeTab === "prescricoes" && (
                                        <div>
                                            <button
                                                className='btn btn-primary d-flex align-items-center gap-2'
                                                data-bs-toggle="modal"
                                                data-bs-target="#modalCriarPrescricao"
                                            >
                                                <i className='bi bi-plus fs-5 text-white'></i>
                                                Nova Prescrição
                                            </button>

                                            {prescricoesRegistradas.length === 0 && (
                                                <div className='mt-3 p-2 pb-3 text-muted'>
                                                    <span className='d-flex align-items-center gap-2 justify-content-center'>
                                                        Nenhuma prescrição registrada
                                                        <i className="bi bi-file-medical text-muted"></i>
                                                    </span>
                                                </div>
                                            )}

                                            {prescricoesRegistradas.map((p, index) => (
                                                <div className='mt-3' key={p.id}>
                                                    <div className='border rounded-2 p-3'>

                                                        {/* ── Cabeçalho com botões de editar e deletar ── */}
                                                        <div className='d-flex justify-content-between align-items-start mb-3'>
                                                            <div>
                                                                <h6 className="mb-0">Prescrição #{index + 1}</h6>
                                                                {p.observacao && (
                                                                    <span className="text-muted small">
                                                                        <i className="bi bi-info-circle me-1"></i>
                                                                        {p.observacao}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="d-flex align-items-center gap-2">
                                                                {/* Botão editar */}
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                                                                    title="Editar prescrição"
                                                                    onClick={() => abrirEdicaoPrescricao(p)}
                                                                >
                                                                    <i className="bi bi-pencil"></i>
                                                                    <span className="d-none d-md-inline">Editar</span>
                                                                </button>

                                                                {/* Botão deletar */}
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                                                                    title="Excluir prescrição"
                                                                    onClick={() => deletarPrescricao(p.id, index + 1)}
                                                                >
                                                                    <i className="bi bi-trash"></i>
                                                                    <span className="d-none d-md-inline">Excluir</span>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* ── Medicamentos e horários ── */}
                                                        <div className="d-flex flex-column gap-2">
                                                            {p.itens?.map((item, i) => (
                                                                <div key={item.id} className="border rounded-2 p-3">

                                                                    <div className='d-flex flex-column flex-md-row justify-content-between gap-2'>
                                                                        <div className='row g-2'>
                                                                            <div className='col-12'>
                                                                                <h6 className="mb-0">
                                                                                    <i className="bi bi-capsule text-primary me-2"></i>
                                                                                    {item.medicamento}
                                                                                </h6>
                                                                            </div>
                                                                            <div className='col-12'>
                                                                                <span className="text-muted small">
                                                                                    <strong>Dosagem:</strong> {item.dosagem} {item.unidade} &nbsp;•&nbsp;
                                                                                    <strong>Via:</strong> {item.via} &nbsp;•&nbsp;
                                                                                    <strong>Frequência:</strong> {item.frequencia}/{item.frequencia} h
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* ── Horários com DATETIME formatado ── */}
                                                                    <div className="mt-3">
                                                                        {item.horarios?.map((h, j) => (
                                                                            <div key={h.id} className="d-flex justify-content-between align-items-center border rounded p-2 mt-2">

                                                                                <div className="d-flex flex-column">
                                                                                    {/* Exibe DD/MM/YYYY HH:MM */}
                                                                                    <span className="fw-semibold">
                                                                                        {formatarHorarioPrescricao(h.horario)}
                                                                                    </span>
                                                                                </div>

                                                                                <div className="grupo-validacao">

                                                                                    {/* 2 = finalizado */}
                                                                                    <input
                                                                                        type="radio"
                                                                                        className="btn-check"
                                                                                        name={`horario-${index}-${i}-${j}`}
                                                                                        id={`ok-${index}-${i}-${j}`}
                                                                                        checked={h.status_id === 2}
                                                                                        onChange={() => alterarStatusHorario(h.id, 2)}
                                                                                    />
                                                                                    <label className="btn-validacao sucesso" htmlFor={`ok-${index}-${i}-${j}`}>
                                                                                        <i className="bi bi-check2"></i>
                                                                                    </label>

                                                                                    {/* 4 = negado_paciente */}
                                                                                    <input
                                                                                        type="radio"
                                                                                        className="btn-check"
                                                                                        name={`horario-${index}-${i}-${j}`}
                                                                                        id={`recusado-${index}-${i}-${j}`}
                                                                                        checked={h.status_id === 4}
                                                                                        onChange={() => alterarStatusHorario(h.id, 4)}
                                                                                    />
                                                                                    <label className="btn-validacao negadoPorPaciente" htmlFor={`recusado-${index}-${i}-${j}`}>
                                                                                        <i className="bi bi-circle"></i>
                                                                                    </label>

                                                                                    {/* 3 = nao_feito */}
                                                                                    <input
                                                                                        type="radio"
                                                                                        className="btn-check"
                                                                                        name={`horario-${index}-${i}-${j}`}
                                                                                        id={`negado-${index}-${i}-${j}`}
                                                                                        checked={h.status_id === 3}
                                                                                        onChange={() => alterarStatusHorario(h.id, 3)}
                                                                                    />
                                                                                    <label className="btn-validacao negado" htmlFor={`negado-${index}-${i}-${j}`}>
                                                                                        <i className="bi bi-x-lg"></i>
                                                                                    </label>

                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>

                                                                </div>
                                                            ))}
                                                        </div>

                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* ── Aba: Cuidados ── */}
                                    {activeTab === "cuidados" && (
                                        <div>
                                            <button className='btn btn-primary d-flex align-items-center gap-2'
                                                data-bs-toggle="modal" data-bs-target="#modalCriarCuidado">
                                                <i className='bi bi-plus fs-5 text-white'></i>
                                                Registrar Cuidado
                                            </button>

                                            {cuidadosPaciente.length === 0 && (
                                                <div className='mt-3 p-2 pb-3 text-muted'>
                                                    <span className='d-flex align-items-center gap-2 justify-content-center'>
                                                        Nenhum cuidado registrado
                                                        <i className="bi bi-heart-pulse text-muted"></i>
                                                    </span>
                                                </div>
                                            )}

                                            {cuidadosPaciente.map((cuiRe, index) => (
                                                <div className='mt-3' key={index}>
                                                    <div className="border rounded-2 p-3">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <div className="d-flex align-items-start gap-3">
                                                                <span className="icone-cuidados-registrados">
                                                                    <i className="bi bi-heart-pulse text-primary"></i>
                                                                </span>
                                                                <div>
                                                                    <h6 className="mb-1">{cuiRe.tipo_cuidado}</h6>
                                                                    <span className="text-muted small">{cuiRe.observacao}</span>
                                                                </div>
                                                            </div>
                                                            <div className='d-flex align-items-start justify-content-end gap-3'>
                                                                <div className="d-flex flex-column align-items-end gap-2">
                                                                    <div className="grupo-validacao">
                                                                        <input type="radio" className="btn-check" name={`validadoOpcoesCuidado-${index}`} id={`validado-okCuidado-${index}`} checked={cuiRe.status_id === 2} onChange={() => alterarStatusCuidado(cuiRe.id, 2)} />
                                                                        <label className="btn-validacao sucesso" htmlFor={`validado-okCuidado-${index}`}><i className="bi bi-check2"></i></label>
                                                                        <input type="radio" className="btn-check" name={`validadoOpcoesCuidado-${index}`} id={`validado-negadoPorPacienteCuidado-${index}`} checked={cuiRe.status_id === 4} onChange={() => alterarStatusCuidado(cuiRe.id, 4)} />
                                                                        <label className="btn-validacao negadoPorPaciente" htmlFor={`validado-negadoPorPacienteCuidado-${index}`}><i className="bi bi-circle"></i></label>
                                                                        <input type="radio" className="btn-check" name={`validadoOpcoesCuidado-${index}`} id={`validado-negadoCuidado-${index}`} checked={cuiRe.status_id === 3} onChange={() => alterarStatusCuidado(cuiRe.id, 3)} />
                                                                        <label className="btn-validacao negado" htmlFor={`validado-negadoCuidado-${index}`}><i className="bi bi-x-lg"></i></label>
                                                                    </div>
                                                                    <span className="text-muted small">{formatarDataBR(cuiRe.created_at)}</span>
                                                                </div>
                                                                <button type='button' className='btn btn-sm' title="Deletar cuidado" onClick={() => deletarCuidado(cuiRe.id)}>
                                                                    <i className='bi bi-trash text-danger'></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Prontuario