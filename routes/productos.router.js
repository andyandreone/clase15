const express = require('express')
const router = express.Router()
const fs = require('fs')
const isAdmin = {
    admin: true
}
    

router.use(express.json()); 
router.use(express.urlencoded({ extended: true})); 

router.get('/listar',(req,res)=>{
    fs.promises.readFile('productos.txt').then(data =>{
        const products = {
            items: [{}]
        }
        const json = JSON.parse(data.toString('utf-8'));
        products.items = json
        res.render('productos', products)
     }).catch(err=>{
        console.log(err)
     })
})    

router.get("/listar/:id", (req, res) => {
     fs.promises.readFile('productos.txt').then(data =>{
        const json = JSON.parse(data.toString('utf-8'));
        let item = json[req.params.id]
        const products = {
            items: [
                item
            ]
        } 
        res.render('productos', products)
     }).catch(err=>{
        console.log(err)
     })
  });

router.get("/agregar",(req,res)=>{
    res.render('agregarProducto', isAdmin)
})

let productos = []

class Producto {
  constructor (title, description, code, price, thumbnail, stock, time) {
      this.id = productos.length+1
      this.title = title
      this.description = description
      this.code = code
      this.price = price
      this.thumbnail = thumbnail
      this.stock = stock
      this.time = time
  }
}

router.post("/guardar",(req, res) => {
    let time = new Date
    let code = req.body.code
    let title = req.body.title
    let description = req.body.description
    let price = parseInt(req.body.price)
    let thumbnail = req.body.thumbnail
    let stock = req.body.stock
    let producto = new Producto(title, description,code, price, thumbnail, stock, time)     
        if(fs.existsSync('productos.txt')){
            fs.promises.readFile('productos.txt').then(data =>{
                const json = JSON.parse(data.toString('utf-8'));
                json.push({...producto, id: json.length});
                fs.promises
                .writeFile('productos.txt',JSON.stringify(json, null, '\t'))
                .then(_=>{
                    console.log("agregado con exito");
                })
            }).catch(err=>{
                console.log(err)
            })
        }else{
            fs.promises.writeFile(('productos.txt'), JSON.stringify([{...producto, id:0}]))
        }
    res.redirect('/productos/listar');
})

router.put("/actualizar/:id", (req, res) => {
    
        if(isAdmin.admin==true){
            try {
                fs.readFile('productos.txt','utf-8',(err, data)=>{
                    data = data.toString('utf-8')
                    data = JSON.parse(data)
                    let id = parseInt(req.params.id)
                    data[id] = {
                        "id": parseInt(id),
                        "title": req.query.title,
                        "description" : req.query.description,
                        "code": req.query,code,
                        "price": parseInt(req.query.price),
                        "thumbnail": req.query.thumbnail,
                        "stock": req.query.stock,
                        "time": new Date
                    }
                    res.status(200).json(data[id])
                    fs.promises
                             .writeFile('productos.txt',JSON.stringify(data, null, '\t'))
                             .then(_=>{
                                 console.log("actualizado con exito");
                             })
                  });
                } catch(err){
                    throw new Error(err)
                }
        }else{
            let json={
                "error": "-1",
                "descripcion": {
                    "ruta": req.originalUrl,
                    "metodo": req.method
                }
            }
            res.json(json)
        }
        
})

router.delete("/borrar/:id", (req, res) => {
    if(isAdmin.admin==true){
        try {
            fs.readFile('productos.txt','utf-8',(err, data)=>{
           data = data.toString('utf-8')
           data = JSON.parse(data)
           let id = parseInt(req.params.id)
           res.json(data[id])
           data.splice( id, 1 );
           fs.promises
                    .writeFile('productos.txt',JSON.stringify(data, null, '\t'))
                    .then(_=>{
                        console.log("Eliminado con exito");
                    })
          });
          } catch(err){
               throw new Error(err)
          }
    }else{
        let json={
            "error": "-1",
            "descripcion": {
                "ruta": req.originalUrl,
                "metodo": req.method
            }
        }
        res.json(json)
    }
    
})

module.exports = router;