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
    const [dashboard, setDashboard] = useState({});
    const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
    const [marcaSelecionada, setMarcaSelecionada] = useState("");
    const [produtoSelecionado, setProdutoSelecionado] = useState(""); // Novo estado para produto
    const [marcas, setMarcas] = useState([]);
    const [produtos, setProdutos] = useState([]); // Estado para produtos
    const [totalGeral, setTotalGeral] = useState(0);

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom' }
        },
        scales: {
            x: { title: { display: false } },
            y: { title: { display: false } }
        }
    };

    const [anosDisponiveis, setAnosDisponiveis] = useState([]);

    async function LoadDashboard() {
        try {
            const response = await api.get(`/dashboard?ano=${anoSelecionado}&marca=${marcaSelecionada}&produto=${produtoSelecionado}`);
            const { producaoData, totalGeral } = response.data;

            const marcas = {};
            const totaisPorMarca = {};

            producaoData.forEach(({ marca }) => {
                if (!marcas[marca]) {
                    marcas[marca] = Array(12).fill(0);
                }
            });

            producaoData.forEach(({ mes, marca, quantidade }) => {
                marcas[marca][mes - 1] += parseFloat(quantidade);
            });

            setDashboard(marcas);
            setTotalGeral(totalGeral);
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
        async function LoadMarcas() {
            try {
                const response = await api.get("/marca");
                setMarcas(response.data);
            } catch (error) {
                alert("Erro ao carregar marcas.");
            }
        }
        async function LoadProdutos() {
            try {
                const response = await api.get("/produto");
                setProdutos(response.data); // Carregar os produtos disponíveis
            } catch (error) {
                alert("Erro ao carregar produtos.");
            }
        }
        async function fetchAnos() {
            try {
                const response = await api.get("/dashboard/anos");
                setAnosDisponiveis(response.data);
            } catch (error) {
                console.error("Erro ao buscar anos disponíveis:", error);
            }
        }

        LoadMarcas();
        LoadProdutos();
        fetchAnos();
    }, []);

    useEffect(() => {
        LoadDashboard();
    }, [anoSelecionado, marcaSelecionada, produtoSelecionado]); // Adicionando produtoSelecionado ao array de dependências

    const lineChartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        datasets: Object.keys(dashboard)
            .filter((marca) => marca && marca !== "null" && marca !== "undefined")
            .map((marca, index) => ({
            label: marca,
            data: dashboard[marca],
            fill: false,
            borderColor: `hsl(${index * 60}, 55%, 77%)`,
            tension: 0.1,
        }))
    };

    return (
        <div className="container-fluid mt-page">
            <NavBar />
            <div className="content-wrapper">
                <div className="container-custom">
                    <div className="col-md-12 mt-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="card-title mb-1">Quantidade Produzida ao Longo do Tempo</h5>
                                    <div className="d-flex align-items-center">
                                        <label className="me-2 fw-bold">Ano:</label>
                                        <select
                                            className="form-select w-auto"
                                            value={anoSelecionado}
                                            onChange={(e) => setAnoSelecionado(e.target.value)}
                                        >
                                            {anosDisponiveis.length === 0 ? (
                                                <option value="">Carregando...</option>
                                            ) : (
                                                anosDisponiveis.map((ano) => (
                                                    <option key={ano} value={ano}>
                                                        {ano}
                                                    </option>
                                                ))
                                            )}
                                        </select>

                                        <label className="me-2 fw-bold ms-3">Marca:</label>
                                        <select
                                            className="form-select w-auto"
                                            value={marcaSelecionada}
                                            onChange={(e) => setMarcaSelecionada(e.target.value)}
                                        >
                                            <option value="">Todas</option>
                                            {marcas.map((marca) => (
                                                <option key={marca.id} value={marca.nome}>
                                                    {marca.nome}
                                                </option>
                                            ))}
                                        </select>

                                        <label className="me-2 fw-bold ms-3">Produto:</label>
                                        <select
                                            className="form-select w-auto"
                                            value={produtoSelecionado}
                                            onChange={(e) => setProdutoSelecionado(e.target.value)}
                                        >
                                            <option value="">Todos</option>
                                            {produtos.map((produto) => (
                                                <option key={produto.id} value={produto.nome}>
                                                    {produto.nome}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="chart-container p-3">
                                    <Line data={lineChartData} options={lineChartOptions} />
                                </div>

                                <div className="d-flex justify-content-start mt-3">
                                    <span className="text-muted small fw-semibold">Total Geral Produzido:</span>
                                    <span className="fw-bold text-dark ms-1">{totalGeral.toLocaleString()}</span>
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
