const db = require("./db");
const express = require ("express");
const app = express();
const cors = require ("cors");
app.use(cors());
app.use(express.json());
const jwt = require('jsonwebtoken'); //para las contraseñas

async function getAllResulPrueba() {
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

    //insertar datos a la tabla resulPrueba
    app.post("/create", verifyToken, (req,res)=>{

        const descResultado = req.body.descResultado;
        const fechaRealiz = req.body.fechaRealiz;
        const idRegPrueba = req.body.idRegPrueba;
        const idTResultado= req.body.idTResultado;
        
        db.query('CALL guardarResulPrueba(?, ?, ?, ?)' ,[descResultado, fechaRealiz, idRegPrueba, idTResultado],
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
    
    //listar datos de la tabla resultado de pruebas con combinacion de 5 tablas (JOIN)
    app.get("/resulPrueba", verifyToken, (req,res)=>{
        // se llaman todos los campos necesarios, pero no se muestran todos en la tabla del FRONTEND
        db.query('SELECT resP.idResulPrueba, proy.nombre, pru.tipoPrueba, tr.tResultado, resP.descResultado, resP.fechaRealiz, resP.idRegPrueba, resP.idTResultado, regP.idRegPrueba, pru.duracionPrueba FROM resulPrueba AS resP INNER JOIN regPrueba AS regP ON resP.idRegPrueba = regP.idRegPrueba INNER JOIN proyecto AS proy ON proy.idProyecto = regP.idProyecto INNER JOIN prueba AS pru ON pru.idPrueba = regP.idPrueba INNER JOIN tipoResultado AS tr ON tr.idTResultado = resP.idTResultado ORDER BY resP.idResulPrueba ASC',
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

    //para actualizar datos de la tabla resulPrueba
    app.put("/update", verifyToken, (req,res)=>{
        const idResulPrueba = req.body.idResulPrueba;
        const descResultado = req.body.descResultado;
        const fechaRealiz = req.body.fechaRealiz;
        const idRegPrueba = req.body.idRegPrueba;
        const idTResultado= req.body.idTResultado;
        
        db.query('UPDATE resulPrueba SET descResultado=?, fechaRealiz=?, idRegPrueba=?, idTResultado=? WHERE idResulPrueba=?' ,[descResultado, fechaRealiz, idRegPrueba, idTResultado, idResulPrueba],
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

    //para eliminar datos de la tabla resulPrueba
    app.delete("/delete/:id", verifyToken, (req,res)=>{
        const idResulPrueba = req.params.id;
        
        db.query('DELETE FROM resulPrueba WHERE idResulPrueba=?' ,idResulPrueba,
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

    //para listar los tipos de resultado para registro
    app.get("/tipoResultado", verifyToken, (req, res) => {
        db.query('SELECT * FROM tipoResultado WHERE idTResultado <> 4', (err, results) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.json(results);
        });
    });
    
    //puerto en el que escucha
    app.listen(3003, ()=> {
        console.log("corriendo en el puerto 3003 resulPrueba")
    });
}

//para exportar el archivo al archivo index
module.exports = { getAllResulPrueba };