import { Link, useNavigate, useParams } from "react-router-dom";
import NavBar from "../../components/navbar/navbar";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import api from "../../constants/api.js";
import "../../styles/custom/time-picker.css"; // Arquivo CSS personalizado
import { useEffect, useRef, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale/pt-BR";
import ModalParadas from "../../components/modal/ModalParadas.jsx";
import RegistroParadaModal from "../../components/modal/RegistroParadaModal.jsx";

registerLocale("pt-BR", ptBR);

function AppointmentAdd() {
    const navigate = useNavigate();
    const [maquinas, setMaquinas] = useState([]);
    const [turnos, setTurnos] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [time, setTime] = useState("12:00");
    const [startDate, setStartDate] = useState(new Date());

    const [startDateParada, setStartDateParada] = useState(new Date());
    const [startDateRetorno, setStartDateRetorno] = useState(new Date());

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

    const [usuarioVerificadorError, setUsuarioVerificadorError] = useState("");


    const [action, setAction] = useState("");
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [reason, setReason] = useState("");
    const [paradas, setParadas] = useState([]);
    const [showModalParadas, setShowModalParadas] = useState(false);



    const [selectedProducaoParada, setSelectedProducaoParada] = useState(null);

    // Seu componente ou função onde a média é calculada

    const [pesos, setPesos] = useState({
        pesoB1: "",
        pesoB2: "",
        pesoB3: "",
        pesoB4: "",
        pesoB5: "",
    });

    const [mediaPesos, setMediaPesos] = useState("0.000");

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

    const usuarioVerificadorRef = useRef(null);
     

    const [usuarioVerificador, setUsuarioVerificador] = useState("");

    const [maquinaSelecionadaRadio, setMaquinaSelecionadaRadio] = useState(""); 

    const [showModalRegistroParada, setShowModalRegistroParada] = useState(false);

    const [producaoParadas, setProducaoParadas] = useState([]);
    const [selectedProducao, setSelectedProducao] = useState(null);

    const [motivoParadaProducao, setMotivoParadaProducao] = useState("");

    const handleOpenModal = (producao_id) => {
        setSelectedProducaoParada(producao_id)
        setShowModalRegistroParada(true);
    };

    
    async function loadProducaoParadas(producao_id) {
        try {
            const response = await api.get(`/production/${producao_id}/paradas`);
            setProducaoParadas(response.data);
            // setSelectedMaquina(maquinasManutencao.find((mq) => mq.id === id));

            setStartDateParada(new Date());
            setStartDateRetorno(new Date());

            setShowModalRegistroParada(true);
        } catch (error) {
            alert("Erro ao carregar histórico de paradas da produção.");
        }
    }



    // Função para fechar o modal
    const handleCloseModal = () => {
        setShowModalRegistroParada(false);
    };

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

    const handleDateChangeParada = (date) => {
        setStartDateParada(date);
    };

    const handleDateChangeRetorno = (date) => {
        setStartDateRetorno(date);
    };

    async function adicionarParadaProducao() {
        if (!motivoParadaProducao.trim()) {
            alert("O motivo não pode estar vazia.");
            return;
        }


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

        /*
        if (!dataProximaManutencao.trim()) {
            alert("A data da próxima manutenção não pode estar vazia.");
            return;
        }*/

        try {
            const now = new Date();
            const localISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString();            

            const json = {
                producao_id: parseInt(id, 10),
                motivo: motivoParadaProducao,
                hora_parada: adjustDateToLocalTimezone(startDateParada),
                hora_retorno: adjustDateToLocalTimezone(startDateRetorno),
                tempo_parada: 5
            }

            const response = await api.post(`/production/${id}/paradas`, json);

            setProducaoParadas((prev) => [response.data, ...prev]);
            // setDescricaoManutencao("");
            setMotivoParadaProducao("");
        } catch (error) {
            alert("Erro ao adicionar a parada.");
        }
    }

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

                    setMediaPesos(calcularMedia({
                        pesoB1: response.data.peso_b1,
                        pesoB2: response.data.peso_b2,
                        pesoB3: response.data.peso_b3,
                        pesoB4: response.data.peso_b4,
                        pesoB5: response.data.peso_b5,
                    }));

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
                    setUsuarioVerificador(response.data.usuario_verificador);
                    setMaquinaSelecionadaRadio(response.data.maquina_selecionada);
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

        if (!id_turno) {
            setErrorTurno("Turno é obrigatório.");
            if (!hasError) turnoRef.current?.focus();
            hasError = true;
        } else {
            setErrorTurno("");
        }
        
        if (!id_produto) {
            setErrorProduto("Produto é obrigatório.");
            if (!hasError) produtoRef.current?.focus();
            hasError = true;
        } else {
            setErrorProduto("");
        }

        if (!id_marca) {
            setErrorMarca("Marca é obrigatória.");
            if (!hasError) marcaRef.current?.focus();
            hasError = true;
        } else {
            setErrorMarca("");
        }
        
        {/*
        if (!id_maquina && !id_maquina_secundaria) {
            setErrorMaquina("Selecione pelo menos uma máquina.");
            setErrorMaquinaSecundaria("Selecione pelo menos uma máquina.");
            hasError = true;
            // return;
        } else {
            setErrorMaquina("");
            setErrorMaquinaSecundaria("");
        } */}
        
        if (!lote || !lote.trim()) {
            setLoteError("Lote é obrigatório.");
            if (!hasError) loteRef.current?.focus();
            hasError = true;
        } else {
            setLoteError("");
        }
        
        if (!loteInterno || !loteInterno.trim()) {
            setLoteInternoError("Lote Interno é obrigatório.");
            if (!hasError) loteInternoRef.current?.focus();
            hasError = true;
        } else {
            setLoteInternoError("");
        }
        
        if (!pesoEmbalagem || !pesoEmbalagem.trim()) {
            setPesoEmbalagemError("Peso Embalagem é obrigatório.");
            if (!hasError) pesoEmbalagemRef.current?.focus();
            hasError = true;
        } else {
            setPesoEmbalagemError("");
        }

        if (!quantidade || !quantidade.trim()) {
            setQuantidadeError("Quantidade é obrigatória.");
            if (!hasError) quantidadeRef.current?.focus();
            hasError = true;
        } else {
            setQuantidadeError("");
        }

        if (!embalagemUtilizada || !embalagemUtilizada.trim()) {
            setEmbalagemUtilizadaError("Embalagem utilizada (KG) é obrigatória.");
            if (!hasError) embalagemUtilizadaRef.current?.focus();
            hasError = true;
        } else {
            setEmbalagemUtilizadaError("");
        }

        if (!perca || !perca.trim()) {
            setPercaError("Perca (KG) é obrigatória.");
            if (!hasError) percaRef.current?.focus();
            hasError = true;
        } else {
            setPercaError("");
        }

        if (!peso || !peso.trim()) {
            setPesoError("Peso é obrigatório.");
            if (!hasError) pesoRef.current?.focus();
            hasError = true;
        } else {
            setPesoError("");
        }

        if (!usuarioVerificador || !usuarioVerificador.trim()) {
            setUsuarioVerificadorError("Usuário é obrigatório.");
            if (!hasError) usuarioVerificadorRef.current?.focus();
            hasError = true;
        } else {
            setUsuarioVerificadorError("");
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
            //maquina_id: id_maquina,
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
            // usuario_verificador_id: verificado ? parseInt(usuarioSelecionado, 10) : null,
            usuario_verificador: verificado ? usuarioVerificador : null,
            verificacao_carimbo: verificacaoCarimbo,
            peso: peso,
            //maquina_id_secundaria: id_maquina_secundaria,
            maquina_selecionada: maquinaSelecionadaRadio
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
     
    const calcularMedia = (pesos) => {
        if (!pesos) return '0.000'; // Protege contra valores null ou undefined
    
        const valores = Object.values(pesos)
          .map((v) => {
            // Verifica se o valor é válido e converte
            if (v && !isNaN(v.replace(',', '.'))) {
              return parseFloat(v.replace(',', '.')); // Substitui vírgula por ponto e converte
            }
            return NaN; // Retorna NaN se o valor for inválido
          })
          .filter((v) => !isNaN(v)); // Remove valores inválidos (NaN)
    
        return valores.length
          ? (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(3)
          : '0.000'; // Retorna '0.000' se não houver valores válidos
    };
    
    useEffect(() => {
        LoadMaquinas();
        LoadTurnos();
        LoadProdutos();
        LoadUsuarios();
        LoadMarcas();
        const hoje = new Date().toISOString().split("T")[0];
        setDataAtual(hoje);

        /*
        if (id_maquina) {
            setErrorMaquina(""); // Remove erro da máquina principal
            setErrorMaquinaSecundaria(""); // Remove erro da máquina secundária
        }
        if (id_maquina_secundaria) {
            setErrorMaquinaSecundaria(""); // Remove erro da máquina secundária
            setErrorMaquina(""); // Remove erro da máquina principal
        } */
        if (showModal) {
            setReason(""); // Limpa o campo de texto quando o modal abrir
        }

    }, [showModal]);

    const handleParar = (idConsulta) => {
        setSelectedAppointment(idConsulta);
        setAction("parar");
        setShowModal(true);
    };

    const handleRetomar = (idConsulta) => {
        setSelectedAppointment(idConsulta);
        setAction("retomar");
        setShowModal(true);
    };

    const handleStopProduction = async () => {
        try {
            if (action === "parar") {

                if (reason.trim() === "") {
                    alert("Por favor, informe o motivo para parar a produção.");
                    return;
                }

                await api.post(`/production/${selectedAppointment}/stop`, { motivo: reason });
            } else {
                await api.post(`/production/${selectedAppointment}/resume`, { motivo: reason });
            }
            setShowModal(false);
            // LoadAppointments(); // Recarrega a lista de produções após a alteração
        } catch (error) {
            alert("Erro ao " + action + " a produção: " + error.response?.data?.error || error.message);
        }
    };

    // Função para tratar a mudança dos valores dos pesos
    const handlePesoChange = (e) => {
        const { name, value } = e.target;
        
        // A expressão regular permite apenas números com até 3 casas decimais
        const regex = /^[0-9]*([.][0-9]{0,3})?$/;
    
        // Verifica se o valor é válido de acordo com a regex
        if (regex.test(value)) {
            setPesos((prevPesos) => {
                const novosPesos = {
                    ...prevPesos,
                    [name]: value,
                };
    
                const novaMedia = calcularMedia(novosPesos);
                setMediaPesos(novaMedia);
    
                return novosPesos;
            });
        }
    };
    

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
                                className={`form-select input-clean ${errorProduto ? 'is-invalid' : ''}`}
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
                                className={`form-select input-clean ${errorMarca ? 'is-invalid' : ''}`}
                                value={id_marca}
                                onChange={(e) => {
                                    setIdMarca(parseInt(e.target.value, 10));
                                    if (e.target.value !== "0") setErrorMarca("");
                                }}
                            >
                                <option value="">Selecione a Marca</option>
                                {marcas.map(t => (
                                    <option key={t.id} value={t.id}>{t.nome}</option>
                                ))}
                            </select>
                            {errorMarca && <div className="invalid-feedback mt-2">{errorMarca}</div>}
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
                        
                        {/*
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
                            <label htmlFor="maquina_secundaria" className="form-label">Máquina 2</label>
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
                        */}

                        <div className="mb-3">
                            <label className="form-label">Selecione a máquina:</label>
                            <div className="d-flex gap-4">
                                <div>
                                    <input
                                        className="btn-check"
                                        type="radio"
                                        id="maquina1"
                                        name="maquina"
                                        value="maquina1"
                                        checked={maquinaSelecionadaRadio === "maquina1"}
                                        onChange={(e) => setMaquinaSelecionadaRadio(e.target.value)}
                                    />
                                    <label className="btn btn-outline-primary" htmlFor="maquina1">
                                        Máquina 1
                                    </label>
                                </div>

                                <div>
                                    <input
                                        className="btn-check"
                                        type="radio"
                                        id="maquina2"
                                        name="maquina"
                                        value="maquina2"
                                        checked={maquinaSelecionadaRadio === "maquina2"}
                                        onChange={(e) => setMaquinaSelecionadaRadio(e.target.value)}
                                    />
                                    <label className="btn btn-outline-primary" htmlFor="maquina2">
                                        Máquina 2
                                    </label>
                                </div>

                                <div>
                                    <input
                                        className="btn-check"
                                        type="radio"
                                        id="maquinaAmbas"
                                        name="maquina"
                                        value="ambas"
                                        checked={maquinaSelecionadaRadio === "ambas"}
                                        onChange={(e) => setMaquinaSelecionadaRadio(e.target.value)}
                                    />
                                    <label className="btn btn-outline-primary" htmlFor="maquinaAmbas">
                                        Máquina 1 e 2
                                    </label>
                                </div>
                            </div>
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
                                onChange={handlePesoChange}
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
                                onChange={handlePesoChange}
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
                                onChange={handlePesoChange}
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
                                onChange={handlePesoChange}
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
                                onChange={handlePesoChange}
                                className="form-control input-clean" 
                                name="pesoB5" 
                                id="pesoB5" 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Média dos Pesos:</label>
                            <input type="text" 
                            value={mediaPesos} 
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
                            <label className="form-label">Quantidade Fardos</label>
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
                                
                                <div className="mb-3">
                                    <label className="form-label">Usuário que verificou</label>
                                    <input 
                                        ref={usuarioVerificadorRef}
                                        value={usuarioVerificador}
                                        type="text"
                                        onChange={(e) => {
                                            setUsuarioVerificador(e.target.value);
                                            if (usuarioVerificadorError) setUsuarioVerificadorError("");
                                        }}
                                        className={`form-control input-clean ${usuarioVerificadorError ? 'is-invalid' : ''}`} 
                                        name="usuarioVerificador" 
                                        id="usuarioVerificador" 
                                    />
                                    {usuarioVerificadorError && <div className="invalid-feedback mt-2">{usuarioVerificadorError}</div>}
                                </div>

                                {/*
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
                                </select> */}
                            </div>
                        )}

                        <button onClick={SaveProducao} className="btn btn-primary btn-clean w-100" type="button">
                            Salvar
                        </button>

                        <div>
                            <button onClick={() => loadProducaoParadas(id)} className="btn btn-secondary btn-clean w-100 mt-3" type="button">
                                Registro de Parada
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/*
            <div className="position-fixed" style={{ bottom: "20px", right: "20px" }}>
                <button
                    className="btn btn-secondary"
                    style={{
                        marginRight: "10px",
                        borderRadius: "50%",
                        padding: "15px 20px",
                        fontSize: "16px",
                        boxShadow: "2px 2px 10px rgba(0,0,0,0.2)"
                    }}
                    onClick={() => handleParar(id)}
                    title="Parar a produção"
                >
                
                <i className="bi bi-pause-fill"></i>
                </button>

                <button
                    className="btn btn-primary"
                    style={{
                        borderRadius: "50%",
                        padding: "15px 20px",
                        fontSize: "16px",
                        boxShadow: "2px 2px 10px rgba(0,0,0,0.2)"
                    }}
                    onClick={() => handleRetomar(id)}
                    title="Retomar a produção"
                >
                <i className="bi bi-play-fill"></i>
                </button> 
            </div> */}

            {/* Modal para confirmar a parada ou retomada */}
            {showModal && (
                <div className="modal fade show" style={{ display: "block" }} aria-modal="true" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{action === "parar" ? "Parar" : "Retomar"} produção</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Tem certeza que deseja {action === "parar" ? "parar" : "retomar"} a produção?</p>

                                {action === "parar" && (
                                    <div className="form-group">
                                        <label htmlFor="motivo">Motivo</label>
                                        <textarea
                                            id="motivo"
                                            name="motivo"
                                            className="form-control"
                                            rows="3"
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            placeholder="Informe o motivo para parar a produção."
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Não
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleStopProduction}>
                                    Sim
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {showModalRegistroParada && (
            <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.6)" }}>
                <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                    <h5 className="modal-title">Registrar Parada</h5>
                    <button type="button" className="btn-close" onClick={() => setShowModalRegistroParada(false)} aria-label="Fechar"></button>
                    </div>

                    <div className="modal-body">
                    <div className="row">
                        {/* Motivo */}
                        <div className="col-12 mb-4">
                        <label htmlFor="motivo" className="form-label">Motivo da Parada</label>
                        <textarea
                            id="motivo"
                            className="form-control input-clean"
                            placeholder="Descreva o motivo da parada"
                            value={motivoParadaProducao}
                            onChange={(e) => setMotivoParadaProducao(e.target.value)}
                            rows={5}
                            style={{ resize: 'none', borderRadius: '8px' }}
                        />
                        </div>

                        {/* Colunas de Data e Hora */}
                        <div className="col-md-6 mb-3">
                        <label htmlFor="data-inicio" className="form-label">Data e Hora da Parada</label>
                        <DatePicker
                            id="data-inicio"
                            name="data-inicio"
                            selected={startDateParada}
                            onChange={handleDateChangeParada}
                            className="form-control input-clean"
                            dateFormat="dd/MM/yyyy HH:mm"
                            locale="pt-BR"
                            showTimeSelect={true}
                            timeFormat="HH:mm"
                            timeIntervals={5}
                            placeholderText="Selecione a data e hora"
                            style={{ borderRadius: '8px' }}
                        />
                        </div>

                        <div className="col-md-6 mb-3">
                        <label htmlFor="data-fim" className="form-label">Data e Hora do Retorno</label>
                        <DatePicker
                            id="data-fim"
                            name="data-fim"
                            selected={startDateRetorno}
                            onChange={handleDateChangeRetorno}
                            className="form-control input-clean"
                            dateFormat="dd/MM/yyyy HH:mm"
                            locale="pt-BR"
                            showTimeSelect={true}
                            timeFormat="HH:mm"
                            timeIntervals={5}
                            placeholderText="Selecione a data e hora"
                            style={{ borderRadius: '8px' }}
                        />
                        </div>
                    </div>

                    {/* Botão Adicionar */}
                    <div className="d-flex justify-content-center mt-4">
                        <button 
                        className="btn btn-primary w-50 py-2"
                        style={{ borderRadius: '8px', transition: 'background-color 0.3s' }}
                        onClick={adicionarParadaProducao}
                        >
                        Adicionar
                        </button>
                    </div>

                    {/* Histórico de Registros */}
                    <div className="mt-4">
                        <div style={{
                        maxHeight: "300px", 
                        overflowY: "auto", 
                        border: "1px solid #ddd", 
                        borderRadius: "8px", 
                        padding: "10px", 
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}>
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th>Hora Parada</th>
                                <th>Hora Retorno</th>
                                <th>Motivo</th>
                            </tr>
                            </thead>
                            <tbody>
      
                            { producaoParadas.map((item, index) => (
                                <tr key={index}>

                                <td>{
                                    new Intl.DateTimeFormat('pt-BR', { 
                                        dateStyle: 'short', 
                                        timeStyle: 'short', 
                                        timeZone: 'America/Sao_Paulo' 
                                    }).format(new Date(new Date(item.hora_parada).getTime() + (3 * 60 * 60 * 1000))) // Ajuste de 3h
                                }</td>

                                <td>{
                                    new Intl.DateTimeFormat('pt-BR', { 
                                        dateStyle: 'short', 
                                        timeStyle: 'short', 
                                        timeZone: 'America/Sao_Paulo' 
                                    }).format(new Date(new Date(item.hora_retorno).getTime() + (3 * 60 * 60 * 1000))) // Ajuste de 3h
                                }</td>

                                <td>{item.motivo}</td>
                                </tr>
                            )) }
                            </tbody>
                        </table>
                        </div>
                    </div>
                    </div>

                    <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModalRegistroParada(false)}>
                        Fechar
                    </button>
                    </div>
                </div>
                </div>
            </div>
            )}



            





            <ModalParadas show={showModalParadas} onClose={() => setShowModalParadas(false)} paradas={paradas} />

            <footer className="mt-auto" style={{ padding: "50px 0", backgroundColor: "#f8f9fa", color: "#6c757d", textAlign: "center" }}>
                <p>2025 Controle de Produção</p>
            </footer>
        </>
    );
}

export default AppointmentAdd;
