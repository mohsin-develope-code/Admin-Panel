const mongoose = require("mongoose");

const authAdminSchema = new mongoose.Schema({

    adminId: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String, 
        required: true,
    },
})


const Auth_Model = mongoose.model("admin", authAdminSchema );

module.exports = Auth_Model;