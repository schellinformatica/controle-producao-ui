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
            data: dashboard, // Agora os dados vêm do banco
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

    async function LoadDashboard() {
        try {
            const response = await api.get("/dashboard");
            const producaoData = response.data;
    
            // Criar um array de 12 posições inicializado com 0
            const meses = Array(12).fill(0);
    
            // Iterar sobre os dados e somar corretamente a quantidade em cada mês
            producaoData.forEach(({ mes, quantidade }) => {
                const index = mes - 1; // Ajusta índice (Janeiro = 0, Fevereiro = 1, etc.)
                meses[index] += parseFloat(quantidade); // Acumula valores no mês correto
            });
    
            setDashboard(meses); // Atualiza o estado do gráfico
        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status === 401) return navigate("/");
                alert(error.response?.data.error);
            } else {
                alert("Erro ao carregar o dashboard.");
            }
        }
    }
    

    useEffect(() => {
        LoadDashboard();
    }, []);

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
