var jwt = require('jwt-simple')
var moment = require('moment')  // Para trabajar con fechas

const secret = 'OhtpElP3ssGwqds1231Y3tu23O51p3946';
const TIEMPO_EXP_TOKEN_MS = 900000;  

//En una app con autentificación basada en Token, el login genera y devuelve el token
const generaToken = (usuario) => {
    var payload = {
        idUsuario: usuario.getId,
        emailUsuario: usuario.getEmail,
        exp: moment().add(TIEMPO_EXP_TOKEN_MS).unix()
    }

    var token = jwt.encode(payload, secret);
    return token;
};

const chequeaUsuarioLogueado = (idUsuarioToken, idUsuarioLocalStorage) => {
    if(idUsuarioToken == idUsuarioLocalStorage){
        return true;
    }else {
        return false;
    }
}

const usuarioEsAdmin = () => {
    var tipoUsuario = JSON.parse(localStorage.user).tipo;
    if(tipoUsuario == "administrador"){
        return true;
    }else{
        return false;
    }
}

//Middleware: lo pondremos ANTES de procesar cualquier petición que requiera autentificación
const chequeaJWT = (pet, resp, next) => {
    // var token = localStorage.token;
    var token = getTokenFromAuthHeader(pet)
    try{
        var decoded = jwt.decode(token, secret) // Si no lanza excepcion pasamos al siguiente middleware
        next();
    }
    catch(error){
        resp.status(401).send({mensaje: "No estás autentificado."});
        console.log(error);
    }
}

//Middleware: lo pondremos ANTES de procesar cualquier petición que requiera ser ADMINISTRADOR
const chequeaAdmin = (req, resp, next) => {
    if(usuarioEsAdmin()){
        next();
    }else{
        resp.status(403).send({mensaje: "No tienes permiso para esta operación."});
    }
}

//Si en la petición HTTP "pet" existe una cabecera "Authorization"
//con el formato "Authorization: Bearer XXXXXX"  
//devuelve el XXXXXX (en JWT esto sería el token)
function getTokenFromAuthHeader(pet) {
    var cabecera = pet.header('Authorization')
    if (cabecera) {
        //Parte el string por el espacio. Si está, devolverá un array de 2
        //la 2ª pos será lo que hay detrás de "Bearer"
        var campos = cabecera.split(' ')
        if (campos.length>1 && cabecera.startsWith('Bearer')) {
            return campos[1] 
        }
    }
    return undefined
}

module.exports = {
    generaToken,
    chequeaJWT,
    chequeaAdmin,
    getTokenFromAuthHeader
};