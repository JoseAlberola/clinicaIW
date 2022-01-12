// Importación fichero de conexión con BD
const { connection } = require('./conexionBD');
// Localstorage
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}
// Encriptacion de contraseñas
const { decrypt, transformarClaveAHash } = require('../crypto');
// Autenticacion Tokens
const { generaToken } = require('../authentication.js');

function guardarAutenticacionCliente(usuario, token){
    var user = JSON.stringify(usuario);
    localStorage.setItem("user", user);
    // localStorage.setItem("idUsuario", usuario.getId);
    // localStorage.setItem("emailUsuario", usuario.getEmail);
    // localStorage.setItem("admin", usuario.isAdmin);
    localStorage.setItem("token", token); 
}

class UsuarioService {

    registrar(usuario, res){
        var query1 = "SELECT * from usuario WHERE email='" + usuario.getEmail + "';";
        
        var query2 = "INSERT INTO usuario (`email`, `password`, `nombre`, `tipo`, `telefono`, `imagen`) VALUES ('" + usuario.getEmail + "', '" + 
            usuario.getPassword + "', '" + usuario.getNombre + "', '" + usuario.getTipo + "', '" + usuario.getTelefono + "', '" + usuario.getImagen + "');";

        connection.query(query1, function (err, result) {
            if (err) {
                res.status(500).send({mensaje:err});
                throw err;
            }else if(result.length){
                res.status(400).send({mensaje:"Ese usuario ya existe."});
            }else{
                connection.query(query2, function(error, resultado){
                    if(error) {
                        res.status(500).send({mensaje:error});
                        throw error;
                    }
                    var idInsertado = resultado.insertId;
                    usuario.setId = idInsertado;
                    var token = generaToken(usuario)
                    guardarAutenticacionCliente(usuario, token);
                    res.status(201).location('http://localhost:3000/clinica/usuarios/' + idInsertado).send({
                        accessToken: token,
                        id: usuario.getId,
                        email: usuario.getEmail,
                        nombre: usuario.getNombre,
                        tipo: usuario.getTipo,
                        mensaje: "Usuario creado correctamente",
                        telefono: usuario.getTelefono,
                        imagen: usuario.getImagen
                    });
                });
            }
        });
    }

    login(usuario, res){
        var query = "SELECT * FROM usuario WHERE email='" + usuario.getEmail + "';";

        connection.query(query, function (err, result, fields) {
            if (err) {
                res.status(500).send({mensaje:err});
                throw err;
            }else if(result.length){
                var hash = transformarClaveAHash(result[0].password);
                var passwordDesencriptada = decrypt(hash);
                if(passwordDesencriptada == usuario.getPassword){
                    //console.log("Login correcto2");
                    usuario.setId = result[0].id;
                    usuario.setEmail = result[0].email;
                    usuario.setNombre = result[0].nombre;
                    usuario.setTipo = result[0].tipo;
                    usuario.setImagen = result[0].imagen;
                    //console.log(result[0].imagen);
                    //console.log("sdfgo");
                    //console.log(result[0].telefono);
                    usuario.setTelefono = result[0].telefono;
                    var token = generaToken(usuario)
                    guardarAutenticacionCliente(usuario, token);
                    res.status(201).location('http://localhost:3000/clinica/usuarios/' + usuario.getId).send({
                        accessToken: token,
                        id: usuario.getId,
                        email: usuario.getEmail,
                        nombre: usuario.getNombre,
                        tipo: usuario.getTipo,
                        mensaje: "Login correcto 2",
                        telefono: usuario.getTelefono,
                        imagen: usuario.getImagen
                    });
                }else{
                    res.status(401).send({mensaje:"Login erróneo"});    
                }
            }else{
                res.status(401).send({mensaje:"Login erróneo"});
            }
        });
    }

    existeUsuario(usuario){
        return new Promise(function(resolve, reject){
            var query = "SELECT * FROM usuario WHERE id=" + usuario.getId;
            connection.query(query, function (err, result) {
                if(err){
                    reject(err);
                }else if (result.length) {
                    resolve(true);
                }else{
                    resolve(false);
                }
            });
        });
    }

    eliminarUsuario(idUsuario, res){
        var query = "DELETE FROM usuario WHERE id=" + idUsuario;
        connection.query(query, function (err, result) {
            if (err) {
                res.status(500).send({mensaje:err});
            }
            res.status(204).send({mensaje:"Usuario eliminado"});
        });
    }

