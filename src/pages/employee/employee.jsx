import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import NavBar from '../../components/navbar/navbar.jsx';

const Employee = () => {
  // JSON fixo de agendamentos
  const [events] = useState([
    { title: 'Consulta Médica', date: '2025-01-20' },
    { title: 'Reunião Equipe', date: '2025-01-21' },
    { title: 'Dentista', date: '2025-01-22' },
    { title: 'Viagem', date: '2025-01-25' }
  ]);

  return (
    <div className="container-fluid mt-page">
      <NavBar />
      <div className="content-wrapper">
        <h1>Agenda de testes</h1>

        <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" events={events} />

        </div>
    </div>
  );
};

export default Employee;
