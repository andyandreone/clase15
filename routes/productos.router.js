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
  constructor (title, price, thumbnail) {
      this.id = productos.length+1
      this.title = title
      this.price = price
      this.thumbnail = thumbnail
  }
}

router.post("/guardar",(req, res) => {
    let title = req.body.title
    let price = parseInt(req.body.price)
    let thumbnail = req.body.thumbnail
    let producto = new Producto(title, price, thumbnail)     
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

router.get("/actualizar/:id",(req,res)=>{
    res.render('modificarProducto', isAdmin)
})

router.put("/actualizar/:id", (req, res) => {
    try {
         fs.readFile('productos.txt','utf-8',(err, data)=>{
        data = data.toString('utf-8')
        data = JSON.parse(data)
        let id = parseInt(req.params.id)
        data[id] = {
            "id": parseInt(id),
            "title": req.query.title,
            "price": parseInt(req.query.price),
            "thumbnail": req.query.thumbnail
        }
        res.status(200).json(data[id - 1])
        fs.promises
                 .writeFile('productos.txt',JSON.stringify(data, null, '\t'))
                 .then(_=>{
                     console.log("actualizado con exito");
                 })
      });
    } catch(err){
        throw new Error(err)
    }
    res.redirect('/productos/listar');
})

module.exports = router;