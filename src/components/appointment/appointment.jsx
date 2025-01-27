function Appointment(props) {
    
    //const dt = new Date(`${props.data_producao}T00:00:00`);

    const dt = new Date(props.hora); // Formato YYYY-MM-DD
    
    return <tr>
         <td>{props.maquina}</td>
        <td>{
            new Intl.DateTimeFormat('pt-BR', {dateStyle:'short'}).format(dt)
        }</td>
        <td>{props.lote}</td>
        <td>{props.lote_interno}</td>
        <td>{props.marca}</td>
        <td className="text-end">{props.quantidade}</td>
        <td className="text-center">{props.verificado}</td>

        <td className="text-end d-flex justify-content-end">
            {/* Botão de Deletar */}
            <button 
                onClick={() => props.ClickDelete(props.id)} 
                className="btn btn-sm btn-outline-card btn-clean me-2">
                <i className="bi bi-trash"></i>
            </button>

            {/* Botão de Parar Produção */}
            <button 
                onClick={() => props.ClickParar(props.id)} 
                className="btn btn-sm btn-outline-card btn-clean me-2"> 
                <i className="bi bi-pause-fill"></i>
            </button>

            {/* Botão de Retomar Produção */}
            <button 
                onClick={() => props.ClickRetomar(props.id)} 
                className="btn btn-sm btn-outline-card btn-clean">
                <i className="bi bi-play-fill"></i>
            </button>
        </td>
       
    </tr>
}

export default Appointment;