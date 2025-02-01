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
            return;
        }

        try {
            // Enviar a solicitação de alteração de senha para o backend
            const response = await axios.put('/usuario/alterar-senha', {
                senhaAtual,
                novaSenha
            });

            setMensagemSucesso('Senha alterada com sucesso!');
            setMensagemErro('');
        } catch (error) {
            setMensagemErro('Erro ao alterar a senha.');
            setMensagemSucesso('');
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
                                    id="nome"
                                    name="nome"
                                    placeholder=""
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Nova senha</label>
                                <input
                                    type="text"
                                    className='form-control input-clean'
                                    id="nome"
                                    name="nome"
                                    placeholder=""
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Confirmar senha</label>
                                <input
                                    type="text"
                                    className='form-control input-clean'
                                    id="nome"
                                    name="nome"
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
