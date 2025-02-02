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
        const totalRegistros = appointments.length;
    
        const totalPesoEmbalagem = appointments.reduce((acc, mq) => acc + (mq.peso_embalagem || 0), 0);
        const totalQuantidade = appointments.reduce((acc, mq) => acc + (mq.quantidade || 0), 0);
        const mediaPesoPacotes = totalQuantidade > 0 ? (totalPesoEmbalagem / totalQuantidade).toFixed(3) : 0;
    
        const totalizador = {
            Máquina: "Total",
            Data: "",
            Lote: "",
            Lote_Interno: "",
            Marca: "",
            Perca: appointments.reduce((acc, mq) => acc + (mq.perca || 0), 0),
            Peso_B1: appointments.reduce((acc, mq) => acc + (mq.peso_b1 || 0), 0),
            Peso_B2: appointments.reduce((acc, mq) => acc + (mq.peso_b2 || 0), 0),
            Peso_B3: appointments.reduce((acc, mq) => acc + (mq.peso_b3 || 0), 0),
            Peso_B4: appointments.reduce((acc, mq) => acc + (mq.peso_b4 || 0), 0),
            Peso_B5: appointments.reduce((acc, mq) => acc + (mq.peso_b5 || 0), 0),
            Peso_Embalagem: totalPesoEmbalagem,
            Quantidade: totalQuantidade,
            Teste_Impacto: "",
            Verificado: ""
        };
    
        const mediaizador = {
            Máquina: "Média",
            Data: "",
            Lote: "",
            Lote_Interno: "",
            Marca: "",
            Perca: (totalizador.Perca / totalRegistros).toFixed(3),
            Peso_B1: (totalizador.Peso_B1 / totalRegistros).toFixed(3),
            Peso_B2: (totalizador.Peso_B2 / totalRegistros).toFixed(3),
            Peso_B3: (totalizador.Peso_B3 / totalRegistros).toFixed(3),
            Peso_B4: (totalizador.Peso_B4 / totalRegistros).toFixed(3),
            Peso_B5: (totalizador.Peso_B5 / totalRegistros).toFixed(3),
            Peso_Embalagem: (totalPesoEmbalagem / totalRegistros).toFixed(3),
            Quantidade: (totalQuantidade / totalRegistros).toFixed(3),
            Média_Peso_Pacote: mediaPesoPacotes, // Adiciona a média correta dos pacotes
            Teste_Impacto: "",
            Verificado: ""
        };
    
        // Criar a planilha com os dados
        const data = appointments.map(mq => ({
            Máquina: mq.maquina.nome,
            Data: mq.hora,
            Lote: mq.lote,
            Lote_Interno: mq.lote_interno,
            Marca: mq.marca,
            Perca: mq.perca,
            Peso_B1: mq.peso_b1,
            Peso_B2: mq.peso_b2,
            Peso_B3: mq.peso_b3,
            Peso_B4: mq.peso_b4,
            Peso_B5: mq.peso_b5,
            Peso_Embalagem: mq.peso_embalagem,
            Quantidade: mq.quantidade,
            Teste_Impacto: mq.teste_impacto,
            Verificado: mq.verificado
        }));
    
        // Adicionar a linha de total e média ao final
        data.push(totalizador);
        data.push(mediaizador);
    
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Empacotamento");
    
        // Salva o arquivo Excel
        XLSX.writeFile(wb, "Empacotamento.xlsx");
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
                            <i class="bi bi-file-earmark-excel-fill"></i>
                        </button>
                        
                        <div className="d-flex align-items-center ms-auto mt-3">
                            <label className="me-2"></label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                className="form-control input-clean input-datetime-filter"
                                dateFormat="dd/MM/yyyy"
                                locale="pt-BR"
                                placeholderText="Data Início"
                            />
                            <label className="ms-2 me-2"></label>
                            <DatePicker
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
                                    <th scope="col">Máquina</th>
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


            {/* Rodapé com espaçamento */}
            <footer className="mt-auto" style={{ padding: "50px 0", backgroundColor: "#f8f9fa", color: "#6c757d", textAlign: "center" }}>
                <p>2025 Controle de Produção</p>
            </footer>
            
        </div>
    );
}

export default Appointments;
