import React, { useRef } from 'react'
import './Relatorio.css'
import * as bootstrap from 'bootstrap';

//componentes
import CardRelatorio from '../../components/CardRelatorio/CardRelatorio';

const Relatorio = () => {

  const modalRefRelatorio = useRef(null)
  const PacienteSelecionado = useRef(null)
  const TituloRelatorio = useRef(null)
  const ConteudoRelatorio = useRef(null)

  return (
    <>
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
                >

                  <div className="col-12">
                    <label className="form-label">Paciente *</label>
                    <select type="text" className="form-select" ref={PacienteSelecionado} required>
                      <option value="" selected disabled>Selecione um paciente</option>
                      <option value="">João da Silva - Quarto 201/A</option>
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
                    <button className="btn btn-outline-danger" data-bs-dismiss="modal">
                      Cancelar
                    </button>

                    <button type="submit" className="btn btn-primary">
                      Criar Paciente
                    </button>
                  </div>
                </form>
              </div>
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
                  placeholder="Buscar por nome, equipe ou quarto..."
                />
              </div>
            </form>
          </div>

          <div className='mt-4'>
          <CardRelatorio />
          </div>


        </div>

      </section >
    </>
  )
}

export default Relatorio
