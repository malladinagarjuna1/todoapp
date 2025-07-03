const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const todoRouter = require("./routes/todo");
const userRouter = require("./routes/user");
const { connectToDatabase } = require("../backend/db/db");
const app = express();



app.use(cors());
app.use(express.json());
app.use('/todo', todoRouter);
app.use('/user', userRouter);

connectToDatabase().then(()=>{
     const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`the server is running on  the ${PORT}`));

})

