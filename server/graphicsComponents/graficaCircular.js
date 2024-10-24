const db = require("../controllers/db");
const express = require ("express");
const app = express();
const cors = require ("cors");
app.use(cors());
app.use(express.json());

async function getAllGraficaCircular() {
    //para grafica circular
    app.get("/graficaCircular", (req,res)=>{
        // llamando los campos para mostrar en la grafica de pastel
        db.query('SELECT p.tipoPrueba AS tipo, COUNT(rp.idPrueba) AS total FROM prueba AS p LEFT JOIN regPrueba AS rp ON p.idPrueba = rp.idPrueba GROUP BY tipoPrueba',
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
    app.listen(3004, ()=> {
        console.log("corriendo en el puerto 3004 graficaCircular")
    });
}

//para exportar el archivo al archivo index
module.exports = { getAllGraficaCircular };

