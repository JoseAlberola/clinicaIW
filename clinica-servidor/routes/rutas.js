const { response } = require('express');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// Conexión con Modelos
const Usuario = require('../models/usuario.js');

// Autenticacion Tokens
const { chequeaJWT, chequeaAdmin } = require('../authentication.js');

// Definimos los tipos de usuarios
const TipoUsuario = Object.freeze({"ADMINISTRADOR":"administrador", "FISIO":"fisio", "RECEPCIONISTA":"recepcionista", "USUARIO":"usuario"});

app.get('/', function(req, res) {
    res.send('Bienvenid@ a la clínica!');
});

app.post('/registro', function(req, res) {
    var nuevoUsuario = req.body;
    var usuario = new Usuario(nuevoUsuario.email, nuevoUsuario.password, nuevoUsuario.nombre, TipoUsuario.USUARIO);
    
    if(usuario.getEmail == undefined || usuario.getPassword == undefined || usuario.getNombre == undefined){
        res.status(400).send("Petición incorrecta");
    }else{
        usuario.registrar(res);
    }
});

app.post('/registroTrabajador', chequeaJWT, chequeaAdmin, function(req, res) {
    var nuevoUsuario = req.body;
    var usuario = new Usuario(nuevoUsuario.email, nuevoUsuario.password, nuevoUsuario.nombre, nuevoUsuario.tipo);
    
    if(usuario.getEmail == undefined || usuario.getPassword == undefined || usuario.getNombre == undefined || usuario.getTipo == undefined){
        res.status(400).send("Petición incorrecta");
    }else{
        usuario.registrar(res);
    }
});
  
app.post('/login', function(req, res) {
    var login = req.body;
    var usuario = new Usuario();
    usuario.setEmail = login.email;
    usuario.setPassword = login.password;
    usuario.login(res);
});

app.delete('/usuarios/:idUsuario', chequeaJWT, chequeaAdmin, async function(req, res) {
    var idUsuario = req.params.idUsuario;
    var usuario = new Usuario();
    usuario.setId = idUsuario;

    var existeUsuario = await usuario.existeUsuario();  
    if(existeUsuario){
        usuario.eliminarUsuario(idUsuario, res);
    }else{
        res.status(404).send("El usuario con ese identificador NO EXISTE.");
    }
});

app.put('/usuarios/:idUsuario', chequeaJWT, chequeaAdmin,async function(req, res) {
    var usuario = new Usuario(); 
    usuario.setId = req.params.idUsuario;
    usuario.setEmail = req.body.email;
    usuario.setNombre = req.body.nombre;

    try{
        var existeUsuario = await usuario.existeUsuario();
        if(!existeUsuario){
            res.status(404).send("No existe ese usuario.");
        }else if(usuario.getId == undefined || usuario.getEmail == undefined || usuario.getNombre == undefined){
            res.status(400).send("Petición incorrecta");
        }else{
            usuario.modificarUsuario(res);
        }
    }catch(error){
        res.status(500).send({error:error});
    }
});

app.get('/usuarios', chequeaJWT, chequeaAdmin, function(req, res) {
    try{
        var usuario = new Usuario();
        usuario.listarTodos(res);
    }catch(error){
        res.status(500).send({error:error});
    }
});

app.get('/fisios', chequeaJWT, function(req, res) {
    const {page, size} = req.query;
    
    const limit = size;
    const offset = page * limit;
    try{
        var usuario = new Usuario();
        usuario.listarFisios(res, limit, offset);
    }catch(error){
        res.status(500).send({error:error});
    }
});

app.get('/fisios/:fisioId', chequeaJWT, function(req, res) {
    //console.log("hola");
    var usuarioId = req.params.fisioId;

    try{
        var usuario = new Usuario();
        usuario.id = usuarioId;
        usuario.datosId(res);
    }catch(error){
        res.status(500).send({error:error});
    }
})

app.get('/citas/:fisioEmail/:fecha', chequeaJWT, function(req, res) {
    //console.log("hola");
    var usuarioEmail = req.params.fisioEmail;
    var date = req.params.fecha;

    try{
        var usuario = new Usuario();
        usuario.email = usuarioEmail;
        usuario.citasEmailFecha(res,date);
    }catch(error){console.log(error);
        res.status(500).send({error:error});
    }
})


app.post('/reservar', chequeaJWT,  function(req, res) {

    var body = req.body;

    var fisio = new Usuario();
    fisio.email = body.fisio;

    fisio.reservarCitasUser(res,body.Fecha,body.hora,body.usuario);
});
module.exports = app;

