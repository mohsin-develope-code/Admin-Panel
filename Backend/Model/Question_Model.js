const mongoose = require('mongoose');


const  questions_Schema = new mongoose.Schema({

    titleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Title',
         required: true, 
         index: true,
    },

    subTitleId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubTitle',
         required: true, 
         index: true,
    },

    question:{
        type: String,
        required: true,
    },

    answer: {
        type: String,
        required: true,
    },

    reference_tags: {
        type: [String],
    }

})


 questions_Schema.index({question: 'question'})

const questionsShcema = mongoose.model('question', questions_Schema);

module.exports = questionsShcema;