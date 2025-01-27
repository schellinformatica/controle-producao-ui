import "./maquinas.css";
import NavBar from "../../components/navbar/navbar.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../constants/api.js";
import Maquina from "../../components/maquina/maquina.jsx";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx"; // Importando a biblioteca xlsx

function Maquinas() {
    const navigate = useNavigate();
    const [maquina, setMaquinas] = useState([]);

    function ClickEdit(id) {
        navigate("/maquinas/edit/" + id);
    }

    function ClickDelete(idConsulta) {
        console.log("deletar: " + idConsulta);
    }

    async function LoadMaquinas() {
        try {
            const response = await api.get("/maquina");

            if (response.data) {
                setMaquinas(response.data);
            }
        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status === 401) return navigate("/");
                alert(error.response?.data.error);
            } else {
                alert("Erro ao carregar máquinas.");
            }
        }
    }

    useEffect(() => {
        LoadMaquinas();
    }, []);

    // Função para exportar para Excel
    function exportToExcel() {
        const ws = XLSX.utils.json_to_sheet(maquina.map(mq => ({
            Máquina: mq.nome,
            Ações: "Editar / Deletar"
        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Máquinas");

        // Salva o arquivo Excel
        XLSX.writeFile(wb, "Maquinas.xlsx");
    }

    return (
        <div className="container-fluid mt-page">
            <NavBar />
            <div className="content-wrapper">
                <div className="container-custom">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Máquinas</li>
                        </ol>
                    </nav>

                    <div>
                        <Link to="/maquinas/add" className="btn btn-primary mt-2">
                            Nova máquina
                        </Link>

                        {/* Botões de exportação */}
                        <button onClick={exportToExcel} className="btn btn-default mt-2 ml-2">
                            Exportar Excel
                        </button>
                    </div>
                
                    <table className="table table-hover mt-4">
                        <thead>
                            <tr>
                                <th scope="col">Máquina</th>
                                <th scope="col" className="col-buttons"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                maquina.map((mq) => {
                                    return <Maquina key={mq.id}
                                                     id={mq.id}
                                                     nome={mq.nome}
                                                     ClickEdit={ClickEdit}
                                    />
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Maquinas;
