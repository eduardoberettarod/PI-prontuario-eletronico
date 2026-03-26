# ✅ SOLUÇÕES - Sistema de Prescrições

## 1️⃣ CORRIGIR MISMATCH: Frontend gera String, Backend espera Objeto

### SOLUÇÃO - Frontend (Prontuario.jsx)

Alterar `gerarHorarios()` para retornar **objetos**, não strings:

```javascript
function gerarHorarios(item) {
    const frequencia = parseInt(item.frequencia);
    if (!frequencia || frequencia <= 0) return [];

    const interval = 24 / frequencia;
    const horarios = [];

    for (let i = 0; i < frequencia; i++) {
        let hora = Math.floor(i * interval);
        let minuto = 0;
        let hh = hora.toString().padStart(2, "0");
        let mm = minuto.toString().padStart(2, "0");
        
        // ✅ RETORNA OBJETO, não string
        horarios.push({
            horario: `${hh}:${mm}`,
            status_id: 1  // Pendente
        });
    }

    return horarios;
}
```

---

## 2️⃣ CORRIGIR BANCO DE DADOS

### SOLUÇÃO - SQL: Adicionar coluna `status_id`

```sql
ALTER TABLE horarios_prescricao ADD COLUMN status_id INT DEFAULT 1;

ALTER TABLE horarios_prescricao 
ADD CONSTRAINT fk_horario_status
FOREIGN KEY (status_id) REFERENCES status_cuidado(id);

-- Você também pode alterar a criação da tabela:
DROP TABLE horarios_prescricao;

CREATE TABLE horarios_prescricao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_prescricao_id INT NOT NULL,
    horario TIME NOT NULL,
    status_id INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (item_prescricao_id) REFERENCES itens_prescricao(id) ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES status_cuidado(id)
);
```

---

## 3️⃣ CORRIGIR ROTA GET

### SOLUÇÃO - Backend (prescricoes.js)

Remover campos inexistentes e usar apenas o que existe:

```javascript
router.get(
    "/paciente/:id",
    autorizar("aluno", "docente", "admin"),
    function (req, res) {
        const { id } = req.params;

        // ✅ Valida se id é número
        if (!Number.isInteger(Number(id)) || id <= 0) {
            return res.status(400).json({ erro: "paciente_id inválido" });
        }

        db.query(
            `
            SELECT 
                p.id AS prescricao_id,
                p.observacao,
                p.data_prescricao,
                ip.id AS item_id,
                ip.medicamento_id,
                ip.dosagem,
                ip.via,
                ip.frequencia,
                m.nome_medicamento,
                m.unidade,
                hp.id AS horario_id,
                hp.horario,
                hp.status_id
            FROM prescricoes p
            LEFT JOIN itens_prescricao ip ON ip.prescricao_id = p.id
            LEFT JOIN medicamentos m ON m.id = ip.medicamento_id
            LEFT JOIN horarios_prescricao hp ON hp.item_prescricao_id = ip.id
            WHERE p.paciente_id = ?
            ORDER BY p.id DESC, ip.id, hp.horario
            `,
            [id],
            function (erro, resultados) {
                if (erro) {
                    console.error("Erro ao carregar prescrições:", erro);
                    return res.status(500).json({ erro: "Erro ao carregar prescrições" });
                }

                // ✅ Retorna array vazio se não encontrar
                if (resultados.length === 0) {
                    return res.json([]);
                }

                const prescricoes = [];

                resultados.forEach(row => {
                    let prescricao = prescricoes.find(p => p.id === row.prescricao_id);

                    if (!prescricao) {
                        prescricao = {
                            id: row.prescricao_id,
                            observacao: row.observacao,
                            data: row.data_prescricao,
                            itens: []
                        };
                        prescricoes.push(prescricao);
                    }

                    let item = prescricao.itens.find(i => i.id === row.item_id);

                    if (!item && row.item_id) {
                        item = {
                            id: row.item_id,
                            medicamento_id: row.medicamento_id,
                            medicamento: row.nome_medicamento,
                            unidade: row.unidade,
                            dosagem: row.dosagem,
                            via: row.via,
                            frequencia: row.frequencia,
                            horarios: []
                        };
                        prescricao.itens.push(item);
                    }

                    // ✅ Valida se horario_id existe antes de acessar
                    if (item && row.horario_id) {
                        item.horarios.push({
                            id: row.horario_id,
                            horario: row.horario,
                            status_id: row.status_id
                        });
                    }
                });

                res.json(prescricoes);
            }
        );
    }
);
```

