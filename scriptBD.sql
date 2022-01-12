CREATE SCHEMA `clinicaiw`;

CREATE USER 'iw'@'%' IDENTIFIED BY 'password';

GRANT ALL PRIVILEGES ON clinicaiw.* TO 'iw'@'%';
ALTER USER 'iw' IDENTIFIED WITH mysql_native_password BY 'password';

CREATE TABLE `clinicaiw`.`tipousuario` (
  `tipo` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`tipo`));

CREATE TABLE `clinicaiw`.`usuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `nombre` VARCHAR(255) NOT NULL,
  `tipo` VARCHAR(255) NOT NULL,
  `telefono` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  INDEX `tipo_idx` (`tipo` ASC) VISIBLE,
  CONSTRAINT `tipo`
    FOREIGN KEY (`tipo`)
    REFERENCES `clinicaiw`.`tipousuario` (`tipo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
    
ALTER TABLE `clinicaiw`.`usuario` 
ADD COLUMN `imagen` VARCHAR(255) NULL AFTER `tipo`;

CREATE TABLE `clinicaiw`.`sala` (
  `nombre` VARCHAR(255) NOT NULL,
  `idusuario` INT NOT NULL,
  PRIMARY KEY (`nombre`),
  UNIQUE INDEX `idusuario_UNIQUE` (`idusuario` ASC) VISIBLE,
  CONSTRAINT `idusuario`
    FOREIGN KEY (`idusuario`)
    REFERENCES `clinicaiw`.`usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `clinicaiw`.`maquina` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `clinicaiw`.`reserva` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATE NOT NULL,
  `hora` INT NOT NULL,
  `emailcliente` VARCHAR(255) NOT NULL,
  `emailfisio` VARCHAR(255) NOT NULL,
  `emailrecepcionista` VARCHAR(255) NULL,
  `idmaquina` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `emailcliente_idx` (`emailcliente` ASC) VISIBLE,
  INDEX `emailfisio_idx` (`emailfisio` ASC) VISIBLE,
  INDEX `idmaquina_idx` (`idmaquina` ASC) VISIBLE,
  CONSTRAINT `emailcliente`
    FOREIGN KEY (`emailcliente`)
    REFERENCES `clinicaiw`.`usuario` (`email`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `emailfisio`
    FOREIGN KEY (`emailfisio`)
    REFERENCES `clinicaiw`.`usuario` (`email`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `emailrecepcionista`
    FOREIGN KEY (`emailrecepcionista`)
    REFERENCES `clinicaiw`.`usuario` (`email`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `idmaquina`
    FOREIGN KEY (`idmaquina`)
    REFERENCES `clinicaiw`.`maquina` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `clinicaiw`.`horario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `horainicio` INT NOT NULL,
  `horafin` INT NOT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `clinicaiw`.`festivo` (
  `fecha` DATE NOT NULL,
  PRIMARY KEY (`fecha`));