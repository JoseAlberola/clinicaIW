export default class Usuario {
    constructor(email, password, nombre, tipo){
        this.email = email;
        this.password = password;
        this.nombre = nombre;
        this.tipo = tipo;
        this.telefono = null;
        this.imagen = null;
    }
}