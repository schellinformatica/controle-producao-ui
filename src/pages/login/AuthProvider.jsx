import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true); // ⏳ Evita re-render antes da verificação

  useEffect(() => {
    if (token) {
      axios.get("http://localhost:3000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        logout();
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, senha) => {
    try {
      const { data } = await axios.post("http://localhost:3000/login", { email, senha });
      setUser(data.usuario);
      setToken(data.token);
      localStorage.setItem("token", data.token);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children} {/* 🔥 Aguarda carregamento antes de renderizar */}
    </AuthContext.Provider>
  );
};