    modificarUsuario(usuario, res){
        var query = "UPDATE usuario SET `email`='" + usuario.getEmail + "', `nombre`='" + usuario.getNombre + "' WHERE id=" + usuario.getId;

        connection.query(query, function (err, result) {
            if (err) {
                res.status(500).send({error:err});
            }
            res.status(204).send("Usuario modificado.");
        });
    }

    async listarTodos(res){
        connection.query("SELECT * FROM usuario;"
        , function (err, result) {
            if (err) {
                res.status(500).send({error:err});
            }
            
            if(result.length == 0){
                res.status(500).send({error:err});
            } else{
                res.status(200).send(result);
            }
        });
    }

    async listarFisios(res,  limit, offset){
        connection.query("SELECT id, nombre, imagen, (SELECT COUNT(*) FROM usuario WHERE tipo='fisio') AS total FROM usuario WHERE tipo='fisio' LIMIT " + limit + " OFFSET " + offset
        , function (err, result, fields) {
            if (err) {
                res.status(500).send({error:err});
            }
            
            if(result.length == 0){
                res.status(500).send({error:err});
            } else{

                var pagina = offset/limit;
                var paginaSiguiente = pagina + 1;
                var paginaAnterior;
                var offsetSiguiente = paginaSiguiente * limit;
                var totalRegistros = result[0].total;
                var registros = result.length;
                var urlSiguiente;
                var urlAnterior;

                if(pagina == 0){
                    paginaAnterior = 0;
                }else {
                    paginaAnterior = pagina - 1;
                    urlAnterior = "http://localhost:3000/clinica/fisios?page=" + 
                                    paginaAnterior + "&size=" + limit;
                }

                if(limit<=registros && limit != totalRegistros 
                    && offsetSiguiente<totalRegistros){
                    urlSiguiente = "http://localhost:3000/clinica/fisios?page=" + 
                                    paginaSiguiente + "&size=" + limit;
                }
                
                // metadatos de la paginación
                result.push({
                    resultados_pagina : registros ,
                    total_registros : result[0].total ,
                    url_siguiente: urlSiguiente,
                    url_anterior: urlAnterior,
                });

                for (var index in result){
                    if(index != limit)
                        delete result[index].total;
                }
                res.status(200).send(result);
            }
        });
    }

    usuarioId(res, id){
        connection.query("SELECT * FROM usuario where id='" + id + "';"
        , function (err, result) {
            if (err) {
                //console.log
                res.status(500).send({error:err});
            }
            
            if(result.length == 0){
                res.status(500).send({error:err});
            } else{
                res.status(200).send(result);
            }
        });

    }



