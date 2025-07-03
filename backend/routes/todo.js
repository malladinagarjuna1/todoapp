
const express = require('express');
const jwt = require('jsonwebtoken');
const {authenticateJwt, SECRET}= require('../middleware/user');
const {Todo}= require('../db/db');
const Router = express.Router();

Router.post('/addtodo', async (req, res)=>{
    const{task}= req.body;
    console.log(req.userId);
    if(task===' '){
        return res.status(400).json("you haven't entered any task ");

    
    }
   try{
    const newtodo = await Todo.create({
        title: task,
        completed: false,
        userId: req.userId,
    });
    res.status(201).json({
        msg: "todo created",
        todo: newtodo,
    });

   }catch(error){
    console.log(error);
    res.status(500).json(
    {
    msg:"error creating todo",
    error: error.message,
    }
    );
   }
});

Router.get('/get',async(req, res)=>{
try{
    const todos= await Todo.find({
        userId: req.userId
    });
    res.json({
        todos: todos,
    })
}
catch(error){
    res.status(500).json({
        msg:"error fetching the todos",
        error: error.message
    });
}
});

Router.put("/:id", async (req, res) => {
    const { id } = req.params; 
    const updatePayload = req.body;
    

    // Basic input check
    if (typeof updatePayload.completed === 'undefined') {
        return res.status(400).json({
            msg: "You must provide a completed status.",
        });
    }

    try {
        const result = await Todo.updateOne(
            { _id: id }, 
            { completed: updatePayload.completed }
        );

            if(updatePayload.completed == 'true'){
        res.json({
  
            msg: "Todo marked as completed."
            
            
        });}
        else if(updatePayload.completed == 'false'){
            res.json({
                msg:"Todo marked as uncompleted"
            });
        }
    
    } catch (error) {
        res.status(500).json({
            msg: "Error updating todo.",
            error: error.message,
        });
    }
});


module.exports = Router;