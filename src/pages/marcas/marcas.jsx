import "./marcas.css";
import NavBar from "../../components/navbar/navbar.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../constants/api.js";
import Marca from "../../components/marca/marca.jsx";

function Marcas() {
    const navigate = useNavigate();
    const [marcas, setMarcas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedMarca, setSelectedMarca] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const limit = 20;

    function ClickEdit(id) {
        navigate("/marcas/edit/" + id);
    }

    function confirmDelete(mq) {
        setSelectedMarca(mq);
        setShowModal(true);
    }
    
    async function ClickDelete() {
        if (!selectedMarca) return;
        try {
            const response = await api.delete("/marca/" + selectedMarca.id);
            if (response.data) {
                setMarcas((prevMarcas) => prevMarcas.filter(mq => mq.id !== selectedMarca.id));
            }
        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status === 401) return navigate("/");
                alert(error.response?.data.error);
            } else {
                alert("Erro ao excluir marca.");
            }
        } finally {
            setShowModal(false);
            setSelectedMarca(null);
        }
    }    

    async function LoadMarcas(currentPage = 1) {
        if (!hasMore) return;

        try {
            const response = await api.get(`/marca?page=${currentPage}&limit=${limit}`);
            const marcaData = response.data;

            if (currentPage === 1) {
                setMarcas(marcaData);
            } else {
                setMarcas((prevMarcas) => [...prevMarcas, ...marcaData]);
            }

            setPage(currentPage);
            setHasMore(marcaData.length === limit);
        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status === 401) return navigate("/");
                alert(error.response?.data.error);
            } else {
                alert("Erro ao carregar marcas.");
            }
        }
    }

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50 && hasMore) {
            LoadMarcas(page + 1);
        }
    };

    useEffect(() => {
        LoadMarcas(1);
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [page, hasMore]);

    return (
        <div className="container-fluid mt-page">
            <NavBar />
            <div className="content-wrapper">
                <div className="container-custom mt-2">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Marcas</li>
                        </ol>
                    </nav>

                    <div>
                        <Link to="/marcas/add" className="btn btn-primary btn-clean mt-3 btn-default-formatted">
                            Nova marca
                        </Link>
                    </div>

                    <div style={{ marginTop: "33px" }}>
                        <table className="table table-hover table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col">Marca</th>
                                    <th scope="col" className="col-buttons"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {marcas.map((mq) => (
                                    <Marca 
                                    key={mq.id}
                                    id={mq.id}
                                    nome={mq.nome}
                                    ClickEdit={ClickEdit}
                                    confirmDelete={() => confirmDelete(mq)} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            {showModal && selectedMarca && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header border-0">
                                <h5 className="modal-title">Atenção</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
   
                            <div className="modal-body text-center">
                                <p style={{ wordBreak: "break-word", overflowWrap: "break-word", fontSize: "1rem" }}>
                                    Você está prestes a excluir a marca{" "} 
                                    <strong style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", verticalAlign: "middle", maxWidth: "100%", display: "inline-block" }}>
                                        {" "}{selectedMarca?.nome}
                                    </strong>.
                                </p>
                                <p>Confirmar a exclusão?</p>
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

export default Marcas;
