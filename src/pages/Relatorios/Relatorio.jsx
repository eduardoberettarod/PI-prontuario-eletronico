import React, { useEffect, useRef, useState } from 'react'
import './Relatorio.css'
import * as bootstrap from 'bootstrap';
import Navbar from '../../components/Navbar/Navbar';

//componentes
import CardRelatorio from '../../components/CardRelatorio/CardRelatorio';
import { urlServer } from '../../../config';

const Relatorio = () => {
  //EXCLUIR RELATORIO 
  const [relatorioParaExcluir, setRelatorioParaExcluir] = useState(null);
  const [relatorioEditando, setRelatorioEditando] = useState(null);
  const [pacientes, setPacientes] = useState([]);

  function pedirConfirmacaoDelete(id) {
    setRelatorioParaExcluir(id);

    const modal = bootstrap.Modal.getOrCreateInstance(
      document.getElementById('modalConfirmarDeleteRelatorio')
    );

    modal.show();
  }

  async function confirmarDeleteRelatorio() {
    if (!relatorioParaExcluir) return;

    const response = await fetch(`${urlServer}/relatorios/${relatorioParaExcluir}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (response.ok) {

      fnCarregarRelatorios();
    } else {
      console.error('Erro ao deletar');
    }

    setRelatorioParaExcluir(null);

    const modal = bootstrap.Modal.getInstance(
      document.getElementById('modalConfirmarDeleteRelatorio')
    );

    modal.hide();
  }

  async function fnCarregarPacientes() {
    const response = await fetch(`${urlServer}/pacientes`, {
      credentials: 'include'
    });

    const data = await response.json();
    setPacientes(data);
  }


  // TOAST RELATORIO
  const toastRefRelatorio = useRef(null)
  const toastInstanceRelatorio = useRef(null);

  useEffect(() => {
    if (toastRefRelatorio.current) {
      toastInstanceRelatorio.current = bootstrap.Toast.getOrCreateInstance(toastRefRelatorio.current, {
        autohide: true,
        delay: 2500,
      })
    }
  }, [])

  // FORM DO MODAL DE RELATORIOS / CRIAR RELATORIO

  const modalRefRelatorio = useRef(null)
  const PacienteSelecionado = useRef(null)
  const TituloRelatorio = useRef(null)
  const ConteudoRelatorio = useRef(null)

  const [relatorios, setRelatorios] = useState([]);
  const [toastMsg, setToastMsg] = useState({
    titulo: "",
    mensagem: "",
    tipo: "success"
  });

  async function fnCriarRelatorio() {
    const novoRelatorio = {
      paciente_id: PacienteSelecionado.current.value,
      titulo: TituloRelatorio.current.value,
      conteudo: ConteudoRelatorio.current.value
    };

    const response = await fetch(`${urlServer}/relatorios`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(novoRelatorio)
    });

    if (response.ok) {
      // recarregar lista depois
      fnCarregarRelatorios();
    }
  }

  async function fnCarregarRelatorios() {
    const response = await fetch(`${urlServer}/relatorios`, {
      credentials: 'include',
      method: 'GET'
    });

    const data = await response.json();

    if (Array.isArray(data)) {
      setRelatorios(data);
    } else {
      console.error("Erro vindo do backend:", data);
      setRelatorios([]);
    }
  }

  async function fnEditarRelatorio() {
    const dadosAtualizados = {
      paciente_id: PacienteSelecionado.current.value,
      titulo: TituloRelatorio.current.value,
      conteudo: ConteudoRelatorio.current.value
    };

    const response = await fetch(
      `${urlServer}/relatorios/${relatorioEditando.id}`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosAtualizados)
      }
    );

    if (response.ok) {
      fnCarregarRelatorios();
    } else {
      console.error('Erro ao editar');
    }
  }

  const formRefRelatorio = useRef(null)
  async function SubmitRelatorio(e) {
    e.preventDefault();

    const formRelatorio = formRefRelatorio.current;

    if (!formRelatorio.checkValidity()) {
      formRelatorio.classList.add("was-validated");
      return;
    }

    if (relatorioEditando) {
      await fnEditarRelatorio();
    } else {
      await fnCriarRelatorio();
    }

    const modalRelatorio = bootstrap.Modal.getOrCreateInstance(modalRefRelatorio.current);
    modalRelatorio.hide();

    document.activeElement.blur();

    if (relatorioEditando) {
      setToastMsg({
        titulo: "Relatório Atualizado",
        mensagem: "Relatório editado com sucesso!",
        tipo: "success"
      });
    } else {
      setToastMsg({
        titulo: "Relatório Criado",
        mensagem: "Relatório criado com sucesso!",
        tipo: "success"
      });
    }

    toastInstanceRelatorio.current?.show();

    formRelatorio.classList.remove("was-validated");
    setRelatorioEditando(null);
  }

  useEffect(() => {
    if (!modalRefRelatorio.current) return;

    const modalElRelatorio = modalRefRelatorio.current;

    const handleHidden = () => {
      modalElRelatorio.querySelector('form').reset();
      setRelatorioEditando(null);
    };

    modalElRelatorio.addEventListener("hidden.bs.modal", handleHidden);

    return () => {
      modalElRelatorio.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, []);

  useEffect(() => {
    fnCarregarRelatorios();
    fnCarregarPacientes();
  }, []);

  function abrirModalEditar(relatorio) {
    setRelatorioEditando(relatorio);

    const modal = bootstrap.Modal.getOrCreateInstance(modalRefRelatorio.current);
    modal.show();

    setTimeout(() => {
      if (PacienteSelecionado.current) {
        PacienteSelecionado.current.value = relatorio.paciente_id;
        TituloRelatorio.current.value = relatorio.titulo;
        ConteudoRelatorio.current.value = relatorio.conteudo;
      }
    }, 100);
  }

  return (
    <>
      <Navbar />
      <section id='relatorio-page-section'>

        {/* Modal Criar Relatorio */}
        <div className="modal fade" id="modalCriarRelatorio" tabIndex="-1" aria-hidden="true" ref={modalRefRelatorio}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">

              <div className="modal-header">
                <div className="p-2">
                  <h5 className="modal-title">{relatorioEditando ? "Editar Relatório" : "Novo Relatório"}</h5>
                  <p className="small opacity-75">Preencha os dados do paciente para fins educacionais</p>
                </div>
                <button
                  type="button"
                  className="btn-close mb-5"
                  data-bs-dismiss="modal"
                ></button>
              </div>

              <div className="modal-body">

                <form className="row g-3 needs-validation"
                  noValidate
                  ref={formRefRelatorio}
                  onSubmit={SubmitRelatorio}>

                  <div className="col-12">
                    <label className="form-label">Paciente *</label>

                    <select className="form-select" ref={PacienteSelecionado} required>
                      <option value="">Selecione um paciente</option>
                      {pacientes.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.nome_paciente} - {p.quarto}
                        </option>
                      ))}
                    </select>

                    <div className="invalid-feedback">
                      Selecione um paciente.
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Título do Relatório *</label>
                    <input type="text" className="form-control" ref={TituloRelatorio} required
                      placeholder='Ex: Avaliação Inicial, Evolução Clínica, etc.' />
                    <div className="invalid-feedback">
                      Informe o título do relatório.
                    </div>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label">Conteúdo do Relatório *</label>
                    <textarea className="form-control form-textarea-relatorio" ref={ConteudoRelatorio} required
                      placeholder='Descreva suas observações, análises e conclusões sobre o caso clínico.
                      
Sugestões de estrutura:
- Identificação do Paciente
- Anamnese
- Exame Físico
- Hipótese Diagnósticas
- Plano de Cuidados
- Considerações Finais
                      '>
                    </textarea>
                    <div className="invalid-feedback">
                      Preencha o conteúdo do relatório.
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
                      {relatorioEditando ? "Salvar Alterações" : "Criar Relatório"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Toast Relatorio */}
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div ref={toastRefRelatorio} className="toast" role="alert" aria-live="assertive" aria-atomic="true">
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

        {/* contudo principal */}
        <div className='container-relatorio'>

          <div className="d-flex flex-column flex-md-row mb-3 align-items-start align-items-md-center justify-content-md-between">

            <div className="text-start mb-2 mb-md-0">
              <h2 className="fw-bold">Relatórios Clínicos</h2>
              <p>Crie relatórios baseados nos prontuários dos pacientes</p>
            </div>

            <div className="d-flex justify-content-md-end container-action-btn">
              <button className="btn btn-primary d-flex align-items-center gap-2 header-action-btn"
                data-bs-toggle="modal"
                data-bs-target="#modalCriarRelatorio"
              >
                <i className="bi bi-plus fs-5"></i>
                Novo Relatório
              </button>
            </div>
          </div>

          <div className='w-100'>
            <form role="search">
              <div className="position-relative w-100 d-flex">
                <i className="bi bi-search position-absolute top-50 translate-middle-y ms-3 text-secondary"></i>
                <input
                  type="text"
                  className="form-control input-search"
                  placeholder="Buscar por título ou nome do paciente..."
                />
              </div>
            </form>
          </div>

          <div className='mt-4 row g-2'>
            {relatorios.map((r, index) => (
              <div className='col-12' key={index}>
                <CardRelatorio
                  PacienteSelecionado={r.nome_paciente}
                  usuario_nome={r.usuario_nome}
                  created_at={r.created_at}
                  TituloRelatorio={r.titulo}
                  ConteudoRelatorio={r.conteudo}
                  onDelete={() => pedirConfirmacaoDelete(r.id)}
                  onEdit={() => abrirModalEditar(r)}
                  onPrint={() => onPrint(r)}
                  mostrarAcoes={true}
                />
              </div>
            ))}
          </div>


        </div>

        {/* Modal para Deletar o Relatorio */}
        <div
          className="modal fade"
          id="modalConfirmarDeleteRelatorio"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title text-danger fw-bold">Confirmar exclusão</h5>
                <button className="btn-close" data-bs-dismiss="modal"></button>
              </div>

              <div className="modal-body">
                <p className='mb-1 mt-2'>Tem certeza que deseja excluir este relatório?</p>
                <p className="small text-muted">
                  Essa ação não pode ser desfeita.
                </p>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancelar
                </button>

                <button
                  className="btn btn-danger"
                  onClick={confirmarDeleteRelatorio}
                >
                  Excluir
                </button>
              </div>

            </div>
          </div>
        </div>

      </section >
    </>
  )
}

export default Relatorio
