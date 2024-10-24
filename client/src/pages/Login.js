//archivo css
import '../App.css';
//importacion de bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = ({ setUser }) => {
    const [credentials, setCredentials] = useState({ usuario: "", contrasena: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:3006/api/login", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            localStorage.setItem('token', data.token); // Almacenar el token en el localStorage
            setUser({ id: data.idUsuario }); // Guardar el ID del usuario
        } else {
            alert('Error: ' + data.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="containerLogin">
                <h1>Inicio de sesión</h1>
                <div className="mb-3">
                    <label className="form-label">Ingrese su usuario</label>
                    <input type="text" className="form-control" name="usuario" placeholder="Usuario" onChange={handleChange} required aria-describedby="emailHelp"/>   
                </div>
                <div className="mb-3">
                    <label className="form-label">Ingrese su contraseña</label>
                    <input type="password" className="form-control" name="contrasena" placeholder="Contraseña" onChange={handleChange} required/>
                </div>
                <div className="text-center">
                    <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
                    <br></br><br></br>
                    <button type="button" className="btn btn-success" onClick={() => navigate('/registro')}>Registrarse</button>
                </div>
            </div>
        </form>
    );
};

export default Login;