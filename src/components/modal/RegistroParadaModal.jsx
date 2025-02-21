import { useState, useEffect } from "react";
import api from "../../constants/api.js"; // Importação da API

const RegistroParadaModal = ({ show, onClose, producaoId }) => {
  const [motivo, setMotivo] = useState("");
  const [horaParada, setHoraParada] = useState("");
  const [horaRetorno, setHoraRetorno] = useState("");
  const [paradas, setParadas] = useState([]);

  // Carregar o histórico de paradas ao abrir o modal
  useEffect(() => {
    if (show) {
      api
        .get(`/production/${producaoId}/paradas`) // Carregar o histórico de paradas usando o api.js
        .then((res) => {
          setParadas(res.data);
        })
        .catch((err) => console.error("Erro ao carregar paradas:", err));
    }
  }, [show, producaoId]);

  const handleSave = async () => {
    const novaParada = { motivo, hora_parada: horaParada, hora_retorno: horaRetorno };

    try {
      const res = await api.post(`/producao/${producaoId}/paradas`, novaParada); // Salvar nova parada usando o api.js

      if (res.status === 201) {
        setParadas((prevParadas) => [...prevParadas, res.data]); // Atualizar a lista de paradas com a nova parada
        // Limpar os campos após salvar
        setMotivo("");
        setHoraParada("");
        setHoraRetorno("");
        onClose(); // Fechar o modal após salvar
      } else {
        console.error("Erro ao salvar a parada");
      }
    } catch (error) {
      console.error("Erro ao salvar a parada:", error);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Registro de Parada</h3>

        <div>
          <h4>Histórico de Paradas</h4>
          <ul>
            {paradas.map((parada) => (
              <li key={parada.id}>
                <strong>{parada.motivo}</strong> - {parada.hora_parada} até {parada.hora_retorno || "Não retornou"}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Nova Parada</h4>
          <input
            type="text"
            placeholder="Motivo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
          <input
            type="datetime-local"
            value={horaParada}
            onChange={(e) => setHoraParada(e.target.value)}
          />
          <input
            type="datetime-local"
            value={horaRetorno}
            onChange={(e) => setHoraRetorno(e.target.value)}
          />
          <button onClick={handleSave} className="btn btn-primary">Salvar</button>
        </div>

        <button onClick={onClose} className="btn btn-secondary">Fechar</button>
      </div>
    </div>
  );
};

export default RegistroParadaModal;
