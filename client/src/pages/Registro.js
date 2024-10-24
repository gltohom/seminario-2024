//archivo css
import '../App.css';
//importacion de bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import Axios from "axios";
import { useNavigate } from 'react-router-dom'; // para poder pasar de una pesaña a otra 

function Registro () {
    const navigate = useNavigate();
    //para listar el SELECT para los tipos de resultados
    const[items,setItems] = useState([]);
    //recuperando la informcación
    useEffect(() => {
        const fetchItems = async () => {
        try {
            const response = await Axios.get("http://localhost:3006/api/puesto");
            setItems(response.data);
        } catch (error) {
            console.error("Error de items", error);
        }
        };
        fetchItems();
    }, []);

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        correo: '',
        idPuesto: '',
        usuario: '',
        contrasena: '',
    });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:3006/api/registro", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            // Limpiar los campos del formulario
            setFormData({
                nombre: '',
                apellido: '',
                telefono: '',
                correo: '',
                idPuesto: '',
                usuario: '',
                contrasena: '',
            });
        } else {
            alert('Error: ' + data.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="containerRegistro">
                <div className="card-header text-center">REGISTRO DE PERSONAL NUEVO</div>
                <div className="card-body">
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1" for="floatingInputInvalid">Ingrese su nombre: </span>
                        <input type="text" className="form-control" name="nombre" placeholder="Nombre" onChange={handleChange} required/>
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1" for="floatingInputInvalid">Ingrese su apellido: </span>
                        <input type="text" className="form-control" name="apellido" placeholder="Apellido" onChange={handleChange} required/>
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1" for="floatingInputInvalid">Ingrese su teléfono: </span>
                        <input type="number" className="form-control" name="telefono" placeholder="Teléfono" onChange={handleChange} required/>
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1" for="floatingInputInvalid">Ingrese su correo: </span>
                        <input type="mail" className="form-control" name="correo" placeholder="Correo" onChange={handleChange} required/>
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">Seleccione su puesto: </span>
                        <select className="form-select" aria-label="Seleccione una opcion" name="idPuesto"  onChange={handleChange} required>
                            <option value="">--Seleccione una opcion--</option>
                            {items.map((val) => (
                                <option key={val.idPuesto} value={val.idPuesto}>
                                    {val.puesto}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1" for="floatingInputInvalid">Ingrese su usuario: </span>
                        <input type="text" className="form-control" name="usuario" placeholder="Usuario" onChange={handleChange} required/>
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1" for="floatingInputInvalid">Ingrese su contraseña: </span>
                        <input type="password" className="form-control" name="contrasena" placeholder="Contraseña" onChange={handleChange} required/>
                    </div>
                    <div className="text-center">
                        <button className='btn btn-success' type="submit">Registrar</button> 
                        <br></br><br></br>
                        <button className='btn btn-danger' onClick={() => navigate('/')}>Volver a Login</button>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default Registro;