function Beneficiamento(props) {
    
    const formattedDate = new Date(props.data).toLocaleDateString('pt-BR'); // ou outro formato desejado

    return ( 
        <tr style={{ cursor: 'pointer' }}>
            <td onClick={() => props.ClickEdit(props.id)}>
                {formattedDate}
            </td>
            <td onClick={() => props.ClickEdit(props.id)}>
                {props.turno}
            </td>
            <td onClick={() => props.ClickEdit(props.id)}>
                {!props.linha ? "" : props.linha === "LINHA_1" ? "1" : "2"}
            </td>
            <td onClick={() => props.ClickEdit(props.id)}>
                {props.operador}
            </td>
          
            <td className="text-end">
                <button onClick={() => props.confirmDelete(props.id)} className="btn btn-sm btn-outline-secondary btn-clean me-2">
                    <i className="bi bi-trash"></i>
                </button> 
            </td>
        </tr>
    )
}

export default Beneficiamento;