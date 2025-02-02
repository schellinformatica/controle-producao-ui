import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/login/login.jsx";
import Employee from "./pages/employee/employee.jsx";
import EmployeeAdd from "./pages/employee-add/employee-add.jsx";
import Appointments from "./pages/appointments/appointments.jsx";
import AppointmentAdd from "./pages/appointment-add/appointment-add.jsx";
import Maquinas from "./pages/maquinas/maquina.jsx";
import MaquinaAdd from "./pages/maquina-add/maquina-add.jsx";
import Dashboard from "./pages/dashboard/dashboard.jsx";
import Beneficiamentos from "./pages/beneficiamentos/beneficiamentos.jsx";
import BeneficiamentoAdd from "./pages/beneficiamento-add/beneficiamento-add.jsx";
import Usuarios from "./pages/usuarios/usuarios.jsx";
import UsuariosAdd from "./pages/usuario-add/usuario-add.jsx";
import UsuarioPerfil from "./pages/usuario-perfil/usuario-perfil.jsx";

function Rotas() {
    return <BrowserRouter>
        <Routes>
            {/*<Route path="/login" element={<Login />} />*/}
            <Route path="/" element={<Login />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/employee/new" element={<EmployeeAdd />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/appointments/add" element={<AppointmentAdd />} />
            <Route path="/appointments/edit/:id" element={<AppointmentAdd />} />
            <Route path="/maquinas" element={<Maquinas />} />
            <Route path="/maquinas/add" element={<MaquinaAdd />} />
            <Route path="/maquinas/edit/:id" element={<MaquinaAdd />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/beneficiamentos" element={<Beneficiamentos />} />
            <Route path="/beneficiamentos/add" element={<BeneficiamentoAdd />} />
            <Route path="/beneficiamentos/edit/:id" element={<BeneficiamentoAdd />} />
            <Route path="/usuario" element={<Usuarios />} />
            <Route path="/usuario/add" element={<UsuariosAdd />} />
            <Route path="/usuario/edit/:id" element={<UsuariosAdd />} />
            <Route path="/usuario-perfil" element={<UsuarioPerfil />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
    </BrowserRouter>
}

export default Rotas;