import "./maquinas-manutencao.css";
import NavBar from "../../components/navbar/navbar.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../constants/api.js";
import MaquinaManutencao from "../../components/maquina-manutencao/maquina-manutencao.jsx";

function MaquinasManutencao() {
    const navigate = useNavigate();
    const [maquinasManutencao, setMaquinasManutencao] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedMaquina, setSelectedMaquina] = useState(null);
    const [historicoManutencao, setHistoricoManutencao] = useState([]);
    const [descricaoManutencao, setDescricaoManutencao] = useState("");

    const [dataProximaManutencao, setDataProximaManutencao] = useState("");


    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const limit = 20;

    async function LoadMaquinasManutencao(currentPage = 1) {
        if (!hasMore) return;
        try {
            const response = await api.get(`/maquina-manutencao?page=${currentPage}&limit=${limit}`);
            const maquinaData = response.data;

            if (currentPage === 1) {
                setMaquinasManutencao(maquinaData);
            } else {
                setMaquinasManutencao((prevMaquinas) => [...prevMaquinas, ...maquinaData]);
            }

            setPage(currentPage);
            setHasMore(maquinaData.length === limit);
        } catch (error) {
            alert("Erro ao carregar máquinas.");
        }
    }

    async function LoadHistoricoManutencao(id) {
        try {
            const response = await api.get(`/manutencao/${id}`);
            setHistoricoManutencao(response.data);
            setSelectedMaquina(maquinasManutencao.find((mq) => mq.id === id));
            setShowModal(true);
        } catch (error) {
            alert("Erro ao carregar histórico de manutenção.");
        }
    }

    async function adicionarManutencao() {
        if (!descricaoManutencao.trim()) {
            alert("A descrição da manutenção não pode estar vazia.");
            return;
        }

        if (!dataProximaManutencao.trim()) {
            alert("A data da próxima manutenção não pode estar vazia.");
            return;
        }

        try {
            const now = new Date();
            const localISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString();            
            const usuario_id = localStorage.getItem('sessionId');

            const json = {
                maquina_manutencao_id: selectedMaquina.id,
                data: localISO,
                descricao: descricaoManutencao,
                usuario_responsavel_id: parseInt(usuario_id, 10),
                data_proxima_manutencao: new Date(dataProximaManutencao)
            }

            const response = await api.post("/manutencao", json);

            setHistoricoManutencao((prev) => [...prev, response.data]);
            setDescricaoManutencao("");
        } catch (error) {
            alert("Erro ao adicionar manutenção.");
        }
    }

    useEffect(() => {
        LoadMaquinasManutencao(1);
    }, []);

    return (
        <div className="container-fluid mt-page">
            <NavBar />
            <div className="content-wrapper">
                <div className="container-custom mt-2">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Manutenção de Máquinas</li>
                        </ol>
                    </nav>

                    <div>
                        <Link to="/maquinas-manutencao/add" className="btn btn-primary btn-clean btn-default-formatted mt-3">
                            Nova máquina
                        </Link>
                    </div>

                    <div style={{ marginTop: "33px" }}>
                        <table className="table table-hover table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col">Máquina</th>
                                    <th scope="col" className="col-buttons"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {maquinasManutencao.map((mq) => (
                                    <tr key={mq.id}>
                                        <td>{mq.nome}</td>
                                        <td className="text-end">
                                            <button 
                                                className="btn btn-sm btn-outline-secondary btn-clean me-2" 
                                                onClick={() => LoadHistoricoManutencao(mq.id)}
                                            >
                                                <i class="bi bi-list-check"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showModal && selectedMaquina && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header border-0">
                                <h5 className="modal-title">Histórico de Manutenção - {selectedMaquina.nome}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>

                            <div className="modal-body">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Data Manutenção</th>
                                            <th>Próxima Manutenção</th>
                                            <th>Descrição</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historicoManutencao.length > 0 ? (
                                            historicoManutencao.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{new Date(item.data).toLocaleDateString()}</td>
                                                    <td>{new Date(item.data_proxima_manutencao).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>

                                                    <td>{item.descricao}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="2" className="text-center">Nenhuma manutenção registrada.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                <div className="mt-4">
                                    <label>Descrição</label>
                                    <textarea
                                        className="form-control mt-2"
                                        value={descricaoManutencao}
                                        onChange={(e) => setDescricaoManutencao(e.target.value)}
                                        placeholder="Descreva a manutenção realizada"
                                        rows={5}
                                    />

                                    <div className="col-md-3">
                                    <label className="form-label mt-3">Data da próxima manutenção</label>
                                    <input
                                        type="date"
                                        name="data"
                                        value={dataProximaManutencao}
                                        onChange={(e) => setDataProximaManutencao(e.target.value)}
                                        className="form-control input-clean"
                                    />
                                    </div>

                                    <button 
                                        className="btn btn-primary btn-clean btn-default-formatted mt-4"
                                        onClick={adicionarManutencao}
                                    >
                                        Adicionar Manutenção
                                    </button>

                                </div>
                            </div>

                            <div className="modal-footer border-0">
                                <button type="button" className="btn btn-outline-secondary btn-clean" onClick={() => setShowModal(false)}>Fechar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <footer className="mt-auto" style={{ padding: "50px 0", backgroundColor: "#f8f9fa", color: "#6c757d", textAlign: "center" }}>
                <p>2025 Controle de Produção</p>
            </footer>
        </div>
    );
}

export default MaquinasManutencao;
