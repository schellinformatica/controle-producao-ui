import React from "react";

const ModalParadas = ({ show, onClose, paradas }) => {
    if (!show) return null;

    return (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Paradas do Empacotamento</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {paradas.length > 0 ? (
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Parada</th>
                                        <th>Retorno</th>
                                        <th>Motivo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paradas.map((parada) => (
                                        <tr key={parada.id}>
                                            <td>{new Date(parada.hora_parada).toLocaleString("pt-BR")}</td>
                                            <td>{parada.hora_retorno ? new Date(parada.hora_retorno).toLocaleString("pt-BR") : "-"}</td>
                                            <td>{parada.motivo || "Não informado"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>Nenhuma parada registrada.</p>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Fechar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalParadas;