---

## 4️⃣ ADICIONAR VALIDAÇÕES NO POST

### SOLUÇÃO - Backend (prescricoes.js) - Validações antes da INSERT

```javascript
router.post(
    "/",
    autorizar("aluno", "docente", "admin"),
    function (req, res) {
        const { paciente_id, observacao, itens } = req.body;
        const usuario_id = req.session.usuario?.id;

        console.log("POST /prescricoes:", { paciente_id, usuario_id, itens_count: itens?.length });

        // ✅ VALIDAÇÃO 1: Usuario autenticado
        if (!usuario_id) {
            return res.status(401).json({ erro: "Usuário não autenticado" });
        }

        // ✅ VALIDAÇÃO 2: paciente_id válido
        if (!paciente_id || !Number.isInteger(Number(paciente_id)) || Number(paciente_id) <= 0) {
            return res.status(400).json({ erro: "paciente_id deve ser um número válido" });
        }

        // ✅ VALIDAÇÃO 3: itens não vazio
        if (!Array.isArray(itens) || itens.length === 0) {
            return res.status(400).json({ erro: "Deve incluir pelo menos 1 medicamento" });
        }

        // ✅ VALIDAÇÃO 4: Cada item tem campos obrigatórios
        for (let i = 0; i < itens.length; i++) {
            const item = itens[i];
            
            if (!item.medicamento_id) {
                return res.status(400).json({ 
                    erro: `Medicamento ${i + 1}: medicamento_id obrigatório` 
                });
            }
            
            const med_id = parseInt(item.medicamento_id);
            if (isNaN(med_id) || med_id <= 0) {
                return res.status(400).json({ 
                    erro: `Medicamento ${i + 1}: medicamento_id inválido` 
                });
            }
            
            if (!item.dosagem) {
                return res.status(400).json({ 
                    erro: `Medicamento ${i + 1}: dosagem obrigatória` 
                });
            }
            
            const dosagem = parseFloat(item.dosagem);
            if (isNaN(dosagem) || dosagem <= 0) {
                return res.status(400).json({ 
                    erro: `Medicamento ${i + 1}: dosagem deve ser > 0` 
                });
            }
            
            if (dosagem > 10000) {
                return res.status(400).json({ 
                    erro: `Medicamento ${i + 1}: dosagem muito alta` 
                });
            }
            
            if (!item.via || typeof item.via !== 'string' || item.via.trim().length === 0) {
                return res.status(400).json({ 
                    erro: `Medicamento ${i + 1}: via obrigatória` 
                });
            }
            
            if (item.via.length > 50) {
                return res.status(400).json({ 
                    erro: `Medicamento ${i + 1}: via muito longa` 
                });
            }
            
            if (!item.frequencia) {
                return res.status(400).json({ 
                    erro: `Medicamento ${i + 1}: frequência obrigatória` 
                });
            }
            
            const freq = parseInt(item.frequencia);
            if (isNaN(freq) || freq <= 0 || freq > 24) {
                return res.status(400).json({ 
                    erro: `Medicamento ${i + 1}: frequência deve estar entre 1 e 24` 
                });
            }
            
            // ✅ VALIDAÇÃO 5: horarios deve ser array
            if (!Array.isArray(item.horarios) || item.horarios.length === 0) {
                return res.status(400).json({ 
                    erro: `Medicamento ${i + 1}: deve ter pelo menos 1 horário` 
                });
            }
            
            // ✅ VALIDACAO 6: cada horário deve ter horario e status_id
            for (let j = 0; j < item.horarios.length; j++) {
                const h = item.horarios[j];
                if (!h.horario || typeof h.horario !== 'string') {
                    return res.status(400).json({ 
                        erro: `Medicamento ${i + 1}, Horário ${j + 1}: horário inválido` 
                    });
                }
                if (!h.status_id || !Number.isInteger(h.status_id) || h.status_id <= 0) {
                    return res.status(400).json({ 
                        erro: `Medicamento ${i + 1}, Horário ${j + 1}: status_id inválido` 
                    });
                }
            }
        }

        // ✅ VALIDAÇÃO 7: observação (opcional) não pode ser muito longa
        if (observacao && typeof observacao === 'string' && observacao.length > 500) {
            return res.status(400).json({ 
                erro: "Observação muito longa (máx 500 caracteres)" 
            });
        }

        // ✅ VALIDAÇÃO 8: Verifica se paciente existe
        db.query(
            "SELECT id FROM pacientes WHERE id = ?",
            [paciente_id],
            function (erro, result) {
                if (erro) {
                    console.error("Erro ao validar paciente:", erro);
                    return res.status(500).json({ erro: "Erro ao validar paciente" });
                }
                
                if (result.length === 0) {
                    return res.status(404).json({ erro: "Paciente não encontrado" });
                }

                // ✅ VALIDAÇÃO 9: Verifica se status_id = 1 existe
                db.query(
                    "SELECT id FROM status_cuidado WHERE id = 1",
                    function (erro, statusResult) {
                        if (erro || statusResult.length === 0) {
                            return res.status(500).json({ 
                                erro: "Status inicial não configurado no sistema" 
                            });
                        }

                        // ✅ Se tudo passou, insere a prescrição
                        inserirPrescricaoComItensHorarios(
                            paciente_id, usuario_id, observacao, itens, res
                        );
                    }
                );
            }
        );
    }
);

// ✅ FUNÇÃO HELPER para inserção com validação de medicamentos
function inserirPrescricaoComItensHorarios(paciente_id, usuario_id, observacao, itens, res) {
    
    // ✅ Coleta todos os medicamento_ids
    const medIds = itens.map(i => parseInt(i.medicamento_id));
    
    // ✅ Valida se todos existem
    db.query(
        `SELECT id FROM medicamentos WHERE id IN (${medIds.join(',')})`,
        function (erro, medicamentosEncontrados) {
            if (erro) {
                console.error("Erro ao validar medicamentos:", erro);
                return res.status(500).json({ 
                    erro: "Erro ao validar medicamentos" 
                });
            }
            
            if (medicamentosEncontrados.length !== medIds.length) {
                return res.status(400).json({ 
                    erro: "Um ou mais medicamentos não foram encontrados" 
                });
            }

            // ✅ Agora sim, insere a prescrição
            db.query(
                `INSERT INTO prescricoes (paciente_id, usuario_id, observacao, data_prescricao) 
                 VALUES (?, ?, ?, NOW())`,
                [paciente_id, usuario_id, observacao || null],
                function (erro, resultado) {
                    if (erro) {
                        console.error("Erro ao inserir prescrição:", erro);
                        return res.status(500).json({ 
                            erro: "Erro ao criar prescrição" 
                        });
                    }

                    const prescricao_id = resultado.insertId;
                    inserirItensEHorarios(prescricao_id, itens, res);
                }
            );
        }
    );
}

// ✅ FUNÇÃO HELPER para inserir itens e horários
function inserirItensEHorarios(prescricao_id, itens, res) {
    const promises = itens.map(item => {
        return new Promise((resolve, reject) => {
            const medicamento_id = parseInt(item.medicamento_id);
            const dosagem = parseFloat(item.dosagem);
            const frequencia = parseInt(item.frequencia);

            db.query(
                `INSERT INTO itens_prescricao 
                 (prescricao_id, medicamento_id, dosagem, via, frequencia) 
                 VALUES (?, ?, ?, ?, ?)`,
                [prescricao_id, medicamento_id, dosagem, item.via, frequencia],
                function (erro, resultadoItem) {
                    if (erro) {
                        console.error("Erro ao inserir item:", erro);
                        return reject(new Error("Erro ao inserir medicamento"));
                    }

                    const item_id = resultadoItem.insertId;

                    // ✅ Inserir horários
                    if (Array.isArray(item.horarios) && item.horarios.length > 0) {
                        const horariosPromises = item.horarios.map(h => {
                            return new Promise((resolveH, rejectH) => {
                                db.query(
                                    `INSERT INTO horarios_prescricao 
                                    (item_prescricao_id, horario, status_id) 
                                    VALUES (?, ?, ?)`,
                                    [item_id, h.horario, h.status_id],
                                    function (erroH) {
                                        if (erroH) {
                                            console.error("Erro ao inserir horário:", erroH);
                                            rejectH(new Error("Erro ao inserir horário"));
                                        } else {
                                            resolveH();
                                        }
                                    }
                                );
                            });
                        });

                        Promise.all(horariosPromises)
                            .then(() => resolve())
                            .catch(err => reject(err));
                    } else {
                        resolve();
                    }
                }
            );
        });
    });

    Promise.all(promises)
        .then(() => {
            console.log("✅ Prescrição criada com sucesso:", prescricao_id);
            res.status(201).json({ 
                sucesso: true, 
                prescricao_id,
                mensagem: "Prescrição criada com sucesso"
            });
        })
        .catch(erro => {
            console.error("❌ Erro ao salvar prescrição:", erro);
            res.status(500).json({ 
                erro: erro.message || "Erro ao criar prescrição"
            });
        });
}
```

