import "./appointments.css";
import NavBar from "../../components/navbar/navbar.jsx";
import { Link, useNavigate } from "react-router-dom";
import Appointment from "../../components/appointment/appointment.jsx";
import { useEffect, useState } from "react";
import api from "../../constants/api.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import * as XLSX from "xlsx"; // Importando a biblioteca xlsx
import ModalParadas from "../../components/modal/ModalParadas.jsx";

registerLocale("pt-BR", ptBR);

function Appointments() {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [action, setAction] = useState("");
    const [reason, setReason] = useState("");

    const [showModalExclusao, setShowModalExclusao] = useState(false);

    const [paradas, setParadas] = useState([]);
    const [showModalParadas, setShowModalParadas] = useState(false);

    const handleViewParadas = async (producaoId) => {
        try {
            const response = await api.get(`/production/${producaoId}/paradas`);
            const data = response.data;
            setParadas(data);
            setShowModalParadas(true);
        } catch (error) {
            console.error("Erro ao buscar paradas:", error);
        }
    };

    async function LoadAppointments() {
        try {
            let url = "/production";
            if (startDate || endDate) {
                url += `?startDate=${startDate ? startDate.toISOString().split('T')[0] : ''}&endDate=${endDate ? endDate.toISOString().split('T')[0] : ''}`;
            }
            const response = await api.get(url);
            if (response.data) {
                setAppointments(response.data);
            }
        } catch (error) {
            alert("Erro ao carregar consultas.");
        }
    }

    function ClickEdit(id) {
        navigate("/appointments/edit/" + id);
    }

    function confirmDelete(apt) {
        setSelectedAppointment(apt);
        setShowModalExclusao(true);
    }

    const handleFilterChange = () => {
        LoadAppointments(); // Recarrega a lista com o novo filtro
    };

    useEffect(() => {
        LoadAppointments();
    }, []);

    const handleParar = (idConsulta) => {
        setSelectedAppointment(idConsulta);
        setAction("parar");
        setShowModal(true);
    };

    const handleRetomar = (idConsulta) => {
        setSelectedAppointment(idConsulta);
        setAction("retomar");
        setShowModal(true);
    };

    const handleStopProduction = async () => {
        if (reason.trim() === "") {
            alert("Por favor, informe o motivo para parar a produção.");
            return;
        }

        try {
            if (action === "parar") {
                await api.post(`/production/${selectedAppointment}/stop`, { motivo: reason });
            } else {
                await api.post(`/production/${selectedAppointment}/resume`, { motivo: reason });
            }
            setShowModal(false);
            LoadAppointments(); // Recarrega a lista de produções após a alteração
        } catch (error) {
            alert("Erro ao " + action + " a produção: " + error.response?.data?.error || error.message);
        }
    };

    async function ClickDelete() {
        if (!selectedAppointment) return;
        try {
            const response = await api.delete("/production/" + selectedAppointment.id);
            if (response.data) {
                setAppointments((prevAppointment) => prevAppointment.filter(apt => apt.id !== selectedAppointment.id));
            }
        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status === 401) return navigate("/");
                alert(error.response?.data.error);
            } else {
                alert("Erro ao excluir empacotamento.");
            }
        } finally {
            setShowModalExclusao(false);
            setSelectedAppointment(null);
        }
    }    

    function exportToExcel() {
    
        let totalProducaoGeral = 0;
        const totalPorMarca = {};

        const dadosExcel = appointments.map((apt) => {
            const quantidade = Number(apt.quantidade);
            totalProducaoGeral += quantidade;

            if (!totalPorMarca[apt.marca]) {
                totalPorMarca[apt.marca] = 0;
            }
            totalPorMarca[apt.marca] += quantidade;

            // Calcula a média dos pesos B1 até B5
            const pesos = [apt.peso_b1, apt.peso_b2, apt.peso_b3, apt.peso_b4, apt.peso_b5]
                .map(p => Number(p) || 0); // Garante que valores nulos ou undefined não causem erro
            const mediaPesos = pesos.reduce((acc, val) => acc + val, 0) / pesos.length;

            // Corrige o horário adicionando 3 horas (caso esteja UTC e precise converter para o fuso local)
            const horaAjustada = new Date(apt.hora);
            horaAjustada.setHours(horaAjustada.getHours() + 3); // Ajuste de fuso horário

            return {
                "Máquina": apt.maquina?.nome || "N/A",
                "Data": horaAjustada.toLocaleString(), // Exibir no formato correto
                "Lote": apt.lote,
                "Marca": apt.marca,
                "Quantidade": quantidade,
                "Média Pesos (B1-B5)": mediaPesos.toFixed(3), // 3 casas decimais
            };
        });

        // Adiciona os totalizadores na planilha
        dadosExcel.push({});
        dadosExcel.push({ "Marca": "Total Geral", "Quantidade": totalProducaoGeral });

        dadosExcel.push({});
        dadosExcel.push({ "Marca": "Total por Marca" });

        Object.entries(totalPorMarca).forEach(([marca, total]) => {
            dadosExcel.push({ "Marca": marca, "Quantidade": total });
        });

        // Criar a planilha e baixar o arquivo
        const ws = XLSX.utils.json_to_sheet(dadosExcel);

        // Autofit: Ajusta automaticamente a largura das colunas
        const colWidths = Object.keys(dadosExcel[0]).map((key) => ({
            wch: Math.max(...dadosExcel.map(row => String(row[key] || "").length), key.length) + 2
        }));
        ws["!cols"] = colWidths;

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Empacotamentos");

        XLSX.writeFile(wb, "Empacotamentos.xlsx");
    }    

    return (
        <div className="container-fluid mt-page">
            <NavBar />
            <div className="content-wrapper">
                <div className="container-custom mt-2">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Empacotamento</li>
                        </ol>
                    </nav>

                    <div className="d-flex justify-content-between align-items-center mt-2">
                        <Link to="/appointments/add" className="btn btn-primary btn-clean mt-3">
                            Novo empacotamento
                        </Link>
                        <button className="btn btn-outline-secondary btn-clean mt-3 ms-3" onClick={exportToExcel}>
                            <i className="bi bi-file-earmark-excel-fill"></i>
                        </button>
                        
                        <div className="d-flex align-items-center ms-auto mt-3">
                            <label htmlFor="data-inicio" className="me-2"></label>
                            <DatePicker
                                id="data-inicio"
                                name="data-inicio"
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                className="form-control input-clean input-datetime-filter"
                                dateFormat="dd/MM/yyyy"
                                locale="pt-BR"
                                placeholderText="Data Início"
                            />
                            <label htmlFor="data-fim" className="ms-2 me-2"></label>
                            <DatePicker
                                id="data-fim"
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                className="form-control input-clean input-datetime-filter"
                                dateFormat="dd/MM/yyyy"
                                locale="pt-BR"
                                placeholderText="Data Fim"
                            />

                            <button className="btn btn-outline-secondary btn-clean ms-3" onClick={handleFilterChange}>
                                <i className="bi bi-filter"></i>
                            </button>
                        </div>
                    </div>

                    <div style={{ marginTop: "33px" }}>
                        <table className="table table-hover table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col">Máquina 1</th>
                                    <th scope="col">Máquina 2</th>
                                    <th scope="col">Data</th>
                                    <th scope="col">Lote</th>
                                    <th scope="col">Lote Interno</th>
                                    <th scope="col">Marca</th>
                                    <th scope="col" className="text-end">Média Pesos</th>
                                    <th scope="col" className="text-end">Quantidade</th>
                                    <th scope="col" className="col-buttons"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    appointments.map((ap) => (
                                        <Appointment key={ap.id}
                                            id={ap.id}
                                            maquina={ap.maquina.nome}
                                            maquina_secundaria={ap.maquina_secundaria.nome}
                                            hora={ap.hora}
                                            lote={ap.lote}
                                            lote_interno={ap.lote_interno}
                                            marca={ap.marca}
                                            media_peso={ap.media_peso}
                                            quantidade={ap.quantidade}
                                            confirmDelete={() => confirmDelete(ap)}
                                            ClickParar={handleParar}
                                            ClickRetomar={handleRetomar}
                                            ClickEdit={ClickEdit}
                                            ClickViewParadas={handleViewParadas}
                                        />
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal para confirmar a parada ou retomada */}
            {showModal && (
                <div className="modal fade show" style={{ display: "block" }} aria-modal="true" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{action === "parar" ? "Parar" : "Retomar"} produção</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Tem certeza que deseja {action === "parar" ? "parar" : "retomar"} a produção?</p>

                                {action === "parar" && (
                                    <div className="form-group">
                                        <label htmlFor="motivo">Motivo</label>
                                        <textarea
                                            id="motivo"
                                            name="motivo"
                                            className="form-control"
                                            rows="3"
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            placeholder="Informe o motivo para parar a produção."
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Não
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleStopProduction}>
                                    Sim
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showModalExclusao && selectedAppointment && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header border-0">
                                <h5 className="modal-title">Atenção</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModalExclusao(false)}></button>
                            </div>
   
                            <div className="modal-body text-center">
                                <p style={{ wordBreak: "break-word", overflowWrap: "break-word", fontSize: "1rem" }}>
                                    Você está prestes a excluir o empacotamento{" "} 
                                    <strong style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", verticalAlign: "middle", maxWidth: "100%", display: "inline-block" }}>
                                        {" "}{selectedAppointment?.id}
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

            <ModalParadas show={showModalParadas} onClose={() => setShowModalParadas(false)} paradas={paradas} />

            {/* Rodapé com espaçamento */}
            <footer className="mt-auto" style={{ padding: "50px 0", backgroundColor: "#f8f9fa", color: "#6c757d", textAlign: "center" }}>
                <p>2025 Controle de Produção</p>
            </footer>
            
        </div>
    );
}

export default Appointments;
