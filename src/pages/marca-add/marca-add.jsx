import { Link, useNavigate, useParams } from "react-router-dom";
import NavBar from "../../components/navbar/navbar";
import api from "../../constants/api.js";
import { useEffect, useRef, useState } from "react";

function MaquinaAdd() {
    const navigate = useNavigate();

    const { id } = useParams();

    const [nome, setNome] = useState("");
    const [nomeError, setNomeError] = useState("");

    const inputRef = useRef(null);
    
    async function LoadMarca(id) {
        try {
            const response = await api.get("/marca/" + id);
            if (response.data) {
                setNome(response.data.nome);
            }
        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status === 401) return navigate("/");
                setNomeError(error.response?.data.error);
            } else {
                setNomeError("Erro ao listar a máquina");
            }
        }
    }

    async function SaveMaquina() {
        let hasError = false;

        if (!nome.trim()) {
            setNomeError("Nome é obrigatório.");
            hasError = true;
            inputRef.current?.focus();
        } else {
            setNomeError("");
        }

        if (hasError) return;

        const json = { nome };

        try {
            const response = id > 0
                ? await api.put("/marca/" + id, json)
                : await api.post("/marca", json);

            if (response.data) {
                navigate("/marcas");
            }
        } catch (error) {
            const errorMsg = error.response?.data.error || "Erro ao salvar marcas";
            setNomeError(errorMsg);
        }
    }

    useEffect(() => {
        if (id > 0) LoadMarca(id);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return (
        <>
            <NavBar />
            
            <div className="container-fluid mt-page">
                <div className="row col-lg-4 offset-lg-4">
                    <div className="col-12 mt-4">
                        <h2>{id > 0 ? "Editar Marca" : "Nova Marca"}</h2>
                    </div>
                    <div className="col-12 mt-4">
                        <div className="mb-3">
                            <label className="form-label">Marca</label>
                            
                            <input
                                ref={inputRef}
                                value={nome}
                                type="text"
                                onChange={(e) => {
                                    setNome(e.target.value);
                                    if (nomeError) setNomeError("");
                                }}
                                className={`form-control input-clean ${nomeError ? 'is-invalid' : ''}`}
                                id="nome"
                                name="nome"
                                placeholder=""
                            />
                            {nomeError && <div className="invalid-feedback mt-2">{nomeError}</div>}

                        </div>

                        <button onClick={SaveMaquina} className="btn btn-primary btn-clean" type="button">
                            Salvar
                        </button>
                    </div>
                </div>
            </div>

            {/* Rodapé com espaçamento */}
            <footer className="mt-auto" style={{ padding: "50px 0", backgroundColor: "#f8f9fa", color: "#6c757d", textAlign: "center" }}>
                <p>2025 Controle de Produção</p>
            </footer>
        </>
    );
}

export default MaquinaAdd;
