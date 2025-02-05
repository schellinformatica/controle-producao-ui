import "./maquinas.css";
import NavBar from "../../components/navbar/navbar.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import api from "../../constants/api.js";
import Maquina from "../../components/maquina/maquina.jsx";
import * as XLSX from "xlsx";

function Maquinas() {
    const navigate = useNavigate();
    const [maquinas, setMaquinas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedMaquina, setSelectedMaquina] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const pageRef = useRef(1);
    const hasMoreRef = useRef(true);
    const limit = 20;

    function ClickEdit(id) {
        navigate("/maquinas/edit/" + id);
    }

    function confirmDelete(mq) {
        setSelectedMaquina(mq);
        setShowModal(true);
    }

    async function ClickDelete() {
        if (!selectedMaquina) return;
        try {
            const response = await api.delete("/maquina/" + selectedMaquina.id);
            if (response.data) {
                setMaquinas((prev) => prev.filter(mq => mq.id !== selectedMaquina.id));
            }
        } catch (error) {
            alert(error.response?.data?.error || "Erro ao excluir máquina.");
        } finally {
            setShowModal(false);
            setSelectedMaquina(null);
        }
    }

    const LoadMaquinas = useCallback(async (currentPage = 1) => {
        if (isLoading || !hasMoreRef.current) return;

        setIsLoading(true);
        try {
            const { data } = await api.get(`/maquina?page=${currentPage}&limit=${limit}`);

            setMaquinas((prev) => currentPage === 1 ? data : [...prev, ...data]);

            hasMoreRef.current = data.length === limit;
            pageRef.current = currentPage;
        } catch (error) {
            alert(error.response?.data?.error || "Erro ao carregar máquinas.");
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    const handleScroll = useCallback(() => {
        if (
            window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 &&
            !isLoading &&
            hasMoreRef.current
        ) {
            LoadMaquinas(pageRef.current + 1);
        }
    }, [isLoading, LoadMaquinas]);

    useEffect(() => {
        LoadMaquinas(1);
    }, [LoadMaquinas]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    function exportToExcel() {
        const ws = XLSX.utils.json_to_sheet(maquinas.map(mq => ({ Máquina: mq.nome })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Máquina");
        XLSX.writeFile(wb, "Maquinas.xlsx");
    }

    return (
        <div className="container-fluid mt-page">
            <NavBar />
            <div className="content-wrapper">
                <div className="container-custom mt-2">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Máquinas</li>
                        </ol>
                    </nav>

                    <div>
                        <Link to="/maquinas/add" className="btn btn-primary btn-clean mt-3 btn-default-formatted">
                            Nova máquina
                        </Link>

                        <button 
                            onClick={exportToExcel} 
                            className="btn btn-outline-secondary btn-clean mt-3 ms-3" 
                            title="Exportar para Excel"
                        >
                            <i className="bi bi-file-earmark-excel-fill"></i>
                        </button>
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
                                {maquinas.map((mq) => (
                                    <Maquina 
                                        key={mq.id}
                                        id={mq.id}
                                        nome={mq.nome}
                                        ClickEdit={ClickEdit}
                                        confirmDelete={() => confirmDelete(mq)} 
                                    />
                                ))}
                            </tbody>
                        </table>
                        {isLoading && <p>Carregando...</p>}
                    </div>
                </div>
            </div>

            {showModal && selectedMaquina && (
                <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header border-0">
                                <h5 className="modal-title">Atenção</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body text-center">
                                <p>Você está prestes a excluir a máquina <strong>{selectedMaquina?.nome}</strong>. Confirmar a exclusão?</p>
                            </div>
                            <div className="modal-footer border-0 justify-content-center">
                                <button type="button" className="btn btn-outline-secondary btn-clean" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="button" className="btn btn-danger btn-clean" onClick={ClickDelete}>Confirmar</button>
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

export default Maquinas;
