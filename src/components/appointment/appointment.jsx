function Appointment(props) {
    const dt = new Date(props.hora);

    const handleRowClick = () => {
        props.ClickEdit(props.id);
    };

    const stopPropagation = (event) => {
        event.stopPropagation();
    };

    return (
        <tr style={{ cursor: 'pointer' }} onClick={handleRowClick}>
            <td>{props.maquina}</td>
            <td>
                {new Intl.DateTimeFormat('pt-BR', {
                    dateStyle: 'short', // Formato curto de data (dd/mm/aaaa)
                    timeZone: 'America/Sao_Paulo'
                }).format(new Date(dt))}
            </td>
            <td>{props.lote}</td>
            <td>{props.lote_interno}</td>
            <td>{/*{props.marca} */}</td>
            <td className="text-end">{props.media_peso}</td>
            <td className="text-end">{props.quantidade}</td>

            <td className="text-end d-flex justify-content-end" onClick={stopPropagation}>
                
                <button
                    onClick={(e) => { stopPropagation(e); props.ClickViewParadas(props.id); }}
                    className="btn btn-sm btn-outline-secondary btn-clean me-2">
                    <i className="bi bi-view-list"></i>
                </button>
                
                <button
                    onClick={(e) => { stopPropagation(e); props.ClickParar(props.id); }}
                    className="btn btn-sm btn-outline-secondary btn-clean me-2">
                    <i className="bi bi-pause-fill"></i>
                </button>

                <button
                    onClick={(e) => { stopPropagation(e); props.ClickRetomar(props.id); }}
                    className="btn btn-sm btn-outline-secondary btn-clean me-2">
                    <i className="bi bi-play-fill"></i>
                </button>

                <button
                    onClick={(e) => { stopPropagation(e); props.confirmDelete(props.id); }}
                    className="btn btn-sm btn-outline-secondary btn-clean me-2">
                    <i className="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    );
}

export default Appointment;
