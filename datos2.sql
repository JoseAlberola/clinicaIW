INSERT INTO `clinicaiw`.`tipousuario` (`tipo`) VALUES ('administrador');
INSERT INTO `clinicaiw`.`tipousuario` (`tipo`) VALUES ('recepcionista');
INSERT INTO `clinicaiw`.`tipousuario` (`tipo`) VALUES ('fisio');
INSERT INTO `clinicaiw`.`tipousuario` (`tipo`) VALUES ('usuario');

insert into `clinicaiw`.`usuario` (`email`, `password`, `nombre`, `tipo`, `telefono` ) VALUES ('fisio1@gmail.com' , '1234', 'fisio1', 'fisio', '902202122');
insert into `clinicaiw`.`usuario` (`email`, `password`, `nombre`, `tipo`, `telefono` ) VALUES ('admin@gmail.com' , '1234', 'admin', 'administrador', '634447012');
insert into `clinicaiw`.`usuario` (`email`, `password`, `nombre`, `tipo`, `telefono` ) VALUES ('recepcionista@gmail.com' , '1234', 'recepcionista', 'recepcionista', '605233197');
insert into `clinicaiw`.`usuario` (`email`, `password`, `nombre`, `tipo`, `telefono` ) VALUES ('fisio2@gmail.com' , '1234', 'pepe', 'fisio', '639001873');

