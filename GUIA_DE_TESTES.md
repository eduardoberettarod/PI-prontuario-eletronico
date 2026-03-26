# 🧪 GUIA DE TESTES - Sistema de Prescrições

## 📝 Pré-requisitos

1. ✅ Backend Node.js rodando em `localhost:3000`
2. ✅ Frontend React rodando em `localhost:5173`
3. ✅ Banco de dados MySQL com tabelas criadas
4. ✅ Usuário autenticado no sistema
5. ✅ **IMPORTANTE:** Executar o SQL de migração

---

## 🔧 PASSO 1: Executar Migração SQL

### No seu gerenciador de banco de dados:

```sql
-- Copie e execute o arquivo: migrations/001_add_status_to_horarios.sql

-- Ou manualmente:
ALTER TABLE horarios_prescricao 
ADD COLUMN status_id INT DEFAULT 1 AFTER horario;

ALTER TABLE horarios_prescricao 
ADD CONSTRAINT fk_horario_status
FOREIGN KEY (status_id) REFERENCES status_cuidado(id);

-- Confirme:
DESCRIBE horarios_prescricao;
-- Deve mostrar: status_id, horario, item_prescricao_id, id
```

---

## 🧪 TESTE 1: Validar Dados Inválidos

### Caso 1a: Sem medicamento selecionado
```
✅ Esperado: Alert "Medicamento 1: selecione um medicamento"
❌ Não deve fazer POST
```

### Caso 1b: Dosagem vazia
```
✅ Esperado: Alert "Medicamento 1: dosagem inválida"
❌ Não deve fazer POST
```

### Caso 1c: Via vazia
```
✅ Esperado: Alert "Medicamento 1: informe a via"
❌ Não deve fazer POST
```

### Caso 1d: Frequência fora do intervalo
```
Evento: Frequência = 0 ou 25
✅ Esperado: Alert "Medicamento 1: frequência inválida (deve estar entre 1 e 24)"
❌ Não deve fazer POST
```

---

## 🧪 TESTE 2: Validar Geração de Horários

### Caso 2a: Frequência = 1
```
Medicamento com frequência 1
✅ Esperado: 1 horário gerado
Exemplo: ["08:00"]
```

### Caso 2b: Frequência = 2
```
✅ Esperado: 2 horários gerados
Exemplo: [
    { horario: "00:00", status_id: 1 },
    { horario: "12:00", status_id: 1 }
]
```

### Caso 2c: Frequência = 3
```
✅ Esperado: 3 horários gerados
Exemplo: [
    { horario: "00:00", status_id: 1 },
    { horario: "08:00", status_id: 1 },
    { horario: "16:00", status_id: 1 }
]
```

### Caso 2d: Frequência = 24
```
✅ Esperado: 24 horários gerados (um por hora)
Exemplo: [
    { horario: "00:00", status_id: 1 },
    { horario: "01:00", status_id: 1 },
    ...
    { horario: "23:00", status_id: 1 }
]
```

---

## 🧪 TESTE 3: Enviar Prescrição Válida

### Configuração:
```
Paciente: ID válido (ex: 1)
Medicamento 1:
  - Nome: Dipirona 500mg (ID: 1 ou outro válido)
  - Dosagem: 500
  - Via: Oral
  - Frequência: 2
Observação: "Tomar com água"
```

### Ações:
1. Preencha o formulário
2. Clique em "Salvar Prescrição"
3. Observe o botão com loading

### Esperado:
```
✅ Botão mostra "Salvando..." com spinner
✅ Alert de sucesso: "✅ Prescrição criada com sucesso!"
✅ Modal fecha automaticamente
✅ Prescrições são recarregadas
✅ Nova prescrição aparece na lista
```

### Backend (console):
```
POST /prescricoes: { paciente_id: 1, usuario_id: 2, itens_count: 1 }
✅ Prescrição criada: 5
✅ Prescrição completa: 5
```

---

## 🧪 TESTE 4: Múltiplos Medicamentos

### Configuração:
```
Medicamento 1: Dipirona 500mg, Oral, Freq 2
Medicamento 2: Amoxicilina 500mg, IM, Freq 3
Medicamento 3: Vitamina C, Oral, Freq 1
```

### Esperado:
```
✅ POST envia array com 3 itens
✅ Cada item tem seus horários
✅ Total de horários: 2 + 3 + 1 = 6
✅ No banco: 1 prescrição, 3 itens, 6 horários
```

---

## 🧪 TESTE 5: Editar Prescrição (Futura Feature)

