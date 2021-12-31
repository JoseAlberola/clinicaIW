const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const secretKey = 'vAwH6sLmpNWzRqIqCc7rdxs01lwHzf43';
const iv = crypto.randomBytes(16);

const encrypt = (text) => {

    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

const decrypt = (hash) => {

    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

    return decrpyted.toString();
};

const concatenarPartesClave = (hash) => {
    return hash.iv + hash.content;
}

const transformarClaveAHash = (texto) => {
    return {
        iv: texto.substr(0, 32),
        content: texto.substr(32, 56)
    };
}

module.exports = {
    encrypt,
    decrypt,
    concatenarPartesClave,
    transformarClaveAHash
};

/* EJEMPLO USO

app.get('/jose', function(req, res) {
    const hash = encrypt('Hello World!');
    console.log(hash);

    var concatenacion = concatenarPartesClave(hash);
    console.log("Concatenacion: " + concatenacion);
    
    var transformacion = transformarClaveAHash(concatenacion); 
    console.log(transformacion);

    const text = decrypt(hash);
    console.log(text); // Hello World!

    const text2 = decrypt(transformacion);
    console.log(text2); // Hello World!
});

*/