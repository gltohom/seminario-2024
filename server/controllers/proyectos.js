const db = require("./db");
const express = require ("express");
const app = express();
const cors = require ("cors");
app.use(cors());
app.use(express.json());
const jwt = require('jsonwebtoken'); //para las contraseñas

async function getAllProyectos() {
    // Middleware para verificar el token
    const verifyToken = (req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) return res.sendStatus(403);

        jwt.verify(token, 'tu_clave_secreta', (err, decoded) => {
            if (err) return res.sendStatus(403);
            req.userId = decoded.id; // O el id que estés usando
            next();
        });
    };

    //insertar datos a la tabla EMPLEADOS
    app.post("/create", verifyToken, (req,res)=>{
        const nombre = req.body.nombre;
        const descripcion = req.body.descripcion;
        const fechaInicio = req.body.fechaInicio;
        const fechaEntrega = req.body.fechaEntrega;
        const idUsuario= req.body.idUsuario;
        
        db.query('INSERT INTO proyecto(nombre, descripcion, fechaInicio, fechaEntrega, idUsuario) VALUES (?,?,?,?,?)' ,[nombre, descripcion, fechaInicio, fechaEntrega, idUsuario],
            (err,result)=>{
                if(err){
                    console.log(err);
                }
                else{
                    res.send(result);
                }
            }
        );
    });

    //listar datos de la tabla PROYECTOS
    app.get("/proyectos", verifyToken,(req,res)=>{
        // se llaman todos los campos necesarios, pero no se muestran todos en la tabla del FRONTEND
        db.query('SELECT p.idProyecto, p.nombre, p.descripcion, p.fechaInicio, p.fechaEntrega, u.idUsuario, u.usuario  FROM proyecto AS p INNER JOIN usuario AS u ON p.idUsuario = u.idUsuario ORDER BY p.idProyecto ASC',
            (err,result)=>{
                if(err){
                    console.log(err);
                }
                else{
                    res.send(result); 
                }
            }
        );
    });

    //para actualizar datos de la tabla empleados
    app.put("/update", verifyToken,(req,res)=>{
        const idProyecto = req.body.idProyecto;
        const nombre = req.body.nombre;
        const descripcion = req.body.descripcion;
        const fechaInicio = req.body.fechaInicio;
        const fechaEntrega = req.body.fechaEntrega;
        const idUsuario= req.body.idUsuario;
        
        db.query('UPDATE proyecto SET nombre=?, descripcion=?, fechaInicio=?, fechaEntrega=?, idUsuario=? WHERE idProyecto=?' ,[nombre, descripcion, fechaInicio, fechaEntrega, idUsuario, idProyecto],
            (err,result)=>{
                if(err){
                    console.log(err);
                }
                else{
                    res.send(result);
                }
            }
        );
    });

    //para eliminar datos de la tabla empleados
    app.delete("/delete/:id", verifyToken,(req,res)=>{
        const idProyecto = req.params.id;
        
        db.query('DELETE FROM proyecto WHERE idProyecto=?' ,idProyecto,
            (err,result)=>{
                if(err){
                    console.log(err);
                }
                else{
                    res.send(result);
                }
            }
        );
    });

    app.listen(3001, ()=> {
        console.log("corriendo en el puerto 3001 proyectos")
    });
}

//para exportar el archivo al archivo index
module.exports = { getAllProyectos };