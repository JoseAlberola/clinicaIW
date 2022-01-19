const { response } = require('express');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// Conexión con Modelos
const Usuario = require('../models/usuario.js');
const Festivo = require('../models/festivo.js');

// Autenticacion Tokens
const { chequeaJWT, chequeaAdmin } = require('../authentication.js');

// Definimos los tipos de usuarios
const TipoUsuario = Object.freeze({"ADMINISTRADOR":"administrador", "FISIO":"fisio", "RECEPCIONISTA":"recepcionista", "USUARIO":"usuario"});

app.get('/', function(req, res) {
    res.send('Bienvenid@ a la clínica!');
});

app.post('/registro', function(req, res) {
    var nuevoUsuario = req.body;
    var usuario = new Usuario(nuevoUsuario.email, nuevoUsuario.password, nuevoUsuario.nombre, TipoUsuario.USUARIO, nuevoUsuario.telefono);
    
    if(usuario.getEmail == undefined || usuario.getPassword == undefined || usuario.getNombre == undefined || usuario.getTelefono == undefined){
        res.status(400).send("Petición incorrecta");
    }else{
        usuario.registrar(res);
    }
});

app.post('/registroTrabajador', chequeaJWT, chequeaAdmin, function(req, res) {
    var nuevoUsuario = req.body;
    var usuario = new Usuario(nuevoUsuario.email, nuevoUsuario.password, nuevoUsuario.nombre, nuevoUsuario.tipo, nuevoUsuario.telefono);
    
    if(usuario.getEmail == undefined || usuario.getPassword == undefined || usuario.getNombre == undefined || usuario.getTipo == undefined || usuario.getTelefono == undefined){
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

app.put('/usuarios/:idUsuario', chequeaJWT, chequeaAdmin, async function(req, res) {
    var usuario = new Usuario(); 
    usuario.setId = req.params.idUsuario;
    usuario.setEmail = req.body.email;
    usuario.setNombre = req.body.nombre;
    usuario.setTelefono = req.body.telefono

    try{
        var existeUsuario = await usuario.existeUsuario();
        if(!existeUsuario){
            res.status(404).send("No existe ese usuario.");
        }else if(usuario.getId == undefined || usuario.getEmail == undefined || usuario.getNombre == undefined || usuario.getTelefono == undefined){
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

app.get('/maquinas', chequeaJWT, function(req, res) {
    try{
        var usuario = new Usuario();
        usuario.listarMaquinas(res);
    }catch(error){
        res.status(500).send({error:error});
    }
});

app.get('/salas', chequeaJWT, function(req, res) {
    try{
        var usuario = new Usuario();
        usuario.listarSalas(res);
    }catch(error){
        res.status(500).send({error:error});
    }
});

app.get('/usuarios/:usuarioEmail', chequeaJWT, function(req, res) {
    var usuarioEmail = req.params.usuarioEmail;
    console.log(usuarioEmail);

    try{
        var usuario = new Usuario();
        usuario.email = usuarioEmail;
        usuario.findByEmail(res);
    }catch(error){
        
        res.status(500).send({error:error});
    }
})

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

app.get('/reservaMaquina/:idMaquina/:fecha', chequeaJWT, function(req, res) {
    var idMaquina = req.params.idMaquina;
    var date = req.params.fecha;

    try{
        var usuario = new Usuario();
        usuario.comprobarReservaMaquina(res, idMaquina, date);
    }catch(error){console.log(error);
        res.status(500).send({error:error});
    }
})

app.get('/reservaSala/:idSala/:fecha', chequeaJWT, function(req, res) {
    var idSala = req.params.idSala;
    var date = req.params.fecha;

    try{
        var usuario = new Usuario();
        usuario.comprobarReservaSala(res, idSala, date);
    }catch(error){console.log(error);
        res.status(500).send({error:error});
    }
})


app.post('/reservar', chequeaJWT,  function(req, res) {

    var body = req.body;

    var fisio = new Usuario();
    fisio.email = body.fisio;

    fisio.reservarCitasUser(res,body.Fecha,body.hora,body.usuario, body.pago);
});


app.post('/reservarMaquina', chequeaJWT,  function(req, res) {

    var body = req.body;

    var fisio = new Usuario();
    fisio.email = body.fisio;

    fisio.reservarMaquina(res,body.idReserva, body.idMaquina);
});

app.post('/reservarSala', chequeaJWT,  function(req, res) {

    var body = req.body;

    var fisio = new Usuario();
    fisio.email = body.fisio;

    fisio.reservarSala(res,body.idReserva, body.idSala);
});


app.get('/listadofisios', chequeaJWT, function(req, res) {
    try{
        var usuario = new Usuario();
        usuario.listadoFisios(res);
    }catch(error){
        res.status(500).send({error:error});
    }
});

app.get('/listadoclientes', chequeaJWT, function(req, res) {
    try{
        var usuario = new Usuario();
        usuario.listarUsuarios(res);
    }catch(error){
        res.status(500).send({error:error});
    }
});

app.post('/reservarRecepcionista', chequeaJWT,  function(req, res) {
//console.log("hola");
    var body = req.body;

    var fisio = new Usuario();
    fisio.email = body.fisio;

    fisio.reservarCitasRecepcionista(res,body.Fecha,body.hora,body.usuario,body.recepcionista);
});

app.get('/citasUsuario/:email', chequeaJWT, function(req, res) {
    
    try{
        var usuario = new Usuario();
        usuario.email = req.params.email;
        //console.log(req.params.email);
        //console.log("sfdgdfg");
        usuario.listarReservas(res,req.params.email);
    }catch(error){
        console.log(error);
        res.status(500).send({error:error});
    }
});

app.delete('/cancelarReserva/:email/:fecha/:hora', chequeaJWT, async function(req, res) {
    
    try{
        //console.log("aqui");
        var usuario = new Usuario();
        usuario.email = req.params.email;
        usuario.cancelarReserva(res,req.params.email,req.params.fecha,req.params.hora);
    }catch(error){
        //console.log("aqui2");
        console.log(error);
        res.status(500).send({error:error});
    }
});

app.put('/cambiarEmail/:email/:nuevoemail', chequeaJWT, async function(req, res) {
    var usuario = new Usuario(); 
    usuario.email= req.params.email;
    //console.log("aqui rutas 1");
    try{
        //console.log("aqui rutas 2");
        if(req.params.nuevoemail == "" || req.params.nuevoemail == undefined || req.params.nuevoemail == null){
            res.status(400).send("Petición incorrecta");
        }else{
            //console.log("aqui rutas 3");
            usuario.cambiarEmail(res,req.params.email,req.params.nuevoemail);
        }
    }catch(error){
        res.status(500).send({error:error});
    }
});

app.put('/cambiarTelefono/:email/:telefono', chequeaJWT, async function(req, res) {
    var usuario = new Usuario(); 
    usuario.email= req.params.email;
    //console.log("aqui rutas 1");
    try{
        //console.log("aqui rutas 2");
        if(req.params.telefono == "" || req.params.telefono == undefined || req.params.telefono == null){
            res.status(400).send("Petición incorrecta");
        }else{
            //console.log("aqui rutas 3");
            usuario.cambiarTelefono(res,req.params.email,req.params.telefono);
        }
    }catch(error){
        res.status(500).send({error:error});
    }
});

app.put('/cambiarNombre/:email/:nombre', chequeaJWT, async function(req, res) {
    var usuario = new Usuario(); 
    usuario.email= req.params.email;
    //console.log("aqui rutas 1");
    try{
        //console.log("aqui rutas 2");
        if(req.params.nombreS == "" || req.params.nombre == undefined || req.params.nombre == null){
            res.status(400).send("Petición incorrecta");
        }else{
            //console.log("aqui rutas 3");
            usuario.cambiarNombre(res,req.params.email,req.params.nombre);
        }
    }catch(error){
        res.status(500).send({error:error});
    }
});


app.post('/crearFestivo', chequeaJWT,  function(req, res) {

    var body = req.body;

    var festivo = new Festivo();
    var date = body.dia;

    festivo.crearFestivo(res,date);
});

app.get('/festivos', chequeaJWT, chequeaAdmin, function(req, res) {
    try{
        var festivo = new Festivo();
        festivo.listarTodos(res);
    }catch(error){
        res.status(500).send({error:error});
    }
});

app.delete('/festivos/:fecha', chequeaJWT, chequeaAdmin, async function(req, res) {
    var fecha = req.params.fecha;
    var festivo = new Festivo(fecha);

    var existeFestivo = await festivo.existeFestivo();  
    if(existeFestivo){
        festivo.eliminarFestivo(fecha, res);
    }else{
        res.status(404).send("Ese festivo NO EXISTE.");
    }
});

app.put('/festivos/:fecha', chequeaJWT, chequeaAdmin, async function(req, res) {
    var festivoAntiguo = new Festivo(req.params.fecha); 
    var festivoNuevo = new Festivo(req.body.fecha);
    
    try{
        var existeFestivo = await festivoAntiguo.existeFestivo();
        if(!existeFestivo){
            res.status(404).send("No existe ese festivo.");
        }else if(festivoNuevo.getFecha == undefined){
            res.status(400).send("Petición incorrecta");
        }else{
            festivoAntiguo.modificarFestivo(festivoNuevo, res);
        }
    }catch(error){
        res.status(500).send({error:error});
    }
});

app.get('/informes/clientes', chequeaJWT, chequeaAdmin, function(req, res) {
    try{
        var usuario = new Usuario();
        usuario.informesClientes(res);
    }catch(error){
        res.status(500).send({error:error});
    }
});

app.get('/informes/fisios', chequeaJWT, chequeaAdmin, function(req, res) {
    try{
        var usuario = new Usuario();
        usuario.informesFisios(res);
    }catch(error){
        res.status(500).send({error:error});
    }
});

module.exports = app;

