import { Link, useNavigate, useParams } from "react-router-dom";
import NavBar from "../../components/navbar/navbar";
import api from "../../constants/api.js";
import { useEffect, useRef, useState } from "react";

function UsuarioPerfil() {

    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [mensagemErro, setMensagemErro] = useState('');
    const [mensagemSucesso, setMensagemSucesso] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (novaSenha !== confirmarSenha) {
            setMensagemErro('As senhas não coincidem.');
            setMensagemSucesso(''); // Garante que a mensagem de sucesso seja apagada
            return;
        }
    
        try {
            const response = await api.put('/usuario/alterar-senha/new', {
                senhaAtual,
                novaSenha
            });
    
            setMensagemSucesso(response.data.message); // Usa a mensagem do backend
            setMensagemErro('');
    
            setSenhaAtual('');
            setNovaSenha('');
            setConfirmarSenha('');
        } catch (error) {
            setMensagemSucesso(''); // Garante que a mensagem de sucesso seja apagada antes de exibir erro
    
            if (error.response && error.response.data) {
                setMensagemErro(error.response.data.message); // Usa a mensagem do backend no erro
            } else {
                setMensagemErro('Erro ao alterar a senha.');
            }
        }
    };
    

    return (
        <>
            <NavBar />
            
            <div className="container-fluid mt-page">
                <div className="row col-lg-4 offset-lg-4">
                    <div className="col-12 mt-4">
                        <h2>Meu perfil</h2>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="col-12 mt-4">
                            <div className="mb-3">
                                <label className="form-label">Senha atual</label>
                                <input
                                    type="text"
                                    className='form-control input-clean'
                                    onChange={(e) => setSenhaAtual(e.target.value)}
                                    id="senhaAtual"
                                    name="senhaAtual"
                                    value={senhaAtual}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Nova senha</label>
                                <input
                                    type="text"
                                    className='form-control input-clean'
                                    value={novaSenha}
                                    onChange={(e) => setNovaSenha(e.target.value)}
                                    id="novaSenha"
                                    name="novaSenha"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Confirmar senha</label>
                                <input
                                    type="text"
                                    className='form-control input-clean'
                                    value={confirmarSenha}
                                    onChange={(e) => setConfirmarSenha(e.target.value)}
                                    id="confirmarSenha"
                                    name="confirmarSenha"
                                    placeholder=""
                                />
                            </div>

                            {mensagemErro && <p style={{ color: 'red' }}>{mensagemErro}</p>}
                            {mensagemSucesso && <p style={{ color: 'green' }}>{mensagemSucesso}</p>}

                            <button className="btn btn-primary btn-clean" type="submit">
                                Alterar senha
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Rodapé com espaçamento */}
            <footer className="mt-auto" style={{ padding: "50px 0", backgroundColor: "#f8f9fa", color: "#6c757d", textAlign: "center" }}>
                <p>2025 Controle de Produção</p>
            </footer>
        </>
    );
}

export default UsuarioPerfil;
