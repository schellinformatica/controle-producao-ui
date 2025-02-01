import { useContext, useState } from "react";
import { AuthContext } from "./AuthProvider";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        await login(email, senha);
        navigate("/dashboard");
    } catch (error) {
        console.error("Erro no login:", error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
