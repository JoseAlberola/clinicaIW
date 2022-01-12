const port = 3000
const { response } = require('express');
const express = require('express')
var cors = require('cors')
const app = express()

app.use(cors())

// Conexión con rutas
const rutas = require('./routes/rutas.js')
app.use('/clinica', rutas)

app.use((req, res, next) => {

  // Dominio que tengan acceso (ej. 'http://example.com')
     res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Metodos de solicitud que deseas permitir
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  
  // Encabecedados que permites (ej. 'X-Requested-With,content-type')
     res.setHeader('Access-Control-Allow-Headers', '*');
  
  next();
  })
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})