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
    
    // Função para ajustar a data considerando o fuso horário
    const adjustDateToLocalTimezone = (date) => {
        // Crie uma nova instância de Date para não modificar a original
        const localDate = new Date(date);
    
        // Obtenha a diferença de minutos entre a hora local e UTC (em minutos)
        const timezoneOffset = localDate.getTimezoneOffset(); // em minutos
        
        // Ajuste a hora subtraindo o offset (para compensar o UTC)
        localDate.setMinutes(localDate.getMinutes() - timezoneOffset);
        
        // Retorne a data ajustada para ser enviada para o backend
        return localDate.toISOString(); // Retorna a data no formato ISO, por exemplo: '2025-02-15T17:55:00.000Z'
    };
    
    const handleCreateNewAppointment = async () => {
        try {
            const hora = adjustDateToLocalTimezone(new Date()); // Cria a data ajustada
            const response = await api.post("/production", { hora });
            navigate(`/appointments/edit/${response.data.id}`);
        } catch (error) {
            alert("Erro ao criar novo empacotamento.");
            console.error(error);
        }
    };
    

    function exportToExcel() {
        let totalProducaoGeral = 0;
        const totalPorMarca = {};
    
        const dadosExcel = appointments.map((apt) => {
            const quantidade = Number(apt.quantidade);
            totalProducaoGeral += quantidade;
    
            if (apt.marca?.nome) {
                totalPorMarca[apt.marca.nome] = (totalPorMarca[apt.marca.nome] || 0) + quantidade;
            }
    
            // Média dos pesos B1 até B5
            const pesos = [apt.peso_b1, apt.peso_b2, apt.peso_b3, apt.peso_b4, apt.peso_b5]
                .map(p => Number(p) || 0);
            const mediaPesos = (pesos.reduce((acc, val) => acc + val, 0) / pesos.length).toFixed(3);
    
            // Ajusta a data e hora
            const horaAjustada = new Date(apt.hora);
            horaAjustada.setHours(horaAjustada.getHours() + 3);
            const dataFormatada = horaAjustada.toLocaleString();
    
            return {
                "Data e Hora": dataFormatada,
                "Turno": apt.turno?.nome || "N/A",
                "Produto": apt.produto?.nome || "N/A",
                "Marca": apt.marca?.nome || "N/A",
                "Quantidade Fardos": quantidade,
                "Peso (kg)": apt.peso || "N/A",
                "Máquina 1": apt.maquina?.nome || "N/A",
                "Máquina 2": apt.maquina_secundaria?.nome || "N/A",
                "Lote": apt.lote || "N/A",
                "Lote Interno": apt.lote_interno || "N/A",
                "P1": apt.peso_b1 ? Number(apt.peso_b1).toFixed(2) : "N/A",
                "P2": apt.peso_b2 ? Number(apt.peso_b2).toFixed(2) : "N/A",
                "P3": apt.peso_b3 ? Number(apt.peso_b3).toFixed(2) : "N/A",
                "P4": apt.peso_b4 ? Number(apt.peso_b4).toFixed(2) : "N/A",
                "P5": apt.peso_b5 ? Number(apt.peso_b5).toFixed(2) : "N/A",
                "Média Pesos (B1-B5)": mediaPesos,
                "Peso Embalagem (kg)": apt.peso_embalagem ? Number(apt.peso_embalagem).toFixed(2) : "N/A",
                "Embalagem Utilizada": apt.embalagem_utilizada || "N/A",
                "Perca (KG)": apt.perca || "N/A",
                "Teste Impacto": apt.teste_impacto || "N/A",
                "Verificação Carimbo": apt.verificao_carimbo || "N/A",
                "Usuário Verificador": apt.usuario_verificador || "N/A"
            };
        });
    
        // Adiciona separação e totalizadores
        dadosExcel.push({});
        dadosExcel.push({ "Marca": "Total Geral", "Quantidade Fardos": totalProducaoGeral });
    
        dadosExcel.push({});
        dadosExcel.push({ "Marca": "Total por Marca" });
    
        Object.entries(totalPorMarca).forEach(([marca, total]) => {
            dadosExcel.push({ "Marca": marca, "Quantidade Fardos": total });
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
                            <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Empacotamento</li>
                        </ol>
                    </nav>

                    <div className="d-flex justify-content-between align-items-center mt-2">
                        <div className="btn btn-primary btn-clean mt-3" onClick={handleCreateNewAppointment}>
                            Novo empacotamento
                        </div>
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
                                            maquina={ap.maquina?.nome}
                                            maquina_secundaria={ap.maquina_secundaria?.nome}
                                            hora={ap.hora}
                                            lote={ap.lote}
                                            lote_interno={ap.lote_interno}
                                            marca={ap.marca?.nome}
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
