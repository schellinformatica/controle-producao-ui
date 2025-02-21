import "./beneficiamentos.css";
import NavBar from "../../components/navbar/navbar.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../constants/api.js";
import Beneficiamento from "../../components/beneficiamento/beneficiamento.jsx";

function Beneficiamentos() {
    const navigate = useNavigate();
    const [beneficiamento, setBeneficiamentos] = useState([]);

    const [selectedBeneficiamento, setSelectedBeneficiamento] = useState(null);
    const [showModalExclusao, setShowModalExclusao] = useState(false);

    function ClickEdit(id) {
        navigate("/beneficiamentos/edit/" + id + "?step=2");
    }

    function confirmDelete(benef) {
        setSelectedBeneficiamento(benef);
        setShowModalExclusao(true);
    }

    async function ClickDelete() {
        if (!selectedBeneficiamento) return;
        try {
            const response = await api.delete("/beneficiamento/" + selectedBeneficiamento.id);
            if (response.data) {
                setBeneficiamentos((prevBeneficiamento) => prevBeneficiamento.filter(apt => apt.id !== selectedBeneficiamento.id));
            }
        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status === 401) return navigate("/");
                alert(error.response?.data.error);
            } else {
                alert("Erro ao excluir beneficiamento.");
            }
        } finally {
            setShowModalExclusao(false);
            setSelectedBeneficiamento(null);
        }
    }  

    async function LoadBeneficiamento() {
        try {
            const response = await api.get("/beneficiamento");

            if (response.data) {
                setBeneficiamentos(response.data);
            }
        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status === 401) return navigate("/");
                alert(error.response?.data.error);
            } else {
                alert("Erro ao carregar beneficiamentos.");
            }
        }
    }

    useEffect(() => {
        LoadBeneficiamento();
    }, []);

    return (
        <div className="container-fluid mt-page">
            <NavBar />
            <div className="content-wrapper">
                <div className="container-custom mt-2">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Beneficiamento</li>
                        </ol>
                    </nav>
                    <div>
                        <Link to="/beneficiamentos/add" className="btn btn-primary btn-clean mt-3">
                            Novo beneficiamento
                        </Link>
                    </div>

                    <div style={{ marginTop: "33px" }}>
                        <table className="table table-hover table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col" className="text-center">Data</th>
                                    <th scope="col" className="text-center">Turno</th>
                                    <th scope="col" className="text-center">Linha</th>
                                    <th scope="col" className="text-center">Operador</th>
                                    <th scope="col" className="col-buttons text-end"></th>
                                </tr>
                            </thead>
                            <tbody className="text-center"> {/* Centraliza os conteúdos das células */}
                                {
                                    beneficiamento.map((ben) => {
                                        return <Beneficiamento key={ben.id}
                                                        id={ben.id}
                                                        data={ben.data}
                                                        turno={ben.turno.nome}
                                                        linha={ben.linha}
                                                        operador={ben.usuario.nome}
                                                        ClickEdit={ClickEdit}
                                                        confirmDelete={() => confirmDelete(ben)}
                                        />
                                    }) 
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showModalExclusao && selectedBeneficiamento && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header border-0">
                                <h5 className="modal-title">Atenção</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModalExclusao(false)}></button>
                            </div>

                            <div className="modal-body text-center">
                                <p style={{ wordBreak: "break-word", overflowWrap: "break-word", fontSize: "1rem" }}>
                                    Você está prestes a excluir o beneficiamento{" "} 
                                    <strong style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", verticalAlign: "middle", maxWidth: "100%", display: "inline-block" }}>
                                        {" "}{selectedBeneficiamento?.id}
                                    </strong>.
                                </p>
                                <p>Confirmar a exclusão?</p>
                            </div>

                            <div className="modal-footer border-0 justify-content-center">
                                <button type="button" className="btn btn-outline-secondary btn-clean" onClick={() => setShowModalExclusao(false)}>Cancelar</button>
                                <button type="button" className="btn btn-danger btn-clean" onClick={ClickDelete}>Confirmar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Rodapé com espaçamento */}
            <footer className="mt-auto" style={{ padding: "50px 0", backgroundColor: "#f8f9fa", color: "#6c757d", textAlign: "center" }}>
                <p>2025 Controle de Produção</p>
            </footer>
        </div>
    );
}

export default Beneficiamentos;
