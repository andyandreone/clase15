const express = require('express')
const app = express()
const fs = require('fs')
const handlebars = require('express-handlebars')
const productos = require('./routes/productos.router')
const carrito = require('./routes/carrito.router')

app.listen(process.env.PORT || 8080,()=>{
    console.log('Escuchando en puerto 8080')
})


app.use('/static', express.static(__dirname + '/public'));

//ROUTES
app.use("/productos", productos)
app.use("/carrito", carrito)


//MOTOR DE HANDLEBARS
app.engine(
    "hbs",
    handlebars({
        extname:".hbs",
        defaultLayout:'index.hbs',
        layoutsDir: __dirname + "/views/layouts",
    })
)

app.set('view engine', 'hbs');

