import "./usuarios.css";
import NavBar from "../../components/navbar/navbar.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../constants/api.js";
import Usuario from "../../components/usuario/usuario.jsx";

function Usuarios() {
    const navigate = useNavigate();
    const [usuario, setUsuarios] = useState([]);

    function ClickEdit(id) {
        navigate("/usuarios/edit/" + id);
    }

    function ClickDelete(idConsulta) {
        console.log("deletar: " + idConsulta);
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
                alert("Erro ao carregar máquinas.");
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
                        <Link to="/usuarios/add" className="btn btn-primary btn-clean mt-3">
                            Novo usuário
                        </Link>

                    </div>

                    <div style={{ marginTop: "33px" }}>
                        <table className="table table-hover table-bordered">
                            <thead>
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
                                        />
                                    }) 
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Rodapé com espaçamento */}
            <footer className="mt-auto" style={{ padding: "50px 0", backgroundColor: "#f8f9fa", color: "#6c757d", textAlign: "center" }}>
                <p>2025 Controle de Produção</p>
            </footer>
            
        </div>
    );
}

export default Usuarios;
