# Variáveis de `Pacientes.jsx` e para que servem

Abaixo está uma lista simples e direta das variáveis usadas em `Pacientes.jsx` e uma explicação curta do propósito de cada uma.

## Refs (useRef)

- `collapseRef` — referência ao elemento de collapse (filtros). Usada para escutar eventos de abrir/fechar e atualizar `aberto`.

- `formFiltro` — referência ao formulário de filtros. Usada em `fnLimparFiltro()` para resetar os filtros.

- `toastRef` — referência ao elemento do toast (notificação). Usada para criar/ativar a instância do toast.

- `toastInstance` — referência à instância do Bootstrap Toast (usada para mostrar o toast programaticamente).

- `modalRef` — referência ao modal de "Criar Paciente". Usada para abrir/fechar corretamente e para resetar o form quando o modal fecha.

- `NomePaciente`, `NomeMaePaciente`, `NascPaciente`, `TipoSanguePaciente`, `FatorRhPaciente`, `EquipePaciente`, `StatusPaciente`, `ConvenioPaciente`, `QuartoPaciente`, `LeitoPaciente` — refs para os inputs do formulário de criação; seus `.current.value` são lidos para criar um novo paciente.

- `NascInvalido` — referência ao elemento que mostra a mensagem de data de nascimento inválida (mostrado quando a data é no futuro).

- `formRef` — referência ao formulário de criação; usada para validação (`checkValidity()`), adicionar/remover as classes de validação e resetar o formulário.

## State (useState) 

- `aberto`, `setAberto` — booleano que indica se os filtros (collapse) estão abertos (true/false).

- `pacientes`, `setPacientes` — array que guarda os pacientes criados; usado para mostrar a contagem (`pacientes.length`) e gerar os cards (`pacientes.map(...)`).

## Funções principais 

- `fnLimparFiltro()` — limpa o formulário de filtros (chama `formFiltro.current.reset()`).

- `fnCriarPaciente()` — cria um objeto `novoPaciente` a partir dos refs do form e adiciona ao estado `pacientes`.

- `handleSubmit(e)` — valida o formulário de criação (incluindo checar se a data de nascimento não é no futuro), chama `fnCriarPaciente()`, fecha o modal, mostra o toast e reseta o formulário.

## Observações rápidas 

- As refs de inputs são usadas para ler valores diretamente (sem controlled inputs) quando se cria um paciente.

- O `toastInstance` e o `modalRef` usam as APIs do Bootstrap para controle correto da UI.