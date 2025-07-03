const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require("../db/db");
const SECRET =  process.env.JWT_SECRET_KEY;
const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(403).json({ message: 'User already exists' });
        }

        const newUser = new User({ username, password });
        await newUser.save();

        const token = jwt.sign({ username: newUser.username }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'User created successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
});

// Signin Route
router.post('/signin', async (req, res) => {
  
    const { username, password } = req.body;

    try {
            console.log("Received body:", req.body); 
        const user = await User.findOne({ username});
       if(!user){
        return res.status(403).json({message:'Invalid username or password'});
       }
       if (user.password !== password) {
            return res.status(403).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ username: user.username }, SECRET, { expiresIn: '1h' });

        res.json({ message: 'Logged in successfully', token });
    } catch (error) {
               console.error("Signin error:", error); 
        res.status(500).json({ message: 'Error signing in', error });
    }
});

module.exports = router;
