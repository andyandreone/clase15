const express = require('express')
const app = express()
const fs = require('fs')
const handlebars = require('express-handlebars')
const productos = require('./routes/productos.router')
const carrito = require('./routes/carrito.router')

app.use("/productos", productos)
app.use("/carrito", carrito)

app.listen(8000,()=>{
    console.log('Escuchando en puerto 8000')
})

//app.use('/static', express.static(__dirname + '/public'));
app.engine(
    "hbs",
    handlebars({
        extname:".hbs",
        defaultLayout:'index.hbs',
        layoutsDir: __dirname + "/views/layouts",
    })
)


app.set('view engine', 'hbs');


