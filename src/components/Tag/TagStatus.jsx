import "./TagStatus.css";

export default function TagStatus({ status }) {
    const estados = {
        critico: { label: "Crítico", className: "tag tag-critico", icon: "bi bi-exclamation-triangle fs-6 text-danger me-2" },
        estavel: { label: "Estável", className: "tag tag-estavel", icon: "bi bi-check-circle fs-6 text-success me-2" },
        observacao: { label: "Em Observação", className: "tag tag-observacao", icon: "bi bi-exclamation-circle fs-6 text-warning me-2" }
    };

    const estadoAtual = estados[status] || estados.estavel;

    return (
        <span className={estadoAtual.className}>
            <i className={estadoAtual.icon}></i>
            {estadoAtual.label}
        </span>
    );
}
