const mongoose = require('mongoose');

const {Schema} = mongoose;

const QuestionSchema = new Schema({
    text: {
        type: String,
        trim: true,
        required: true,
    },
    expression: {
        type: String,
        trim: true,
        allowBlank: true,
    },
    variants: [{
        text: {
            type: String,
            trim: true,
            required: true,
        },
        isCorrect: {
            type: Boolean,
            default: false,
        },
    }],
}, {
    collection: 'questions',
});

exports.QuestionSchema = QuestionSchema;
exports.QuestionModel = mongoose.model('Question', QuestionSchema);
