const db = require("../controllers/db");
const express = require ("express");
const app = express();
const cors = require ("cors");
app.use(cors());
app.use(express.json());

async function getAllGraficaLineal() {

    //para grafica Lineal
    app.get("/graficaLineal", (req,res)=>{
        // llamando los campos para mostrar en la grafica de de lineas
        db.query('SELECT tr.tResultado AS tipo, COUNT(rp.idResulPrueba) AS total FROM tipoResultado AS tr LEFT JOIN resulPrueba AS rp ON tr.idTResultado = rp.idTResultado GROUP BY tResultado',
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

    //puerto en el que escucha
    app.listen(3005, ()=> {
        console.log("corriendo en el puerto 3005 graficaLineal")
    });
}

//para exportar el archivo al archivo index
module.exports = { getAllGraficaLineal };

