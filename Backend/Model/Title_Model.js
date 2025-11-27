const mongoose = require("mongoose");


const title_Schema = new mongoose.Schema({

    title:{
        type: String,
        required: true,
    },
})


title_Schema.index({title: 'title'});

const titleSchema = mongoose.model('title', title_Schema);

module.exports = titleSchema;