import "./maquinas.css";
import NavBar from "../../components/navbar/navbar.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../constants/api.js";
import Maquina from "../../components/maquina/maquina.jsx";
import * as XLSX from "xlsx";

function Maquinas() {
    const navigate = useNavigate();
    const [maquinas, setMaquinas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedMaquina, setSelectedMaquina] = useState(null);
    const [page, setPage] = useState(1); // Controle de página
    const [hasMore, setHasMore] = useState(true); // Verificar se há mais itens
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
                setMaquinas((prevMaquinas) => prevMaquinas.filter(mq => mq.id !== selectedMaquina.id));
            }
        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status === 401) return navigate("/");
                alert(error.response?.data.error);
            } else {
                alert("Erro ao excluir máquina.");
            }
        } finally {
            setShowModal(false);
            setSelectedMaquina(null);
        }
    }    

    async function LoadMaquinas(currentPage = 1) {
        if (!hasMore) return;  // Se não houver mais, não fazer a requisição

        try {
            const response = await api.get(`/maquina?page=${currentPage}&limit=${limit}`);
            const maquinaData = response.data;

            if (currentPage === 1) {
                setMaquinas(maquinaData);
            } else {
                setMaquinas((prevMaquinas) => [...prevMaquinas, ...maquinaData]);
            }

            setPage(currentPage);
            setHasMore(maquinaData.length === limit);
        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status === 401) return navigate("/");
                alert(error.response?.data.error);
            } else {
                alert("Erro ao carregar máquinas.");
            }
        }
    }

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50 && hasMore) {
            LoadMaquinas(page + 1);
        }
    };

    useEffect(() => {
        LoadMaquinas(1);
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [page, hasMore]);

    function exportToExcel() {
        const ws = XLSX.utils.json_to_sheet(maquinas.map(mq => ({
            Máquina: mq.nome
        })));
    
        // Adiciona um título para o relatório na primeira linha
        ws['A1'] = { 
            v: 'Relatório de Máquinas', 
            t: 's' 
        };
        ws['A1'].s = { 
            font: { bold: true, sz: 16 }, 
            alignment: { horizontal: 'center', vertical: 'center' }
        };
    
        // Mesclar as células para o título (aqui estamos considerando apenas 1 coluna)
        ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 0 } }];
    
        // Adiciona o nome da coluna "Máquinas" na segunda linha em negrito
        ws['A2'] = { 
            v: 'Máquina', 
            t: 's' 
        };
        ws['A2'].s = { 
            font: { bold: true }, 
            alignment: { horizontal: 'center' }
        };
    
        // Calculando o autofit das colunas
        const colWidths = [];
        maquinas.forEach(mq => {
            const length = mq.nome.length; // Calculando o comprimento do nome da máquina
            colWidths[0] = Math.max(colWidths[0] || 0, length); // A largura da coluna é baseada no nome mais longo
        });
    
        // Ajustando a largura das colunas para o conteúdo
        ws['!cols'] = [{ wch: colWidths[0] + 2 }]; // Adicionando um pequeno espaço extra
    
        // Criando a planilha e adicionando a aba "Máquina"
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Máquina");
    
        // Salva o arquivo Excel
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
                            data-bs-toggle="tooltip" 
                            data-bs-placement="top"
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
                                    confirmDelete={() => confirmDelete(mq)} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            {showModal && selectedMaquina && (
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
                                        {" "}{selectedMaquina?.nome}
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

export default Maquinas;
