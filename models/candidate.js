const mongoose = require('mongoose');

const {MAX_OPINION, MAX_COMMENT} = require('../constants/restrictions');
const REGEX = require('../constants/regex');

const {Schema} = mongoose;

function feedbackArrayLengthValidator(value) {
    return !value.length || (value.length && value.length >= 0 && value.length < MAX_OPINION);
}

const CandidateSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    skype: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        trim: true,
        match: REGEX.EMAIL,
    },
    result: {
        link: {
            type: String,
            trim: true,
            match: REGEX.URL,
        },
        answers: {
            type: Object,
        },
        startedAt: {
            type: Date,
        },
        completedAt: {
            type: Date,
        },
    },
    feedback: {
        liked: {
            type: [Schema.Types.ObjectId],
            default: [],
            allowBlank: true,
            validate: {
                validator: feedbackArrayLengthValidator,
                message: 'feedback.liked length exceeded',
            },
        },
        disliked: {
            type: [Schema.Types.ObjectId],
            default: [],
            allowBlank: true,
            validate: {
                validator: feedbackArrayLengthValidator,
                message: 'feedback.disliked length exceeded',
            },
        },
        comment: {
            type: String,
            default: '',
            allowBlank: true,
            trim: true,
            maxlength: [MAX_COMMENT, 'feedback.comment length exceeded'],
        },
    },
}, {
    collection: 'candidates',
});

exports.CandidateSchema = CandidateSchema;
exports.CandidateModel = mongoose.model('Candidate', CandidateSchema);
