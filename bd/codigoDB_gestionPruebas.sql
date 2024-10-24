-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema GestionPruebas
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema GestionPruebas
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `GestionPruebas` DEFAULT CHARACTER SET utf8mb4 ;
USE `GestionPruebas` ;

-- -----------------------------------------------------
-- Table `GestionPruebas`.`puesto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `GestionPruebas`.`puesto` (
  `idPuesto` INT NOT NULL AUTO_INCREMENT,
  `puesto` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idPuesto`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `GestionPruebas`.`personal`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `GestionPruebas`.`personal` (
  `idPersonal` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `apellido` VARCHAR(45) NOT NULL,
  `telefono` VARCHAR(8) NOT NULL,
  `correo` VARCHAR(45) NOT NULL,
  `idPuesto` INT NOT NULL,
  PRIMARY KEY (`idPersonal`),
  INDEX `fk_personal_puesto1_idx` (`idPuesto` ASC) VISIBLE,
  CONSTRAINT `fk_personal_puesto1`
    FOREIGN KEY (`idPuesto`)
    REFERENCES `GestionPruebas`.`puesto` (`idPuesto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `GestionPruebas`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `GestionPruebas`.`usuario` (
  `idUsuario` INT NOT NULL AUTO_INCREMENT,
  `usuario` VARCHAR(45) NOT NULL,
  `contrasena` VARCHAR(255) NOT NULL,
  `idPersonal` INT NOT NULL,
  PRIMARY KEY (`idUsuario`),
  INDEX `fk_Usuario_personal_idx` (`idPersonal` ASC) VISIBLE,
  UNIQUE INDEX `usuario_UNIQUE` (`usuario` ASC) VISIBLE,
  CONSTRAINT `fk_Usuario_personal`
    FOREIGN KEY (`idPersonal`)
    REFERENCES `GestionPruebas`.`personal` (`idPersonal`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `GestionPruebas`.`prueba`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `GestionPruebas`.`prueba` (
  `idPrueba` INT NOT NULL AUTO_INCREMENT,
  `tipoPrueba` VARCHAR(45) NOT NULL,
  `descripcion` VARCHAR(800) NOT NULL,
  `duracionPrueba` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idPrueba`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `GestionPruebas`.`proyecto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `GestionPruebas`.`proyecto` (
  `idProyecto` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `descripcion` VARCHAR(1000) NOT NULL,
  `fechaInicio` VARCHAR(10) NOT NULL,
  `fechaEntrega` VARCHAR(10) NOT NULL,
  `idUsuario` INT NOT NULL,
  PRIMARY KEY (`idProyecto`),
  INDEX `fk_proyecto_Usuario1_idx` (`idUsuario` ASC) VISIBLE,
  CONSTRAINT `fk_proyecto_Usuario1`
    FOREIGN KEY (`idUsuario`)
    REFERENCES `GestionPruebas`.`usuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `GestionPruebas`.`regPrueba`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `GestionPruebas`.`regPrueba` (
  `idRegPrueba` INT NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(1000) NOT NULL,
  `fechaReg` VARCHAR(10) NOT NULL,
  `idPrueba` INT NOT NULL,
  `idProyecto` INT NOT NULL,
  PRIMARY KEY (`idRegPrueba`),
  INDEX `fk_regPrueba_prueba1_idx` (`idPrueba` ASC) VISIBLE,
  INDEX `fk_regPrueba_proyecto1_idx` (`idProyecto` ASC) VISIBLE,
  CONSTRAINT `fk_regPrueba_prueba1`
    FOREIGN KEY (`idPrueba`)
    REFERENCES `GestionPruebas`.`prueba` (`idPrueba`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_regPrueba_proyecto1`
    FOREIGN KEY (`idProyecto`)
    REFERENCES `GestionPruebas`.`proyecto` (`idProyecto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `GestionPruebas`.`tipoResultado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `GestionPruebas`.`tipoResultado` (
  `idTResultado` INT NOT NULL AUTO_INCREMENT,
  `tResultado` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idTResultado`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `GestionPruebas`.`resulPrueba`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `GestionPruebas`.`resulPrueba` (
  `idResulPrueba` INT NOT NULL AUTO_INCREMENT,
  `descResultado` VARCHAR(1000) NOT NULL,
  `fechaRealiz` VARCHAR(10) NOT NULL,
  `idRegPrueba` INT NOT NULL,
  `idTResultado` INT NOT NULL,
  PRIMARY KEY (`idResulPrueba`),
  INDEX `fk_resulPrueba_regPrueba1_idx` (`idRegPrueba` ASC) VISIBLE,
  INDEX `fk_resulPrueba_tipoResultado1_idx` (`idTResultado` ASC) VISIBLE,
  CONSTRAINT `fk_resulPrueba_regPrueba1`
    FOREIGN KEY (`idRegPrueba`)
    REFERENCES `GestionPruebas`.`regPrueba` (`idRegPrueba`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_resulPrueba_tipoResultado1`
    FOREIGN KEY (`idTResultado`)
    REFERENCES `GestionPruebas`.`tipoResultado` (`idTResultado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `GestionPruebas`.`bitacora`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `GestionPruebas`.`bitacora` (
  `idBitacora` INT NOT NULL AUTO_INCREMENT,
  `deTabla` VARCHAR(45) NOT NULL,
  `accion` VARCHAR(45) NOT NULL,
  `horaFecha` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sqlEjecutado` VARCHAR(3000) NOT NULL,
  `sqlRevertir` VARCHAR(3000) NOT NULL,
  PRIMARY KEY (`idBitacora`))
ENGINE = InnoDB;

USE `GestionPruebas` ;

-- -----------------------------------------------------
-- procedure guardarPersonal
-- -----------------------------------------------------

DELIMITER $$
USE `GestionPruebas`$$
CREATE PROCEDURE guardarPersonal(_nombre VARCHAR(45), _apellido VARCHAR(45), _telefono VARCHAR(8), _correo VARCHAR(45), _idPuesto INT)
BEGIN
	INSERT INTO personal(nombre, apellido, telefono, correo, idPuesto) VALUES (_nombre, _apellido, _telefono, _correo, _idPuesto);
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure guardarUsuario
-- -----------------------------------------------------

DELIMITER $$
USE `GestionPruebas`$$
CREATE PROCEDURE guardarUsuario(_usuario VARCHAR(45), _contrasena VARCHAR(255), _idPersonal INT)
BEGIN
	INSERT INTO usuario(usuario, contrasena, idPersonal) VALUES (_usuario, _contrasena, _idPersonal);
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure guardarProyecto
-- -----------------------------------------------------

DELIMITER $$
USE `GestionPruebas`$$
CREATE PROCEDURE guardarProyecto( _nombre VARCHAR(100), _descripcion VARCHAR(1000), _fechaInicio VARCHAR(10), _fechaEntrega VARCHAR(10), _idUsuario INT)
BEGIN
	INSERT INTO proyecto(nombre, descripcion, fechaInicio, fechaEntrega, idUsuario) VALUES (_nombre, _descripcion, _fechaInicio, _fechaEntrega, _idUsuario);
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure guardarRegPrueba
-- -----------------------------------------------------

DELIMITER $$
USE `GestionPruebas`$$
CREATE PROCEDURE guardarRegPrueba(_descripcion VARCHAR(1000), _fechaReg VARCHAR(10), _idPrueba INT, _idProyecto INT)
BEGIN
	INSERT INTO regPrueba(descripcion, fechaReg, idPrueba, idProyecto) VALUES (_descripcion, _fechaReg, _idPrueba, _idProyecto);
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure guardarResulPrueba
-- -----------------------------------------------------

DELIMITER $$
USE `GestionPruebas`$$
CREATE PROCEDURE guardarResulPrueba(_descResultado VARCHAR(1000), _fechaRealiz VARCHAR(10), _idRegPrueba INT, _idTResultado INT)
BEGIN
	INSERT INTO resulPrueba(descResultado, fechaRealiz, idRegPrueba, idTResultado) VALUES (_descResultado, _fechaRealiz, _idRegPrueba, _idTResultado);
END$$

DELIMITER ;

USE `GestionPruebas`;

DELIMITER $$
USE `GestionPruebas`$$
CREATE TRIGGER proyecto_AFTER_INSERT
AFTER INSERT ON proyecto
FOR EACH ROW
BEGIN
	INSERT INTO bitacora(deTabla,accion,sqlEjecutado,sqlRevertir) VALUES(
		'proyecto','insert',
        CONCAT('INSERT INTO proyecto(idProyecto,nombre,descripcion,fechaInicio,fechaFin,idUsuario) VALUES(',NEW.idProyecto,',''',NEW.nombre,''',''',NEW.descripcion,''',''',NEW.fechaInicio,''',''',NEW.fechaEntrega,''',',NEW.idUsuario,');'),
        CONCAT('DELETE FROM proyecto WHERE idProyecto =',NEW.idProyecto,';') 
    );
END$$

USE `GestionPruebas`$$
CREATE TRIGGER proyecto_AFTER_UPDATE
AFTER UPDATE ON proyecto
FOR EACH ROW
BEGIN
	INSERT INTO bitacora(deTabla,accion,sqlEjecutado,sqlRevertir)VALUES(
		'proyecto','update',
        CONCAT('UPDATE proyecto SET nombre =''',NEW.nombre,''',descripcion=''',NEW.descripcion,''',fechaInicio=''',NEW.fechaInicio,''',fechaEntrega=''',NEW.fechaEntrega,''',idUsuario=',NEW.idUsuario,' WHERE idproyecto =',OLD.idProyecto,';'),
        CONCAT('UPDATE proyecto SET nombre =''',OLD.nombre,''',descripcion=''',OLD.descripcion,''',fechaInicio=''',OLD.fechaInicio,''',fechaEntrega=''',OLD.fechaEntrega,''',idUsuario=',OLD.idUsuario,' WHERE idproyecto =',NEW.idProyecto,';')
    );
END$$

USE `GestionPruebas`$$
CREATE TRIGGER proyecto_AFTER_DELETE 
AFTER DELETE ON proyecto 
FOR EACH ROW
BEGIN
	INSERT INTO bitacora(deTabla,accion,sqlEjecutado,sqlRevertir)VALUES(
		'proyecto','delete',
        CONCAT('DELETE FROM proyecto WHERE idProyecto =',OLD.idProyecto,';'),
        CONCAT('INSERT INTO proyecto(idProyecto,nombre,descripcion,fechaInicio,fechaEntrega,idUsuario) VALUES(',OLD.idProyecto,',''',OLD.nombre,''',''',OLD.descripcion,''',''',OLD.fechaInicio,''',''',OLD.fechaEntrega,''',',OLD.idUsuario,');')
    );
END$$

USE `GestionPruebas`$$
CREATE TRIGGER regPrueba_AFTER_INSERT 
AFTER INSERT ON regPrueba 
FOR EACH ROW
BEGIN
	INSERT INTO bitacora(deTabla,accion,sqlEjecutado,sqlRevertir)VALUES(
		'regPrueba','insert',
        CONCAT('INSERT INTO regPrueba(idRegPrueba,descripcion,fecha,idPrueba,idProyecto) VALUES (',NEW.idRegPrueba,',''',NEW.descripcion,''',''',NEW.fechaReg,''',',NEW.idPrueba,',',NEW.idProyecto,');'),
        CONCAT('DELETE FROM regPrueba WHERE idRegPrueba = ',NEW.idRegPrueba,';')
    );
END$$

USE `GestionPruebas`$$
CREATE TRIGGER resultadoEnDesarrollo_AFTER_INSERT
AFTER INSERT ON regPrueba
FOR EACH ROW
BEGIN
	INSERT INTO resulPrueba(descResultado,fechaRealiz,idRegPrueba,idTResultado)VALUES(
		'Prueba en desarrollo',
        CONCAT(NEW.fechaReg),
        CONCAT(NEW.idRegPrueba),
        4
    );
END$$

USE `GestionPruebas`$$
CREATE TRIGGER regPrueba_AFTER_UPDATE 
AFTER UPDATE ON regPrueba
FOR EACH ROW
BEGIN
	INSERT INTO bitacora(deTabla,accion,sqlEjecutado,sqlRevertir)VALUES(
		'regPrueba','update',
        CONCAT('UPDATE regPrueba SET descripcion = ''',NEW.descripcion,''', fecha = ''',NEW.fechaReg,''', idPrueba = ',NEW.idPrueba,', idProyecto = ',NEW.idProyecto,' WHERE idRegPrueba = ',OLD.idRegPrueba,';'),
        CONCAT('UPDATE regPrueba SET descripcion = ''',OLD.descripcion,''', fecha = ''',OLD.fechaReg,''', idPrueba = ',OLD.idPrueba,', idProyecto = ',OLD.idProyecto,' WHERE idRegPrueba = ',NEW.idRegPrueba,';')
    );
END$$

USE `GestionPruebas`$$
CREATE TRIGGER regPrueba_AFTER_DELETE
AFTER DELETE ON regPrueba
FOR EACH ROW
BEGIN
	INSERT INTO bitacora(deTabla,accion,sqlEjecutado,sqlRevertir)VALUES(
    'regPrueba','delete',
    CONCAT('DELETE FROM regPrueba WHERE idRegPrueba = ',OLD.idRegPrueba,';'),
    CONCAT('INSERT INTO regPrueba(idRegPrueba,descripcion,fecha,idPrueba,idProyecto) VALUES (',OLD.idRegPrueba,',''',OLD.descripcion,''',''',OLD.fechaReg,''',',OLD.idPrueba,',',OLD.idProyecto,');')
    );
END$$

USE `GestionPruebas`$$
CREATE TRIGGER resulPrueba_AFTER_INSERT
AFTER INSERT ON resulPrueba
FOR EACH ROW
BEGIN
	INSERT INTO bitacora(deTabla,accion,sqlEjecutado,sqlRevertir)VALUES(
		'resulPrueba','insert',
        CONCAT('INSERT INTO resulPrueba(idResulPrueba,descResultado,fechaRealizada,idRegPrueba,idTResultado) VALUES(',NEW.idResulPrueba,',''',NEW.descResultado,''',''',NEW.fechaRealiz,''',',NEW.idRegPrueba,',',NEW.idTResultado,');'),
        CONCAT('DELETE FROM resulPrueba WHERE idResulPrueba = ',NEW.idResulPrueba,';')
    );
END$$

USE `GestionPruebas`$$
CREATE TRIGGER resulPrueba_AFTER_UPDATE
AFTER UPDATE ON resulPrueba
FOR EACH ROW
BEGIN
	INSERT INTO bitacora(deTabla,accion,sqlEjecutado,sqlRevertir)VALUES(
		'resulPrueba','update',
        CONCAT('UPDATE resulPrueba SET descResultado = ''',NEW.descResultado,''', fechaRealizada = ''',NEW.fechaRealiz,''', idRegPrueba = ',NEW.idRegPrueba,', idTResultado = ',NEW.idTResultado,' WHERE idResulPrueba = ',OLD.idResulPrueba,';'),
        CONCAT('UPDATE resulPrueba SET descResultado = ''',OLD.descResultado,''', fechaRealizada = ''',OLD.fechaRealiz,''', idRegPrueba = ',OLD.idRegPrueba,', idTResultado = ',OLD.idTResultado,' WHERE idResulPrueba = ',NEW.idResulPrueba,';')
    );
END$$

USE `GestionPruebas`$$
CREATE TRIGGER resulPrueba_AFTER_DELETE
AFTER DELETE ON resulPrueba
FOR EACH ROW
BEGIN
	INSERT INTO bitacora(deTabla,accion,sqlEjecutado,sqlRevertir) VALUES (
		'resulPrueba','delete',
        CONCAT('DELETE FROM resulPrueba WHERE idResulPrueba = ',OLD.idResulPrueba,';'),
        CONCAT('INSERT INTO resulPrueba(idResulPrueba,descResultado,fechaRealizada,idRegPrueba,idTResultado) VALUES(',OLD.idResulPrueba,',''',OLD.descResultado,''',''',OLD.fechaRealiz,''',',OLD.idRegPrueba,',',OLD.idTResultado,');')
    );
END$$


DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `GestionPruebas`.`puesto`
-- -----------------------------------------------------
START TRANSACTION;
USE `GestionPruebas`;
INSERT INTO `GestionPruebas`.`puesto` (`idPuesto`, `puesto`) VALUES (1, 'Analista de pruebas');
INSERT INTO `GestionPruebas`.`puesto` (`idPuesto`, `puesto`) VALUES (2, 'Ingeniero de pruebas');
INSERT INTO `GestionPruebas`.`puesto` (`idPuesto`, `puesto`) VALUES (3, 'Gerente de pruebas');
INSERT INTO `GestionPruebas`.`puesto` (`idPuesto`, `puesto`) VALUES (4, 'Ingeniero de automatización de pruebas');

COMMIT;


-- -----------------------------------------------------
-- Data for table `GestionPruebas`.`personal`
-- -----------------------------------------------------
START TRANSACTION;
USE `GestionPruebas`;
INSERT INTO `GestionPruebas`.`personal` (`idPersonal`, `nombre`, `apellido`, `telefono`, `correo`, `idPuesto`) VALUES (1, 'Gustavo Alberto', 'López Tohom', '33040665', 'gustavo@gustavo.com', 1);

COMMIT;


-- -----------------------------------------------------
-- Data for table `GestionPruebas`.`usuario`
-- -----------------------------------------------------
START TRANSACTION;
USE `GestionPruebas`;
INSERT INTO `GestionPruebas`.`usuario` (`idUsuario`, `usuario`, `contrasena`, `idPersonal`) VALUES (1, 'glopez', '$2a$12$V/ErTBSwcDHg7JO9tn6jse6Gwv6s/7q6E/0XUc1IPJ282I5wr4Tz6', 1);

COMMIT;


-- -----------------------------------------------------
-- Data for table `GestionPruebas`.`prueba`
-- -----------------------------------------------------
START TRANSACTION;
USE `GestionPruebas`;
INSERT INTO `GestionPruebas`.`prueba` (`idPrueba`, `tipoPrueba`, `descripcion`, `duracionPrueba`) VALUES (1, 'Pruebas Unitarias', 'Las pruebas unitarias son de muy bajo nivel y se realizan cerca de la fuente de la aplicación. Consisten en probar métodos y funciones individuales de las clases, componentes o módulos que usa tu software. En general, las pruebas unitarias son bastante baratas de automatizar y se pueden ejecutar rápidamente mediante un servidor de integración continua.', '1 Semana');
INSERT INTO `GestionPruebas`.`prueba` (`idPrueba`, `tipoPrueba`, `descripcion`, `duracionPrueba`) VALUES (2, 'Pruebas de Integración', 'Las pruebas de integración verifican que los distintos módulos o servicios utilizados por tu aplicación funcionan bien en conjunto. Por ejemplo, se puede probar la interacción con la base de datos o asegurarse de que los microservicios funcionan bien en conjunto y según lo esperado. Estos tipos de pruebas son más costosos de ejecutar, ya que requieren que varias partes de la aplicación estén en marcha.', '2 Semanas');
INSERT INTO `GestionPruebas`.`prueba` (`idPrueba`, `tipoPrueba`, `descripcion`, `duracionPrueba`) VALUES (3, 'Pruebas Funcionales', 'Las pruebas funcionales se centran en los requisitos empresariales de una aplicación. Solo verifican el resultado de una acción y no comprueban los estados intermedios del sistema al realizar dicha acción.', '1 Semana');
INSERT INTO `GestionPruebas`.`prueba` (`idPrueba`, `tipoPrueba`, `descripcion`, `duracionPrueba`) VALUES (4, 'Pruebas de Extremo a Extremo', 'Las pruebas integrales replican el comportamiento de un usuario con el software en un entorno de aplicación completo. Además, verifican que diversos flujos de usuario funcionen según lo previsto, y pueden ser tan sencillos como cargar una página web o iniciar sesión, o mucho más complejos, como la verificación de notificaciones de correo electrónico, pagos en línea, etc.', '3 Semanas');
INSERT INTO `GestionPruebas`.`prueba` (`idPrueba`, `tipoPrueba`, `descripcion`, `duracionPrueba`) VALUES (5, 'Pruebas de Aceptación', 'Las pruebas de aceptación son pruebas formales que verifican si un sistema satisface los requisitos empresariales. Requieren que se esté ejecutando toda la aplicación durante las pruebas y se centran en replicar las conductas de los usuarios. Sin embargo, también pueden ir más allá y medir el rendimiento del sistema y rechazar cambios si no se han cumplido determinados objetivos.', '1 Semana');
INSERT INTO `GestionPruebas`.`prueba` (`idPrueba`, `tipoPrueba`, `descripcion`, `duracionPrueba`) VALUES (6, 'Pruebas de Rendimiento', 'Las pruebas de rendimiento evalúan el rendimiento de un sistema con una carga de trabajo determinada. Ayudan a medir la fiabilidad, la velocidad, la escalabilidad y la capacidad de respuesta de una aplicación. Por ejemplo, una prueba de rendimiento puede analizar los tiempos de respuesta al ejecutar un gran número de solicitudes, o cómo se comporta el sistema con una cantidad significativa de datos. Puede determinar si una aplicación cumple con los requisitos de rendimiento, localizar cuellos de botella, medir la estabilidad durante los picos de tráfico y mucho más.', '3 Semanas');
INSERT INTO `GestionPruebas`.`prueba` (`idPrueba`, `tipoPrueba`, `descripcion`, `duracionPrueba`) VALUES (7, 'Pruebas de Humo', 'Las pruebas de humo son pruebas básicas que sirven para comprobar el funcionamiento básico de la aplicación. Están concebidas para ejecutarse rápidamente, y su objetivo es ofrecerte la seguridad de que las principales funciones de tu sistema funcionan según lo previsto.', '1 Semana');

COMMIT;


-- -----------------------------------------------------
-- Data for table `GestionPruebas`.`tipoResultado`
-- -----------------------------------------------------
START TRANSACTION;
USE `GestionPruebas`;
INSERT INTO `GestionPruebas`.`tipoResultado` (`idTResultado`, `tResultado`) VALUES (1, 'Exitoso');
INSERT INTO `GestionPruebas`.`tipoResultado` (`idTResultado`, `tResultado`) VALUES (2, 'Fallido');
INSERT INTO `GestionPruebas`.`tipoResultado` (`idTResultado`, `tResultado`) VALUES (3, 'Finalizó con errores');
INSERT INTO `GestionPruebas`.`tipoResultado` (`idTResultado`, `tResultado`) VALUES (4, 'Prueba en desarrollo');

COMMIT;