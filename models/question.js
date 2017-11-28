const mongoose = require('mongoose');

const {toClient} = require('../utils/schema');

const {Schema} = mongoose;

const VariantSchema = new Schema({
    text: {
        type: String,
        trim: true,
        required: true,
    },
    isCorrect: {
        type: Boolean,
        default: false,
    },
}, {
    collection: 'variants',
});

VariantSchema.method('toClient', toClient);

const QuestionSchema = new Schema({
    question: {
        type: String,
        trim: true,
        required: true,
    },
    expression: {
        type: String,
        trim: true,
        allowBlank: true,
    },
    variants: [VariantSchema],
}, {
    collection: 'questions',
});

QuestionSchema.method('toClient', toClient);

exports.QuestionSchema = QuestionSchema;
exports.VariantSchema = VariantSchema;

exports.QuestionModel = mongoose.model('Question', QuestionSchema);
