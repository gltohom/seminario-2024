import './App.css';
import React, { useEffect, useState } from 'react';
// importacion de Routes
import { Routes, Route, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Importa la librería
//importación de paginas
import Login from './pages/Login';
import Registro from './pages/Registro';

import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Default from "./pages/Default";
import Proyectos from './pages/Proyectos';
import RegPrueba from './pages/RegPrueba';
import ResulPrueba from './pages/ResulPrueba';
import ReporteProyecto from './pages/ReporteProyecto';

function App() {
  const [usuario, setUser] = useState(null);
  const navigate = useNavigate(); // Inicializa useNavigate

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Decodifica el token
            const decodedToken = jwtDecode(token);
            console.log(decodedToken);
            // Suponiendo que el ID del usuario se encuentra en la propiedad "idUsuario"
            setUser({ idUsuario: decodedToken.idUsuario, usuario: decodedToken.usuario });
        }
    }, []);

    const handleLogout = () => {
      localStorage.removeItem('token'); // Eliminar el token del localStorage
      setUser(null); // Limpiar el estado del usuario
      navigate('/'); // Redirigir al inicio o a la página de login
  };

  return (
    <div>
      <div>
        {!usuario ? (
          <Routes>
            <Route path="/" element={<Login setUser={setUser} />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="*" element={<Default />} />
          </Routes>
        ) : (
          <>
            <h1 className="container text-center">Proyecto de Seminario <h4>Bienvenido {usuario ? usuario.usuario : "Invitado"}</h4> </h1>
            <Routes>
              <Route path="/" element={<Layout userId={usuario.idUsuario} onLogout={handleLogout} setUser={setUser}/>}>
                <Route path="proyectos" element={<Proyectos userId={usuario.idUsuario} usuario={usuario.usuario} />} />
                <Route path="/" element={<Home userId={usuario.idUsuario}/>} />
                <Route path="*" element={<Default userId={usuario.idUsuario}/>} />
                <Route path="/regPrueba" element={<RegPrueba userId={usuario.idUsuario}/>} />
                <Route path="/resulPrueba" element={<ResulPrueba userId={usuario.idUsuario}/>} />
                <Route path="/reporteProyecto" element={<ReporteProyecto userId={usuario.idUsuario}/>} />
              </Route>
            </Routes>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
