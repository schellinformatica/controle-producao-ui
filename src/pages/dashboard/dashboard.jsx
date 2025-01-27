import "./dashboard.css";

import NavBar from "../../components/navbar/navbar.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../constants/api.js";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

function Dashboard() {
    Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState([]);
    const [resumo, setResumo] = useState(null);

    const lineChartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        datasets: [{
            label: "Produção (unidades)",
            data: [100, 110, 120, 130, 120, 150, 160, 180, 165, 155, 200, 230],
            fill: false,
            borderColor: "#00b0ff",
            tension: 0.1,
        }]
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false, 
        plugins: {
            title: {
                display: false, // Remover título do gráfico
            },
            legend: {
                position: 'bottom',
            }
        },
        scales: {
            x: {
                title: {
                    display: false, // Remover título do eixo X
                }
            },
            y: {
                title: {
                    display: false, // Remover título do eixo Y
                }
            }
        }
    };

    return (
        <div className="container-fluid mt-page">
            <NavBar />
            <div className="content-wrapper">
                <div className="container-custom">
                    <div className="col-md-12 mt-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                {/* Título alinhado à esquerda com padding */}
                                <h5 className="card-title mb-3">Quantidade Produzida ao Longo do Tempo</h5>
                                <div className="chart-container p-3"> {/* Padding no container do gráfico */}
                                    <Line data={lineChartData} options={lineChartOptions} />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Dashboard;
