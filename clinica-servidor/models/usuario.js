// Conexión con servicio
const UsuarioService = require('../services/usuarioService.js');

// Conexión con fichero de encriptación
const { encrypt, decrypt, concatenarPartesClave, transformarClaveAHash} = require('../crypto.js');

class Usuario {
    constructor(email, password, nombre, tipo, telefono){
        this.email = email;
        this.password = password;
        this.nombre = nombre;
        this.tipo = tipo;
        this.telefono = telefono;
        this.imagen = null;
    }

    registrar(res){
        var hash = encrypt(this.getPassword);
        var partesHashUnidas = concatenarPartesClave(hash); 
        this.setPassword = partesHashUnidas;

        var usuarioService = new UsuarioService();
        usuarioService.registrar(this, res);
    }

    registrarTrabajador(res){
        var hash = encrypt(this.getPassword);
        var partesHashUnidas = concatenarPartesClave(hash); 
        this.setPassword = partesHashUnidas;

        var usuarioService = new UsuarioService();
        usuarioService.registrarTrabajador(this, res);
    }

    login(res){
        if(this.getEmail == undefined || this.getPassword == undefined){
            res.status(400).send("Petición incorrecta");
        }else{
            var usuarioService = new UsuarioService();
            usuarioService.login(this, res);
        }
    }

    async existeUsuario(){
        var usuarioService = new UsuarioService();
        var resultado = await usuarioService.existeUsuario(this);
        return resultado;
    }

    eliminarUsuario(idUsuario, res){
        var usuarioService = new UsuarioService();
        usuarioService.eliminarUsuario(idUsuario, res);
    }

    modificarUsuario(res){
        var usuarioService = new UsuarioService();
        usuarioService.modificarUsuario(this, res);
    }

    listarTodos(res){
        var usuarioService = new UsuarioService();
        usuarioService.listarTodos(res);
    }

    listarMaquinas(res){
        var usuarioService = new UsuarioService();
        usuarioService.listarMaquinas(res);
    }

    listarSalas(res){
        var usuarioService = new UsuarioService();
        usuarioService.listarSalas(res);
    }

    listarFisios(res, limit, offset){
        var usuarioService = new UsuarioService();
        usuarioService.listarFisios(res, limit, offset);
    }

    datosId(res){
        var usuarioService = new UsuarioService();
        usuarioService.usuarioId(res, this.getId); 
    }

    findByEmail(res){
        var usuarioService = new UsuarioService();
        console.log(this.email);
        usuarioService.findByEmail(res, this.getEmail); 
    }

    citasEmailFecha(res, date){
        var usuarioService = new UsuarioService();
        usuarioService.listarCitasEmailFecha(res,date, this.getEmail); 
    }

    comprobarReservaMaquina(res, idMaquina, date){
        var usuarioService = new UsuarioService();
        usuarioService.comprobarReservaMaquina(res, idMaquina, date); 
    }

    comprobarReservaSala(res, idSala, date){
        var usuarioService = new UsuarioService();
        usuarioService.comprobarReservaSala(res, idSala, date); 
    }

    reservarCitasUser(res,date ,hora, cliente){
        var usuarioService = new UsuarioService();
        usuarioService.ReservarCitasUser(res, this.getEmail, date, hora, cliente); 
    }

    reservarMaquina(res, idReserva, idMaquina){
        var usuarioService = new UsuarioService();
        usuarioService.ReservarMaquina(res, idReserva, idMaquina); 
    }

    reservarSala(res, idReserva, idSala){
        var usuarioService = new UsuarioService();
        usuarioService.ReservarSala(res, idReserva, idSala); 
    }

    reservarCitasRecepcionista(res,date ,hora, cliente,recepcionista){
        var usuarioService = new UsuarioService();
        usuarioService.ReservarCitasRecepcionista(res, this.getEmail, date, hora, cliente,recepcionista); 
    }

    listadoFisios(res, limit, offset){
        var usuarioService = new UsuarioService();
        usuarioService.listadoFisios(res, limit, offset);
    }

    listarUsuarios(res){
        var usuarioService = new UsuarioService();
        usuarioService.listarUsuarios(res);
    }

    listarReservas(res, email){
        var usuarioService = new UsuarioService();
        usuarioService.listarReservas(res,email);
    }

    cancelarReserva(res,email,dia,hora){
        var usuarioService = new UsuarioService();
        usuarioService.cancelarReserva(res,email,dia,hora);
    }

    cambiarEmail(res,email,nuevoEmail){
        //console.log("Usuario");
        var usuarioService = new UsuarioService();
        usuarioService.cambiarEmail(res,email, nuevoEmail);
    }

    cambiarTelefono(res,email,telefono){
        //console.log("Usuario");
        var usuarioService = new UsuarioService();
        usuarioService.cambiarTelefono(res,email, telefono);
    }

    cambiarNombre(res,email,nombre){
        //console.log("Usuario");
        var usuarioService = new UsuarioService();
        usuarioService.cambiarNombre(res,email, nombre);
    }

    crearFestivo(res,date){
        var usuarioService = new UsuarioService();
        usuarioService.crearFestivo(res, date); 
    }

    informesClientes(res){
        var usuarioService = new UsuarioService();
        usuarioService.informesClientes(res);
    }

    informesFisios(res){
        var usuarioService = new UsuarioService();
        usuarioService.informesFisios(res);
    }

    get getId(){
        return this.id;
    }

    get getEmail(){
        return this.email;
    }
    
    get getPassword(){
        return this.password;
    }

    get getNombre(){
        return this.nombre;
    }

    get getTipo(){
        return this.tipo;
    }

    get getTelefono(){
        return this.telefono;
    }

    get getImagen(){
        return this.imagen;
    }

    set setId(nuevoId){
        this.id = nuevoId;
    }

    set setEmail(nuevoEmail){
        this.email = nuevoEmail;
    }
    
    set setPassword(nuevaPassword){
        this.password = nuevaPassword;
    }

    set setNombre(nuevoNombre){
        this.nombre = nuevoNombre;
    }

    set setTipo(nuevoTipo){
        this.tipo = nuevoTipo;
    }

    set setTelefono(nuevoTipo){
        this.telefono = nuevoTipo;
    }

    set setImagen(nuevoTipo){
        this.imagen= nuevoTipo;
    }

}
module.exports = Usuario;