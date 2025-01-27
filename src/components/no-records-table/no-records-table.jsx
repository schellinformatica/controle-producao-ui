function NoRecordsTable() {
    return (
        <div
            className="text-center"
            style={{
                border: '1px solid #dee2e6', // Cor cinza suave
                padding: '40px',
                backgroundColor: '#f8f9fa', // Cor de fundo similar à tabela
                marginTop: 25
            }}
        >
            Não há registros disponíveis.
        </div>
    )
}

export default NoRecordsTable;