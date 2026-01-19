import React, { useEffect, useRef, useState } from 'react'
import './Relatorio.css'
import * as bootstrap from 'bootstrap';
import Navbar from '../../components/Navbar/Navbar';

//componentes
import CardRelatorio from '../../components/CardRelatorio/CardRelatorio';

const Relatorio = () => {
  //EXCLUIR RELATORIO 
  const [relatorioParaExcluir, setRelatorioParaExcluir] = useState(null);

  function pedirConfirmacaoDelete(index) {
    setRelatorioParaExcluir(index);

    const modal = bootstrap.Modal.getOrCreateInstance(
      document.getElementById('modalConfirmarDeleteRelatorio')
    );

    modal.show();
  }

  function confirmarDeleteRelatorio() {
    setRelatorios(prev =>
      prev.filter((_, index) => index !== relatorioParaExcluir)
    );

    setRelatorioParaExcluir(null);

    const modal = bootstrap.Modal.getInstance(
      document.getElementById('modalConfirmarDeleteRelatorio')
    );

    modal.hide();
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

  function fnCriarRelatorio() {

    const novoRelatorio = {
      PacienteSelecionado: PacienteSelecionado.current.value,
      TituloRelatorio: TituloRelatorio.current.value,
      ConteudoRelatorio: ConteudoRelatorio.current.value
    };

    setRelatorios(prev => [...prev, novoRelatorio]);
  }

  const formRefRelatorio = useRef(null)
  function SubmitRelatorio(e) {

    e.preventDefault();

    const formRelatorio = formRefRelatorio.current

    // validação bootstrap
    if (!formRelatorio.checkValidity()) {
      formRelatorio.classList.add("was-validated");
      return
    }

    // cria o relatorio
    fnCriarRelatorio();

    //fecha o modal
    const modalRelatorio = bootstrap.Modal.getOrCreateInstance(modalRefRelatorio.current);
    modalRelatorio.hide();

    //remove foco do botão antes do modal fechar (EVITA TRAVAMENTO DO BACKDROP)
    document.activeElement.blur();

    // 3️ mostra o toast
    toastInstanceRelatorio.current?.show();


    formRelatorio.classList.remove("was-validated")
  }

  useEffect(() => {
    if (!modalRefRelatorio.current) return;

    const modalElRelatorio = modalRefRelatorio.current;

    const handleHidden = () => {
      modalElRelatorio.querySelector('form').reset();
    }

    modalElRelatorio.addEventListener("hidden.bs.modal", handleHidden);

    return () => {
      modalElRelatorio.removeEventListener("hidden.bs.modal", handleHidden)
    };
  }, []);



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
                  <h5 className="modal-title">Novo Relatório</h5>
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
                    <select type="text" className="form-select" ref={PacienteSelecionado} required>
                      <option value="" selected disabled>Selecione um paciente</option>
                      <option value="João da Silva">João da Silva - Quarto 201/A</option>
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
                      Criar Relatório
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
              <strong className="me-auto d-flex align-items-center text-success">
                Relatório Criado <i className="bi bi-check fs-5 ms-1"></i>
              </strong>
              <button type="button" className="btn-close" data-bs-dismiss="toast"></button>
            </div>

            <div className="toast-body">
              Relatório criado com sucesso!
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
                  PacienteSelecionado={r.PacienteSelecionado}
                  TituloRelatorio={r.TituloRelatorio}
                  ConteudoRelatorio={r.ConteudoRelatorio}
                  onDelete={() => pedirConfirmacaoDelete(index)}
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
