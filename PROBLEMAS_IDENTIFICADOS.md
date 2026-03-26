# 🔴 Problemas Identificados - Sistema de Prescrições

## 1️⃣ MISMATCH CRÍTICO: Frontend vs Backend

### Problema
O **frontend envia dados em um formato** que o **backend não espera**:

#### Frontend (Prontuario.jsx, linhas 85-90):
```javascript
const itensComHorarios = itens.map(item => ({
    ...item,
    horarios: gerarHorarios(item),  // ❌ Array de STRINGS: ["08:00", "16:00", ...]
    status_id: 1
}));
```

A função `gerarHorarios()` retorna um array de **strings**:
```javascript
// Retorna: ["08:00", "16:00", "00:00"]
horarios.push(`${hh}:${mm}`);
```

#### Backend (prescricoes.js, linha 154):
```javascript
if (item.horarios && item.horarios.length > 0) {
    const horariosPromises = item.horarios.map(h => {
        return new Promise((resolveH, rejectH) => {
            db.query(
                `INSERT INTO horarios_prescricao 
                (item_prescricao_id, horario, status_id) 
                VALUES (?, ?, ?)`,
                [item_id, h.horario, h.status_id],  // ❌ h.horario = undefined
                // ❌ h.status_id = undefined
                //    pois h é uma STRING "08:00", não um objeto
```

**Resultado:** Insere `NULL` nos campos, causando erro ou dados inválidos.

---

## 2️⃣ BANCO DE DADOS: Tabela mal definida

### Problema na definição SQL
O SQL comentado está **INCOMPLETO**:

```sql
CREATE TABLE horarios_prescricao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_prescricao_id INT NOT NULL,
    horario TIME NOT NULL,
    FOREIGN KEY (item_prescricao_id) REFERENCES itens_prescricao(id) ON DELETE CASCADE
);
```

**Mas o backend tenta inserir 3 colunas:**
```javascript
[item_prescricao_id, horario, status_id]  // ❌ status_id não existe!
```

### Problema no GET (prescricoes.js, linhas 13-16)
```sql
SELECT 
    ...
    hp.id AS horario_id,
    hp.horario
    hp.data_hora,        -- ❌ COLUNA NÃO EXISTE
    hp.status_id         -- ❌ COLUNA NÃO EXISTE
```

---

## 3️⃣ VALIDAÇÕES FALTANDO - Frontend

**Função `gerarHorarios()`:**

### ❌ Problema 1: Frequência zero não é tratada
```javascript
if (!frequencia || frequencia <= 0) return [];
// Bom, mas deveria validar antes de enviar
```

### ❌ Problema 2: Frequência muito alta
Se frequência = 24: gera 24 horários? Sem limite máximo.
Se frequência = 100: gera 100 horários? Sem proteção.

### ❌ Problema 3: Horários com minutos não são precisos
```javascript
let minuto = 0;  // Sempre 0, nunca distribui entre minutos
// Resultaria em: 08:00, 16:00, 00:00 (3x por dia)
// Mas 24 horas são necessários? Seria 08:00, 16:00 + resto?
```

### ❌ Problema 4: Não valida se campo obrigatório está vazio
```javascript
function fnAdicionarNovaPrescricao() {
    const paciente_id = new URLSearchParams(...).get("id");
    // ❌ Não valida se paciente_id é null/undefined/NaN
```

---

## 4️⃣ VALIDAÇÕES FALTANDO - Backend

**POST /prescricoes:**

### ❌ Problema 1: status_id = 1 nunca foi validado
```javascript
horarios: gerarHorarios(item),
status_id: 1  // ❌ Não valida se status_id = 1 existe em status_cuidado
```

A tabela `status_cuidado` tem apenas:
- `pendente` (id=1)
- `finalizado` (id=2)
- `nao_feito` (id=3)
- `negado_paciente` (id=4)

Mas não há verificação!

### ❌ Problema 2: Não valida se medicamento_id existe
```javascript
[prescricao_id, medicamento_id, dosagem, item.via, frequencia]
// ❌ Não verifica:
// - Se medicamento_id existe em 'medicamentos'
// - Se está ativo
// - Se o usuário tem permissão
```

### ❌ Problema 3: Não valida se paciente_id existe
```javascript
[paciente_id, usuario_id, observacao || null]
// ❌ Não verifica se paciente_id é válido
// ❌ Não verifica se paciente_id pertence ao mesmo setor do usuário
```

### ❌ Problema 4: Dosagem poderia ser negativa
```javascript
const dosagem = parseFloat(item.dosagem);
if (isNaN(dosagem)) return reject(...)
// ❌ Não valida se dosagem < 0
// ❌ Não valida se dosagem é muito grande (9999999.99)
```

### ❌ Problema 5: `item.via` não é validado
```javascript
[prescricao_id, medicamento_id, dosagem, item.via, frequencia]
// ❌ item.via poderia ser NULL, undefined, ou texto muito longo
// ❌ Não existe lista pré-definida de vias válidas (Oral, IV, IM, etc)
```

### ❌ Problema 6: Frequência não é validada no backend
```javascript
const frequencia = parseInt(item.frequencia);
if (isNaN(frequencia)) return reject(...)
// ❌ Não valida se frequencia <= 0
// ❌ Não valida valor máximo
```

---

## 5️⃣ ERRO HANDLING & PROMISES

