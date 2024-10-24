import '../App.css';
import { useEffect, useState} from "react"; //useEffects sirve para recuperar los items del listado para labelSelect, desde la BD
import Axios from "axios";
//importacion de bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
//importación de alertas
import Swal from 'sweetalert2';

function ReporteProyecto ({ userId }) {
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
  
  //para listar el SELECT para los tipos de resultados
  const[proyectoList,setProyectoList] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      //para listar los proyectos registrados
      try {
          const response = await Axios.get("http://localhost:3007/proyectos");
          setProyectoList(response.data);
      } catch (error) {
          console.error("Error de items", error);
      }
    };
    fetchItems();
  }, []);
  
  //metodo para ingreso de datos
  const[idProyecto,setIdProyecto] = useState();
  
  //metodo para mostrar lista de registros de pruebas desde BD
  const [reporteProyectoList,setReporteProyecto] = useState([]);

  //funcion para boton de ingreso de datos
  const add = () => {
    if (!idProyecto) {
      Swal.fire({
          icon: "warning",
          title: "Selecciona un proyecto",
          text: "Debes seleccionar un proyecto para generar el reporte.",
      });
      return;
    }
    Axios.post("http://localhost:3007/select", { idProyecto })
        .then((response) => {
            setReporteProyecto(response.data); // Actualiza la tabla con la respuesta
            Swal.fire({
                title: "Reporte generado",
                icon: "success",
                timer: 3000
            });
        })
        .catch((error) => {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.message === "Network Error" ? "Intente más tarde" : error.message
            });
        });
    };

  //para listar datos desde la BD
  const getReporteProyecto = () => {
    Axios.get(`http://localhost:3007/select?idProyecto=${idProyecto}`).then((response) => {
      setReporteProyecto(response.data);
    }).catch((error) => {
      console.error("Error al obtener el reporte:", error);
    });
  }

  //para tener siempre listado los registros de prueba
  getReporteProyecto();

  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">
          REPORTE DE PRUEBAS REALIZADAS AL PROYECTO
        </div>
        <div className="card-body">
        <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Seleccione el proyecto para realizar proyecto: </span>
            <select className="form-select" aria-label="Seleccione una opcion" value={idProyecto} onChange={(event)=>{
              setIdProyecto(event.target.value);
            }}>
              <option value="">--Seleccione una opcion--</option>
              {proyectoList.map((val) => (
                  <option key={val.idProyecto} value={val.idProyecto}>
                      {val.nombre}
                  </option>
              ))}
            </select>
          </div>
        </div>
        <div className="card-footer text-muted">
            <button className='btn btn-success' onClick={add} >Generar Reporte</button>
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Tipo de prueba</th>
            <th scope="col">Duración de prueba</th>
            <th scope="col">Resultado</th>
            <th scope="col">Fecha Resultado</th>
            <th scope="col">Descripción de resultado</th>
          </tr>
        </thead>
        <tbody>
          {
            reporteProyectoList.map((val,key)=>{
              return <tr key={idProyecto}>
                  <td>{val.tipoPrueba}</td>
                  <td>{val.duracionPrueba}</td>
                  <td>{val.tResultado}</td>
                  <td>{val.fechaRealiz}</td>
                  <td>{val.descResultado}</td>
                </tr>
            })
          }
        </tbody>
      </table>
    </div>
  ); 
}

export default ReporteProyecto;