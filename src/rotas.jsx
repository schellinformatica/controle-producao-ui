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
import Profile from "./pages/profile/profile.jsx";
import { AuthContext } from "./pages/login/AuthProvider.jsx";
import { useContext } from "react";
import UsuarioPerfil from "./pages/usuario-perfil/usuario-perfil.jsx";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <p>Carregando...</p>; // Evita problemas de redirecionamento antes de carregar o user
    return user ? children : <Navigate to="/login" />;
};

function Rotas() {
    return <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />} />
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
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/usuarios/add" element={<UsuariosAdd />} />
            <Route path="/usuarios/edit/:id" element={<UsuariosAdd />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/usuario-perfil" element={<UsuarioPerfil />} />

            <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
    </BrowserRouter>
}

export default Rotas;