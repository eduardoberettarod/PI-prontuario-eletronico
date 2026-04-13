# 📋 Prontuário Eletrônico

Um sistema web moderno para gerenciamento de prontuários eletrônicos de pacientes. Permitindo visualizar, atualizar e gerenciar informações médicas de forma segura e eficiente.

## 🎯 Sobre o Projeto

O **Prontuário Eletrônico** é uma aplicação web desenvolvida com React e Vite, projetada para profissionais de saúde organizarem e acessarem informações de pacientes de maneira centralizada. O sistema oferece:

- ✅ Autenticação segura de usuários
- 👥 Gerenciamento de pacientes
- 📝 Prontuários médicos detalhados
- 💊 Registro de medicamentos
- 🏥 Organização por setor/departamento
- 📊 Relatórios e análises
- 👤 Gerenciamento de perfis de usuários
- 🔒 Controle de acesso com roles e permissões

## 📦 Dependências Necessárias

Este projeto requer que você baixe e configure **dois repositórios adicionais** para funcionar corretamente:

### 1. **pi-prontuario-eletronico-backend**
Backend da aplicação - API REST responsável pela lógica de negócio e gerenciamento de dados.

[Repositório do Backend](https://github.com/eduardoberettarod/PI-prontuario-eletronico-backend)

### 2. **documentacao-prontuario-eletronico** ⚠️ **IMPORTANTE**
Contém a **documentação do projeto e o banco de dados**. Você **precisa baixar este repositório** para obter o banco de dados necessário.

[Repositório da Documentação](https://github.com/eduardoberettarod/documentacao-prontuario-eletronico)

## 🚀 Como Instalar e Executar

### Pré-requisitos
- Node.js (v16 ou superior)
- npm ou yarn
- Git

### Passo 1: Clonar o repositório Frontend
```bash
git clone https://github.com/eduardoberettarod/PI-prontuario-eletronico
cd PI-prontuario-eletronico
```

### Passo 2: Clonar o Backend
```bash
git clone https://github.com/eduardoberettarod/PI-prontuario-eletronico-backend
cd pi-prontuario-eletronico-backend
npm install
# Siga as instruções de configuração do backend
```

### Passo 3: Clonar a Documentação (com banco de dados)
```bash
git clone https://github.com/eduardoberettarod/documentacao-prontuario-eletronico
# A documentação contém o banco de dados necessário para o projeto funcionar
```

### Passo 4: Instalar dependências do Frontend
```bash
# De volta no diretório PI-prontuario-eletronico
npm install
```

### Passo 5: Configurar variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto com as configurações necessárias:
```env
VITE_API_URL=http://localhost:3000
# Adicione outras variáveis conforme necessário
```

### Passo 6: Executar em modo desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm run preview` - Visualiza a build de produção localmente
- `npm run lint` - Executar ESLint para verificar a qualidade do código

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── AuthContext/     # Contexto de autenticação
│   ├── Card/            # Componentes de card
│   ├── Loader/          # Componente de carregamento
│   ├── Navbar/          # Navegação
│   └── ...
├── pages/               # Páginas da aplicação
│   ├── Home/            # Página inicial
│   ├── Login/           # Login de usuários
│   ├── Pacientes/       # Gerenciamento de pacientes
│   ├── Prontuarios/     # Prontuários médicos
│   ├── Relatorios/      # Relatórios
│   └── ...
├── style/               # Estilos globais
├── App.jsx              # Componente raiz
└── main.jsx             # Arquivo de entrada
```

## 🔒 Autenticação

O sistema utiliza autenticação via contexto React (`AuthContext`) que valida credenciais do usuário e mantém a sessão ativa. Certifique-se de que o backend está rodando para a autenticação funcionar.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React, Vite
- **Estilização**: CSS3
- **Roteamento**: React Router
- **Gerenciamento de Estado**: Context API
- **Linting**: ESLint

## 📚 Documentação Adicional

Para mais informações sobre a configuração completa, banco de dados e documentação do projeto, consulte o repositório `documentacao-prontuario-eletronico`.

## 👤 Conta de Teste

Para testar o sistema, utilize as seguintes credenciais:

| Campo | Valor |
|-------|-------|
| **Email** | `teste.docente@demo.com` |
| **Senha** | `senha123` |

> **Nota**: Esta conta de teste está disponível no banco de dados após a execução do schema de documentação.

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

**Nota Importante**: Este projeto requer que os três repositórios (frontend, backend e documentação) estejam instalados e configurados para funcionar corretamente.
