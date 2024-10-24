//archivo css
import '../App.css';
// importacion de Outlet para renderizar todas las paginas o vistas
import { Outlet, useNavigate } from "react-router-dom";
//importacion de bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import Axios from "axios";

// funcion para crear el contenedor (MENU)
const Layout = ({ userId, setUser }) =>{
  // Configurar el token para cada solicitud
  const navigate = useNavigate();

    // Configurar el token para cada solicitud
  Axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/'); // Redirige a la página de inicio o login
  };

    return <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <div className="collapse navbar-collapse" id="navbarText">
              <ul className="navbar-nav mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link active"  aria-current="page" href="/">Inicio</a>
                </li>
              </ul>
              <ul className="navbar-nav mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="/proyectos">Proyectos</a>
                </li>
              </ul>
              <ul className="navbar-nav mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="/regPrueba">Registro de pruebas</a>
                </li>
              </ul>
              <ul className="navbar-nav mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="/resulPrueba">Registro de resultados</a>
                </li>
              </ul>
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="/reporteProyecto">Reporte proyecto</a>
                </li>
              </ul>
              <ul className="navbar-nav ">
              <li className="nav-item">
                <a className="nav-link active" onClick={handleLogout} style={{ cursor: 'pointer' }}>Cerrar sesión</a>
              </li>
              </ul>
  
              <span class="navbar-text">
                Menú principal
              </span>
            </div>
          </div>
        </nav>
        <br></br>
        <Outlet/>
    </div>;
}

export default Layout;