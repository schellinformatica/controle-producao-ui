import { BrowserRouter, Route, Routes } from "react-router-dom";

import Employee from "./pages/employee/employee.jsx";
import EmployeeAdd from "./pages/employee-add/employee-add.jsx";
import Appointments from "./pages/appointments/appointments.jsx";
import AppointmentAdd from "./pages/appointment-add/appointment-add.jsx";
import Maquinas from "./pages/maquinas/maquina.jsx";
import MaquinaAdd from "./pages/maquina-add/maquina-add.jsx";
import Dashboard from "./pages/dashboard/dashboard.jsx";

function Rotas() {
    return <BrowserRouter>
        <Routes>
            <Route path="/employee" element={<Employee />} />
            <Route path="/employee/new" element={<EmployeeAdd />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/appointments/add" element={<AppointmentAdd />} />
            <Route path="/appointments/edit/:id" element={<AppointmentAdd />} />
            <Route path="/maquinas" element={<Maquinas />} />
            <Route path="/maquinas/add" element={<MaquinaAdd />} />
            <Route path="/maquinas/edit/:id" element={<MaquinaAdd />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    </BrowserRouter>
}

export default Rotas;