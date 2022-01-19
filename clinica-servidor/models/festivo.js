// Conexión con servicio
const FestivoService = require('../services/festivoService.js');

class Festivo {
    constructor(fecha){
        this.fecha = fecha;
    }

    crearFestivo(res,date){
        var festivoService = new FestivoService();
        festivoService.crearFestivo(res, date); 
    }

    listarTodos(res){
        var festivoService = new FestivoService();
        festivoService.listarTodos(res);
    }

    async existeFestivo(){
        var festivoService = new FestivoService();
        var resultado = await festivoService.existeFestivo(this);
        return resultado;
    }

    eliminarFestivo(fecha, res){
        var festivoService = new FestivoService();
        festivoService.eliminarFestivo(fecha, res);
    }

    modificarFestivo(festivoNuevo, res){
        var festivoService = new FestivoService();
        festivoService.modificarFestivo(this, festivoNuevo, res);
    }

    get getId(){
        return this.id;
    }

    get getFecha(){
        return this.fecha;
    }

    set setId(nuevoId){
        this.id = nuevoId;
    }

    set setFecha(nuevaFecha){
        this.fecha = nuevaFecha;
    }
}
module.exports = Festivo;