import "./beneficiamento-add.css";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import NavBar from "../../components/navbar/navbar.jsx";
import api from "../../constants/api.js";

const BeneficiamentoEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [beneficiamento, setBeneficiamento] = useState({
    data: '',
    turno_id: '',
    usuario_id: '',
    beneficiamentos_itens: [],
  });

  const [horaInput, setHoraInput] = useState({
    hora: '',
    producao_brunidor_1: '',
    producao_polidor_2: '',
    tonelada_hora: '',
    classificacao_3_4: '',
  });

  const [step, setStep] = useState(1);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const stepParam = urlParams.get('step');
    if (stepParam) setStep(Number(stepParam));
    if (id > 0) carregarBeneficiamento();
  }, [location.search]);

  const carregarBeneficiamento = async () => {
    try {
      const response = await api.get(`/beneficiamento/${id}`);
      setBeneficiamento({
        ...response.data,
        beneficiamentos_itens: response.data.beneficiamentos_itens || [],
      });
      if (step === 2 && response.data.beneficiamentos_itens.length > 0) {
        // Carregar dados de horários (beneficiamento_item) se estiver no step 2
        carregarBeneficiamentoItens(response.data.beneficiamentos_itens);
      }
    } catch (error) {
      console.error('Erro ao carregar beneficiamento:', error);
    }
  };

  const carregarBeneficiamentoItens = (itens) => {
    // Atualiza os dados de horário na tabela
    setBeneficiamento((prev) => ({
      ...prev,
      beneficiamentos_itens: itens,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBeneficiamento((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHoraChange = (e) => {
    const { name, value } = e.target;
    setHoraInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const adicionarHora = async () => {
    if (!horaInput.hora) return alert('Informe a hora.');

    const [hours, minutes] = horaInput.hora.split(':');
    const horaFormatada = new Date();
    horaFormatada.setHours(hours, minutes, 0, 0);  // Configura a hora e minuto, ignorando a data

    const novoBeneficiamentoItem = {
      hora: horaFormatada.toISOString(), // Converte para ISO-8601
      maquina_id_1: Number(horaInput.producao_brunidor_1),
      maquina_id_2: Number(horaInput.producao_polidor_2),
      tonelada_hora: Number(horaInput.tonelada_hora),
      classificacao_3_4: Number(horaInput.classificacao_3_4),
      beneficiamento_id: beneficiamento.id,
    };

    try {
      // Salva no banco de dados via API
      await api.post("/beneficiamento_item", novoBeneficiamentoItem);

      // Atualiza a tabela local com o novo item
      setBeneficiamento((prev) => ({
        ...prev,
        beneficiamentos_itens: [...(prev.beneficiamentos_itens || []), novoBeneficiamentoItem],
      }));

      setHoraInput({
        hora: '',
        producao_brunidor_1: '',
        producao_polidor_2: '',
        tonelada_hora: '',
        classificacao_3_4: '',
      });
    } catch (error) {
      console.error('Erro ao adicionar horário:', error);
      alert('Erro ao adicionar horário.');
    }
  };

  const removerHora = async (index) => {
    const horaRemovida = beneficiamento.beneficiamentos_itens[index];

    setBeneficiamento((prev) => ({
      ...prev,
      beneficiamentos_itens: prev.beneficiamentos_itens.filter((_, i) => i !== index),
    }));

    try {
      await api.delete(`/beneficiamento_item/${horaRemovida.id}`);
      alert('Horário removido com sucesso');
    } catch (error) {
      console.error('Erro ao remover horário:', error);
      alert('Erro ao remover horário.');
    }
  };

  const salvarBeneficiamento = async () => {
    try {
      const json = {
        data: new Date(beneficiamento.data).toISOString(), // Converte para ISO-8601
        turno_id: Number(beneficiamento.turno_id),
        usuario_id: Number(beneficiamento.usuario_id)
      };

      const response = await api.post("/beneficiamento", json);
      setBeneficiamento(response.data); 
      setStep(2);
    } catch (error) {
      console.error('Erro ao salvar beneficiamento:', error);
      alert('Erro ao salvar beneficiamento.');
    }
  };

  return (
    <div className="container-fluid mt-page">
      <NavBar />
      <div className="content-wrapper">
        <div className="container-custom mt-2">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
              <li className="breadcrumb-item"><Link to="/beneficiamentos">Beneficiamento</Link></li>
              <li className="breadcrumb-item active" aria-current="page">
                {step === 1 ? 'Novo' : 'Editar'}
              </li>
            </ol>
          </nav>

          <div className="mt-4">
            <form className="row g-3">
              {step === 1 && (
                <>
                  <div className="col-md-4">
                    <label className="form-label">Data</label>
                    <input
                      type="date"
                      name="data"
                      className="form-control input-clean"
                      onChange={handleChange}
                      value={beneficiamento.data}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Turno</label>
                    <input
                      type="number"
                      name="turno_id"
                      className="form-control input-clean"
                      onChange={handleChange}
                      value={beneficiamento.turno_id}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Operador</label>
                    <input
                      type="number"
                      name="usuario_id"
                      className="form-control input-clean"
                      onChange={handleChange}
                      value={beneficiamento.usuario_id}
                    />
                  </div>

                  <button type="button" className="btn btn-primary btn-clean mt-4" onClick={salvarBeneficiamento}>
                    Avançar para Horários
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <h5 className="mt-4">Adicionar Horários</h5>
                  <div className="row g-3 mt-1">
                    <div className="col-md-2">
                      <input
                        type="time"
                        name="hora"
                        className="form-control input-clean"
                        value={horaInput.hora}
                        onChange={handleHoraChange}
                      />
                    </div>

                    <div className="col-md-2">
                      <input
                        type="number"
                        name="producao_brunidor_1"
                        className="form-control input-clean"
                        placeholder="Máquina 1"
                        value={horaInput.producao_brunidor_1}
                        onChange={handleHoraChange}
                      />
                    </div>

                    <div className="col-md-2">
                      <input
                        type="number"
                        name="producao_polidor_2"
                        className="form-control input-clean"
                        placeholder="Máquina 2"
                        value={horaInput.producao_polidor_2}
                        onChange={handleHoraChange}
                      />
                    </div>

                    <div className="col-md-2">
                      <input
                        type="number"
                        name="tonelada_hora"
                        className="form-control input-clean"
                        placeholder="Tonelada/Hora"
                        value={horaInput.tonelada_hora}
                        onChange={handleHoraChange}
                      />
                    </div>

                    <div className="col-md-2">
                      <input
                        type="number"
                        name="classificacao_3_4"
                        className="form-control input-clean"
                        placeholder="Classificação do 3/4"
                        // value={horaInput.tonelada_hora}
                        onChange={handleHoraChange}
                      />
                    </div>

                    <div className="col-md-2">
                      <button type="button" className="btn btn-primary btn-clean w-100" onClick={adicionarHora}>
                        Adicionar
                      </button>
                    </div>
                  </div>

                  <table className="table table-bordered" style={{ marginTop: '30px' }}>
                    <thead>
                      <tr>
                        <th rowSpan="2" className="text-center align-middle">Hora</th>
                        <th colSpan="2" className="text-center">Produção do Bronidor</th>
                        <th colSpan="1" className="text-center">Produção do Polidor</th>
                        <th colSpan="1" className="text-center">Classificador Trier</th>
                        <th rowSpan="2" className="text-center align-middle">Ação</th>
                      </tr>
                      <tr>
                        <th className="text-center">Máquina 1</th>
                        <th className="text-center">Máquina 2</th>
                        <th className="text-center">Tonelada/Hora</th>
                        <th className="text-center">Classificador do 3/4</th>
                      </tr>
                    </thead>
                    <tbody>
                      {beneficiamento.beneficiamentos_itens && beneficiamento.beneficiamentos_itens.length > 0 ? (
                        beneficiamento.beneficiamentos_itens.map((item, index) => (
                          <tr key={index}>
                            <td className="text-center">{new Date(item.hora).toLocaleTimeString()}</td>
                            <td className="text-center">{item.maquina_id_1}</td>
                            <td className="text-center">{item.maquina_id_2}</td>
                            <td className="text-center">{item.tonelada_hora}</td>
                            <td className="text-center">{item.tonelada_hora}</td>
                            <td className="text-center align-middle">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-card btn-clean"
                                onClick={() => removerHora(index)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center no-data-row">Nenhum regitro encontrado</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeneficiamentoEdit;
