const express = require("express");
const router = require('./Routes/Admin_Routes');
const cors = require('cors');
const  mongoose  = require("mongoose");
require('dotenv').config()

const app = express();

const PORT = process.env.PORT || 8080;




mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log("Database Connected..."))
        .catch((err) =>  console.log(`Something is wrong in connection ${err}`))


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ 
              origin: 'https://altazkeer-admin-panel.vercel.app',  
              methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
              credentials: true, 
        }));





app.use('/admin', router )




app.listen(PORT, console.log(`Server started ${PORT}`))
