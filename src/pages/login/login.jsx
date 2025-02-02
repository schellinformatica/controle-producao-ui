import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import logo from "../../assets/sua_logo.png";
import api from "../../constants/api.js";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");

    async function ExecuteLogin(e) {
        e.preventDefault();
        setMsg("");

        try {
            const response = await api.post("/login", { email, password });

            if (response.data) {
                localStorage.setItem("sessionToken", response.data.token);
                localStorage.setItem("sessionId", response.data.id);
                localStorage.setItem("sessionEmail", response.data.email);
                localStorage.setItem("sessionName", response.data.nome);
                api.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
                navigate("/appointments");
            } else {
                setMsg("Erro ao efetuar login. Tente novamente mais tarde.");
            }
        } catch (error) {
            setMsg(error.response?.data.error || "Erro ao efetuar login. Tente novamente mais tarde.");
        }
    }

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <img src={logo} className="login-logo" alt="Logo" />
                <h2 className="login-title">Bem-vindo!</h2>
                <p className="login-subtitle">Faça login para continuar</p>

                {msg && <div className="login-alert">{msg}</div>}

                <form onSubmit={ExecuteLogin}>
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="E-mail"
                            className="login-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Senha"
                            className="login-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button className="login-button" type="submit">
                        Entrar
                    </button>
                </form>

                <p className="login-footer">
                    Esqueceu sua senha? <a href="#">Recuperar</a>
                </p>
            </div>
        </div>
    );
}

export default Login;
