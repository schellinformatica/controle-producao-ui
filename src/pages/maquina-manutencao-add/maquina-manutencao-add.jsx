import { Link, useNavigate, useParams } from "react-router-dom";
import NavBar from "../../components/navbar/navbar";
import api from "../../constants/api.js";
import { useEffect, useRef, useState } from "react";

function MaquinaManutencaoAdd() {
    const navigate = useNavigate();

    const { id } = useParams();

    const [nome, setNome] = useState("");
    const [nomeError, setNomeError] = useState("");

    const inputRef = useRef(null);

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
                ? await api.put("/maquina-manutencao/" + id, json)
                : await api.post("/maquina-manutencao", json);

            if (response.data) {
                navigate("/maquinas-manutencao");
            }
        } catch (error) {
            const errorMsg = error.response?.data.error || "Erro ao salvar máquina";
            setNomeError(errorMsg);
        }
    }

    useEffect(() => {
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
                        <h2>{id > 0 ? "Editar Máquina" : "Nova Máquina"}</h2>
                    </div>
                    <div className="col-12 mt-4">
                        <div className="mb-3">
                            <label className="form-label">Máquina</label>
                            
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

export default MaquinaManutencaoAdd;
