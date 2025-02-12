function Marca(props) {
        
    return ( 
        <tr style={{ cursor: 'pointer' }}>
            <td onClick={() => props.ClickEdit(props.id)}>
                {props.nome}
            </td>
            <td className="text-end">
                <button onClick={() => props.confirmDelete(props.id)} className="btn btn-sm btn-outline-secondary btn-clean me-2">
                    <i className="bi bi-trash"></i>
                </button> 
            </td>
        </tr>
    )
}

export default Marca;