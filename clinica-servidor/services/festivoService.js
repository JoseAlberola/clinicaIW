// Importación fichero de conexión con BD
const { connection } = require('./conexionBD');

class FestivoService {

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

    async listarTodos(res){
        connection.query("SELECT * FROM festivo ORDER BY fecha ASC;"
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

    existeFestivo(festivo){
        return new Promise(function(resolve, reject){
            var query = "SELECT * FROM festivo WHERE fecha='" + festivo.getFecha + "'";
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

    eliminarFestivo(fecha, res){
        var query = "DELETE FROM festivo WHERE fecha='" + fecha + "'";
        connection.query(query, function (err, result) {
            if (err) {
                res.status(500).send({mensaje:err});
            }
            res.status(204).send({mensaje:"Festivo eliminado"});
        });
    }

    modificarFestivo(festivoAntiguo, festivoNuevo, res){
        var query = "UPDATE festivo SET `fecha`='" + festivoNuevo.getFecha + "' WHERE fecha='" + festivoAntiguo.getFecha + "'";

        connection.query(query, function (err, result) {
            if (err) {
                res.status(500).send({error:err});
            }
            res.status(204).send("Festivo modificado.");
        });
    }

}

module.exports = FestivoService;