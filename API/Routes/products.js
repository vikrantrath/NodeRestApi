const express = require('express');
const router  = express.Router();
const Product = require('../Models/Product');
const mongoose = require('mongoose');

const checkAuth = require('../Middleware/check-auth')
//Multer is a middleware that allows up to access Multipart file data i.e images as such
const multer = require('multer');


//defining the storage options that directs to the uploads folder and also sets the name of the images
const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'./uploads/')
    },
    filename: function(req,file,cb){
        cb(null,new Date().toISOString()+file.originalname)
    }
})

//upload uses multer to store the files
const upload = multer({storage:storage})


//Handles Get request coming to fetch all the products available
router.get('/',(req,res,next) => {
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then( docs => {
        const response = 
        {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name :doc.name,
                    price : doc.price,
                    _id : doc._id,
                    productImage : doc.productImage,
                    request : {
                        type : 'GET',
                        url : 'http://localhost:3000/products/'+doc._id
                    }
                }
            })
        } 
        if(docs.length>0){
        res.status(200).json(response);
    }
    else{
        res.status(404).json({message:"No Data Exists"})
    }

    })
    .catch(
        err => {
            res.status(500).json({error : err})
        }
    );
})

//Post request to handle addition of products. upload is used as an image is added and it tracks the file in the request as req.file
router.post('/',checkAuth,upload.single('productImage'),(req,res,next) => {
    console.log(req.file);
    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price,
        productImage : req.file.path

    });
    product.save()
    .then(result => {
        console.log(result)
        res.status(201).json({
            message : "Created Product Successfully",
            createdProduct : {
                name: result.name,
                price : result.price,
                _id : result._id,
                productImage : result.productImage,
                request : {
                    type : 'GET',
                    url : "http://localhost:3000/products/"+result._id
                }
            }
        });
    
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error:err})
    
    })

});
//Get request to get a product based on the productId
router.get('/:productId',(req,res,next) =>{
    const id = req.params.productId;
    Product.findById(id)
    .exec()
    .then(doc => {

        if(doc){
            res.status(200).json(doc);
        }
        else{
            res.status(404).json({message : "No Valid Entry for ID"})
        }
        
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({error:err})
    })
})

//patch request to update a product
router.patch('/:productId',checkAuth,(req,res,next) =>{
        const id = req.params.productId
        const updateOps = {}
        for(const ops of req.body){
            updateOps[ops.propName] = ops.value;
        }
        Product.update({_id:id}, {$set: updateOps})
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).json({
                message:"Update Results",
                result: {
                    name: result.name,
                    price : result.price,
                    _id : result._id,
                    request : {
                        type : 'GET',
                        url : "http://localhost:3000/products/"+id
                    }
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err});
        });

})

//delete request to delete a product
router.delete('/:productId',checkAuth,(req,res,next) =>{
    const id = req.params.productId

    //use DeleteOne since remove is getting deprecated
    Product.remove({_id:id})
    .exec()
    .then( result => {
        res.status(200).json({
            message:'Deleted Product',
            result : result
        });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error:err})
    })

    

})

module.exports = router;