### Estrutura esperada no GET:
```javascript
{
    id: 5,
    observacao: "Tomar com água",
    data: "2026-03-26T10:30:00Z",
    itens: [
        {
            id: 3,
            medicamento_id: 1,
            medicamento: "Dipirona 500mg",
            unidade: "mg",
            dosagem: 500,
            via: "Oral",
            frequencia: 2,
            horarios: [
                {
                    id: 7,
                    horario: "08:00",
                    status_id: 1  // ✅ Agora presente!
                },
                {
                    id: 8,
                    horario: "20:00",
                    status_id: 1
                }
            ]
        }
    ]
}
```

### Verificar no Frontend:
```javascript
// No console do navegador:
prescrições[0].itens[0].horarios[0].status_id
// ✅ Deve retornar: 1
```

---

## 🔍 DEBUG: Monitorar Requisições

### Ativar DevTools (F12) e ir para "Network":

#### POST /prescricoes:
```
Method: POST
Status: 201 (Created) ✅ ou 400 (Bad Request) ❌
Headers: Content-Type: application/json
Body:
{
    "paciente_id": 1,
    "observacao": "...",
    "itens": [...]
}
Response:
{
    "sucesso": true,
    "prescricao_id": 5,
    "mensagem": "Prescrição criada com sucesso"
}
```

#### GET /prescricoes/paciente/1:
```
Status: 200 ✅
Response:
[
    {
        "id": 5,
        "itens": [...],
        "horarios": [
            { "id": 7, "horario": "08:00", "status_id": 1 }
        ]
    }
]
```

---

## 🔴 TROUBLESHOOTING

### ❌ Alert "Usuário não autenticado"
```
Problema: req.session.usuario é undefined
Solução: 
1. Verifique se está logado
2. Verifique se cookies estão sendo enviados
3. Verifique CORS em server.js:
   - credentials: true ✅
   - origin: "http://localhost:5173" ✅
```

### ❌ Alert "Paciente não identificado"
```
Problema: URL não tem parâmetro ?id=
Solução:
1. Verifique se está acessando a página corretamente
2. URL deve ser: /prontuario?id=1
```

### ❌ Status 404 no POST
```
Problema: URL errada na requisição
Solução: Frontend deve fazer POST em /prescricoes (não /paciente/prescricoes)
Verifique no arquivo: Prontuario.jsx linha ~85
fetch(`${urlServer}/prescricoes`, ...)  ✅
```

### ❌ Status 500 - "Erro ao criar prescrição"
```
Problema: Erro ao inserir na tabela prescricoes
Soluções:
1. Verifique no console do backend qual é o erro exato
2. Pode ser: paciente_id não existe, coluna faltando, etc
```

### ❌ Horários não aparecem no GET
```
Problema: Campo status_id retorna undefined
Solução: Execute a migração SQL (passo 1)
Verifique: DESCRIBE horarios_prescricao;
Deve ter: id, item_prescricao_id, horario, status_id, created_at
```

### ❌ "Máximo de 20 medicamentos por prescrição"
```
Problema: User tentou adicionar mais de 20 medicamentos
Esperado: Este é o limite de validação
Solução: Criar múltiplas prescrições
```

---

## ✅ CHECKLIST DE TESTES

- [ ] Teste 1a: Medicamento vazio → Validação OK
- [ ] Teste 1b: Dosagem vazia → Validação OK
- [ ] Teste 1c: Via vazia → Validação OK
- [ ] Teste 1d: Frequência inválida → Validação OK
- [ ] Teste 2a: Frequência 1 → 1 horário
- [ ] Teste 2b: Frequência 2 → 2 horários
- [ ] Teste 2c: Frequência 3 → 3 horários
- [ ] Teste 2d: Frequência 24 → 24 horários
- [ ] Teste 3: Prescrição simples → Sucesso
- [ ] Teste 4: Múltiplos medicamentos → Sucesso
- [ ] Teste 5: GET retorna status_id → Presente
- [ ] Debug: Network mostra 201 → OK
- [ ] Debug: GET mocestra horários → Completo
- [ ] Troubleshoot: Erros resolvidos → Funcionando

---

## 📞 RELATÓRIO

Se algum teste falhar:
1. Verifique o console do navegador (F12 → Console)
2. Verifique o console do Node.js (terminal)
3. Verifique o banco de dados directamente
4. Compare com este documento
5. Reporte exatamente qual teste falhou e qual foi a mensagem

---

**Data:** 26 de Março de 2026
**Status:** 🟢 COMPLETO E TESTÁVEL
