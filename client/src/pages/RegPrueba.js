import '../App.css';
import { useEffect, useState} from "react"; //useEffects sirve para recuperar los items del listado para labelSelect, desde la BD
import Axios from "axios";
//importacion de bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
//importación de alertas
import Swal from 'sweetalert2';

function RegPrueba ({ userId }) {
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
  const[pruebaList,setPruebaList] = useState([]);
  const[proyectoList,setProyectoList] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      //para listar los tipos de prueba
      try {
          const response = await Axios.get("http://localhost:3002/prueba");
          setPruebaList(response.data);
      } catch (error) {
          console.error("Error de items", error);
      }
      //para listar los proyectos registrados
      try {
          const response = await Axios.get("http://localhost:3002/proyectos");
          setProyectoList(response.data);
      } catch (error) {
          console.error("Error de items", error);
      }
    };
    fetchItems();
  }, []);
  

  //metodo para ingreso de datos
  const[descripcion,setDescripcion] = useState();
  const[fechaReg,setFechaReg] = useState();
  const[idPrueba,setIdPrueba] = useState();
  const[idProyecto,setIdProyecto] = useState();
  const[idRegPrueba,setIdRegPrueba] = useState();
  //para editar datos
  const[editar,setEditar] = useState(false);

  //metodo para mostrar lista de registros de pruebas desde BD
  const [regPruebaList,setRegPrueba] = useState([]);

  //funcion para boton de ingreso de datos
  const add = ()=>{
    if (!descripcion || !fechaReg || !idPrueba || !idPrueba) {
      Swal.fire({
          icon: "warning",
          title: "Completar formulario",
          text: "Debe llenar todos los campos.",
      });
      return;
    }
    Axios.post("http://localhost:3002/create",{
      descripcion:descripcion,
      fechaReg:fechaReg,
      idPrueba:idPrueba,
      idProyecto:idProyecto,
      idRegPrueba:idRegPrueba
      }).then(()=>{
        //para listar los registros de prueba despues de realizar un registro
        getRegPrueba();
        //para limpiar campos
        limpiarCampos ();
        //mensaje de ingreso de datos
        Swal.fire({
          title: "<strong>Registro realizado</strong>",
          html: "<i>Registro exitoso</i>",
          icon: 'success',
          timer: 3000
        });
      }).catch(function(error){
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: JSON.parse(JSON.stringify(error)).message==="Network Error"?"Intente más tarde":JSON.parse(JSON.stringify(error).message)
      });
    });
  }

  //para actualizar la informacion con el boton
  const update = ()=>{
    if (!descripcion || !fechaReg || !idPrueba || !idPrueba) {
      Swal.fire({
        icon: "warning",
        title: "Completar formulario",
        text: "Debe llenar todos los campos.",
      });
      return;
    }
      Axios.put("http://localhost:3002/update",{
          descripcion:descripcion,
          fechaReg:fechaReg,
          idPrueba:idPrueba,
          idProyecto:idProyecto,
          idRegPrueba:idRegPrueba
      }).then(()=>{
          //para listar los registros de prueba despues de realizar un registro
          getRegPrueba();
          //para limpiar campos
          limpiarCampos ();
          //mensaje de ingreso de datos
          Swal.fire({
              title: "<strong>Actualización exitosa</strong>",
              html: "<i>El registro <strong>Cod-Pru-"+idRegPrueba+"</strong> fue actualizado con éxito</i>",
              icon: 'success',
              timer: 3000
          });
      }).catch(function(error){
          Swal.fire({
              icon: "error",
              title: "Oops...",
              text: JSON.parse(JSON.stringify(error)).message==="Network Error"?"Intente más tarde":JSON.parse(JSON.stringify(error).message)
          });
      });
  }

  //para eliminar la informacion con el boton
  const deleteRegPrueba = (val)=>{
      //mensaje de eliminación de datos
      Swal.fire({
          title: "Eliminar registro",
          html: "<i>¿Desea eliminar el registro <strong>"+val.idRegPrueba+"</strong>?</i>",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si, eliminar registro"
      }).then((result) => {
          if (result.isConfirmed) {
              Axios.delete(`http://localhost:3002/delete/${val.idRegPrueba}`).then(()=>{
                  //para listar los registros de prueba despues de realizar la eliminación
                  getRegPrueba();
                  limpiarCampos();
                  Swal.fire({
                      title: "Eliminado",
                      html: "<strong>"+val.idRegPrueba+"</strong> fue eliminado con éxito",
                      icon: "success",
                      timer: 3000
                  });          
              }).catch(function(error){
                  Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: "No se pudo eliminar el registro",
                      footer: JSON.parse(JSON.stringify(error)).message==="Network Error"?"Intente más tarde":JSON.parse(JSON.stringify(error).message)
                  });
              });
          }
      });
  }

  //para boton cancelar/limpiar formulario
  const limpiarCampos = ()=>{
      setIdRegPrueba();
      setDescripcion("");
      setFechaReg("");
      setIdPrueba("");
      setIdProyecto("");
      setEditar(false); //para regresar al boton registrar
  }

  //para editar
  const editarRegPrueba = (val)=>{
      setEditar(true);

      setDescripcion(val.descripcion);
      setFechaReg(val.fechaReg);
      setIdPrueba(val.idPrueba);
      setIdProyecto(val.idProyecto);
      setIdRegPrueba(val.idRegPrueba);
  }

  //para listar datos desde la BD
  const getRegPrueba = ()=>{
      Axios.get("http://localhost:3002/regPrueba").then((response)=>{
      setRegPrueba(response.data);
      });
  }

  //para tener siempre listado los registros de prueba
  getRegPrueba();

  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">
          REGISTRO DE PRUEBAS A REALIZAR
        </div>

        <div className="card-body">
        <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Ingrese el proyecto al que se realizará la prueba: </span>
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
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Tipo de prueba a realizar: </span>
            <select className="form-select" aria-label="Seleccione una opcion" value={idPrueba} onChange={(event)=>{
              setIdPrueba(event.target.value);
            }}>
              <option value="">--Seleccione una opcion--</option>
              {pruebaList.map((val) => (
                  <option key={val.idPrueba} value={val.idPrueba}>
                      {val.tipoPrueba}
                  </option>
              ))}
            </select>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Descripción de la prueba: </span>
            <input type="text" 
            onChange={(event)=>{
              setDescripcion(event.target.value);
            }}
            className="form-control" value={descripcion} placeholder="Ingrese la descripción de la prueba" aria-label="Username" aria-describedby="basic-addon1" required/>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Fecha de registro de la prueba: </span>
            <input type="date" 
            onChange={(event)=>{
              setFechaReg(event.target.value);
            }}
            className="form-control" value={fechaReg} placeholder="Ingrese la fecha de registro de la prueba" aria-label="Username" aria-describedby="basic-addon1" required/>
          </div>          
        </div>
        <div className="card-footer text-muted">
          {
            editar?
            <div>
            <button className='btn btn-warning m-2' onClick={update}>Actualizar</button>
            <button className='btn btn-info m-2' onClick={limpiarCampos}>Cancelar</button> 
            </div>
            :<button className='btn btn-success' onClick={add}>Registrar</button> 
          }
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Proyecto</th>
            <th scope="col">Descripción de prueba</th>
            <th scope="col">Tipo de prueba</th>
            <th scope="col">Duración de prueba</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {
            regPruebaList.map((val,key)=>{
              return <tr key={val.idRegPrueba}>
                  <th>Cod-Pru-{val.idRegPrueba}</th>
                  <td>{val.nombre}</td>
                  <td>{val.descripcion}</td>
                  <td>{val.tipoPrueba}</td>
                  <td>{val.duracionPrueba}</td>
                  <td>
                    <div className="btn-group" role="group" aria-label="Basic example">
                      <button type="button" 
                        onClick={()=>{
                          editarRegPrueba(val);
                        }}
                        className="btn btn-info">Editar</button>
                      <button type="button" 
                        onClick={()=>{
                          deleteRegPrueba(val);
                        }}
                      className="btn btn-danger">Eliminar</button>
                    </div>
                  </td>
                </tr>
            })
          }
        </tbody>
      </table>
    </div>
  ); 
}

export default RegPrueba;

