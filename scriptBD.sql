-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema clinicaiw
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema clinicaiw
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `clinicaiw` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `clinicaiw` ;

CREATE USER 'iw'@'%' IDENTIFIED BY 'password';

GRANT ALL PRIVILEGES ON clinicaiw.* TO 'iw'@'%';
ALTER USER 'iw' IDENTIFIED WITH mysql_native_password BY 'password';


-- -----------------------------------------------------
-- Table `clinicaiw`.`festivo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinicaiw`.`festivo` (
  `fecha` DATE NOT NULL,
  PRIMARY KEY (`fecha`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `clinicaiw`.`horario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinicaiw`.`horario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `horainicio` INT NOT NULL,
  `horafin` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `clinicaiw`.`maquina`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinicaiw`.`maquina` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `clinicaiw`.`tipousuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinicaiw`.`tipousuario` (
  `tipo` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`tipo`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `clinicaiw`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinicaiw`.`usuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `nombre` VARCHAR(255) NOT NULL,
  `tipo` VARCHAR(255) NOT NULL,
  `imagen` VARCHAR(255) NULL DEFAULT NULL,
  `telefono` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  INDEX `tipo_idx` (`tipo` ASC) VISIBLE,
  CONSTRAINT `tipo`
    FOREIGN KEY (`tipo`)
    REFERENCES `clinicaiw`.`tipousuario` (`tipo`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `clinicaiw`.`sala`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinicaiw`.`sala` (
  `id` INT NOT NULL,
  `nombre` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `clinicaiw`.`reserva`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinicaiw`.`reserva` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATE NOT NULL,
  `hora` INT NOT NULL,
  `emailcliente` VARCHAR(255) NOT NULL,
  `emailfisio` VARCHAR(255) NOT NULL,
  `emailrecepcionista` VARCHAR(255) NULL DEFAULT NULL,
  `idmaquina` INT NULL DEFAULT NULL,
  `idsala` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `emailcliente_idx` (`emailcliente` ASC) VISIBLE,
  INDEX `emailfisio_idx` (`emailfisio` ASC) VISIBLE,
  INDEX `idmaquina_idx` (`idmaquina` ASC) VISIBLE,
  INDEX `emailrecepcionista` (`emailrecepcionista` ASC) VISIBLE,
  INDEX `idsala_idx` (`idsala` ASC) VISIBLE,
  CONSTRAINT `emailcliente`
    FOREIGN KEY (`emailcliente`)
    REFERENCES `clinicaiw`.`usuario` (`email`)
    ON UPDATE CASCADE,
  CONSTRAINT `emailfisio`
    FOREIGN KEY (`emailfisio`)
    REFERENCES `clinicaiw`.`usuario` (`email`)
    ON UPDATE CASCADE,
  CONSTRAINT `emailrecepcionista`
    FOREIGN KEY (`emailrecepcionista`)
    REFERENCES `clinicaiw`.`usuario` (`email`)
    ON UPDATE CASCADE,
  CONSTRAINT `idmaquina`
    FOREIGN KEY (`idmaquina`)
    REFERENCES `clinicaiw`.`maquina` (`id`),
  CONSTRAINT `idsala`
    FOREIGN KEY (`idsala`)
    REFERENCES `clinicaiw`.`sala` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 21
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


ALTER TABLE clinicaiw.reserva 
ADD COLUMN pago VARCHAR(255) NULL AFTER idsala;

ALTER TABLE `clinicaiw`.`reserva` 
ADD COLUMN `referencia` VARCHAR(255) NULL DEFAULT NULL AFTER `pago`;

-- -----------------------------------------------------
-- Población de la base de datos
-- -----------------------------------------------------
INSERT INTO `clinicaiw`.`tipousuario` (`tipo`) VALUES ('administrador');
INSERT INTO `clinicaiw`.`tipousuario` (`tipo`) VALUES ('recepcionista');
INSERT INTO `clinicaiw`.`tipousuario` (`tipo`) VALUES ('fisio');
INSERT INTO `clinicaiw`.`tipousuario` (`tipo`) VALUES ('usuario');
INSERT INTO `clinicaiw`.`usuario` (`id`, `email`, `password`, `nombre`, `tipo`, `imagen`, `telefono`) VALUES ('1', 'albaperez@ua', '161ae283fdab5886fe86fd65fe0d647e5fbef6', 'Alba Pérez Álvarez', 'fisio', 'alba.jpg', '674734683');
INSERT INTO `clinicaiw`.`usuario` (`id`, `email`, `password`, `nombre`, `tipo`, `imagen`, `telefono`) VALUES ('2', 'jose@ua', '161ae283fdab5886fe86fd65fe0d647e5fbef6', 'Jose', 'usuario', '', '634574867');
INSERT INTO `clinicaiw`.`usuario` (`id`, `email`, `password`, `nombre`, `tipo`, `imagen`, `telefono`) VALUES ('3', 'miguelgil@ua', '161ae283fdab5886fe86fd65fe0d647e5fbef6', 'Miguel Gil Sánchez', 'fisio', 'miguel.jpg', '689463968');
INSERT INTO `clinicaiw`.`usuario` (`id`, `email`, `password`, `nombre`, `tipo`, `imagen`, `telefono`) VALUES ('4', 'cesarleon@ua', '161ae283fdab5886fe86fd65fe0d647e5fbef6', 'César León Capitán', 'fisio', 'cesar.jpg', '625374947');
INSERT INTO `clinicaiw`.`usuario` (`id`, `email`, `password`, `nombre`, `tipo`, `imagen`, `telefono`) VALUES ('5', 'victorlledo@ua', '161ae283fdab5886fe86fd65fe0d647e5fbef6', 'Víctor Lledó', 'fisio', 'victor.jpg', '643859473');
INSERT INTO `clinicaiw`.`usuario` (`id`, `email`, `password`, `nombre`, `tipo`, `imagen`, `telefono`) VALUES ('6', 'joaquimvaldivia@ua', '161ae283fdab5886fe86fd65fe0d647e5fbef6', 'Joaquim Valdivia Tor', 'fisio', 'joaquim.jpg', '694637178');
INSERT INTO `clinicaiw`.`usuario` (`id`, `email`, `password`, `nombre`, `tipo`, `imagen`, `telefono`) VALUES ('7', 'nicolasmoreno@ua', '161ae283fdab5886fe86fd65fe0d647e5fbef6', 'Nicolás Moreno Fortes', 'fisio', 'nicolas.jpg', '648572984');
INSERT INTO `clinicaiw`.`usuario` (`id`, `email`, `password`, `nombre`, `tipo`, `imagen`, `telefono`) VALUES ('8', 'maria@ua', '161ae283fdab5886fe86fd65fe0d647e5fbef6', 'María del Mar Parrón', 'fisio', 'maria.jpg', '648672131');
UPDATE `clinicaiw`.`usuario` SET `imagen` = 'fotoPerfil.jpg' WHERE (`id` = '2');
INSERT INTO `clinicaiw`.`usuario` (`id`, `email`, `password`, `nombre`, `tipo`, `imagen`, `telefono`) VALUES ('9', 'pedro@ua', '161ae283fdab5886fe86fd65fe0d647e5fbef6', 'Pedro', 'usuario', 'fotoPerfil.jpg', '674243729');
INSERT INTO `clinicaiw`.`usuario` (`id`, `email`, `password`, `nombre`, `tipo`, `imagen`, `telefono`) VALUES ('10', 'alfredo@ua', '161ae283fdab5886fe86fd65fe0d647e5fbef6', 'Alfredo', 'usuario', 'fotoPerfil.jpg', '672345467');
INSERT INTO `clinicaiw`.`usuario` (`id`, `email`, `password`, `nombre`, `tipo`, `imagen`, `telefono`) VALUES ('11', 'alberto@ua', '161ae283fdab5886fe86fd65fe0d647e5fbef6', 'Alberto Frías Cartagena', 'recepcionista', 'alberto.jpg', '687945635');
INSERT INTO `clinicaiw`.`usuario` (`id`, `email`, `password`, `nombre`, `tipo`, `imagen`, `telefono`) VALUES ('12', 'fabiana@ua', '161ae283fdab5886fe86fd65fe0d647e5fbef6', 'Fabiana Michelena', 'recepcionista', 'fabiana.jpg', '645624657');
INSERT INTO `clinicaiw`.`usuario` (`id`, `email`, `password`, `nombre`, `tipo`, `imagen`, `telefono`) VALUES ('13', 'admin@ua', '161ae283fdab5886fe86fd65fe0d647e5fbef6', 'Admin', 'administrador', 'fotoPerfil.jpg', '634523465');
INSERT INTO `clinicaiw`.`sala` (`id`, `nombre`) VALUES ('1', 'Box 1');
INSERT INTO `clinicaiw`.`sala` (`id`, `nombre`) VALUES ('2', 'Box 2');
INSERT INTO `clinicaiw`.`sala` (`id`, `nombre`) VALUES ('3', 'Box 3');
INSERT INTO `clinicaiw`.`sala` (`id`, `nombre`) VALUES ('4', 'Box 4');
INSERT INTO `clinicaiw`.`sala` (`id`, `nombre`) VALUES ('5', 'Box 5');
INSERT INTO `clinicaiw`.`maquina` (`id`, `nombre`) VALUES ('1', 'Elíptica');
INSERT INTO `clinicaiw`.`maquina` (`id`, `nombre`) VALUES ('2', 'Máquina de presoterapia');
INSERT INTO `clinicaiw`.`maquina` (`id`, `nombre`) VALUES ('3', 'Electroestimulador');
INSERT INTO `clinicaiw`.`maquina` (`id`, `nombre`) VALUES ('4', 'Ultrasonidos');
INSERT INTO `clinicaiw`.`maquina` (`id`, `nombre`) VALUES ('5', 'Electrólisis percutanea');
INSERT INTO `clinicaiw`.`maquina` (`id`, `nombre`) VALUES ('6', 'Equipo de diatermia');
INSERT INTO `clinicaiw`.`festivo` (`fecha`) VALUES ('2022-01-25');
INSERT INTO `clinicaiw`.`festivo` (`fecha`) VALUES ('2022-02-10');
INSERT INTO `clinicaiw`.`festivo` (`fecha`) VALUES ('2022-02-22');
INSERT INTO `clinicaiw`.`festivo` (`fecha`) VALUES ('2022-02-27');
INSERT INTO `clinicaiw`.`festivo` (`fecha`) VALUES ('2022-02-25');
INSERT INTO `clinicaiw`.`festivo` (`fecha`) VALUES ('2022-03-12');
INSERT INTO `clinicaiw`.`festivo` (`fecha`) VALUES ('2022-03-17');
INSERT INTO `clinicaiw`.`festivo` (`fecha`) VALUES ('2022-04-25');
INSERT INTO `clinicaiw`.`festivo` (`fecha`) VALUES ('2022-05-15');
INSERT INTO `clinicaiw`.`festivo` (`fecha`) VALUES ('2022-06-18');
INSERT INTO `clinicaiw`.`festivo` (`fecha`) VALUES ('2022-07-14');
