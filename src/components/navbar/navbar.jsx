import { Link, useNavigate } from "react-router-dom";
import api from "../../constants/api";
import "./navbar.css";

function NavBar() {
    const navigate = useNavigate();

    const sessionName = localStorage.getItem("sessionName");

    const userRole = localStorage.getItem("userRole");

    function Logout() {
        localStorage.removeItem("sessionToken");
        localStorage.removeItem("sessionId");
        localStorage.removeItem("sessionEmail");
        localStorage.removeItem("sessionName");
        localStorage.removeItem("userRole");

        navigate("/");
        api.defaults.headers.common['Authorization'] = "";
    }

    return (
        <nav className="navbar fixed-top navbar-expand-lg bg-primary" data-bs-theme="dark">
            <div className="container-fluid">
                <div className="navbar-brand">
                    Controle de Produção
                </div>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/beneficiamentos">Beneficiamentos</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/appointments">Empacotamento</Link>
                        </li>
                        {userRole === "1" && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/produtos">Produtos</Link>
                            </li>
                        )}
                        {userRole === "1" && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/maquinas">Máquinas</Link>
                            </li>
                        )}
                        <li className="nav-item">
                            <Link className="nav-link" to="/maquinas-manutencao">Manutenções</Link>
                        </li>
                        {userRole === "1" && ( //apenas admin pode visualizar e acessar
                            <li className="nav-item">
                                <Link className="nav-link" to="/usuario">Usuários</Link>
                            </li>
                        )}
                    </ul>

                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <div className="btn-group">
                                {/* Botão com nome do usuário e seta de dropdown */}
                                <button
                                    type="button"
                                    className="btn btn-primary dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {/* Exibe o nome completo do usuário */}
                                    {sessionName ? sessionName : 'Usuário'}
                                </button>

                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <Link className="dropdown-item" to="/usuario-perfil">Meu perfil</Link>
                                    </li>
                                    <li>
                                        <button className="dropdown-item" onClick={Logout}>Desconectar</button>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
