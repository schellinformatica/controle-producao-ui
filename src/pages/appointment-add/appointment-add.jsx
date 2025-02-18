import { Link, useNavigate, useParams } from "react-router-dom";
import NavBar from "../../components/navbar/navbar";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import api from "../../constants/api.js";
import "../../styles/custom/time-picker.css"; // Arquivo CSS personalizado
import { useEffect, useRef, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale/pt-BR";

registerLocale("pt-BR", ptBR);

function AppointmentAdd() {
    const navigate = useNavigate();

    const [maquinas, setMaquinas] = useState([]);
    const [turnos, setTurnos] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [marcas, setMarcas] = useState([]);

    const [time, setTime] = useState("12:00");

    const [startDate, setStartDate] = useState(new Date());

    /* inputs */
    const { id } = useParams();
    const [data_atual, setDataAtual] = useState("");
    const [id_maquina, setIdMaquina] = useState(0);
    const [id_maquina_secundaria, setIdMaquinaSecundaria] = useState(0);
    const [id_turno, setIdTurno] = useState("");
    const [id_produto, setIdProduto] = useState("");
    const [id_marca, setIdMarca] = useState("");
    const [lote, setLote] = useState("");
    const [loteInterno, setLoteInterno] = useState("");
    const [pesoB1, setPesoB1] = useState("");
    const [pesoB2, setPesoB2] = useState("");
    const [pesoB3, setPesoB3] = useState("");
    const [pesoB4, setPesoB4] = useState("");
    const [pesoB5, setPesoB5] = useState("");
    const [pesoEmbalagem, setPesoEmbalagem] = useState("");
    const [marca, setMarca] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [embalagemUtilizada, setEmbalagemUtilizada] = useState("");
    const [perca, setPerca] = useState("");
    const [testeImpacto, setTesteImpacto] = useState(false);
    const [verificado, setVerificado] = useState(false);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
    const [verificacaoCarimbo, setVerificacaoCarimbo] = useState(false);
    const [peso, setPeso] = useState("");
    
    /* inputs error */
    const [errorTurno, setErrorTurno] = useState("");
    const [errorProduto, setErrorProduto] = useState("");
    const [errorMaquina, setErrorMaquina] = useState("");
    const [errorMaquinaSecundaria, setErrorMaquinaSecundaria] = useState("");
    const [errorMarca, setErrorMarca] = useState("");
    const [loteError, setLoteError] = useState("");
    const [loteInternoError, setLoteInternoError] = useState("");
    const [pesoB1Error, setPesoB1Error] = useState("");
    const [pesoB2Error, setPesoB2Error] = useState("");
    const [pesoB3Error, setPesoB3Error] = useState("");
    const [pesoB4Error, setPesoB4Error] = useState("");
    const [pesoB5Error, setPesoB5Error] = useState("");
    const [pesoEmbalagemError, setPesoEmbalagemError] = useState("");
    const [marcaError, setMarcaError] = useState("");
    const [quantidadeError, setQuantidadeError] = useState("");
    const [embalagemUtilizadaError, setEmbalagemUtilizadaError] = useState("");
    const [percaError, setPercaError] = useState("");
    const [usuarios, setUsuarios] = useState([]);
    const [pesoError, setPesoError] = useState("");

    const [pesos, setPesos] = useState({
        pesoB1: "",
        pesoB2: "",
        pesoB3: "",
        pesoB4: "",
        pesoB5: "",
    });
    const [errors, setErrors] = useState({});

    const loteRef = useRef(null);
    const maquinaRef = useRef(null);
    const maquinaSecundariaRef = useRef(null);
    const loteInternoRef = useRef(null);
    const pesoEmbalagemRef = useRef(null);
    const marcaRef = useRef(null);
    const quantidadeRef = useRef(null);
    const embalagemUtilizadaRef = useRef(null);
    const percaRef = useRef(null);
    const turnoRef = useRef(null);
    const produtoRef = useRef(null);
    const pesoRef = useRef(null);
     
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const newValue = value.replace(",", ".");
        
        if (/^\d*\.?\d*$/.test(newValue) || newValue === "") {
            setPesos((prev) => ({ ...prev, [name]: newValue }));
        }
    };

    const handleDateChange = (date) => {
        setStartDate(date);
    };

    async function LoadUsuarios() {
        try {
            const response = await api.get("/usuario");

            if (response.data) {
                setUsuarios(response.data);
            }

        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status == 401)
                    return navigate("/");

                alert(error.response?.data.error);
            }
            else
                alert("Erro ao listar os usuários.");
        }
    }

    async function LoadMaquinas() {
        try {
            const response = await api.get("/maquina");

            if (response.data) {
                setMaquinas(response.data);

                // Se for modo alteração...
                if (id > 0)
                    LoadAppointment(id);
            }

        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status == 401)
                    return navigate("/");

                alert(error.response?.data.error);
            }
            else
                alert("Erro ao listar as máquinas.");
        }
    }

    async function LoadTurnos() {
        try {
            const response = await api.get("/turno");

            if (response.data) {
                setTurnos(response.data);

                // Se for modo alteração...
                if (id > 0)
                    LoadAppointment(id);
            }

        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status == 401)
                    return navigate("/");

                alert(error.response?.data.error);
            }
            else
                alert("Erro ao listar os turnos.");
        }
    }

    async function LoadProdutos() {
        try {
            const response = await api.get("/produto");

            if (response.data) {
                setProdutos(response.data);
            }

        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status == 401)
                    return navigate("/");

                alert(error.response?.data.error);
            }
            else
                alert("Erro ao listar os produtos.");
        }
    }

    async function LoadMarcas() {
        try {
            const response = await api.get("/marca");

            if (response.data) {
                setMarcas(response.data);
            }

        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status == 401)
                    return navigate("/");

                alert(error.response?.data.error);
            }
            else
                alert("Erro ao listar as marcas.");
        }
    }

    async function LoadAppointment(id) {

        try {
            const response = await api.get("/production/" + id);

            if (response.data) {
                if (response.data) {

                    const horaUtc = new Date(response.data.hora)
                    const horaLocal = new Date(horaUtc.getTime() + horaUtc.getTimezoneOffset() * 60000);

                    const dataFormatada = new Date(response.data.hora).toISOString().split('T')[0];
                    setDataAtual(dataFormatada);
                    setIdTurno(response.data.turno_id);
                    setIdProduto(response.data.produto_id);
                    setIdMaquina(response.data.maquina_id);
                    setLote(response.data.lote);
                    setLoteInterno(response.data.lote_interno);

                    setPesos({
                        pesoB1: response.data.peso_b1,
                        pesoB2: response.data.peso_b2,
                        pesoB3: response.data.peso_b3,
                        pesoB4: response.data.peso_b4,
                        pesoB5: response.data.peso_b5
                    });

                    setPesoB1(response.data.peso_b1);
                    setPesoB2(response.data.peso_b2);
                    setPesoB3(response.data.peso_b3);
                    setPesoB4(response.data.peso_b4);
                    setPesoB5(response.data.peso_b5);
                    setPesoEmbalagem(response.data.peso_embalagem);
                    setIdMarca(response.data.marca_id);
                    setQuantidade(response.data.quantidade);
                    setEmbalagemUtilizada(response.data.embalagem_utilizada);
                    setPerca(response.data.perca);
                    setTesteImpacto(response.data.teste_impacto);
                    setVerificado(response.data.verificado);
                    setUsuarioSelecionado(response.data.usuario_verificador_id);
                    setVerificacaoCarimbo(response.data.verificacao_carimbo);
                    setPeso(response.data.peso);
                    setIdMaquinaSecundaria(response.data.maquina_id_secundaria);

                    setStartDate(horaLocal);
                }
            }
        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status == 401)
                    return navigate("/");

                alert(error.response?.data.error);
            }
            else
                alert("Erro ao listar máquinas.");
        }
    }

    async function SaveProducao() {
        let hasError = false;

        if (id_turno === "" || id_turno === 0) {
            setErrorTurno("Turno é obrigatório.");
            if (!hasError) turnoRef.current?.focus();
            hasError = true;
        } else {
            setErrorTurno("");
        }

        if (id_produto === "" || id_produto === 0) {
            setErrorProduto("Produto é obrigatório.");
            if (!hasError) produtoRef.current?.focus();
            hasError = true;
        } else {
            setErrorProduto("");
        }
        
        if (!id_maquina && !id_maquina_secundaria) {
            setErrorMaquina("Selecione pelo menos uma máquina.");
            setErrorMaquinaSecundaria("Selecione pelo menos uma máquina.");
            return;
        } else {
            setErrorMaquina("");
            setErrorMaquinaSecundaria("");
        }
        
        /*
        if (id_maquina === "" || id_maquina === 0) {
            setErrorMaquina("Máquina é obrigatório.");
            if (!hasError) maquinaRef.current?.focus();
            hasError = true;
        } else {
            setErrorMaquina("");
        }
            
        if (id_maquina_secundaria === "" || id_maquina_secundaria === 0) {
            setErrorMaquinaSecundaria("Máquina 2 é obrigatória.");
            if (!hasError) maquinaSecundariaRef.current?.focus();
            hasError = true;
        } else {
            setErrorMaquinaSecundaria("");
        } */
        
        if (!lote.trim()) {
            setLoteError("Lote é obrigatório.");
            if (!hasError) loteRef.current?.focus();
            hasError = true;
        } else {
            setLoteError("");
        }
        
        if (!loteInterno.trim()) {
            setLoteInternoError("Lote Interno é obrigatório.");
            if (!hasError) loteInternoRef.current?.focus();
            hasError = true;
        } else {
            setLoteInternoError("");
        }
        
        if (!pesoEmbalagem.trim()) {
            setPesoEmbalagemError("Peso Embalagem é obrigatório.");
            if (!hasError) pesoEmbalagemRef.current?.focus();
            hasError = true;
        } else {
            setPesoEmbalagemError("");
        }

        if (id_marca === "" || id_marca === 0) {
            setErrorMarca("Marca é obrigatória.");
            if (!hasError) marcaRef.current?.focus();
            hasError = true;
        } else {
            setErrorMarca("");
        }

        if (!quantidade.trim()) {
            setQuantidadeError("Quantidade é obrigatória.");
            if (!hasError) quantidadeRef.current?.focus();
            hasError = true;
        } else {
            setQuantidadeError("");
        }

        if (!embalagemUtilizada.trim()) {
            setEmbalagemUtilizadaError("Embalagem utilizada (KG) é obrigatória.");
            if (!hasError) embalagemUtilizadaRef.current?.focus();
            hasError = true;
        } else {
            setEmbalagemUtilizadaError("");
        }

        if (!perca.trim()) {
            setPercaError("Perca (KG) é obrigatória.");
            if (!hasError) percaRef.current?.focus();
            hasError = true;
        } else {
            setPercaError("");
        }

        if (!peso.trim()) {
            setPesoError("Peso é obrigatório.");
            if (!hasError) pesoRef.current?.focus();
            hasError = true;
        } else {
            setPesoError("");
        }

        if (hasError) return;
        
        const now = new Date();
        const localISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString();
        //.slice(0, -1); // Remove o 'Z' do final
        
        const usuario_id = localStorage.getItem('sessionId');  // ou do cookie, dependendo de onde você armazena
        
        const data = new Date(data_atual);
        data.setHours(0, 0, 0, 0);
        const dataPostgreSQL = data.toISOString().replace('Z', '-03:00'); // Substitui "Z" (UTC) pelo fuso horário local

        // Função para ajustar a data considerando o fuso horário
        const adjustDateToLocalTimezone = (date) => {
            // Crie uma nova instância da data
            const localDate = new Date(date);
            
            // Obtenha a diferença de minutos entre a hora local e UTC (em minutos)
            const timezoneOffset = localDate.getTimezoneOffset(); // em minutos
            
            // Ajuste a hora subtraindo o offset (para compensar o UTC)
            localDate.setMinutes(localDate.getMinutes() - timezoneOffset);
            
            // Retorne a data ajustada para ser enviada para o backend
            return localDate.toISOString(); // Retorna a data no formato ISO, por exemplo: '2025-02-15T17:55:00.000Z'
        };

        const json = {
            maquina_id: id_maquina,
            produto_id: id_produto,
            lote: lote,
            lote_interno: loteInterno,
            peso_b1: pesos.pesoB1,
            peso_b2: pesos.pesoB2,
            peso_b3: pesos.pesoB3,
            peso_b4: pesos.pesoB4,
            peso_b5: pesos.pesoB5,
            peso_embalagem: pesoEmbalagem,
            marca_id: id_marca,
            quantidade: quantidade,
            embalagem_utilizada: embalagemUtilizada,
            perca: perca,
            teste_impacto: testeImpacto,
            verificado: verificado,
            hora: adjustDateToLocalTimezone(startDate),
            turno_id: id_turno,
            usuario_id: parseInt(usuario_id, 10),
            usuario_verificador_id: verificado ? parseInt(usuarioSelecionado, 10) : null,
            verificacao_carimbo: verificacaoCarimbo,
            peso: peso,
            maquina_id_secundaria: id_maquina_secundaria
        };

        //if (!id > 0)
            //json.hora = dt; //localISO;

        try { 
            const response = id > 0
                ? await api.put("/production/" + id, json)
                : await api.post("/production", json);

            if (response.data) {
                navigate("/appointments");
            }
        } catch (error) {
            const errorMsg = error.response?.data.error || "Erro ao salvar máquina";
            alert(errorMsg);
        }
    }  
     
    const calcularMedia = () => {
        const valores = Object.values(pesos)
            .map(v => parseFloat(v.replace(",", "."))) // Converter para número e substituir vírgula por ponto
            .filter(v => !isNaN(v)); // Remover valores inválidos
    
        return valores.length ? (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(3) : "0.000";
    };

    useEffect(() => {
        LoadMaquinas();
        LoadTurnos();
        LoadProdutos();
        LoadUsuarios();
        LoadMarcas();
        const hoje = new Date().toISOString().split("T")[0];
        setDataAtual(hoje);

        if (id_maquina) {
            setErrorMaquina(""); // Remove erro da máquina principal
            setErrorMaquinaSecundaria(""); // Remove erro da máquina secundária
        }
        if (id_maquina_secundaria) {
            setErrorMaquinaSecundaria(""); // Remove erro da máquina secundária
            setErrorMaquina(""); // Remove erro da máquina principal
        }
    }, [id_maquina, id_maquina_secundaria]);

    return (
        <>
            <NavBar />
            
            <div className="container-fluid mt-page">
                <div className="row col-lg-4 offset-lg-4">
                    <div className="col-12 mt-4">
                        <h2>Controle de Empacotamento</h2>
                    </div>
                    <div className="col-12 mt-4">                        
                        <div className="mb-3">
                            <label htmlFor="data-inicio" className="form-label d-block">Data e Hora</label>
                            <DatePicker
                            id="data-inicio"
                            name="data-inicio"
                            selected={startDate}
                            onChange={handleDateChange}
                            className="form-control input-clean input-datetime-filter"
                            dateFormat="dd/MM/yyyy HH:mm" // Formato de data e hora
                            locale="pt-BR"
                            showTimeSelect={true} // Habilita o seletor de hora
                            timeFormat="HH:mm" // Formato da hora
                            timeIntervals={5} // Intervalo de 15 minutos no seletor de hora
                            placeholderText="Selecione a data e hora"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="turno" className="form-label">Turno</label>
                            <select
                                ref={turnoRef}
                                name="turno" 
                                id="turno" 
                                className={`form-select input-clean ${errorTurno ? 'is-invalid' : ''}`}
                                value={id_turno} 
                                onChange={(e) => {
                                    setIdTurno(parseInt(e.target.value, 10));
                                    if (e.target.value !== "0") setErrorTurno(""); // Limpa o erro se houver um valor válido
                                }}
                            >
                                <option value="">Selecione o Turno</option>
                                {turnos.map(t => (
                                    <option key={t.id} value={t.id}>{t.nome}</option>
                                ))}
                            </select>
                            {errorTurno && <div className="invalid-feedback mt-2">{errorTurno}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="produto" className="form-label">Produto</label>
                            <select
                                ref={produtoRef}
                                name="produto" 
                                id="produto" 
                                className={`form-select input-clean ${errorTurno ? 'is-invalid' : ''}`}
                                value={id_produto}
                                onChange={(e) => {
                                    setIdProduto(parseInt(e.target.value, 10));
                                    if (e.target.value !== "0") setErrorProduto(""); // Limpa o erro se houver um valor válido
                                }}
                            >
                                <option value="">Selecione o Produto</option>
                                {produtos.map(t => (
                                    <option key={t.id} value={t.id}>{t.nome}</option>
                                ))}
                            </select>
                            {errorProduto && <div className="invalid-feedback mt-2">{errorProduto}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="marca" className="form-label">Marca</label>
                            <select
                                ref={marcaRef}
                                name="marca" 
                                id="marca" 
                                className={`form-select input-clean ${marcaError ? 'is-invalid' : ''}`}
                                value={id_marca}
                                onChange={(e) => {
                                    setIdMarca(parseInt(e.target.value, 10));
                                    if (e.target.value !== "0") setMarcaError("");
                                }}
                            >
                                <option value="">Selecione a Marca</option>
                                {marcas.map(t => (
                                    <option key={t.id} value={t.id}>{t.nome}</option>
                                ))}
                            </select>
                            {marcaError && <div className="invalid-feedback mt-2">{marcaError}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="peso" className="form-label">Peso</label>
                            <select
                                ref={pesoRef}
                                name="peso"
                                id="peso"
                                className="form-select input-clean"
                                value={peso}
                                onChange={(e) => setPeso(e.target.value)}
                            >
                                <option value="">Selecione um Peso</option>
                                <option value="KG_1">1kg</option>
                                <option value="KG_2">2kg</option>
                                <option value="KG_5">5kg</option>
                            </select>
                            {pesoError && <div className="invalid-feedback mt-2">{pesoError}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="maquina" className="form-label">Máquina 1</label>
                            <select
                                ref={maquinaRef}
                                name="maquina" 
                                id="maquina" 
                                className={`form-select input-clean ${errorMaquina ? 'is-invalid' : ''}`}
                                value={id_maquina} 
                                onChange={(e) => {
                                    setIdMaquina(parseInt(e.target.value, 10));
                                    if (e.target.value !== "0") setErrorMaquina(""); // Limpa o erro se houver um valor válido
                                }}
                            >
                                <option value="">Selecione a Máquina</option>
                                {maquinas.map(d => (
                                    <option key={d.id} value={d.id}>{d.nome}</option>
                                ))}
                            </select>
                            {errorMaquina && <div className="invalid-feedback mt-2">{errorMaquina}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="maquina" className="form-label">Máquina 2</label>
                            <select
                                ref={maquinaSecundariaRef}
                                name="maquina_secundaria" 
                                id="maquina_secundaria" 
                                className={`form-select input-clean ${errorMaquinaSecundaria ? 'is-invalid' : ''}`}
                                value={id_maquina_secundaria}
                                onChange={(e) => {
                                    setIdMaquinaSecundaria(parseInt(e.target.value, 10));
                                    if (e.target.value !== "0") setErrorMaquinaSecundaria("");
                                }}
                            >
                                <option value="">Selecione a Máquina</option>
                                {maquinas.map(d => (
                                    <option key={d.id} value={d.id}>{d.nome}</option>
                                ))}
                            </select>
                            {errorMaquinaSecundaria && <div className="invalid-feedback mt-2">{errorMaquinaSecundaria}</div>}
                        </div>
                                                             
                        <div className="mb-3">
                            <label className="form-label">Lote</label>
                            
                            <input 
                                ref={loteRef}
                                value={lote}
                                type="text"
                                onChange={(e) => {
                                    setLote(e.target.value);
                                    if (loteError) setLoteError("");
                                }}
                                className={`form-control input-clean ${loteError ? 'is-invalid' : ''}`}
                                name="lote" 
                                id="lote"
                            />
                            {loteError && <div className="invalid-feedback mt-2">{loteError}</div>}
                        </div>
     
                        <div className="mb-3">
                            <label className="form-label">Lote Interno</label>
                            <input
                                ref={loteInternoRef}
                                value={loteInterno}
                                type="text"
                                onChange={(e) => {
                                    setLoteInterno(e.target.value);
                                    if (loteInternoError) setLoteInternoError("");
                                }}
                                className={`form-control input-clean ${loteInternoError ? 'is-invalid' : ''}`} 
                                name="loteInterno" 
                                id="loteInterno" 
                                required 
                            />
                            {loteInternoError && <div className="invalid-feedback mt-2">{loteInternoError}</div>}
                        </div>
                                
                        <div className="mb-3">
                            <label className="form-label">P1</label>
                            <input
                                value={pesos.pesoB1}
                                type="text"
                                onChange={handleInputChange}
                                className="form-control input-clean"
                                name="pesoB1"
                                id="pesoB1"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">P2</label>
                            <input
                                value={pesos.pesoB2}
                                type="text"
                                onChange={handleInputChange}
                                className="form-control input-clean"
                                name="pesoB2"
                                id="pesoB2"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">P3</label>
                            <input 
                                value={pesos.pesoB3}
                                type="text"
                                onChange={handleInputChange}
                                className="form-control input-clean" 
                                name="pesoB3" 
                                id="pesoB3" 
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label">P4</label>
                            <input 
                                value={pesos.pesoB4}
                                type="text"
                                onChange={handleInputChange}
                                className="form-control input-clean" 
                                name="pesoB4" 
                                id="pesoB4" 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">P5</label>
                            <input 
                                value={pesos.pesoB5}
                                type="text"
                                onChange={handleInputChange}
                                className="form-control input-clean" 
                                name="pesoB5" 
                                id="pesoB5" 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Média dos Pesos:</label>
                            <input type="text" 
                            value={calcularMedia()} 
                            className="form-control input-clean" 
                            id="media-pesos"
                            name="media-pesos"
                            readOnly 
                            disabled />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Peso Emb.(G)</label>
                            <input 
                                ref={pesoEmbalagemRef}
                                value={pesoEmbalagem}
                                type="text"

                                onChange={(e) => {
                                    // Permite apenas números e ponto decimal
                                    const newValue = e.target.value.replace(",", "."); // Troca vírgula por ponto
                                    if (/^\d*\.?\d*$/.test(newValue) || newValue === "") {
                                        setPesoEmbalagem(newValue);
                                        if (pesoEmbalagemError) setPesoEmbalagemError("");
                                    }
                                }}

                                className={`form-control input-clean ${pesoEmbalagemError ? 'is-invalid' : ''}`}  
                                name="pesoEmbalagem" 
                                id="pesoEmbalagem" 
                            />
                            {pesoEmbalagemError && <div className="invalid-feedback mt-2">{pesoEmbalagemError}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Quantidade</label>
                            <input 
                                ref={quantidadeRef}
                                value={quantidade}
                                type="text"
                                onChange={(e) => {
                                    const valor = e.target.value;
                                    if (/^\d*$/.test(valor) && valor.length <= 10) { // Permite apenas números e limita a 10 caracteres
                                        setQuantidade(valor);
                                        if (quantidadeError) setQuantidadeError("");
                                    }
                                }}
                                className={`form-control input-clean ${quantidadeError ? 'is-invalid' : ''}`} 
                                name="quantidade" 
                                id="quantidade" 
                                maxLength={10} // Impede a digitação além de 10 caracteres no nível do input
                            />
                            {quantidadeError && <div className="invalid-feedback mt-2">{quantidadeError}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Embalagem Utilizada (KG)</label>
                            <input 
                                ref={embalagemUtilizadaRef}
                                value={embalagemUtilizada}
                                type="text"
                                onChange={(e) => {
                                    // Permite apenas números e ponto decimal
                                    const newValue = e.target.value.replace(",", "."); // Troca vírgula por ponto
                                    if (/^\d*\.?\d*$/.test(newValue) || newValue === "") {
                                        setEmbalagemUtilizada(newValue);
                                        if (embalagemUtilizadaError) setEmbalagemUtilizadaError("");
                                    }
                                }}
                                className={`form-control input-clean ${embalagemUtilizadaError ? 'is-invalid' : ''}`} 
                                name="embalagemUtilizada" 
                                id="embalagemUtilizada" 
                            />
                            {embalagemUtilizadaError && <div className="invalid-feedback mt-2">{embalagemUtilizadaError}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Perca (KG)</label>
                            <input 
                                ref={percaRef}
                                value={perca}
                                type="text"
                                onChange={(e) => {
                                    // Permite apenas números e ponto decimal
                                    const newValue = e.target.value.replace(",", "."); // Troca vírgula por ponto
                                    if (/^\d*\.?\d*$/.test(newValue) || newValue === "") {
                                        setPerca(newValue);
                                        if (percaError) setPercaError("");
                                    }
                                }}
                                className={`form-control input-clean ${percaError ? 'is-invalid' : ''}`} 
                                name="perca" 
                                id="perca" 
                            />
                            {percaError && <div className="invalid-feedback mt-2">{percaError}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="d-block mb-2">Teste impacto</label>
                            <label 
                                className="border rounded p-3 d-flex align-items-center gap-3 cursor-pointer user-select-none w-100"
                                htmlFor="testeImpacto" // Garante que o clique ative o checkbox
                            >
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="testeImpacto"
                                    checked={testeImpacto}
                                    onChange={(e) => setTesteImpacto(e.target.checked)}
                                />
                                <span className="mb-0">Realizado</span>
                            </label>
                        </div>

                        <div className="mb-3">
                            <label className="d-block mb-2">Verificação do Carimbo</label>
                            <label 
                                className="border rounded p-3 d-flex align-items-center gap-3 cursor-pointer user-select-none w-100"
                                htmlFor="verificacaoCarimbo"
                            >
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="verificacaoCarimbo"
                                    checked={verificacaoCarimbo}
                                    onChange={(e) => setVerificacaoCarimbo(e.target.checked)}
                                />
                                <span className="mb-0">Verificado</span>
                            </label>
                        </div>

                        <div className="mb-3">
                            <label className="d-block mb-2">Verificado</label>
                            <label 
                                className="border rounded p-3 d-flex align-items-center gap-3 cursor-pointer user-select-none w-100"
                                htmlFor="verificado"
                            >
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="verificado"
                                    checked={verificado}
                                    onChange={(e) => setVerificado(e.target.checked)}
                                />
                                <span className="mb-0">Item foi verificado</span>
                            </label>
                        </div>

                        {verificado && (
                            <div className="mb-3">
                                <label htmlFor="usuario" className="form-label">Usuário que verificou</label>
                                <select
                                    name="usuario_verificador"
                                    id="usuario_verificador"
                                    className="form-select input-clean"
                                    value={usuarioSelecionado}
                                    onChange={(e) => setUsuarioSelecionado(e.target.value)}
                                >
                                    <option value="">Selecione o usuário</option>
                                    {usuarios.map(usuario => (
                                        <option key={usuario.id} value={usuario.id}>{usuario.nome}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button onClick={SaveProducao} className="btn btn-primary btn-clean" type="button">
                            Salvar
                        </button>
                    </div>
                </div>
            </div>

            <footer className="mt-auto" style={{ padding: "50px 0", backgroundColor: "#f8f9fa", color: "#6c757d", textAlign: "center" }}>
                <p>2025 Controle de Produção</p>
            </footer>
        </>
    );
}

export default AppointmentAdd;
