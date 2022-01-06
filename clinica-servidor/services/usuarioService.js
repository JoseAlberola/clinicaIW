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
        
        var query2 = "INSERT INTO usuario (`email`, `password`, `nombre`, `tipo`) VALUES ('" + usuario.getEmail + "', '" + 
            usuario.getPassword + "', '" + usuario.getNombre + "', '" + usuario.getTipo + "');";

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
                        mensaje: "Usuario creado correctamente"
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
                    console.log("Login correcto");
                    usuario.setId = result[0].id;
                    usuario.setEmail = result[0].email;
                    usuario.setNombre = result[0].nombre;
                    usuario.setTipo = result[0].tipo;
                    var token = generaToken(usuario)
                    guardarAutenticacionCliente(usuario, token);
                    res.status(201).location('http://localhost:3000/clinica/usuarios/' + usuario.getId).send({
                        accessToken: token,
                        id: usuario.getId,
                        email: usuario.getEmail,
                        nombre: usuario.getNombre,
                        tipo: usuario.getTipo,
                        mensaje: "Login correcto"});
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
                console.log
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
   
        connection.query("SELECT * FROM reserva where fecha='" + date + "' AND emailfisio='"+email+"' ;"
        , function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).send({error:err});
            }else{
                console.log("Hay "+result.length+ " citas");
                res.status(200).send(result);
            }
        });

    }

}

module.exports = UsuarioService;