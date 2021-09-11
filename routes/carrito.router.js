const express = require('express')
const router = express.Router()
const fs = require('fs')



router.get('/',(req,res)=>{
    fs.promises.readFile('productos.txt').then(data =>{
        const products = {
            items: [{}]
        }

        const json = JSON.parse(data.toString('utf-8'));
        products.items = json
        res.render('carrito', products)
        
      
     }).catch(err=>{
        console.log(err)
     })
})    

module.exports = router;