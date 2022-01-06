// Conexión con servicio
const UsuarioService = require('../services/usuarioService.js');

// Conexión con fichero de encriptación
const { encrypt, decrypt, concatenarPartesClave, transformarClaveAHash} = require('../crypto.js');

class Usuario {
    constructor(email, password, nombre, tipo){
        this.email = email;
        this.password = password;
        this.nombre = nombre;
        this.tipo = tipo;
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

    listarFisios(res, limit, offset){
        var usuarioService = new UsuarioService();
        usuarioService.listarFisios(res, limit, offset);
    }

    datosId(res){
        var usuarioService = new UsuarioService();
        usuarioService.usuarioId(res, this.getId); 
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

}
module.exports = Usuario;