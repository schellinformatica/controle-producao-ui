import { useContext } from "react";
import { AuthContext } from "../login/AuthProvider.jsx";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      <h1>Perfil</h1>
      {user ? <p>Bem-vindo, {user.name}</p> : <p>Carregando...</p>}
      <button onClick={logout}>Sair</button>
    </div>
  );
};

export default Profile;
