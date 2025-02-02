import "./usuarios.css";
import NavBar from "../../components/navbar/navbar.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../constants/api.js";
import Usuario from "../../components/usuario/usuario.jsx";

function Usuarios() {
    const navigate = useNavigate();
    const [usuario, setUsuarios] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    function ClickEdit(id) {
        navigate("/usuario/edit/" + id);
    }

    function confirmDelete(user) {
        setSelectedUser(user);
        setShowModal(true);
    }
    
    async function ClickDelete() {
        if (!selectedUser) return;
        try {
            const response = await api.delete("/usuario/" + selectedUser.id);
            if (response.data) {
                setUsuarios((prevUsuarios) => prevUsuarios.filter(u => u.id !== selectedUser.id));
            }
        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status === 401) return navigate("/");
                alert(error.response?.data.error);
            } else {
                alert("Erro ao excluir usuário.");
            }
        } finally {
            setShowModal(false);
            setSelectedUser(null);
        }
    }    

    async function LoadUsuario() {
        try {
            const response = await api.get("/usuario");

            if (response.data) {
                setUsuarios(response.data);
            }
        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status === 401) return navigate("/");
                alert(error.response?.data.error);
            } else {
                alert("Erro ao carregar usuários.");
            }
        }
    }

    useEffect(() => {
        LoadUsuario();
    }, []);

    return (
        <div className="container-fluid mt-page">
            <NavBar />
            <div className="content-wrapper">
                <div className="container-custom mt-2">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Usuário</li>
                        </ol>
                    </nav>

                    <div>
                        <Link to="/usuario/add" className="btn btn-primary btn-clean mt-3 btn-default-formatted">
                            Novo usuário
                        </Link>
                    </div>

                    <div style={{ marginTop: "33px" }}>
                        <table className="table table-hover table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col">Nome</th>
                                    <th scope="col" className="col-buttons"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    usuario.map((user) => {
                                        return <Usuario key={user.id}
                                                        id={user.id}
                                                        nome={user.nome}
                                                        ClickEdit={ClickEdit}
                                                        confirmDelete={() => confirmDelete(user)}
                                        />
                                    }) 
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showModal && selectedUser && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header border-0">
                                <h5 className="modal-title">Atenção</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
   
                            <div className="modal-body text-center">
                                <p style={{ wordBreak: "break-word", overflowWrap: "break-word", fontSize: "1rem" }}>
                                    Você está prestes a excluir o usuário(a){" "} 
                                    <strong style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", verticalAlign: "middle", maxWidth: "100%", display: "inline-block" }}>
                                        {" "}{selectedUser?.nome}
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

export default Usuarios;
