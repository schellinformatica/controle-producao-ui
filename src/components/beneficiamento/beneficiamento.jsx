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
                {props.operador}
            </td>
          
            <td className="text-end">
                <button onClick={() => props.ClickDelete(props.id)} className="btn btn-sm btn-outline-danger btn-clean me-2">
                    <i className="bi bi-trash"></i>
                </button> 
            </td>
        </tr>
    )
}

export default Beneficiamento;