    listarCitasEmailFecha(res,date, email) {

        connection.query("SELECT * FROM festivo where fecha='" + date +"' ;"
        , function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).send({error:err});
            }else if(result.length === 0){
                connection.query("SELECT * FROM reserva where fecha='" + date + "' AND emailfisio='"+email+"' ;"
                , function (err, result) {
                    if (err) {
                        console.log(err);
                        res.status(500).send({error:err});
                    }else{
                        res.status(200).send(result);
                    }
                });
            }else{
                res.status(200).send("dia festivo");
            }
        });
    }

    ReservarCitasUser(res, fisio, date, hora, cliente){
        connection.query("INSERT INTO reserva (emailcliente, emailfisio, fecha, hora) VALUES ('" + cliente + "' , '" + fisio + "' , '" + date + "' , '" + hora + "' ) ;"
        , function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).send({error:err});
            }else{
                console.log("Se ha insertado con exito la cita");
                res.status(200).send(result);
            }
        });

    }

    ReservarCitasRecepcionista(res, fisio, date, hora, cliente, recepcionista){
        connection.query("INSERT INTO reserva (emailcliente, emailfisio, emailrecepcionista, fecha, hora) VALUES ('" + cliente + "' , '" + fisio + "' , '" + recepcionista + "' , '" + date + "' , '" + hora + "' ) ;"
        , function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).send({error:err});
            }else{
                console.log("Se ha insertado con exito la cita");
                res.status(200).send(result);
            }
        });

    }

    listadoFisios(res){
        connection.query("SELECT id, email, nombre, imagen FROM usuario WHERE tipo='fisio';"
        , function (err, result) {
            //console.log(err);
            //console.log(result);
            if (err) {
                res.status(500).send({error:err});
            }else{
                res.status(200).send(result);
            }   
        });
    }

    listarUsuarios(res){
        connection.query("SELECT * FROM usuario WHERE tipo='usuario';"
        , function (err, result) {
            
            //console.log(result);
            if (err) {
                res.status(500).send({error:err});
            }else{
                res.status(200).send(result);
            }
        });
    }

    listarReservas(res,email){
        connection.query("SELECT fecha, hora, emailfisio FROM reserva WHERE emailcliente=" + "'" +  email + "'" + " ORDER BY fecha DESC;"
        //connection.query("SELECT fecha, hora, emailfisio FROM reserva WHERE emailcliente=" + "'" +  email + "';"
        , function (err, result) {
            //console.log(err);
            //console.log(result);
            
            if (err) {
                console.log(err);
                res.status(500).send({error:err});
            }else{
                res.status(200).send(result);
            }   
        });
    }

    cancelarReserva(res,email,dia,hora){
        var query = "DELETE FROM reserva WHERE emailcliente=" + "'" + email + "' AND fecha=" + "'" + dia + "' AND hora=" + hora + ";";
        connection.query(query, function (err, result) {
            if (err) {
                res.status(500).send({mensaje:err});
            }
            res.status(204).send({mensaje:"Cita eliminada"});
        });
    }

    cambiarEmail(res,email,nuevoEmail){
        //console.log("Service");
    
            var query = "SELECT COUNT(*) as existe FROM usuario where email=" + "'" + nuevoEmail + "'"  + ";";
                connection.query(query, function (err, result) {
                    if (err) {
                        res.status(500).send({mensaje:err});
                    }else{
                        //console.log(result);
                        //console.log(result.length);
                        const resultado = Object.values(JSON.parse(JSON.stringify(result)));
                        //console.log(resultado[0].existe);
                        if(resultado[0].existe == 0){
                            //console.log("Dentro");
                            try{
                                //console.log("Dentro2");
                                var query = "UPDATE usuario SET email=" + "'" + nuevoEmail + "' where email=" + "'" + email + "'"  + ";";
                                    connection.query(query, function (err, result) {
                                        if (err) {
                                            //console.log("Dentro3");
                                            res.status(500).send({mensaje:err});
                                        }
                                        //console.log("Dentro4");
                                        res.status(204).send({mensaje:err});
                                    });
                            }catch(error){
                                //console.log("Dentro6");
                                res.status(500).send({mensaje:err});
                            }
                        }else{
                            //console.log("Dentro5");
                            res.status(500).send();
                        }
                    }
                });
    }

    cambiarTelefono(res,email,telefono){
        //console.log("Service");
        var query = "UPDATE usuario SET telefono=" + "'" + telefono + "' where email=" + "'" + email + "'"  + ";";
        connection.query(query, function (err, result) {
            if (err) {
                res.status(500).send({mensaje:err});
            }
            res.status(204).send({mensaje:"Telefono Actualizado"});
        });
    }

    cambiarNombre(res,email,nombre){
        //console.log("Service");
        var query = "UPDATE usuario SET nombre=" + "'" + nombre + "' where email=" + "'" + email + "'"  + ";";
        connection.query(query, function (err, result) {
            if (err) {
                res.status(500).send({mensaje:err});
            }
            res.status(204).send({mensaje:"Nombre Actualizado"});
        });
    }

    crearFestivo(res, date){
        connection.query("SELECT * FROM reserva where fecha='" + date +"' ;"
        , function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).send({error:err});
            }else if(result.length === 0){
                connection.query("SELECT * FROM festivo where fecha='" + date +"' ;"
                , function (err, result) {
                    if (err) {
                        console.log(err);
                        res.status(500).send({error:err});
                    }else if(result.length === 0){
                        connection.query("INSERT INTO festivo  (`fecha`) VALUES ('" + date +  "');"
                        , function (err, result) {
                            if (err) {
                                console.log(err);
                                res.status(500).send({error:err});
                            }else{
                                res.status(200).send(result);
                            }
                        });
                    }else{
                        res.status(200).send("dia festivo");
                    }
                });
            }else{
                res.status(200).send("dia con citas");
            }
        });
    }

}

module.exports = UsuarioService;