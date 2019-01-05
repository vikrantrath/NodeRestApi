const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');


//bcrypt is a hashing algorithm which can only be encrypted but not decrypted so safe against dictionary attacks
const bcrypt = require('bcrypt');
//Web token can be used to authencticate users
const jwt  = require('jsonwebtoken')
const User = require('../Models/User')

//post request to add a user through signup
router.post('/signup',(req,res,next)=>{
        User.findOne({email : req.body.email})//check whether the email already exists or not
        .exec()
        .then(user => {
            if(user){
                res.status(409).json({
                    message:'Email Exists'
                })
            }
            else{
                bcrypt.hash(req.body.password,10,(err,hash)=>{
                    if(err){
                        res.status(500).json({
                            error:err
                        })
                    }
                    //only enter if bcrypting is successful
                    else{   const user = new User({
                        _id : new mongoose.Types.ObjectId(),
                        email : req.body.email,
                        password : hash
                        })
                        user.save()
                        .then(result =>{
                            console.log(result);
                            res.status(201).json({
                                message : 'User Created'
                            })
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error:err
                            })
                        })
                    }
                })
            }
        })
        
    })
    router.post('/login',(req,res,next) => {
        User.find({email : req.body.email})
        .exec()
        .then(user => {
            if(user.length < 1){
                res.status(401).json({
                    message : "Auth Failed"
                })
            }
            else{
                bcrypt.compare(req.body.password,user[0].password,(err,result) => {
                    if(err){
                        return res.status(401).json({
                            message : "Auth Failed"
                        })
                    }
                    if(result){
                        const token = jwt.sign({
                            email : user[0].email,
                            userId : user[0]._id
                        },process.env.JWT_KEY,{
                            expiresIn : "1h"
                      })
                        return res.status(200).json({
                            message : "Auth Successful",
                            token : token
                        })
                    }

                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error : err,
                message : "In Catch BLock"
            })
        })
    })

    router.delete('/:userId',(req,res,next) => {
        User.deleteOne({_id:req.params.userId})
        .exec()
        .then(result => {
            res.status(201).json({
                message : "User Deleted"
            })
        })
        .catch(err => {
            res.status(500).json({
                error : err
            })
        })
    })

module.exports = router;