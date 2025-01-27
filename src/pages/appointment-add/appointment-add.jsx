import { Link, useNavigate, useParams } from "react-router-dom";
import NavBar from "../../components/navbar/navbar";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import api from "../../constants/api.js";
import "../../styles/custom/time-picker.css"; // Arquivo CSS personalizado
import { useEffect, useState } from "react";

function AppointmentAdd() {
    const navigate = useNavigate();

    const [maquinas, setMaquinas] = useState([]);
    const [time, setTime] = useState("12:00");

    /* inputs */
    const { id } = useParams();
    const [id_maquina, setIdMaquina] = useState(0);
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

    /* inputs error */
    const [errorMaquina, setErrorMaquina] = useState("");
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

    const formatToBrazilianCurrency = (value) => {
        // Remove tudo que não for número ou vírgula
        value = value.replace(/[^\d,]/g, '');
    
        // Substitui a vírgula por ponto, caso haja
        value = value.replace(',', '.');
    
        // Limita as casas decimais para 3
        let [integer, decimal] = value.split('.');
    
        if (decimal) {
          decimal = decimal.slice(0, 3);
        }
    
        // Adiciona a vírgula de volta para formato brasileiro
        value = integer + (decimal ? ',' + decimal : '');
    
        // Formata o número com ponto como separador de milhar
        const parts = value.split(',');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona ponto a cada 3 dígitos
    
        return parts.join(',');
    };

    const handleChange = (e) => {
        let value = e.target.value;
    
        // Formata o valor dinamicamente ao digitar
        const formattedValue = formatToBrazilianCurrency(value);
    
        setPesoB1(formattedValue);
    };

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
                alert("Erro ao listar máquinas.");
        }
    }

    async function LoadAppointment(id) {

        try {
            const response = await api.get("/appointments/" + id);

            if (response.data) {
                /*
                const date = new Date(response.data.booking_date);
                const dateOnly = date.toISOString().split("T")[0];

                setIdDoctor(response.data.id_doctor);
                setIdService(response.data.id_service);
                setBookingDate(dateOnly);
                setBookingHour(response.data.booking_hour);
                setPatientName(response.data.patient_name);
                */
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
        const now = new Date();
        const localISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString();
        //.slice(0, -1); // Remove o 'Z' do final
        
        const json = {
            maquina_id: id_maquina,
            lote: lote,
            lote_interno: loteInterno,
            peso_b1: pesoB1,
            peso_b2: pesoB2,
            peso_b3: pesoB3,
            peso_b4: pesoB4,
            peso_b5: pesoB5,
            peso_embalagem: pesoEmbalagem,
            marca: marca,
            quantidade: quantidade,
            embalagem_utilizada: embalagemUtilizada,
            perca: perca,
            teste_impacto: testeImpacto,
            verificado: verificado,
            hora: localISO
        };

        try { 
            /*
            const response = await api.post("/production", json, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            */

            const response = id > 0
                ? await api.put("/production/" + id, json)
                : await api.post("/production", json);

            if (response.data) {
                navigate("/appointments");
            }
        } catch (error) {
            const errorMsg = error.response?.data.error || "Erro ao salvar máquina";
            alert(errorMsg);
            // setNomeError(errorMsg);
        }
    }   

    useEffect(() => {
        LoadMaquinas();
    }, []);

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
                            <label htmlFor="maquina" className="form-label">Máquina</label>
                            <select 
                                name="maquina" 
                                id="maquina" 
                                className={`form-select input-clean ${errorMaquina ? 'is-invalid' : ''}`}
                                value={id_maquina} 
                                onChange={(e) => {
                                    setIdMaquina(parseInt(e.target.value, 10));
                                    if (e.target.value !== "0") setErrorMaquina(""); // Limpa o erro se houver um valor válido
                                }}
                            >
                                <option value="0">Selecione a Máquina</option>
                                {maquinas.map(d => (
                                    <option key={d.id} value={d.id}>{d.nome}</option>
                                ))}
                            </select>
                            {errorMaquina && <div className="invalid-feedback mt-2">{errorMaquina}</div>}
                        </div>
                        
                        {/*}
                        <div className="mb-3">
                            <label className="form-label">Hora</label>
                            <TimePicker
                                onChange={setTime}
                                value={time}
                                disableClock // Remove o relógio analógico
                                clearIcon={null} // Remove o ícone de limpar
                                format="HH:mm" // Formato de hora de 24 horas
                                className="form-control timepicker-bootstrap" // Classe personalizada para o estilo
                            />
                        </div> */}
                                     
                        <div className="mb-3">
                            <label className="form-label">Lote</label>
                            <input 
                                value={lote}
                                type="text"
                                onChange={(e) => {
                                    setLote(e.target.value);
                                    if (loteError) setLoteError("");
                                }}
                                className="form-control input-clean" 
                                name="lote" 
                                id="lote" 
                                required 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Lote Interno</label>
                            <input 
                                value={loteInterno}
                                type="text"
                                onChange={(e) => {
                                    setLoteInterno(e.target.value);
                                    if (loteInternoError) setLoteInternoError("");
                                }}
                                className="form-control" 
                                name="loteInterno" 
                                id="loteInterno" 
                                required 
                            />
                        </div>
                                
                        <div className="mb-3">
                            <label className="form-label">Peso B1</label>
                            <input
                                type="text"
                                value={pesoB1}
                                onChange={handleChange}
                                className="form-control"
                                name="pesoB1"
                                id="pesoB1"
                                placeholder="0,000"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Peso B.2</label>
                            <input 
                                value={pesoB2}
                                type="text"
                                onChange={(e) => {
                                    setPesoB2(e.target.value);
                                    if (pesoB2Error) setPesoB2Error("");
                                }}
                                className="form-control" 
                                name="pesoB2" 
                                id="pesoB2" 
                                required 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Peso B.3</label>
                            <input 
                                value={pesoB3}
                                type="text"
                                onChange={(e) => {
                                    setPesoB3(e.target.value);
                                    if (pesoB3Error) setPesoB3Error("");
                                }}
                                className="form-control" 
                                name="pesoB3" 
                                id="pesoB3" 
                                required 
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label">Peso B.4</label>
                            <input 
                                value={pesoB4}
                                type="text"
                                onChange={(e) => {
                                    setPesoB4(e.target.value);
                                    if (pesoB4Error) setPesoB4Error("");
                                }}
                                className="form-control" 
                                name="pesoB4" 
                                id="pesoB4" 
                                required 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Peso B.5</label>
                            <input 
                                value={pesoB5}
                                type="text"
                                onChange={(e) => {
                                    setPesoB5(e.target.value);
                                    if (pesoB5Error) setPesoB5Error("");
                                }}
                                className="form-control" 
                                name="pesoB5" 
                                id="pesoB5" 
                                required 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Peso Emb.(G)</label>
                            <input 
                                value={pesoEmbalagem}
                                type="text"
                                onChange={(e) => {
                                    setPesoEmbalagem(e.target.value);
                                    if (pesoEmbalagemError) setPesoEmbalagemError("");
                                }}
                                className="form-control" 
                                name="pesoEmbalagem" 
                                id="pesoEmbalagem" 
                                required 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Marca</label>
                            <input 
                                value={marca}
                                type="text"
                                onChange={(e) => {
                                    setMarca(e.target.value);
                                    if (marcaError) setMarcaError("");
                                }}
                                className="form-control" 
                                name="marca" 
                                id="marca" 
                                required 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Quantidade</label>
                            <input 
                                value={quantidade}
                                type="text"
                                onChange={(e) => {
                                    setQuantidade(e.target.value);
                                    if (quantidadeError) setQuantidadeError("");
                                }}
                                className="form-control" 
                                name="quantidade" 
                                id="quantidade" 
                                required 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Embalagem Utilizada (KG)</label>
                            <input 
                                value={embalagemUtilizada}
                                type="text"
                                onChange={(e) => {
                                    setEmbalagemUtilizada(e.target.value);
                                    if (embalagemUtilizadaError) setEmbalagemUtilizadaError("");
                                }}
                                className="form-control" 
                                name="embalagemUtilizada" 
                                id="embalagemUtilizada" 
                                required 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Perca (KG)</label>
                            <input 
                                value={perca}
                                type="text"
                                onChange={(e) => {
                                    setPerca(e.target.value);
                                    if (percaError) setPercaError("");
                                }}
                                className="form-control" 
                                name="perca" 
                                id="perca" 
                                required 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Teste impacto</label>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={testeImpacto}
                                    onChange={(e) => setTesteImpacto(e.target.checked)}
                                />
                                <label className="form-check-label">
                                    Marcar se o teste de impacto foi realizado
                                </label>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Verificado</label>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={verificado}
                                    onChange={(e) => setVerificado(e.target.checked)}
                                />
                                <label className="form-check-label">
                                    Marcar se o item foi verificado
                                </label>
                            </div>
                        </div>

                        <button onClick={SaveProducao} className="btn btn-primary" type="button">
                            Salvar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AppointmentAdd;
