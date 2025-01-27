import { Link } from "react-router-dom";
import "./navbar.css";

function NavBar() {
    return <nav className="navbar fixed-top navbar-expand-lg bg-primary" data-bs-theme="dark">
    <div className="container-fluid">
        <div className="navbar-brand">
            Controle de Produção
        </div>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {/* Centralização dos itens */}
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                <li className="nav-item">
                    <Link className="nav-link active" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/beneficiamento">Beneficiamento</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/appointments">Produção</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/maquinas">Máquinas</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/employee">Usuários</Link>
                </li>

                {/* Adicionando o dropdown de Relatórios */}
                <li className="nav-item dropdown">
                    <Link className="nav-link dropdown-toggle" to="#" id="reportsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Relatórios
                    </Link>
                    <ul className="dropdown-menu" aria-labelledby="reportsDropdown">
                        <li><Link className="dropdown-item" to="/relatorio1">Eficiência de Produção</Link></li>
                    </ul>
                </li>

                {/*<li className="nav-item">
                    <Link className="nav-link active" to="/employee">Usuários</Link>
                </li>*/}
            </ul>

            <ul className="navbar-nav">
                <li className="nav-item">
                    <div className="btn-group">
                        <button type="button" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            {localStorage.getItem("sessionName")}
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><button className="dropdown-item">Desconectar</button></li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</nav>
}

export default NavBar;