import React, { useRef } from 'react'
import jsPDF from "jspdf";
import './CardRelatorio.css'
import LogoSenac from '/image/senac-logo.png'

function CardRelatorio({
    TituloRelatorio,
    ConteudoRelatorio,
    PacienteSelecionado,
    usuario_nome,
    created_at,
    onDelete,
    onEdit,
    onPrint,
    mostrarAcoes = true
}) {

    function formatarDataBR(data) {
        if (!data) return "";

        const novaData = new Date(data);

        return novaData.toLocaleDateString("pt-BR");
    }


    function onPrint() {
        const doc = new jsPDF({ unit: "mm", format: "a4" });

        // ─── CONFIGURAÇÕES GLOBAIS ───────────────────────────────────────────────
        const PAGE_W = 210;
        const PAGE_H = 297;
        const MARGIN_LEFT = 14;
        const MARGIN_RIGHT = 14;
        const CONTENT_WIDTH = PAGE_W - MARGIN_LEFT - MARGIN_RIGHT;
        const FOOTER_HEIGHT = 30; // reserva no rodapé
        const CONTENT_BOTTOM_LIMIT = PAGE_H - FOOTER_HEIGHT - 10;

        // Paleta de cores (RGB)
        const COLOR_PRIMARY = [0, 71, 130];      // azul escuro institucional
        const COLOR_ACCENT = [0, 150, 199];      // azul claro (barra decorativa)
        const COLOR_TEXT = [30, 30, 30];       // quase preto
        const COLOR_MUTED = [100, 100, 110];    // cinza médio
        const COLOR_LIGHT = [245, 247, 250];    // fundo de seção
        const COLOR_BORDER = [210, 215, 225];    // bordas e linhas

        // ─── HELPERS ────────────────────────────────────────────────────────────
        const setColor = ([r, g, b]) => doc.setTextColor(r, g, b);
        const setDraw = ([r, g, b]) => doc.setDrawColor(r, g, b);
        const setFill = ([r, g, b]) => doc.setFillColor(r, g, b);

        const dataFormatada = new Date(created_at).toLocaleDateString("pt-BR", {
            day: "2-digit", month: "long", year: "numeric"
        });

        // ─── FUNÇÃO: DESENHAR CABEÇALHO ─────────────────────────────────────────
        function drawHeader(pageNum) {
            // Barra superior colorida
            setFill(COLOR_PRIMARY);
            doc.rect(0, 0, PAGE_W, 2, "F");

            // Barra de acento logo abaixo
            setFill(COLOR_ACCENT);
            doc.rect(0, 2, PAGE_W, 1, "F");

            // Fundo do cabeçalho
            setFill(COLOR_LIGHT);
            doc.rect(0, 3, PAGE_W, 36, "F");

            // Logo
            doc.addImage(LogoSenac, "PNG", MARGIN_LEFT, 6, 28, 28);

            // Linha vertical separando logo do texto
            setDraw(COLOR_ACCENT);
            doc.setLineWidth(0.5);
            doc.line(MARGIN_LEFT + 32, 8, MARGIN_LEFT + 32, 32);

            // Título principal
            doc.setFont("Helvetica", "bold");
            doc.setFontSize(18);
            setColor(COLOR_PRIMARY);
            doc.text("Relatório Médico", MARGIN_LEFT + 37, 17);

            // Subtítulo institucional
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(8.5);
            setColor(COLOR_MUTED);
            doc.text("Documento Clínico · Uso Interno", MARGIN_LEFT + 37, 24);

            // Número de página (canto superior direito)
            doc.setFontSize(8);
            setColor(COLOR_MUTED);
            doc.text(`Página ${pageNum}`, PAGE_W - MARGIN_RIGHT, 13, { align: "right" });

            // Linha divisória inferior do cabeçalho
            setDraw(COLOR_BORDER);
            doc.setLineWidth(0.3);
            doc.line(0, 39, PAGE_W, 39);
        }

        // ─── FUNÇÃO: DESENHAR RODAPÉ ─────────────────────────────────────────────
        function drawFooter() {
            const yBase = PAGE_H - FOOTER_HEIGHT;

            // Linha superior do rodapé
            setDraw(COLOR_BORDER);
            doc.setLineWidth(0.3);
            doc.line(MARGIN_LEFT, yBase, PAGE_W - MARGIN_RIGHT, yBase);

            // Barra inferior colorida
            setFill(COLOR_PRIMARY);
            doc.rect(0, PAGE_H - 3, PAGE_W, 3, "F");

            // Coluna esquerda: autor
            doc.setFont("Helvetica", "bold");
            doc.setFontSize(8);
            setColor(COLOR_MUTED);
            doc.text("RESPONSÁVEL PELO RELATÓRIO", MARGIN_LEFT, yBase + 7);

            doc.setFont("Helvetica", "normal");
            doc.setFontSize(10);
            setColor(COLOR_TEXT);
            doc.text(usuario_nome, MARGIN_LEFT, yBase + 13);

            // Linha de assinatura
            setDraw(COLOR_BORDER);
            doc.setLineWidth(0.3);
            doc.line(MARGIN_LEFT, yBase + 19, MARGIN_LEFT + 70, yBase + 19);

            doc.setFont("Helvetica", "italic");
            doc.setFontSize(7.5);
            setColor(COLOR_MUTED);
            doc.text("Assinatura", MARGIN_LEFT, yBase + 23);

            // Coluna direita: data
            doc.setFont("Helvetica", "bold");
            doc.setFontSize(8);
            setColor(COLOR_MUTED);
            doc.text("DATA DE EMISSÃO", PAGE_W - MARGIN_RIGHT, yBase + 7, { align: "right" });

            doc.setFont("Helvetica", "normal");
            doc.setFontSize(10);
            setColor(COLOR_TEXT);
            doc.text(dataFormatada, PAGE_W - MARGIN_RIGHT, yBase + 13, { align: "right" });
        }

        // ─── FUNÇÃO: NOVA PÁGINA ─────────────────────────────────────────────────
        let pageNum = 1;
        function addNewPage() {
            drawFooter();
            doc.addPage();
            pageNum++;
            drawHeader(pageNum);
            return 46; // y inicial após cabeçalho
        }

        // ─── FUNÇÃO: LABEL + VALOR ────────────────────────────────────────────────
        function drawLabelValue(label, value, x, y, maxWidth = 85) {
            doc.setFont("Helvetica", "bold");
            doc.setFontSize(7.5);
            setColor(COLOR_MUTED);
            doc.text(label.toUpperCase(), x, y);

            doc.setFont("Helvetica", "normal");
            doc.setFontSize(10.5);
            setColor(COLOR_TEXT);
            const lines = doc.splitTextToSize(value, maxWidth);
            doc.text(lines, x, y + 5);

            return y + 5 + lines.length * 5;
        }

        // ─── INICIAR DOCUMENTO ───────────────────────────────────────────────────
        drawHeader(pageNum);
        let y = 46;

        // ─── SEÇÃO: INFORMAÇÕES DO PACIENTE ──────────────────────────────────────
        // Fundo de destaque
        setFill([236, 242, 250]);
        doc.roundedRect(MARGIN_LEFT, y, CONTENT_WIDTH, 30, 2, 2, "F");

        // Ícone decorativo (barra lateral esquerda)
        setFill(COLOR_ACCENT);
        doc.roundedRect(MARGIN_LEFT, y, 3, 30, 1, 1, "F");

        // Label da seção
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(8.5);
        setColor(COLOR_ACCENT);
        doc.text("INFORMAÇÕES DO PACIENTE", MARGIN_LEFT + 7, y + 8);

        // Linha sutil abaixo do label
        setDraw(COLOR_ACCENT);
        doc.setLineWidth(0.2);
        doc.line(MARGIN_LEFT + 7, y + 10, MARGIN_LEFT + 7 + 65, y + 10);

        // Dados em duas colunas
        const colLeft = MARGIN_LEFT + 7;
        const colRight = MARGIN_LEFT + 100;

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(7.5);
        setColor(COLOR_MUTED);
        doc.text("PACIENTE", colLeft, y + 16);
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(11);
        setColor(COLOR_TEXT);
        doc.text(PacienteSelecionado, colLeft, y + 22);

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(7.5);
        setColor(COLOR_MUTED);
        doc.text("DATA", colRight, y + 16);
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(11);
        setColor(COLOR_TEXT);
        doc.text(dataFormatada, colRight, y + 22);

        y += 36;

        // ─── SEÇÃO: TÍTULO DO RELATÓRIO ───────────────────────────────────────────
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(7.5);
        setColor(COLOR_MUTED);
        doc.text("TÍTULO DO RELATÓRIO", MARGIN_LEFT, y);

        y += 5;

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(15);
        setColor(COLOR_PRIMARY);
        const tituloLines = doc.splitTextToSize(TituloRelatorio, CONTENT_WIDTH);
        doc.text(tituloLines, MARGIN_LEFT, y);
        y += tituloLines.length * 7 + 4;

        // Linha decorativa sob o título
        setDraw(COLOR_PRIMARY);
        doc.setLineWidth(0.8);
        doc.line(MARGIN_LEFT, y, MARGIN_LEFT + 40, y);
        setDraw(COLOR_ACCENT);
        doc.line(MARGIN_LEFT + 40, y, MARGIN_LEFT + 55, y);
        y += 8;

        // ─── SEÇÃO: CONTEÚDO DO RELATÓRIO ────────────────────────────────────────
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(8.5);
        setColor(COLOR_PRIMARY);
        doc.text("CONTEÚDO", MARGIN_LEFT, y);
        y += 6;

        // Linha separadora antes do conteúdo
        setDraw(COLOR_BORDER);
        doc.setLineWidth(0.3);
        doc.line(MARGIN_LEFT, y, PAGE_W - MARGIN_RIGHT, y);
        y += 7;

        // Texto do conteúdo com suporte a múltiplas páginas
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(10.5);
        setColor(COLOR_TEXT);
        doc.setLineHeightFactor(1.6);

        const paragrafos = ConteudoRelatorio.split("\n").filter(p => p.trim() !== "");

        for (const paragrafo of paragrafos) {
            const linhas = doc.splitTextToSize(paragrafo.trim(), CONTENT_WIDTH);
            const blockHeight = linhas.length * 6;

            if (y + blockHeight > CONTENT_BOTTOM_LIMIT) {
                y = addNewPage();

                // Retomar label de seção na nova página
                doc.setFont("Helvetica", "bold");
                doc.setFontSize(8.5);
                setColor(COLOR_PRIMARY);
                doc.text("CONTEÚDO (continuação)", MARGIN_LEFT, y);
                y += 6;
                setDraw(COLOR_BORDER);
                doc.setLineWidth(0.3);
                doc.line(MARGIN_LEFT, y, PAGE_W - MARGIN_RIGHT, y);
                y += 7;
            }

            doc.setFont("Helvetica", "normal");
            doc.setFontSize(10.5);
            setColor(COLOR_TEXT);
            doc.text(linhas, MARGIN_LEFT, y);
            y += blockHeight + 4; // espaçamento entre parágrafos
        }

        // ─── RODAPÉ FINAL ────────────────────────────────────────────────────────
        drawFooter();

        // ─── SALVAR ──────────────────────────────────────────────────────────────
        doc.save(`relatorio_${TituloRelatorio.replace(/\s+/g, "_")}.pdf`);
    }


    return (
        <>
            <div className="card p-3 position-relative card-relatorio">

                <div className="row align-items-center">

                    <div className="col-12 col-md-1 d-flex align-items-center justify-content-start justify-content-md-center mb-2 mb-md-0">
                        <span className="icon-relatorio">
                            <i className="bi bi-file-earmark-text text-warning fs-4"></i>
                        </span>
                    </div>

                    <div className="col-12 col-md-11">
                        <p className="fw-medium fs-6 mb-1 mt-2">{TituloRelatorio}</p>
                        <p className="mb-0">Paciente: {PacienteSelecionado}</p>
                        <p className="mb-0">
                            Criado por {usuario_nome} em {formatarDataBR(created_at)}
                        </p>

                    </div>

                </div>

                <div className="bg-body-secondary p-2 mt-3 rounded-2 d-flex align-items-center" style={{ overflow: 'hidden' }}>
                    <p className="mb-0 text-truncate-multiline">
                        {ConteudoRelatorio}
                    </p>
                </div>

                {mostrarAcoes && (
                    <div className="position-absolute end-0 me-3 top-0 mt-3 gap-2 d-flex">

                        {onEdit && (
                            <button className='btn btn-success'
                                title='Editar relatório'
                                onClick={onEdit}>
                                <i className='bi bi-pencil-square text-light fs-6'></i>
                            </button>
                        )}

                        {onPrint && (
                            <button className="btn btn-primary"
                                title='Imprimir relatório'
                                onClick={onPrint}>
                                <i className="bi bi-printer text-light fs-6"></i>
                            </button>
                        )}

                        {onDelete && (
                            <button className="btn btn-danger"
                                title='Excluir relatório'
                                onClick={onDelete}>
                                <i className="bi bi-trash text-light fs-6"></i>
                            </button>
                        )}

                    </div>
                )}

            </div>

        </>
    )
}

export default CardRelatorio
