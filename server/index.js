//importando archivos desde la carpeta CONTROLLERS
const proyectos = require('./controllers/proyectos');
const regPrueba = require('./controllers/regPrueba');
const reporteProyecto = require('./controllers/reporteProyecto');
const resulPrueba = require('./controllers/resulPrueba');
const registroLogin = require('./controllers/registroLogin');
const graficaCircular = require('./graphicsComponents/graficaCircular');
const graficaLineal = require('./graphicsComponents/graficaLineal');

async function main() {
    try {
        // llamando modulo del archivo PROYECTOS
        const allRegistroLogin = await registroLogin.getAllRegistroLogin();
        console.log('Importación de archivo registroLogin ¡Exitosa!:', allRegistroLogin);
        // llamando modulo del archivo PROYECTOS
        const allProyectos = await proyectos.getAllProyectos();
        console.log('Importación de archivo Proyectos ¡Exitosa!:', allProyectos);
        // llamando modulo del archivo REGPRUEBA
        const allRegPrueba = await regPrueba.getAllRegPrueba();
        console.log('Importación de archivo RegPrueba ¡Exitosa!:', allRegPrueba);
        // llamando modulo del archivo REPORTEPROYECTO
        const allReporteProyecto = await reporteProyecto.getAllReporteProyecto();
        console.log('Importación de archivo ReporteProyecto ¡Exitosa!:', allReporteProyecto);
        // llamando modulo del archivo REGRESULTADO
        const allResulPrueba = await resulPrueba.getAllResulPrueba();
        console.log('Importación de archivo ResulPrueba ¡Exitosa!:', allResulPrueba);
        // llamando modulo del archivo GRAPHICS Circular
        const allGraficaCircular = await graficaCircular.getAllGraficaCircular();
        console.log('Importación de archivo GraficaCircular ¡Exitosa!:', allGraficaCircular);
        // llamando modulo del archivo GRAPHICS Lineal
        const allGraficaLineal = await graficaLineal.getAllGraficaLineal();
        console.log('Importación de archivo GraficaLineal ¡Exitosa!:', allGraficaLineal);
        
    } catch (err) { // para mostrar errores en consola
        console.error(err);
    }
}

main();