---

## 5️⃣ MELHORAR TRATAMENTO DE ERRO NO FRONTEND

### SOLUÇÃO - Frontend (Prontuario.jsx)

```javascript
function fnAdicionarNovaPrescricao() {
    // ✅ Validar paciente_id
    const paciente_id = new URLSearchParams(window.location.search).get("id");
    if (!paciente_id || isNaN(paciente_id)) {
        alert("Paciente não identificado");
        return;
    }

    // ✅ Validar itens vazios
    if (itens.length === 0) {
        alert("Adicione pelo menos um medicamento");
        return;
    }

    const itensComHorarios = itens.map((item, idx) => {
        // ✅ Validar campos obrigatórios
        if (!item.medicamento_id || !item.dosagem || !item.via || !item.frequencia) {
            throw new Error(`Medicamento ${idx + 1}: campos incompletos`);
        }

        const horarios = gerarHorarios(item);
        if (horarios.length === 0) {
            throw new Error(`Medicamento ${idx + 1}: frequência inválida`);
        }

        return {
            ...item,
            horarios,
            status_id: 1
        };
    });

    const payload = {
        paciente_id: parseInt(paciente_id),
        observacao: observacaoPrescricao || "",
        itens: itensComHorarios
    };

    // ✅ Mostrar loading
    const botaoSalvar = document.querySelector('[type="submit"]');
    botaoSalvar.disabled = true;
    botaoSalvar.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Salvando...';

    fetch(`${urlServer}/prescricoes`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })
        .then(res => {
            if (res.status === 201 || res.status === 200) {
                return res.json();
            }
            return res.json().then(err => {
                throw new Error(err.erro || "Erro ao salvar prescrição");
            });
        })
        .then(dados => {
            console.log("✅ Prescrição salva:", dados);
            alert("Prescrição criada com sucesso!");
            fnCarregarPrescricoes();
        })
        .catch(err => {
            console.error("❌ Erro:", err);
            alert("Erro: " + err.message);
        })
        .finally(() => {
            // ✅ Retirar loading
            botaoSalvar.disabled = false;
            botaoSalvar.innerHTML = 'Salvar Prescrição';
        });
}
```

---

## 📋 RESUMO DAS CORREÇÕES

| Problema | Solução |
|----------|---------|
| Frontend envia strings | ✅ Alterar `gerarHorarios()` para retornar objetos |
| Tabela sem `status_id` | ✅ ALTER TABLE adicionar coluna e FK |
| GET retorna campos inexistentes | ✅ Remover `hp.data_hora` |
| Sem validação de ForeignKeys | ✅ Verificar medicamentos e pacientes |
| Promises sem transação | ✅ Validar tudo antes de inserir |
| Sem feedback ao usuário | ✅ Mostrar loader e alertas |
| Frequência sem limite | ✅ Validar 1-24 |
| Dosagem negativa | ✅ Validar > 0 |
| Código silencioso | ✅ Adicionar logs e tratamento |

