import "./produtos.css";
import NavBar from "../../components/navbar/navbar.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../constants/api.js";
import Produto from "../../components/produto/produto.jsx";

function Produtos() {
    const navigate = useNavigate();
    const [produtos, setProdutos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduto, setSelectedProduto] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const limit = 20;
    
    function ClickEdit(id) {
        navigate("/produtos/edit/" + id);
    }

    function confirmDelete(mq) {
        setSelectedProduto(mq);
        setShowModal(true);
    }

    async function ClickDelete() {
        if (!selectedProduto) return;
        try {
            const response = await api.delete("/produto/" + selectedProduto.id);
            if (response.data) {
                setProdutos((prevProdutos) => prevProdutos.filter(mq => mq.id !== selectedProduto.id));
            }
        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status === 401) return navigate("/");
                alert(error.response?.data.error);
            } else {
                alert("Erro ao excluir o produto.");
            }
        } finally {
            setShowModal(false);
            setSelectedProduto(null);
        }
    }

    async function LoadProdutos(currentPage = 1) {
        if (!hasMore) return;

        try {
            const response = await api.get(`/produto?page=${currentPage}&limit=${limit}`);
            const produtoData = response.data;

            if (currentPage === 1) {
                setProdutos(produtoData);
            } else {
                setProdutos((prevProdutos) => [...prevProdutos, ...produtoData]);
            }

            setPage(currentPage);
            setHasMore(produtoData.length === limit);
        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status === 401) return navigate("/");
                alert(error.response?.data.error);
            } else {
                alert("Erro ao carregar produtos.");
            }
        }
    }

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50 && hasMore) {
            LoadProdutos(page + 1);
        }
    };

    useEffect(() => {
        LoadProdutos(1);
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
                            <li className="breadcrumb-item active" aria-current="page">Produtos</li>
                        </ol>
                    </nav>

                    <div>
                        <Link to="/produtos/add" className="btn btn-primary btn-clean mt-3 btn-default-formatted">
                            Novo produto
                        </Link>
                    </div>

                    <div className="table-responsive" style={{ marginTop: "33px" }}>
                        <table className="table table-hover table-bordered produtos-table">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col">Produto</th>
                                    <th scope="col" className="col-buttons"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {produtos.map((mq) => (
                                    <Produto
                                        key={mq.id}
                                        id={mq.id}
                                        nome={mq.nome}
                                        ClickEdit={ClickEdit}
                                        confirmDelete={() => confirmDelete(mq)}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>  
            </div>

            {showModal && selectedProduto && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header border-0">
                                <h5 className="modal-title">Atenção</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>

                            <div className="modal-body text-center">
                                <p style={{ wordBreak: "break-word", overflowWrap: "break-word", fontSize: "1rem" }}>
                                    Você está prestes a excluir a máquina{" "}
                                    <strong style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", verticalAlign: "middle", maxWidth: "100%", display: "inline-block" }}>
                                        {" "}{selectedProduto?.nome}
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
        </div>
    );
}

export default Produtos;
