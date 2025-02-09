import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";

// Lazy Loading das páginas
const Login = lazy(() => import("./pages/login/login.jsx"));
const Employee = lazy(() => import("./pages/employee/employee.jsx"));
const EmployeeAdd = lazy(() => import("./pages/employee-add/employee-add.jsx"));
const Appointments = lazy(() => import("./pages/appointments/appointments.jsx"));
const AppointmentAdd = lazy(() => import("./pages/appointment-add/appointment-add.jsx"));
const Maquinas = lazy(() => import("./pages/maquinas/maquina.jsx"));
const MaquinaAdd = lazy(() => import("./pages/maquina-add/maquina-add.jsx"));
const Dashboard = lazy(() => import("./pages/dashboard/dashboard.jsx"));
const Beneficiamentos = lazy(() => import("./pages/beneficiamentos/beneficiamentos.jsx"));
const BeneficiamentoAdd = lazy(() => import("./pages/beneficiamento-add/beneficiamento-add.jsx"));
const Usuarios = lazy(() => import("./pages/usuarios/usuarios.jsx"));
const UsuariosAdd = lazy(() => import("./pages/usuario-add/usuario-add.jsx"));
const UsuarioPerfil = lazy(() => import("./pages/usuario-perfil/usuario-perfil.jsx"));
const MaquinasManutencao = lazy(() => import("./pages/maquinas-manutencao/maquinas-manutencao.jsx"));
const MaquinasManutencaoAdd = lazy(() => import("./pages/maquina-manutencao-add/maquina-manutencao-add.jsx"));
const Produtos = lazy(() => import("./pages/produtos/produtos.jsx"));
const ProdutoAdd = lazy(() => import("./pages/produto-add/produto-add.jsx"));

// Componente de Spinner
const Spinner = () => (
    <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
    }}>
        <div style={{
            width: "50px",
            height: "50px",
            border: "5px solid rgba(0, 0, 0, 0.1)",
            borderTop: "5px solid #007bff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
        }} />
        <style>{`
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `}</style>
    </div>
);

function Rotas() {
    return (
        <BrowserRouter>
            <Suspense fallback={<Spinner />}>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/employee" element={<Employee />} />
                    <Route path="/employee/new" element={<EmployeeAdd />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/appointments/add" element={<AppointmentAdd />} />
                    <Route path="/appointments/edit/:id" element={<AppointmentAdd />} />
                    <Route path="/maquinas" element={<Maquinas />} />
                    <Route path="/maquinas/add" element={<MaquinaAdd />} />
                    <Route path="/maquinas/edit/:id" element={<MaquinaAdd />} />
                    <Route path="/beneficiamentos" element={<Beneficiamentos />} />
                    <Route path="/beneficiamentos/add" element={<BeneficiamentoAdd />} />
                    <Route path="/beneficiamentos/edit/:id" element={<BeneficiamentoAdd />} />
                    <Route path="/usuario" element={<Usuarios />} />
                    <Route path="/usuario/add" element={<UsuariosAdd />} />
                    <Route path="/usuario/edit/:id" element={<UsuariosAdd />} />
                    <Route path="/usuario-perfil" element={<UsuarioPerfil />} />
                    <Route path="/maquinas-manutencao" element={<MaquinasManutencao />} />
                    <Route path="/maquinas-manutencao/add" element={<MaquinasManutencaoAdd />} />
                    <Route path="/produtos" element={<Produtos />} />
                    <Route path="/produtos/add" element={<ProdutoAdd />} />
                    <Route path="/produtos/edit/:id" element={<ProdutoAdd />} />
                    <Route path="*" element={<Navigate to="/appointments" />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default Rotas;
