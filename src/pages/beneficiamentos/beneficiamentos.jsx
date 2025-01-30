import "./beneficiamentos.css";
import NavBar from "../../components/navbar/navbar.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../constants/api.js";
import Beneficiamento from "../../components/beneficiamento/beneficiamento.jsx";

function Beneficiamentos() {
    const navigate = useNavigate();
    const [beneficiamento, setBeneficiamentos] = useState([]);

    function ClickEdit(id) {
        navigate("/maquinas/edit/" + id);
    }

    function ClickDelete(idConsulta) {
        console.log("deletar: " + idConsulta);
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
                            <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
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
                            <thead>
                                <tr>
                                    <th scope="col">Data</th>
                                    <th scope="col">Turno</th>
                                    <th scope="col">Operador</th>
                                    <th scope="col" className="col-buttons"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    beneficiamento.map((ben) => {
                                        return <Beneficiamento key={ben.id}
                                                        id={ben.id}
                                                        data={ben.data}
                                                        turno={ben.turno.nome}
                                                        operador={ben.usuario.nome}
                                                        ClickEdit={ClickEdit}
                                                        ClickDelete={ClickDelete}
                                        />
                                    }) 
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Rodapé com espaçamento */}
            <footer className="mt-auto" style={{ padding: "50px 0", backgroundColor: "#f8f9fa", color: "#6c757d", textAlign: "center" }}>
                <p>2025 Controle de Produção</p>
            </footer>
            
        </div>
    );
}

export default Beneficiamentos;
