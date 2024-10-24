import '../App.css';
import {useState} from "react";
import Axios from "axios";
//importacion de bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
//importación de alertas
import Swal from 'sweetalert2';

function Proyectos({ userId }) {
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

  //metodo para ingreso de datos y para mostrar los datos
  const[nombre,setNombre] = useState();
  const[descripcion,setDescripcion] = useState();
  const[fechaInicio,setFechaInicio] = useState();
  const[fechaEntrega,setFechaEntrega] = useState();
  const[idUsuario,setUser] = useState();
  const[idProyecto,setIdProyecto] = useState();
  //para editar datos
  const[editar,setEditar] = useState(false);

  //metodo para mostrar lista de proyectos desde BD
  const [proyectosList,setProyectos] = useState([]);

  //funcion para boton de ingreso de datos
  const add = ()=>{
    if (!nombre || !descripcion || !fechaInicio || !fechaEntrega) {
      Swal.fire({
          icon: "warning",
          title: "Completar formulario",
          text: "Debe llenar todos los campos.",
      });
      return;
    }
    Axios.post("http://localhost:3001/create",{
      nombre:nombre,
      descripcion:descripcion,
      fechaInicio:fechaInicio,
      fechaEntrega:fechaEntrega,
      idUsuario:userId
    }).then(()=>{
      //para listar los proyectos despues de realizar un registro
      getProyectos();
      //para limpiar campos
      limpiarCampos ();
      //mensaje de ingreso de datos
      Swal.fire({
        title: "<strong>Registro realizado</strong>",
        html: "<i>El proyecto <strong>"+nombre+"</strong> fue registrado con éxito</i>",
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
    if (!nombre || !descripcion || !fechaInicio || !fechaEntrega) {
      Swal.fire({
          icon: "warning",
          title: "Completar formulario",
          text: "Debe llenar todos los campos.",
      });
      return;
    }
    Axios.put("http://localhost:3001/update",{
      idProyecto:idProyecto,
      nombre:nombre,
      descripcion:descripcion,
      fechaInicio:fechaInicio,
      fechaEntrega:fechaEntrega,
      idUsuario:idUsuario
    }).then(()=>{
      //para listar los proyectos despues de realizar un registro
      getProyectos();
      //para limpiar campos
      limpiarCampos ();
      //mensaje de ingreso de datos
      Swal.fire({
        title: "<strong>Actualización exitosa</strong>",
        html: "<i>El proyecto <strong>"+nombre+"</strong> fue actualizado con éxito</i>",
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
  const deleteProyectos = (val)=>{
    //mensaje de eliminación de datos
    Swal.fire({
      title: "Eliminar registro",
      html: "<i>¿Desea eliminar el proyecto <strong>"+val.nombre+"</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar registro"
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/delete/${val.idProyecto}`).then(()=>{
          //para listar los proyectos despues de realizar la eliminación
          getProyectos();
          limpiarCampos();
          Swal.fire({
            title: "Eliminado",
            html: "<strong>"+val.nombre+"</strong> fue eliminado con éxito",
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
    setIdProyecto("");
    setNombre("");
    setDescripcion("");
    setFechaInicio("");
    setFechaEntrega("");
    setUser("");
    setEditar(false); //para regresar al boton registrar
  }

  //para editar
  const editarProyectos = (val)=>{
    setEditar(true);

    setNombre(val.nombre);
    setDescripcion(val.descripcion);
    setFechaInicio(val.fechaInicio);
    setFechaEntrega(val.fechaEntrega);
    setUser(val.idUsuario);
    setIdProyecto(val.idProyecto);
  }
  
  //para listar datos desde la BD
  const getProyectos = ()=>{
    Axios.get("http://localhost:3001/proyectos").then((response)=>{
      setProyectos(response.data);
    });
  }
  //para tener siempre listado los proyectos
  getProyectos();
  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">
          REGISTRO DE PROYECTOS
        </div>
        <form>
          <div className="card-body">
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1" for="floatingInputInvalid">Nombre del proyecto: </span>
              <input type="text" 
              onChange={(event)=>{
                setNombre(event.target.value);
              }}
              className="form-control" value={nombre} placeholder="Ingrese el nombre del proyecto" aria-label="Username" aria-describedby="basic-addon1" required/>
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Descripción del proyecto: </span>
              <input type="text" 
              onChange={(event)=>{
                setDescripcion(event.target.value);
              }}
              className="form-control" value={descripcion} placeholder="Ingrese la descripción del proyecto" aria-label="Username" aria-describedby="basic-addon1" required/>
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Fecha de inicio: </span>
              <input type="date" 
              onChange={(event)=>{
                setFechaInicio(event.target.value);
              }}
              className="form-control" value={fechaInicio} placeholder="Ingrese la fecha de inicio" aria-label="Username" aria-describedby="basic-addon1" required/>
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Fecha de entrega: </span>
              <input type="date" 
              onChange={(event)=>{
                setFechaEntrega(event.target.value);
              }}
              className="form-control" value={fechaEntrega} placeholder="Ingrese la fecha de entrega" aria-label="Username" aria-describedby="basic-addon1" required/>
            </div>
          </div>
        </form>
        
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
            <th scope="col">Descripción</th>
            <th scope="col">Fecha de Inicio</th>
            <th scope="col">Fecha de Entrega</th>
            <th scope="col">Registrado por:</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {
            proyectosList.map((val,key)=>{
              return <tr key={val.idProyecto}>
                <th>Cod-Proy-{val.idProyecto}</th>
                <td>{val.nombre}</td>
                <td>{val.descripcion}</td>
                <td>{val.fechaInicio}</td>
                <td>{val.fechaEntrega}</td>
                <td>{val.usuario}</td>
                <td>
                  <div className="btn-group" role="group" aria-label="Basic example">
                    <button type="button" 
                      onClick={()=>{
                        editarProyectos(val);
                      }}
                      className="btn btn-info">Editar</button>
                    <button type="button" 
                      onClick={()=>{
                        deleteProyectos(val);
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

export default Proyectos;