### ❌ Problema 1: Se `item.horarios` for undefined
```javascript
if (item.horarios && item.horarios.length > 0) {
    const horariosPromises = item.horarios.map(h => {
```
**Bom!** Mas e se vem `null`? Deveria ser mais rigoroso.

### ❌ Problema 2: Sem transação = dados inconsistentes
Se a prescrição é criada ✅ mas os itens falham ❌, fica órfã no banco.
Se os itens são criados ✅ mas os horários falham ❌, fica sem horários.

**Não há rollback automático!**

### ❌ Problema 3: Promise.all() falha de forma silenciosa
```javascript
Promise.all(promises)
    .then(() => res.json({ sucesso: true, prescricao_id }))
    .catch(erro => {
        console.error("Erro ao inserir itens:", erro);
        res.status(500).json({ erro: erro.message });
    });
```
Se um item falha, a resposta HTTP é 500, mas a prescrição JÁ EXISTE no banco!

### ❌ Problema 4: Erro na query da prescrição não deixa claro o motivo
```javascript
db.query(
    `INSERT INTO prescricoes ...`,
    [paciente_id, usuario_id, observacao || null],
    function (erro, resultado) {
        if (erro) {
            console.log(erro);  // ❌ Apenas loga
            return res.status(500).json(erro);
        }
```

---

## 6️⃣ PROBLEMAS NA ROTA GET

### ❌ Problema 1: Retorna campos que não existem
```sql
hp.data_hora,   -- ❌ NÃO EXISTE
hp.status_id    -- ❌ NÃO EXISTE
```

Isso vai causar erro 500 no banco de dados sempre que tentar GET.

### ❌ Problema 2: LEFT JOIN sem verificar se tabela existe
```sql
LEFT JOIN horarios_prescricao hp ON hp.item_prescricao_id = ip.id
// Se a tabela não foi criada, a query falha
```

### ❌ Problema 3: Tenta acessar campos não retornados
```javascript
if (item && row.horario_id) {
    item.horarios.push({
        id: row.horario_id,
        data_hora: row.data_hora,        -- undefined
        status_id: row.status_id         -- undefined
    });
}
```

**Resultado:** Frontend recebe `horarios[]` com objetos incompletos.

---

## 7️⃣ FRONTEND: Tratamento de erro inadequado

### ❌ Problema 1: Erros silenciosos
```javascript
.catch(err => console.log(err));  // ❌ Só loga, sem feedback de UI
```

Usuário não sabe se salvou ou não!

### ❌ Problema 2: Sucesso sem validar resposta
```javascript
.then(() => fnCarregarPrescricoes())
// ❌ Assume que a prescrição foi criada,
// mas e se o backend retornou erro?
```

### ❌ Problema 3: Sem loader/spinner
Usuário não sabe que a requisição está em progresso.

---

## 8️⃣ CAMPOS CRITICOS INDEFINIDOS

### Na função `fnAdicionarNovaPrescricao()`:
```javascript
const paciente_id = new URLSearchParams(window.location.search).get("id");
// ✅ Se faltar, será null, mas não é validado
```

### Na função `gerarHorarios()`:
```javascript
const frequencia = parseInt(item.frequencia);
if (!frequencia || frequencia <= 0) return [];
// ✅ Valida, mas deixa item sem horários (confunde frontend)
```

### No objeto de payload:
```javascript
const payload = {
    paciente_id,      // Pode ser null
    observacao: observacaoPrescricao,  // Pode estar vazio (OK)
    itens: itensComHorarios  // Array vazio? Sem validação
};
```

---

## 9️⃣ ESTRUTURA DE DADOS INCONSISTENTE

### Tabela `horarios_prescricao` atual:
```sql
id, item_prescricao_id, horario (TIME)
```

### Mas o frontend precisa de:
```javascript
{
    horario: "08:00",     // ✅ Existe
    status_id: 1,         // ❌ Não existe na tabela
    id: 1                 // ✅ Existe
}
```

**Falta:** `status_id`, `data_criacao`, possível `data_horario` para futuro?

---

## 🔟 POSSÍVEIS ERROS EM PRODUÇÃO

1. **Usuário A** envia prescrição ✅ com sucesso
2. **Usuário B** tenta carregar a mesma prescrição
3. Frontend tenta renderizar `hp.status_id` que vem `undefined` 🔴
4. Interface quebra ou mostra dados inconsistentes 🔴

---

## RESUMO DOS ERROS CRÍTICOS

| # | Severidade | Problema | Local |
|---|----------|----------|-------|
| 1 | 🔴 CRÍTICO | Mismatch de dados (string vs objeto) | Frontend → Backend |
| 2 | 🔴 CRÍTICO | Tabela incompleta no BD | SQL schema |
| 3 | 🔴 CRÍTICO | SELECT retorna campos inexistentes | GET /prescricoes |
| 4 | 🟠 ALTO | Sem validação de chaves estrangeiras | POST /prescricoes |
| 5 | 🟠 ALTO | Sem transações = dados órfãos | POST /prescricoes |
| 6 | 🟠 ALTO | Sem validação de limites | gerarHorarios() |
| 7 | 🟡 MÉDIO | Erro handling silencioso | Frontend |
| 8 | 🟡 MÉDIO | Valores negativos não validados | dosagem, frequencia |
| 9 | 🟡 MÉDIO | Sem feedback ao usuário | UI/UX |
| 10| 🟡 MÉDIO | Sem tratamento de via inválida | POST /prescricoes |
