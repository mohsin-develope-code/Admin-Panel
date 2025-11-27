const mongoose = require('mongoose');


const subTitle_Schema = new mongoose.Schema({
    
    titleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Title',
         required: true, 
         index: true
    },

    subTitle:{
        type: String,
        required: true,
    },

})



subTitle_Schema.index({subTitle: 'subTitle'});

const subTitleSchema = mongoose.model('subTitle', subTitle_Schema);

module.exports = subTitleSchema;