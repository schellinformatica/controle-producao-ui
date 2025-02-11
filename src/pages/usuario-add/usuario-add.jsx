import { Link, useNavigate, useParams } from "react-router-dom";
import NavBar from "../../components/navbar/navbar";
import api from "../../constants/api.js";
import { useEffect, useRef, useState } from "react";

function UsuarioAdd() {
    const navigate = useNavigate();

    const { id } = useParams();

    const [nome, setNome] = useState("");
    const [nomeError, setNomeError] = useState("");
    const nomeRef = useRef(null);

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const [roleError, setRoleError] = useState("");

    const emailRef = useRef(null);
    const roleRef = useRef(null);

    const [loading, setLoading] = useState(false); // Estado para o loader

    const [roles, setRoles] = useState([]);

    const [role_id, setRoleId] = useState("");
    
    async function LoadUsuario(id) {
        try {
            const response = await api.get("/usuario/" + id);
            if (response.data) {
                setNome(response.data.nome);
                setEmail(response.data.email);
                setRoleId(response.data.role_id);
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

    async function LoadRoles() {
        try {
            const response = await api.get("/role");

            if (response.data) {
                setRoles(response.data);
            }

        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status == 401)
                    return navigate("/");

                alert(error.response?.data.error);
            }
            else
                alert("Erro ao listar as permissões.");
        }
    }

    async function SaveUsuario() {
        let hasError = false;

        const fields = [
            { value: nome.trim(), error: nomeError, setError: setNomeError, ref: nomeRef, fieldName: 'Nome' },
            { value: email.trim(), error: emailError, setError: setEmailError, ref: emailRef, fieldName: 'Email' },
            { value: email.trim(), error: roleError, setError: setRoleError, ref: emailRef, fieldName: 'Permissão' },
        ];

        // Itera sobre os campos e valida
        for (let i = 0; i < fields.length; i++) {
            const { value, setError, ref, fieldName } = fields[i];
            if (!value) {
                setError(`${fieldName} é obrigatório.`);
                if (!hasError) {
                    ref.current?.focus();  // Set foco no primeiro campo com erro
                }
                hasError = true;
            } else {
                setError(""); // Se o campo estiver preenchido, limpa o erro
            }
        }

        if (hasError) return;

        const json = { nome, email, role_id };

        // Ativa o loader
        setLoading(true);

        try {
            const response = id > 0
                ? await api.put("/usuario/" + id, json)
                : await api.post("/usuario", json);

            if (response.data) {
                // Após salvar, desativa o loader e redireciona
                setLoading(false);
                navigate("/usuario");
            }
        } catch (error) {
            // Se erro ocorrer, desativa o loader
            setLoading(false);
            const errorMsg = error.response?.data.error || "Erro ao salvar usuário";
            setNomeError(errorMsg);
            alert("erro");
        }
    }

    useEffect(() => {
        if (id > 0) LoadUsuario(id);
        if (nomeRef.current) {
            nomeRef.current.focus();
        }
        LoadRoles();
    }, []);

    return (
        <>
            <NavBar />
            
            <div className="container-fluid mt-page">
                <div className="row col-lg-4 offset-lg-4">
                    <div className="col-12 mt-4">
                        <h2>{id > 0 ? "Editar Usuário" : "Novo Usuário"}</h2>
                    </div>
                    
                    <div className="col-12 mt-4">
                        <div className="mb-3">
                            <label className="form-label">Nome</label>
                            <input
                                ref={nomeRef}
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
                                disabled={loading} // Desabilita o campo durante o loading
                            />
                            {nomeError && <div className="invalid-feedback mt-2">{nomeError}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                ref={emailRef}
                                value={email}
                                type="text"
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (emailError) setEmailError("");
                                }}
                                className={`form-control input-clean ${emailError ? 'is-invalid' : ''}`}
                                id="email"
                                name="email"
                                placeholder=""
                                disabled={loading || id > 0} // Desabilita o campo durante o loading e ao editar
                            />
                            {emailError && <div className="invalid-feedback mt-2">{emailError}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="role" className="form-label">Permissão</label>
                            <select
                                ref={roleRef}
                                name="role" 
                                id="role"
                                className={`form-select input-clean ${roleError ? 'is-invalid' : ''}`}
                                value={role_id} 
                                onChange={(e) => {
                                    setRoleId(parseInt(e.target.value, 10));
                                    if (e.target.value !== "0") setErrorRole("");
                                }}
                            >
                                <option value="">Selecione a Permissão</option>
                                {roles.map(t => (
                                    <option key={t.id} value={t.id}>{t.nome}</option>
                                ))}
                            </select>
                            {roleError && <div className="invalid-feedback mt-2">{roleError}</div>}
                        </div>

                        <button onClick={SaveUsuario} className="btn btn-primary btn-clean" type="button" disabled={loading}>
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>

                    {/* Loader sobre os campos */}
                    {loading && (
                        <div className="d-flex justify-content-center mt-4 position-absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Carregando...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Rodapé com espaçamento */}
            <footer className="mt-auto" style={{ padding: "50px 0", backgroundColor: "#f8f9fa", color: "#6c757d", textAlign: "center" }}>
                <p>2025 Controle de Produção</p>
            </footer>
        </>
    );
}

export default UsuarioAdd;
