# 🔧 DEBUGGING - Erro 500 ao Salvar Prescrição

## ✅ Mudanças Implementadas

1. **Inserção SEQUENCIAL** (não paralela) - evita race conditions
2. **Validação individual de medicamentos** - sem problemas de query IN
3. **Logs MUITO detalhados** - mostra exatamente onde falha

---

## 🚀 Como Debugar

### 1️⃣ Abra o console do Node.js

Procure por logs como:

```
🔍 Iniciando validações do banco...
✅ Paciente validado: 1
✅ Status validado
✅ Todos os medicamentos validados
✅ VALIDAÇÕES COMPLETAS - Iniciando inserção...
📝 Inserindo prescrição para paciente_id: 1
✅ Prescrição criada com ID: 5
📝 Inserindo 1 itens...
🚀 Iniciando inserção de 1 itens para prescrição 5
📝 Processando item 1/1...
✅ Item 1 criado com ID: 3
📝 Item 1 tem 2 horários
✅ Horário 1 (08:00) inserido para medicamento 1
✅ Horário 2 (20:00) inserido para medicamento 1
✅ Item 1 - todos os horários inseridos
✅ Prescrição completa com sucesso! ID: 5
```

### 2️⃣ Se houver erro, procure por:

```
❌ Erro ao inserir item 1: _____ (mensagem do erro)
⚠️ Horário inválido
❌ Erro ao inserir horário 1: _____ (mensagem do erro)
```

---

## 🔴 Erros Comuns e Soluções

### ❌ "Erro ao criar prescrição"
```
Solução: Verifique se:
- A coluna data_prescricao existe em prescricoes
- O usuario_id é válido
- O paciente_id é válido
```

### ❌ "Erro ao inserir item"
```
Solução: Verifique se:
- A tabela itens_prescricao existe
- As colunas: prescricao_id, medicamento_id, dosagem, via, frequencia existem
- medicamento_id existe na tabela medicamentos
```

### ❌ "Erro ao inserir horário"
```
Solução: Verifique se:
- A tabela horarios_prescricao existe
- As colunas: item_prescricao_id, horario, status_id existem
- A coluna status_id foi adicionada pela migração
- O status_id = 1 existe em status_cuidado
```

### ❌ "Formato de horário inválido"
```
Solução: O frontend está gerando horários com formato errado
- Deve ser: "08:00" (HH:MM)
- Não: "8:00" ou "08:0" ou "8"
```

---

## 🔍 Verificar Banco de Dados

```sql
-- Confirmar estrutura
DESCRIBE horarios_prescricao;
-- Deve ter: id, item_prescricao_id, horario, status_id, created_at

DESCRIBE itens_prescricao;
-- Deve ter: id, prescricao_id, medicamento_id, dosagem, via, frequencia

DESCRIBE prescricoes;
-- Deve ter: id, paciente_id, usuario_id, observacao, data_prescricao

-- Confirmar status existe
SELECT * FROM status_cuidado WHERE id = 1;
-- Deve retornar: id=1, nome_status='pendente'

-- Confirmar medicamento existe
SELECT * FROM medicamentos WHERE id = 1;
-- Deve retornar registro
```

---

## 📝 Passo-a-Passo para Testar

1. **Abra o console do Node.js**
2. **No navegador (_F12_), preencha o formulário:**
   - Medicamento: Selecione um (ex: id=1)
   - Dosagem: 500
   - Via: Oral
   - Frequência: 2
   - Observação: "Teste"
3. **Clique "Salvar Prescrição"**
4. **Observe o console do Node.js:**
   - Se sucesso: Verá "✅ Prescrição completa com sucesso!"
   - Se erro: Verá "❌ Erro ao ..." com detalhes
5. **Se houver erro, copie a mensagem e compare com soluções acima**

---

## 💡 Dicas

- Os logs estão em **português com emojis** para fácil leitura
- Cada passo é numerado (item 1/X)
- Horários mostram a hora exata inserida
- Erros mostram o medicamento e horário exato
- Total de 3 níveis de detalhe: ❌ erro, ⚠️ aviso, ✅ sucesso

---

**Se o erro persistir, copie TODO o console do Node.js e compare com este guia.**

Status: 🟢 Pronto para debug
