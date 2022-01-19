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
