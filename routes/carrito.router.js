const express = require('express')
const router = express.Router()
const fs = require('fs')



router.get('/listar',(req,res)=>{
        fs.promises.readFile('carrito.txt').then(data =>{
            if(data.length>0){
                const products = {
                    items: [{}]
                }
                const json = JSON.parse(data.toString('utf-8'));
                products.items = json
                console.log(products)
                res.render('carrito', products)
            }else{
                res.send("No hay productos en agregados")
            }
         }).catch(err=>{
            console.log(err)
         })
})    

router.get("/listar/:id", (req, res) => {
    fs.promises.readFile('carrito.txt').then(data =>{
        if(data.length>0){
            const json = JSON.parse(data.toString('utf-8'));
            let item = json[req.params.id]
            const products = {
                items: [
                    item
                ]
            } 
            res.render('productos', products)
        }else{
            res.send("No hay productos en agregados")
        }
       
    }).catch(err=>{
       console.log(err)
    })
 });

let productosCarrtito = [] 
class Carrito {
  constructor (time, product) {
      this.id = productosCarrtito.length+1
      this.time = time
      this.product = product
  }
}

 router.post("/guardar/:id",(req, res) => {
    let time = new Date
    if(fs.existsSync('productos.txt')){
        fs.promises.readFile('productos.txt').then(data =>{
            const json = JSON.parse(data.toString('utf-8'));
            let item = json[req.params.id]
            let carrito = new Carrito(time, item)

            if(fs.existsSync('carrito.txt')){
                fs.promises.readFile('carrito.txt').then(data =>{
                    const json = JSON.parse(data.toString('utf-8'));
                    json.push({...carrito, id: json.length});
                    fs.promises
                    .writeFile('carrito.txt',JSON.stringify(json, null, '\t'))
                    .then(_=>{
                        console.log("agregado con exito");
                        res.json(json)
                    })
                }).catch(err=>{
                    console.log(err)
                })
            }else{
                fs.promises.writeFile(('carrito.txt'), JSON.stringify([{...producto, id:0}]))
            }

         })
    }    
  
        
})



router.delete("/borrar/:id", (req, res) => {
           try {
           fs.readFile('carrito.txt','utf-8',(err, data)=>{
           data = data.toString('utf-8')
           data = JSON.parse(data)
           let id = parseInt(req.params.id)
           res.json(data[id])
           data.splice( id, 1 );
           fs.promises
                    .writeFile('carrito.txt',JSON.stringify(data, null, '\t'))
                    .then(_=>{
                        console.log("Eliminado con exito");
                    })
          });
          } catch(err){
               throw new Error(err)
          }
   
    
})


module.exports = router;