//archivo css
import '../App.css';
//importacion de bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import Axios from "axios";

//importando grafica
import GraficaCircular from './componentsGraphics/GraficaCircular';
import GraficaLineal from './componentsGraphics/GraficaLineal';


function Home ({ userId }) {
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

    return(
        <div className="marginIzq">
            <div className="containerGrafica columnGrafica">
                <div className="container column column-left">
                    <p className="m-2"><b>Tipos de pruebas: </b>Cantidad de pruebas realizadas por tipo</p>
                    <div className="bg-light mx-auto px-2 border border-1 border-black" style={{width: "550px", height: "550px"}}>
                        <div style={{width:"100%", height:"100%", padding:"10px 0"}}>
                            <GraficaCircular/>
                        </div>
                    </div>
                </div>
                <div className="column column-right">
                    <p className="m-2"><b>Resultado de pruebas: </b>Cantidad por tipo de resultados obtenidos</p>
                    <div className="bg-light mx-auto px-2 border border-1 border-black" style={{width: "550px", height: "550px"}}>
                        <GraficaLineal />
                    </div>
                </div>   
            </div>
            <p>Proyecto Seminario 2024</p>
        </div>
    );
}

export default Home;