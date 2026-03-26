# 🔧 PASSO-A-PASSO PARA DEBUGAR ERRO 500

## ❌ ERRO: POST /prescricoes retorna 500 (Internal Server Error)

---

## 🚀 PASSO 1: Executar Diagnóstico do Banco

### Abra o DBClient (ou MySQL Workbench) e execute:

```sql
-- Arquivo: diagnostico_banco.sql
-- Copie TODO o conteúdo e execute no seu gerenciador de banco
```

### Procure por estas 3 coisas CRÍTICAS:

#### ✅ 1. A coluna `status_id` existe em `horarios_prescricao`?

```
Se DESCRIBE horarios_prescricao mostrar:
- id ✅
- item_prescricao_id ✅
- horario ✅
- status_id ✅ ← DEVE ESTAR AQUI
- created_at (opcional)

Se NÃO mostrar status_id:
❌ MIGRAÇÃO NÃO FOI EXECUTADA!
👉 Execute: migrations/001_add_status_to_horarios.sql
```

#### ✅ 2. A tabela `status_cuidado` tem o registro id=1?

```
Se SELECT * FROM status_cuidado retornar:
id | nome_status
1  | pendente ✅

Se retornar vazio ou id diferentes:
❌ Dados não configurados
👉 Execute:
INSERT INTO status_cuidado (nome_status) VALUES ('pendente');
```

#### ✅ 3. Existe pelo menos 1 medicamento?

```
Se SELECT COUNT(*) FROM medicamentos retornar:
- 0 → ❌ Nenhum medicamento cadastrado!
- >0 → ✅ OK

Se está vazio:
👉 Cadastre medicamentos primeiro
```

---

## 🔍 PASSO 2: Verificar Console do Node.js

### Abra o terminal do Node.js e procure por:

```
🔍 Iniciando validações do banco...
```

Se NÃO APARECER nada:
- ❌ Backend não recebeu a requisição
- 👉 Verifique logs do Express
- 👉 Teste com curl:
  ```bash
  curl -X POST http://localhost:3000/prescricoes \
    -H "Content-Type: application/json" \
    -d '{"paciente_id":1,"observacao":"teste","itens":[]}'
  ```

Se aparecer `🔍 Iniciando validações do banco...`, procure por LINHAS COM ❌:

```
❌ Paciente não encontrado
❌ Status não encontrado
❌ Medicamentos não encontrados
❌ Erro ao criarprescricao
❌ Erro ao inserir item
❌ Erro ao inserir horário
```

---

## 📋 PASSO 3: Diagnóstico por Mensagem de Erro

### Se no console do Node aparecer:

#### ❌ "❌ Paciente não encontrado"
```
Problema: paciente_id não existe na tabela pacientes
Solução:
1. Verifique o paciente_id que está enviando (ex: 1)
2. Execute no banco:
   SELECT * FROM pacientes WHERE id = 1;
3. Se não retornar nada, o paciente não existe
4. Use um paciente_id que existe
```

#### ❌ "❌ Status não encontrado"
```
Problema: status_id = 1 não existe em status_cuidado
Solução:
1. Execute: SELECT * FROM status_cuidado;
2. Se não mostrar id=1, execute:
   INSERT INTO status_cuidado (id, nome_status) 
   VALUES (1, 'pendente');
```

#### ❌ "❌ Medicamentos não encontrados"
```
Problema: medicamento_id não existe
Solução:
1. Execute: SELECT id, nome_medicamento FROM medicamentos;
2. Copie um ID válido
3. No formulário, selecione esse medicamento
4. Tente novamente
```

#### ❌ "❌ Erro ao criar prescrição"
```
Problema: Erro ao inserir em prescricoes
Soluções:
1. Verifique se as colunas existem:
   DESCRIBE prescricoes;
   (Deve ter: id, paciente_id, usuario_id, observacao, data_prescricao)
2. Verifique se paciente_id e usuario_id são válidos
3. Faça teste manual SEGURO:
   INSERT INTO prescricoes (...) VALUES (...);
```

#### ❌ "❌ Erro ao inserir item"
```
Problema: Erro ao inserir em itens_prescricao
Soluções:
1. Verifique estrutura:
   DESCRIBE itens_prescricao;
2. Verifique se medicamento_id existe:
   SELECT id FROM medicamentos WHERE id = [SEU_ID];
3. Teste dosagem > 0 e < 10000
4. Teste via não vazia (ex: "Oral")
```

#### ❌ "❌ Erro ao inserir horário"
```
Problema: Erro ao inserir em horarios_prescricao
Soluções:
1. Verifique estrutura:
   DESCRIBE horarios_prescricao;
   (Deve ter: id, item_prescricao_id, horario, status_id)
2. Verifique se status_id = 1 existe:
   SELECT * FROM status_cuidado WHERE id = 1;
3. Verifique formato de horário (deve ser HH:MM):
   - ✅ "08:00"
   - ❌ "8:00"
   - ❌ "8"
```

---

## ✅ PASSO 4: Testar Script Seguro do Banco

No DBClient, execute (comentado com /* */ para evitar acidentes):

```sql
-- ⚠️ ESTE SCRIPT NÃO SALVA - FAZ ROLLBACK

BEGIN;  -- Iniciar transação

-- 1. Ver medicamentos disponíveis
SELECT id, nome_medicamento FROM medicamentos LIMIT 1;
-- Copie o ID (ex: 1)

-- 2. Ver pacientes disponíveis
SELECT id, nome_paciente FROM pacientes LIMIT 1;
-- Copie o ID (ex: 1)

-- 3. Ver usuários disponíveis
SELECT id, nome FROM usuarios LIMIT 1;
-- Copie o ID (ex: 1)

-- 4. Ver status
SELECT * FROM status_cuidado WHERE id = 1;
-- Deve retornar: id=1, nome_status='pendente'

-- ✅ Se todos os passos acima funcionaram, o banco está OK!

ROLLBACK;  -- Cancela tudo (não salva nada)
```

---

## 🎯 CHECKLIST DE DEBUG

- [ ] Coluna `status_id` existe em `horarios_prescricao`?
- [ ] Tabela `status_cuidado` tem id=1?
- [ ] Existe pelo menos 1 medicamento?
- [ ] Existe pelo menos 1 paciente?
- [ ] Existe pelo menos 1 usuário?
- [ ] Console do Node mostra logs de validação?
- [ ] Qual é a 1ª mensagem de ❌ erro?

---

## 📞 PRÓXIMO PASSO

1. **Abra o arquivo:** `diagnostico_banco.sql`
2. **Execute no seu gerenciador de banco**
3. **Copie TODAS as respostas**
4. **Relate qual passo falha primeiro**

Exemplo de relatório:
```
"Executei diagnostico_banco.sql e:
- TABLES: mostra prescricoes, itens_prescricao, ❌ horarios_prescricao NÃO EXISTE
- Status: ❌ Tabela status_cuidado vazia
- Medicamentos: ✅ 5 medicamentos"
```

---

**Status:** 🔴 BLOQUEADO - Esperando diagnóstico do banco
