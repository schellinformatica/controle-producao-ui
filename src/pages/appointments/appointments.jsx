import "./appointments.css";
import NavBar from "../../components/navbar/navbar.jsx";
import { Link, useNavigate } from "react-router-dom";
import Appointment from "../../components/appointment/appointment.jsx";
import { useEffect, useState } from "react";
import api from "../../constants/api.js";

function Appointments() {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [action, setAction] = useState("");
    const [reason, setReason] = useState("");

    async function LoadAppointments() {
        try {
            let url = "/production";
            if (startDate || endDate) {
                url += `?startDate=${startDate}&endDate=${endDate}`;
            }
            const response = await api.get(url);
            if (response.data) {
                setAppointments(response.data);
            }
        } catch (error) {
            alert("Erro ao carregar consultas.");
        }
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

    return (
        <div className="container-fluid mt-page">
            <NavBar />
            <div className="content-wrapper">
                <div className="container-custom">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Produção</li>
                        </ol>
                    </nav>
                    <div>
                        <Link to="/appointments/add" className="btn btn-primary mt-2">
                            Nova produção
                        </Link>
                    </div>
                    
                    <div className="mt-3">
                        <label htmlFor="startDate">Data Início</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <label htmlFor="endDate" className="ml-3">Data Fim</label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                        <button className="btn btn-secondary ml-3" onClick={handleFilterChange}>Aplicar Filtro</button>
                    </div>

                    <div>
                        <table className="table table-hover mt-4">
                            <thead>
                                <tr>
                                    <th scope="col">Máquina</th>
                                    <th scope="col">Hora</th>
                                    <th scope="col">Lote</th>
                                    <th scope="col">Lote Interno</th>
                                    <th scope="col">Marca</th>
                                    <th scope="col" className="text-end">Quantidade</th>
                                    <th scope="col" className="text-center">Verificado</th>
                                    <th scope="col" className="col-buttons"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    appointments.map((ap) => {
                                        return (
                                            <Appointment key={ap.id}
                                                id={ap.id}
                                                maquina={ap.maquina.nome}
                                                hora={ap.hora}
                                                lote={ap.lote}
                                                lote_interno={ap.lote_interno}
                                                marca={ap.marca}
                                                quantidade={ap.quantidade}
                                                verificado={ap.verificado}
                                                ClickDelete={() => console.log("deletar: " + ap.id)}
                                                ClickParar={handleParar}
                                                ClickRetomar={handleRetomar}
                                            />
                                        );
                                    })
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
        </div>
    );
}

export default Appointments;
