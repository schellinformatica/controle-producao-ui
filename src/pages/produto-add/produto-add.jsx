import { Link, useNavigate, useParams } from "react-router-dom";
import NavBar from "../../components/navbar/navbar.jsx";
import api from "../../constants/api.js";
import { useEffect, useRef, useState } from "react";

function ProdutoAdd() {
    const navigate = useNavigate();

    const { id } = useParams();

    const [nome, setNome] = useState("");
    const [nomeError, setNomeError] = useState("");

    const inputRef = useRef(null);
    
    async function LoadProduto(id) {
        try {
            const response = await api.get("/produto/" + id);
            if (response.data) {
                setNome(response.data.nome);
            }
        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status === 401) return navigate("/");
                setNomeError(error.response?.data.error);
            } else {
                setNomeError("Erro ao listar o produto");
            }
        }
    }

    async function SaveProduto() {
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
                ? await api.put("/produto/" + id, json)
                : await api.post("/produto", json);

            if (response.data) {
                navigate("/produtos");
            }
        } catch (error) {
            const errorMsg = error.response?.data.error || "Erro ao salvar produto";
            setNomeError(errorMsg);
        }
    }

    useEffect(() => {
        if (id > 0) LoadProduto(id);
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
                        <h2>{id > 0 ? "Editar Produto" : "Novo Produto"}</h2>
                    </div>
                    <div className="col-12 mt-4">
                        <div className="mb-3">
                            <label className="form-label">Nome</label>
                            
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

                        <button onClick={SaveProduto} className="btn btn-primary btn-clean" type="button">
                            Salvar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProdutoAdd;
