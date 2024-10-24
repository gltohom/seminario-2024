const db = require("./db");
const express = require ("express");
const app = express();
const cors = require ("cors");
app.use(cors());
app.use(express.json());
const jwt = require('jsonwebtoken'); //para las contraseñas

async function getAllRegPrueba() {
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

    //insertar datos a la tabla regPrueba
    app.post("/create", verifyToken, (req,res)=>{

        const descripcion = req.body.descripcion;
        const fechaReg = req.body.fechaReg;
        const idPrueba = req.body.idPrueba;
        const idProyecto= req.body.idProyecto;
        
        db.query('CALL guardarRegPrueba(?,?, ?, ?)' ,[descripcion, fechaReg, idPrueba, idProyecto],
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
    
    //listar datos de la tabla registro de pruebas con combinacion de 3 tablas (JOIN)
    app.get("/regPrueba", verifyToken, (req,res)=>{
        // se llaman todos los campos necesarios, pero no se muestran todos en la tabla del FRONTEND
        db.query('SELECT rp.idRegPrueba, p.nombre,rp.descripcion, rp.fechaReg, rp.idPrueba, rp.idProyecto, pb.tipoPrueba, pb.duracionPrueba FROM regPrueba AS rp INNER JOIN proyecto AS p ON rp.idProyecto = p.idProyecto INNER JOIN prueba AS pb ON rp.idPrueba = pb.idPrueba ORDER BY rp.idRegPrueba ASC',
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

    //para actualizar datos de la tabla regPrueba
    app.put("/update", verifyToken, (req,res)=>{
        const idRegPrueba = req.body.idRegPrueba;
        const descripcion = req.body.descripcion;
        const fechaReg = req.body.fechaReg;
        const idPrueba = req.body.idPrueba;
        const idProyecto= req.body.idProyecto;
        
        db.query('UPDATE regPrueba SET descripcion=?, fechaReg=?, idPrueba=?, idProyecto=? WHERE idRegPrueba=?' ,[descripcion, fechaReg, idPrueba, idProyecto, idRegPrueba],
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
    app.delete("/delete/:id", verifyToken, (req,res)=>{
        const idRegPrueba = req.params.id;
        
        db.query('DELETE FROM regPrueba WHERE idRegPrueba=?' ,idRegPrueba,
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

    //para listar los tipos de prueba para registro de prueba
    app.get("/prueba", verifyToken, (req, res) => {
        db.query('SELECT idPrueba, tipoPrueba FROM prueba', (err, results) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.json(results);
        });
    });

    //para listar los proyectos para registro de prueba
    app.get("/proyectos", verifyToken, (req, res) => {
        db.query('SELECT idProyecto, nombre FROM proyecto', (err, results) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.json(results);
        });
    });

    //puerto en el que escucha
    app.listen(3002, ()=> {
        console.log("corriendo en el puerto 3002 regPrueba")
    });
}

//para exportar el archivo al archivo index
module.exports = { getAllRegPrueba };

